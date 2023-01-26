// nodeモジュールをインポート
import { Logger } from '@suzuki3jp/utils';
import type { LoggerOptions } from '@suzuki3jp/utils';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
const app = express();
dotenv.config();

// モジュールをインポート
import { api } from './api/index';
import { eventsIndex } from './events/index';
import { createApiServer } from './utils/API';
import { createClients } from './utils/Client';

const loggerOptions: LoggerOptions = {
    isSaveLogToCsv: true,
    logFilePath: path.resolve(__dirname, './data/log/log.csv'),
};
const logger = new Logger(loggerOptions);

// クライアント定義
const clientInfo = createClients(logger);
const twitchClient = clientInfo.twitch;
const discordClient = clientInfo.discord.client;
const discordToken = clientInfo.discord.token;
const apiServer = createApiServer(app);

eventsIndex(twitchClient, discordClient, discordToken, logger);
api(app, apiServer, logger);
