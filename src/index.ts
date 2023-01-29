// nodeモジュールをインポート
import { Logger } from '@suzuki3jp/utils';
import type { LoggerOptions } from '@suzuki3jp/utils';
import dotenv from 'dotenv';
import express from 'express';
const app = express();
dotenv.config();

// モジュールをインポート
import { api } from './api/index';
import { Base } from './class/Base';
import { DataManager } from './class/DataManager';
import { events } from './events/index';
import { createApiServer } from './utils/API';
import { createClients } from './utils/Client';

const DM = new DataManager();

const loggerOptions: LoggerOptions = {
    isSaveLogToCsv: true,
    logFilePath: DM._paths.log,
};
const logger = new Logger(loggerOptions);

// クライアント定義
const clientInfo = createClients(logger);
const twitchClient = clientInfo.twitch;
const discordClient = clientInfo.discord.client;
const discordToken = clientInfo.discord.token;
const apiServer = createApiServer(app);
const base = new Base(twitchClient, discordClient, clientInfo.eventSub, logger);

events(base, discordToken);
api(app, apiServer, logger);
