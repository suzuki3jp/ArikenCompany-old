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
        const embeds = this._createOnStreamEmbed(stream);
        if (channel instanceof TextChannel) {
            channel.send({ content: '@everyone', embeds });
        } else return;
    }

    async turnOffline() {
        this._updateData(false);
    }

    _updateData(isStreaming: boolean) {
        if (!this.userIndex || !this.user) return;
        const newUsers = this.users.splice(this.userIndex);
        this.user.isStreaming = isStreaming;
        newUsers.push(this.user);
        this.users = newUsers;
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
}
