// nodeモジュールをインポート
import type { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import type { Logger } from '@suzuki3jp/logger';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import type { Client as Discord, StringMappedInteractionTypes } from 'discord.js';

// モジュールをインポート
import { DataManager } from './DataManager';

export class Base {
    public twitch: Twitch;
    public discord: Discord;
    public eventSub: EventSubWsListener;
    public logger: Logger;
    public DM: DataManager;

    constructor(twitch: Twitch, discord: Discord, eventSub: EventSubWsListener, logger: Logger) {
        this.twitch = twitch;
        this.discord = discord;
        this.eventSub = eventSub;
        this.logger = logger;
        this.DM = new DataManager();
    }

    emitDebug(message: string) {
        this.logger.emitLog('debug', message);
    }

    getMe(): Base {
        return this;
    }
}
