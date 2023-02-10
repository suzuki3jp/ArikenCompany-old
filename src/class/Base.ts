// nodeモジュールをインポート
import type { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import type { Logger } from '@suzuki3jp/logger';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import { Express } from 'express';
import { Server as HTTP } from 'http';
import { Server as HTTPS } from 'https';
import type { Client as Discord } from 'discord.js';

// モジュールをインポート
import { DataManager } from './DataManager';

export class Base {
    public api: { app: Express; server: HTTP | HTTPS };
    public twitch: Twitch;
    public discord: Discord;
    public eventSub: EventSubWsListener;
    public logger: Logger;
    public DM: DataManager;

    constructor(
        twitch: Twitch,
        discord: Discord,
        eventSub: EventSubWsListener,
        logger: Logger,
        apiApp: Express,
        apiServer: HTTP | HTTPS
    ) {
        this.api = {
            app: apiApp,
            server: apiServer,
        };
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
