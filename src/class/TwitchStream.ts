import { JST } from '@suzuki3jp/utils';
import { HelixStream } from '@twurple/api';
import { EventSubStreamOfflineEvent, EventSubStreamOnlineEvent, EventSubSubscription } from '@twurple/eventsub-base';
import { Collection } from 'discord.js';

import { TwitchStreamerData } from './JsonTypes';
import { ArikenCompany } from '../ArikenCompany';

export class TwitchStream extends ArikenCompany {
    cache: Collection<string, TwitchStreamer>;

    constructor(app: ArikenCompany) {
        super(app);
        this.cache = new Collection(null);
        const { users } = this.DM.getStreamStatus();
        users.forEach((streamerData) => {
            const streamer = new TwitchStreamer(this, streamerData, this.subscribeOnline(streamerData.id), this.subscribeOffline(streamerData.id));
            this.cache.set(streamerData.id, streamer);
        });
    }

    subscribeOnline(id: string): EventSubSubscription<unknown> {
        this.logger.info('Listening stream online event.' + id);
        return this.client.twitch.eventSub.onStreamOnline(id, (event) => {
            console.log(`Stream online! ${event.broadcasterDisplayName}`);
        });
    }
    subscribeOffline(id: string): EventSubSubscription<unknown> {
        this.logger.info('Listening stream offline event.' + id);
        return this.client.twitch.eventSub.onStreamOffline(id, (event) => {
            console.log(`Stream offline! ${event.broadcasterDisplayName}`);
        });
    }
}

export class TwitchStreamer extends ArikenCompany {
    public displayName: string;
    public id: string;
    public isStreaming: boolean;
    public name: string;
    public notificationChannelId: string;
    public onlineSubscription: EventSubSubscription<unknown>;
    public offlineSubscription: EventSubSubscription<unknown>;

    constructor(app: ArikenCompany, data: TwitchStreamerData, onlineSubscription: EventSubSubscription<unknown>, offlineSubscription: EventSubSubscription<unknown>) {
        super(app);
        this.displayName = data.displayName;
        this.id = data.id;
        this.isStreaming = data.isStreaming;
        this.name = data.name;
        this.notificationChannelId = data.notificationChannelId;
        this.onlineSubscription = onlineSubscription;
        this.offlineSubscription = offlineSubscription;
    }

    async updateStreamerInfoById(): Promise<boolean> {
        const streamer = await this.client.twitch.api.users.getUserById(this.id);
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
}

// export class TwitchStreamOld extends ArikenCompany {
//     public users: TwitchStreamer[];
//     public user: TwitchStreamer | null;
//     public userIndex: number | null;
//     constructor(app: ArikenCompany, event: EventSubStreamOfflineEvent | EventSubStreamOnlineEvent) {
//         super(app);
//         this.users = this.DM.getStreamStatus().users;
//         this.user = null;
//         this.userIndex = null;
//         this.users.forEach((value, index) => {
//             if (value.id !== event.broadcasterId) return;
//             this.userIndex = index;
//             this.user = value;
//         });
//     }

//     async turnOnline() {
//         if (this.userIndex === null || this.user === null) return;

//         const channel = await this.client.discord.channels.fetch(this.user.notificationChannelId);
//         const stream = await this.client.twitch.api.streams.getStreamByUserId(this.user.id);
//         if (!channel || !stream) return;
//         this._updateData(true);
//         this._changeDiscordActivity();
//         const embeds = await this._createOnStreamEmbed(stream);
//         if (channel instanceof TextChannel) {
//             await channel.send({ content: '@everyone', embeds });
//             this.logger.info(`Sent stream notification. [${stream.userDisplayName}](${stream.userId})`);
//         } else {
//             this.logger.debug(`Failed to send stream notification. The channel is not TextChannel.`);
//         }
//     }

//     async turnOffline() {
//         this._updateData(false);
//         this._changeDiscordActivity();
//         this.logger.info(`Stream has been offline. [${this.user?.displayName}](${this.user?.id})`);
//     }

//     _updateData(isStreaming: boolean) {
//         if (this.userIndex === null || this.user === null) return;
//         this.users.splice(this.userIndex, 1);
//         this.user.isStreaming = isStreaming;
//         this.users.push(this.user);
//         this.DM.setStreamStatus({ users: this.users });
//         this.logger.debug(`Update isStreaming to ${isStreaming}. [${this.user.displayName}](${this.user.id})`);
//     }

//     async _createOnStreamEmbed(stream: HelixStream): Promise<MessageEmbed[]> {
//         const archives = (await this.client.twitch.api.videos.getVideosByUser(stream.userId, { type: 'archive' })).data;
//         const latestArchive = archives[0];

//         const embed: APIEmbed = {
//             title: `${stream.userDisplayName}が配信を開始しました`,
//             url: `https://www.twitch.tv/${stream.userName}`,
//             description: `**タイトル**: ${stream.title}, **ゲーム**: ${stream.gameName}`,
//             footer: {
//                 text: `${JST.getDateString()} | videoId: ${latestArchive.streamId === stream.id ? latestArchive.id : 'アーカイブ未生成'}`,
//             },
//         };
//         // @ts-expect-error
//         return [new MessageEmbed(embed)];
//     }

//     _changeDiscordActivity() {
//         if (!this.user) return;
//         if (this.user.name !== ARIKEN_TWITCH_ID) return;
//         const isStreaming = this.user.isStreaming;

//         changeArikenActivity(isStreaming, this);
//     }
// }

export const ARIKEN_TWITCH_ID = 'arikendebu';
export const changeArikenActivity = (isStreaming: boolean, app: ArikenCompany) => {
    const streamingStr = 'ありけん: 配信中';
    if (isStreaming) {
        app.client.discord.user?.setPresence({
            activities: [{ name: streamingStr, type: 'STREAMING', url: 'https://www.twitch.tv/arikendebu' }],
            status: 'online',
        });
        app.logger.info(`Discord activity changed to streaming.`);
    } else {
        app.client.discord.user?.setPresence({
            status: 'idle',
        });
        app.logger.info(`Discord activity changed to not-streming.`);
    }
};
