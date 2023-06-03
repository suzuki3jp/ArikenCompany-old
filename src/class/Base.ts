// nodeモジュールをインポート
// import type { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import { ApiClient } from '@twurple/api';
import { ChatClient } from '@twurple/chat';
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
    public twitchChat: ChatClient;
    public discord: Discord;
    public twitchEventSub: EventSubWsListener;
    public twitchApi: ApiClient;
    public logger: Logger;
    public DM: DataManager;

    constructor(options: {
        twitchChat: ChatClient;
        twitchApi: ApiClient;
        twitchEventSub: EventSubWsListener;
        discord: Discord;
        apiApp: Express;
        apiServer: HTTP | HTTPS;
        logger: Logger;
    }) {
        this.api = {
            app: options.apiApp,
            server: options.apiServer,
        };
        this.twitchChat = options.twitchChat;
        this.twitchEventSub = options.twitchEventSub;
        this.twitchApi = options.twitchApi;
        this.discord = options.discord;
        this.logger = options.logger;
        this.DM = new DataManager();
    }

    getMe(): Base {
        return this;
    }
}
