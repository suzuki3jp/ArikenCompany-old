import { JST } from '@suzuki3jp/utils';
import { HelixStream } from '@twurple/api';
import { EventSubStreamOfflineEvent, EventSubStreamOnlineEvent } from '@twurple/eventsub-base';

import { Base } from './Base';
import { TwitchStreamer } from './JsonTypes';
import { MessageEmbed, TextChannel } from 'discord.js';
import { APIEmbed } from 'discord-api-types/v9';

export class TwitchStream extends Base {
    public users: TwitchStreamer[];
    public user: TwitchStreamer | null;
    public userIndex: number | null;
    constructor(base: Base, event: EventSubStreamOfflineEvent | EventSubStreamOnlineEvent) {
        super({ base });
        this.users = this.DM.getStreamStatus().users;
        this.user = null;
        this.userIndex = null;
        this.users.forEach((value, index) => {
            if (value.id !== event.broadcasterId) return;
            this.userIndex = index;
            this.user = value;
        });
    }

    async turnOnline() {
        if (this.userIndex === null || this.user === null) return;

        const channel = await this.discord.channels.fetch(this.user.notificationChannelId);
        const stream = await this.twitch._api.streams.getStreamByUserId(this.user.id);
        if (!channel || !stream) return;
        this._updateData(true);
        this._changeDiscordActivity();
        const embeds = this._createOnStreamEmbed(stream);
        if (channel instanceof TextChannel) {
            await channel.send({ content: '@everyone', embeds });
            this.logger.info(`Sent stream notification. [${stream.userDisplayName}](${stream.userId})`);
        } else {
            this.logger.debug(`Failed to send stream notification. The channel is not TextChannel.`);
        }
    }

    async turnOffline() {
        this._updateData(false);
        this._changeDiscordActivity();
        this.logger.info(`Stream has been offline. [${this.user?.displayName}](${this.user?.id})`);
    }

    _updateData(isStreaming: boolean) {
        if (this.userIndex === null || this.user === null) return;
        this.users.splice(this.userIndex, 1);
        this.user.isStreaming = isStreaming;
        this.users.push(this.user);
        this.DM.setStreamStatus({ users: this.users });
        this.logger.debug(`Update isStreaming to ${isStreaming}. [${this.user.displayName}](${this.user.id})`);
    }

    _createOnStreamEmbed(stream: HelixStream): MessageEmbed[] {
        const embed: APIEmbed = {
            title: `${stream.userDisplayName}が配信を開始しました`,
            url: `https://www.twitch.tv/${stream.userName}`,
            description: `**タイトル**: ${stream.title}, **ゲーム**: ${stream.gameName}`,
            footer: {
                text: JST.getDateString(),
            },
        };
        // @ts-expect-error
        return [new MessageEmbed(embed)];
    }

    _changeDiscordActivity() {
        if (!this.user) return;
        if (this.user.name !== ARIKEN_TWITCH_ID) return;
        const isStreaming = this.user.isStreaming;

        changeArikenActivity(isStreaming, this);
    }
}

export const ARIKEN_TWITCH_ID = 'arikendebu';
export const changeArikenActivity = (isStreaming: boolean, base: Base) => {
    const streamingStr = 'ありけん: 配信中';
    if (isStreaming) {
        base.discord.user?.setPresence({
            activities: [{ name: streamingStr, type: 'STREAMING', url: 'https://www.twitch.tv/arikendebu' }],
            status: 'online',
        });
        base.logger.info(`Discord activity changed to streaming.`);
    } else {
        base.discord.user?.setPresence({
            status: 'idle',
        });
        base.logger.info(`Discord activity changed to not-streming.`);
    }
};
