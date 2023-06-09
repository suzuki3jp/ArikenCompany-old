import { HelixStream, ApiClient as TwitchApi } from '@twurple/api';
import { EventSubStreamOfflineEvent, EventSubStreamOnlineEvent, EventSubSubscription, EventSubListener as TwitchEventSub } from '@twurple/eventsub-base';
import { Logger } from '@suzuki3jp/logger';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import { Collection, Client as Discord, ForumChannel, AnyChannel } from 'discord.js';
dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault('Asia/Tokyo');

import { DataManager } from './DataManager';
import { StreamStatusJson, TwitchStreamerData } from './JsonTypes';

export class TwitchStream {
    cache: Collection<string, TwitchStreamer>;

    private DM: DataManager;
    private discord: Discord;
    private logger: Logger;
    private api: TwitchApi;
    private eventSub: TwitchEventSub;
    constructor(logger: Logger, api: TwitchApi, eventSub: TwitchEventSub, discord: Discord) {
        this.DM = new DataManager();
        this.logger = logger;
        this.api = api;
        this.discord = discord;
        this.eventSub = eventSub;
        this.cache = new Collection(null);

        const { users } = this.DM.getStreamStatus();
        users.forEach((streamerData) => {
            const streamer = new TwitchStreamer(this.api, streamerData, this.subscribeOnline(streamerData.id), this.subscribeOffline(streamerData.id));
            this.cache.set(streamerData.id, streamer);
        });
    }

    async addStreamNotification(id: string, notificationChannelId: string): Promise<TwitchStreamer | null> {
        const user = await this.api.users.getUserById(id);
        const stream = await user?.getStream();
        if (!user) return null;
        const onlineSub = this.subscribeOnline(id);
        const offlineSub = this.subscribeOffline(id);

        // cacheに対して登録する
        const streamerData: TwitchStreamerData = {
            id: id,
            name: user.name,
            displayName: user.displayName,
            isStreaming: Boolean(stream),
            notificationChannelId: notificationChannelId,
        };
        const streamer = new TwitchStreamer(this.api, streamerData, onlineSub, offlineSub);
        this.cache.set(id, streamer);

        // ファイルに反映する
        this.saveToFileFromCache();

        return streamer;
    }

    subscribeOnline(id: string): EventSubSubscription<unknown> {
        this.logger.info('Listening stream online event.' + id);
        return this.eventSub.onStreamOnline(id, (event) => this.onlineHandler(event));
    }

    subscribeOffline(id: string): EventSubSubscription<unknown> {
        this.logger.info('Listening stream offline event.' + id);
        return this.eventSub.onStreamOffline(id, (event) => this.offlineHandler(event));
    }

    async onlineHandler(event: EventSubStreamOnlineEvent) {
        this.logger.info('Stream online. ' + event.broadcasterDisplayName);
        const oldData = this.cache.get(event.broadcasterId);
        const stream = await event.getStream();
        if (oldData && stream) {
            oldData.isStreaming = true;
            this.cache.set(event.broadcasterId, oldData);
            this.saveToFileFromCache();
            this.sendStreamNotification(oldData);

            // 配信開始したのがありけんだった時
            if (oldData.name !== 'arikendebu') return;
            this.setArikenStatus(oldData);
            this.postClipMemo(stream);
        }
    }

    offlineHandler(event: EventSubStreamOfflineEvent) {
        this.logger.info('Stream offline. ' + event.broadcasterDisplayName);
        const oldData = this.cache.get(event.broadcasterId);
        if (oldData) {
            oldData.isStreaming = false;
            this.cache.set(event.broadcasterId, oldData);
            this.saveToFileFromCache();

            // 配信終了したのがありけんだった時
            if (oldData.name !== 'arikendebu') return;
            this.setArikenStatus(oldData);
        }
    }

    async sendStreamNotification(streamer: TwitchStreamer) {
        const date = dayjs.tz(undefined);
        const channel = await this.discord.channels.fetch(streamer.notificationChannelId);
        if (!channel?.isText()) return;
        const stream = await this.api.streams.getStreamByUserId(streamer.id);
        if (!stream) return;
        channel.send({
            content: '@everyone',
            embeds: [
                {
                    title: `${streamer.displayName} が配信を開始しました`,
                    description: '-----------------------------',
                    url: `https://twitch.tv/${streamer.name}`,
                    fields: [
                        { name: 'タイトル', value: stream.title || 'No Data', inline: true },
                        { name: 'ゲーム', value: stream.gameName || 'No Data', inline: true },
                    ],
                    footer: {
                        text: `${date.year()}/${date.month() + 1}/${date.date()} ${date.hour()}:${date.minute()}:${date.second()}`,
                    },
                },
            ],
        });
    }

    saveToFileFromCache(): StreamStatusJson {
        const streamStatus: StreamStatusJson = {
            users: [],
        };
        this.cache.forEach((streamer) => streamStatus.users.push(streamer.toJSON()));
        this.DM.setStreamStatus(streamStatus);
        this.logger.debug('Saved stream notification to file from cache.');
        return streamStatus;
    }

    async reloadStreamerDataById(): Promise<StreamStatusJson> {
        const streamStatus: StreamStatusJson = {
            users: [],
        };
        const results: Promise<TwitchStreamerData | null>[] = this.cache.map(async (target) => {
            const user = await this.api.users.getUserById(target.id);
            const stream = await user?.getStream();
            if (!user) return null;
            return {
                id: user.id,
                name: user.name,
                displayName: user.displayName,
                isStreaming: Boolean(stream),
                notificationChannelId: target.notificationChannelId,
            };
        });
        (await Promise.all(results)).forEach((streamerData) => {
            if (!streamerData) return;
            streamStatus.users.push(streamerData);
        });
        this.DM.setStreamStatus(streamStatus);
        return streamStatus;
    }

    async setArikenStatus(data: TwitchStreamerData) {
        const stream = await this.api.streams.getStreamByUserId(data.id);
        if (stream) {
            this.discord.user?.setPresence({
                status: 'online',
                activities: [{ type: 'STREAMING', name: stream.title, url: 'https://twitch.tv/arikendebu' }],
            });
        } else {
            this.discord.user?.setPresence({
                status: 'idle',
                activities: [],
            });
        }
    }

    async syncArikenStatus() {
        const ariken = this.cache.filter((streamer) => streamer.name === 'arikendebu').first();
        if (!ariken) return;
        await this.setArikenStatus(ariken.toJSON());
    }

    async postClipMemo(stream: HelixStream) {
        const video = (await this.api.videos.getVideosByUser(stream.userId, { type: 'archive' })).data[0];
        const MEMO_CHANNELID = '1102269877881933916';
        const forum = this.discord.channels.cache.get(MEMO_CHANNELID);
        if (!isForumChannel(forum)) return;
        const { startDate } = stream;
        const now = dayjs(startDate);
        const title = `${now.year()}/${formatMonthDate(now.month() + 1)}/${formatMonthDate(now.date())}`;

        // 最新のアーカイブがスタートされた配信のものか確認する
        if (video.streamId !== stream.id) return;

        // 同じ日に複数回配信したときは同じスレッドにurlを投稿する
        const latestThread = forum.threads.cache.last();
        if (latestThread?.name === title) {
            // その日複数回目
            latestThread.send(video.url);
            this.logger.info('Sent the link that started the Nth stream today.');
        } else {
            // その日初めて
            await forum.threads.create({
                name: title,
                message: {
                    content: video.url,
                },
            });
            this.logger.info('Create memo channel with the link that started the first stream today.');
        }
    }
}

export class TwitchStreamer {
    public displayName: string;
    public id: string;
    public isStreaming: boolean;
    public name: string;
    public notificationChannelId: string;
    public onlineSubscription: EventSubSubscription<unknown>;
    public offlineSubscription: EventSubSubscription<unknown>;

    private api: TwitchApi;
    constructor(api: TwitchApi, data: TwitchStreamerData, onlineSubscription: EventSubSubscription<unknown>, offlineSubscription: EventSubSubscription<unknown>) {
        this.displayName = data.displayName;
        this.id = data.id;
        this.isStreaming = data.isStreaming;
        this.name = data.name;
        this.notificationChannelId = data.notificationChannelId;
        this.onlineSubscription = onlineSubscription;
        this.offlineSubscription = offlineSubscription;
        this.api = api;
    }

    async updateStreamerInfoById(): Promise<boolean> {
        const streamer = await this.api.users.getUserById(this.id);
        if (!streamer) return false;
        this.displayName = streamer.displayName;
        this.name = streamer.name;
        const stream = await streamer.getStream();
        this.isStreaming = Boolean(stream);
        return true;
    }

    setIsStreaming(isStreaming: boolean) {
        this.isStreaming = isStreaming;
    }

    toJSON(): TwitchStreamerData {
        return {
            id: this.id,
            name: this.name,
            displayName: this.displayName,
            isStreaming: this.isStreaming,
            notificationChannelId: this.notificationChannelId,
        };
    }
}

const isForumChannel = (channel: AnyChannel | undefined): channel is ForumChannel => {
    return channel?.type === 'GUILD_FORUM';
};

const formatMonthDate = (str: string | number): string => {
    str = str.toString();
    if (str.length !== 1) return str;
    return `0${str}`;
};
