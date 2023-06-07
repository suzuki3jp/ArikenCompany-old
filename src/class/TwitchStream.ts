import { ApiClient as TwitchApi } from '@twurple/api';
import { EventSubStreamOfflineEvent, EventSubStreamOnlineEvent, EventSubSubscription, EventSubListener as TwitchEventSub } from '@twurple/eventsub-base';
import { Logger } from '@suzuki3jp/logger';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import { Collection, Client as Discord } from 'discord.js';
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

    onlineHandler(event: EventSubStreamOnlineEvent) {
        this.logger.info('Stream online. ' + event.broadcasterDisplayName);
        const oldData = this.cache.get(event.broadcasterId);
        if (oldData) {
            oldData.isStreaming = true;
            this.cache.set(event.broadcasterId, oldData);
            this.saveToFileFromCache();
            this.sendStreamNotification(oldData);
        }
    }

    offlineHandler(event: EventSubStreamOfflineEvent) {
        this.logger.info('Stream offline. ' + event.broadcasterDisplayName);
        const oldData = this.cache.get(event.broadcasterId);
        if (oldData) {
            oldData.isStreaming = false;
            this.cache.set(event.broadcasterId, oldData);
            this.saveToFileFromCache();
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
