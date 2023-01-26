// nodeモジュールをインポート
import { TwitchClient } from '@suzuki3jp/twitch.js';
import type { AuthConfig, ClientOptions } from '@suzuki3jp/twitch.js';
import { CustomError, Env, Logger } from '@suzuki3jp/utils';
import type { LoggerOptions } from '@suzuki3jp/utils';
import type { AccessToken } from '@twurple/auth';
import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';
import type { ClientOptions as DiscordOptions } from 'discord.js';
import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import https from 'https';
import path from 'path';
const app = express();

// モジュールをインポート
import { api } from './api/index';
import { DataManager } from './class/DataManager';
import { twitch } from './data/settings.json';
import { eventsIndex } from './events/index';

dotenv.config();
const DM = new DataManager();
const twitchToken = process.env.TWITCH_TOKEN;
const twitchRefreshToken = process.env.TWITCH_REFRESHTOKEN;
const twitchClientId = process.env.TWITCH_CLIENTID;
const twitchClientSecret = process.env.TWITCH_CLIENTSECRET;
const discordToken = process.env.DISCORD_TOKEN;

const loggerOptions: LoggerOptions = {
    isSaveLogToCsv: true,
    logFilePath: path.resolve(__dirname, './data/log/log.csv'),
};
const logger = new Logger(loggerOptions);

// .env
if (twitchToken && twitchClientId && twitchClientSecret && twitchRefreshToken && discordToken) {
    const onRefresh = (tokenInfo: AccessToken) => {
        const newToken = tokenInfo.accessToken;
        const newRefreshToken = tokenInfo.refreshToken;
        const envDataObj = {
            TWITCH_TOKEN: newToken,
            TWITCH_REFRESHTOKEN: newRefreshToken,
            TWITCH_CLIENTID: twitchClientId,
            TWITCH_CLIENTSECRET: twitchClientSecret,
            DISCORD_TOKEN: discordToken,
        };
        const newEnvData = Env.parseToEnv(envDataObj);

        writeFileSync(path.resolve(__dirname, '../.env'), newEnvData, 'utf-8');
        logger.info('twitch token on resfresh.');
    };

    // initial function
    (async () => {
        const authConfig: AuthConfig = {
            accessToken: twitchToken,
            refreshToken: twitchRefreshToken,
            clientId: twitchClientId,
            clientSecret: twitchClientSecret,
            onRefresh,
        };
        const twitchOptions: ClientOptions = { channels: twitch.channels };
        const discordOptions: DiscordOptions = {
            intents: Object.values(Intents.FLAGS),
        };

        const twitchClient = new TwitchClient(authConfig, twitchOptions);
        const discordClient = new Client(discordOptions);
        const apiServer = https.createServer(
            {
                key: DM.getKey(),
                cert: DM.getCert(),
            },
            app
        );
        eventsIndex(twitchClient, discordClient, discordToken, logger);
        api(app, apiServer, logger);
    })();
} else {
    throw new CustomError('ENV_ERROR', 'environment variables are invalid.');
}
