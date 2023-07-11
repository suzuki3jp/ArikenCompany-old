import { EmbedBuilder } from 'discord.js';
import { EventEmitter } from 'events';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';
import { EventSubHttpListener, DirectConnectionAdapter } from '@twurple/eventsub-http';
import { EventSubStreamOnlineEvent, EventSubStreamOfflineEvent } from '@twurple/eventsub-base';

import { ArikenCompany } from '@/ArikenCompany';
import { ErrorMessages, makeError } from '@/helpers/errors/ArikenCompanyError';
import { Logger, LogMessages } from '@/helpers/Logger/Logger';
import { JST } from '@/helpers/date/JST';

export class ArikenCompanyEventSub extends EventEmitter {
    public eventSub: EventSubHttpListener;
    public logger: Logger;

    public on<K extends keyof ArikenCompanyEventSubEvents>(event: K, handler: (...args: ArikenCompanyEventSubEvents[K]) => void): this;
    on(event: string, handler: (...args: any[]) => void) {
        return super.on(event, handler);
    }

    constructor(private client: ArikenCompany) {
        super();
        if (!this.client.isReady()) throw makeError(ErrorMessages.CantSetupChat);
        this.eventSub = new EventSubHttpListener({ apiClient: this.client.twitchApi, adapter: new NgrokAdapter(), secret: this.client.dotenv.cache.EVENTSUB_SECRET });
        this.logger = this.client.logger.createChild('EventSub');
        this.subscribeStreamEventsFromDB();
    }

    private async subscribeStreamEventsFromDB() {
        const streamers = await this.client.db.streamers.getAll();
        streamers.forEach((s) => {
            this.eventSub.onStreamOnline(s.id, (e) => this.onOnline(e));
            this.eventSub.onStreamOffline(s.id, (e) => this.onOffline(e));
            this.logger.info(LogMessages.subscribedStreamEvents(s.id));
        });
    }

    private async onOnline(event: EventSubStreamOnlineEvent) {
        this.logger.info(LogMessages.streamerOnline(event.broadcasterId));

        const streamr = await this.client.db.streamers.getStreamerById(event.id);
        if (!streamr) return;

        const channel = await this.client.chat?.fetchDiscordChannel(streamr.notificationChannelId);
        if (channel?.isTextBased()) {
            const embed = await this.createOnlineNotificationEmbed(streamr.id);
            if (!embed) return;

            await channel.send({
                embeds: [embed],
            });
            return;
        } else this.logger.error(LogMessages.notificationChannelIsntTextBased(streamr.notificationChannelId));
    }

    private async onOffline(event: EventSubStreamOfflineEvent) {
        this.logger.info(LogMessages.streamerOffline(event.broadcasterId));
    }

    private async createOnlineNotificationEmbed(id: string) {
        const now = new JST().toString();

        const stream = await this.client.twitchApi?.getStreamByUserId(id);
        if (!stream) return null;
        return new EmbedBuilder()
            .setTitle(`${stream.userDisplayName} が配信を開始しました。`)
            .setDescription('-----------------------------')
            .setFields([
                {
                    name: 'タイトル',
                    value: stream.title,
                    inline: true,
                },
                {
                    name: 'ゲーム',
                    value: stream.gameName,
                    inline: true,
                },
            ])
            .setFooter({
                text: now,
            })
            .toJSON();
    }
}

const Events = {
    StreamOnline: 'streamOnline',
    StreamOffline: 'streamOffline',
};

export interface ArikenCompanyEventSubEvents {
    streamOnline: [userId: string];
    streamOffline: [userId: string];
}
