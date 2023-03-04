import { JST } from '@suzuki3jp/utils';
import { HelixStream } from '@twurple/api';
import { EventSubStreamOfflineEvent, EventSubStreamOnlineEvent } from '@twurple/eventsub-base';

import { Base } from './Base';
import { TwitchUser } from './JsonTypes';
import { MessageEmbed, TextChannel } from 'discord.js';
import { APIEmbed } from 'discord-api-types/v9';

export class TwitchStream extends Base {
    public users: TwitchUser[];
    public user: TwitchUser | null;
    public userIndex: number | null;
    constructor(base: Base, event: EventSubStreamOfflineEvent | EventSubStreamOnlineEvent) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
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
        if (!this.userIndex || !this.user) return;

        const channel = await this.discord.channels.fetch(this.user.notificationChannelId);
        const stream = await this.twitch._api.streams.getStreamByUserId(this.user.id);
        if (!channel || !stream) return;
        this._updateData(true);
        this._changeDiscordActivity(true);
        const embeds = this._createOnStreamEmbed(stream);
        if (channel instanceof TextChannel) {
            channel.send({ content: '@everyone', embeds });
            this.logger.emitLog('info', '配信開始通知を送信');
        } else {
            this.logger.emitLog(
                'debug',
                '配信開始通知を送信しようとしたチャンネルがTextChannelではなかったため送信不可'
            );
        }
    }

    async turnOffline() {
        this._updateData(false);
        this._changeDiscordActivity(false);
    }

    _updateData(isStreaming: boolean) {
        if (!this.userIndex || !this.user) return;
        this.users.splice(this.userIndex, 1);
        this.user.isStreaming = isStreaming;
        this.users.push(this.user);
        this.DM.setStreamStatus({ users: this.users });
    }

    _createOnStreamEmbed(stream: HelixStream): MessageEmbed[] {
        const embed: APIEmbed = {
            title: `${stream.userDisplayName}が配信を開始しました`,
            url: `https://www.twitch.tv/${stream.userName}`,
            description: `タイトル: ${stream.title} ゲーム: ${stream.gameName}`,
            footer: {
                text: JST.getDateString(),
            },
        };
        // @ts-expect-error
        return [new MessageEmbed(embed)];
    }

    _changeDiscordActivity(isStreaming: boolean) {
        const streamingStr = 'ありけん: 配信中';
        if (isStreaming) {
            this.discord.user?.setPresence({
                activities: [{ name: streamingStr, type: 'STREAMING', url: 'https://www.twitch.tv/arikendebu' }],
                status: 'online',
            });
            this.logger.emitLog('info', 'discordのアクティビティを配信中に変更');
        } else {
            this.discord.user?.setPresence({
                activities: undefined,
                status: 'idle',
            });
            this.logger.emitLog('info', 'discordのアクティビティを配信外に変更');
        }
    }
}
