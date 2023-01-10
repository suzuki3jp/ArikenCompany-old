// import packages
import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import type { ClientOptions as DiscordOptions, BitFieldResolvable } from 'discord.js';
import type { AccessToken } from '@twurple/auth';
import { writeFileSync } from 'fs';
import path from 'path';
import { CustomError, Logger, Env } from '@suzuki3jp/utils';
import type { LoggerOptions } from '@suzuki3jp/utils';
import express from 'express';
const app = express();
import http from 'http';

// import modules
import { TwitchClient } from '@suzuki3jp/twitch.js';
import type { AuthConfig, ClientOptions } from '@suzuki3jp/twitch.js';
import { twitch } from './data/settings.json';
import { eventsIndex } from './events/index';

dotenv.config();
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
            intents: Object.values(GatewayIntentBits) as BitFieldResolvable<keyof typeof GatewayIntentBits, number>,
        };

        const twitchClient = new TwitchClient(authConfig, twitchOptions);
        const discordClient = new Client(discordOptions);
        const apiServer = http.createServer(app);
        eventsIndex({ server: apiServer, app }, twitchClient, discordClient, discordToken, logger);
    })();
} else {
    throw new CustomError('ENV_ERROR', 'environment variables are invalid.');
}
