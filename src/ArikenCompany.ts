import { Logger } from '@suzuki3jp/logger';
import { ApiClient, ApiClient as TwitchApi } from '@twurple/api';
import { RefreshingAuthProvider as TwitchAuth } from '@twurple/auth';
import { ChatClient, ChatClient as TwitchChat } from '@twurple/chat';
import { EventSubHttpListener, EventSubHttpListener as TwitchEventSub, DirectConnectionAdapter as EventSubAdapter } from '@twurple/eventsub-http';
import { Client as Discord, Intents } from 'discord.js';
import { Express } from 'express';
import express from 'express';
import { Server as HTTP, createServer as createHTTP } from 'http';
import { Server as HTTPS, createServer as createHTTPS } from 'https';

import { DataManager } from './class/DataManager';
import { DotEnv, SettingsJson } from './class/JsonTypes';
import { TwitchStream } from './class/TwitchStream';
import { dotenv } from './utils/Env';

export class ArikenCompany {
    public api: ApiManager;
    public client: ClientManager;
    public DM: DataManager;
    public logger: Logger;
    public streamNotifications: TwitchStream;

    private env: DotEnv;

    constructor(extend?: ArikenCompany) {
        if (!extend) {
            const logger = new Logger(false);
            // private property
            this.env = dotenv();

            // public property
            this.api = new ApiManager(logger);
            this.client = new ClientManager(this.env, logger);
            this.DM = new DataManager();
            this.logger = logger;
            this.addLoggerEventListener();
            this.streamNotifications = new TwitchStream(this.logger, this.client.twitch.api, this.client.twitch.eventSub, this.client.discord);
        } else {
            const { api, client, DM, logger, streamNotifications } = extend;
            this.api = api;
            this.client = client;
            this.DM = DM;
            this.logger = logger;
            this.env = dotenv();
            this.streamNotifications = streamNotifications;
        }
    }

    addLoggerEventListener() {
        this.logger.on('debug', (msg) => {
            if (process.argv.includes('--debug')) {
                console.log(msg);
            }
        });

        this.logger.on('system', (msg) => {
            console.log(msg);
            this.logger.appendToCsv(msg);
        });

        this.logger.on('info', (msg) => {
            console.log(msg);
            this.logger.appendToCsv(msg);
        });
    }

    async start() {
        this.api.listen();
        await this.client.start();
    }
}

export class ApiManager {
    public app: Express;
    public server: HTTP | HTTPS;

    private DM: DataManager;
    private logger: Logger;
    private settings: SettingsJson;
    constructor(logger: Logger) {
        this.DM = new DataManager();
        this.logger = logger;
        this.settings = this.DM.getSettings();

        this.app = express();
        if (this.settings.api.isSecure) {
            this.server = createHTTPS(
                {
                    key: this.DM.getKey4Api(),
                    cert: this.DM.getCert4Api(),
                },
                this.app
            );
        } else {
            this.server = createHTTP(this.app);
        }
    }

    listen() {
        this.server.listen(this.settings.api.port, () => {
            if (this.server instanceof HTTP) {
                this.logger.system(`API is ready. listening at http://localhost:${this.settings.api.port}`);
            } else {
                this.logger.system(`API is ready. listening at https://api.suzuki3jp.xyz:${this.settings.api.port}`);
            }
        });
    }
}

export class ClientManager {
    public discord: Discord;
    public twitch: { api: TwitchApi; chat: TwitchChat; eventSub: TwitchEventSub };

    private DM: DataManager;
    private DISCORD_TOKEN: string;
    private logger: Logger;
    private TWITCH_CLIENTID: string;
    private TWITCH_CLIENTSECRET: string;
    private TWITCH_REFRESHTOKEN: string;
    private TWITCH_TOKEN: string;

    constructor(env: DotEnv, logger: Logger) {
        const { DISCORD_TOKEN, TWITCH_CLIENTID, TWITCH_CLIENTSECRET, TWITCH_REFRESHTOKEN, TWITCH_TOKEN, TWITCH_HTTPSECRET } = env;

        // private property
        this.DM = new DataManager();
        this.DISCORD_TOKEN = DISCORD_TOKEN;
        this.logger = logger;
        this.TWITCH_CLIENTID = TWITCH_CLIENTID;
        this.TWITCH_CLIENTSECRET = TWITCH_CLIENTSECRET;
        this.TWITCH_REFRESHTOKEN = TWITCH_REFRESHTOKEN;
        this.TWITCH_TOKEN = TWITCH_TOKEN;

        // public property
        const {
            twitch: { id, channels },
            httpHostName,
        } = this.DM.getSettings();

        this.discord = new Discord({
            intents: Object.values(Intents.FLAGS),
        });
        const twitchAuth = new TwitchAuth({
            clientId: this.TWITCH_CLIENTID,
            clientSecret: this.TWITCH_CLIENTSECRET,
            onRefresh: (userId, newTokens) => {
                if (!newTokens.refreshToken) throw new Error('Twitch token refresh error.');

                this.TWITCH_REFRESHTOKEN = newTokens.refreshToken;
                this.TWITCH_TOKEN = newTokens.accessToken;

                const newEnv: DotEnv = {
                    TWITCH_CLIENTID: this.TWITCH_CLIENTID,
                    TWITCH_CLIENTSECRET: this.TWITCH_CLIENTSECRET,
                    TWITCH_REFRESHTOKEN: this.TWITCH_REFRESHTOKEN,
                    TWITCH_TOKEN: this.TWITCH_TOKEN,
                    TWITCH_HTTPSECRET: TWITCH_HTTPSECRET,
                    DISCORD_TOKEN: this.DISCORD_TOKEN,
                };
                this.DM.setEnv(newEnv);
                this.logger.info('Twitch token has been refreshed.');
            },
        });
        twitchAuth.addUser(
            id,
            {
                accessToken: this.TWITCH_TOKEN,
                refreshToken: this.TWITCH_REFRESHTOKEN,
                expiresIn: 0,
                obtainmentTimestamp: 0,
            },
            ['chat']
        );
        const eventSubAdapter = new EventSubAdapter({
            hostName: httpHostName,
            sslCert: {
                key: this.DM.getKey4Http(),
                cert: this.DM.getCert4Http(),
            },
        });
        const api = new ApiClient({ authProvider: twitchAuth });
        const chat = new ChatClient({ authProvider: twitchAuth, channels });
        const eventSub = new EventSubHttpListener({ apiClient: api, adapter: eventSubAdapter, secret: TWITCH_HTTPSECRET });

        this.twitch = { api, chat, eventSub };
    }

    async start() {
        this.logger.system('Clients starting...');
        await this.discord.login(this.DISCORD_TOKEN);
        await this.twitch.chat.connect();
        this.twitch.eventSub.start();
    }
}
