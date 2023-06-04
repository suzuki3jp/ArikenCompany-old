// nodeモジュールをインポート
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
        twitchChat?: ChatClient;
        twitchApi?: ApiClient;
        twitchEventSub?: EventSubWsListener;
        discord?: Discord;
        apiApp?: Express;
        apiServer?: HTTP | HTTPS;
        logger?: Logger;
        base?: Base;
    }) {
        if (options.base) {
            this.api = options.base.api;
            this.twitchApi = options.base.twitchApi;
            this.twitchChat = options.base.twitchChat;
            this.DM = options.base.DM;
            this.api = options.base.api;
            this.discord = options.base.discord;
            this.twitchEventSub = options.base.twitchEventSub;
            this.logger = options.base.logger;
        } else {
            const { apiApp, apiServer, twitchApi, twitchChat, twitchEventSub, discord, logger } = options;
            if (!apiApp || !apiServer || !twitchApi || !twitchChat || !twitchEventSub || !discord || !logger)
                throw new Error('Invalid Base args.');

            this.api = {
                app: apiApp,
                server: apiServer,
            };
            this.twitchChat = twitchChat;
            this.twitchEventSub = twitchEventSub;
            this.twitchApi = twitchApi;
            this.discord = discord;
            this.logger = logger;
            this.DM = new DataManager();
        }
    }

    getMe(): Base {
        return this;
    }
}
