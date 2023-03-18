// nodeモジュールをインポート
import { Logger, Options } from '@suzuki3jp/logger';
import cron from 'node-cron';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import express from 'express';
const app = express();
dotenv.config();

// モジュールをインポート
import { api } from './api/index';
import { Base } from './class/Base';
import { DataManager } from './class/DataManager';
import { events } from './events/index';
import { eventSub } from './eventSub/index';
import { createApiServer } from './utils/API';
import { createClients } from './utils/Client';

const DM = new DataManager();

const loggerOptions: Options = {
    path: DM._paths.log,
};
const logger = new Logger(true, loggerOptions);

// クライアント定義
const clientInfo = createClients(logger);
const twitchClient = clientInfo.twitch;
const discordClient = clientInfo.discord.client;
const discordToken = clientInfo.discord.token;
const apiServer = createApiServer(app);
const base = new Base(twitchClient, discordClient, clientInfo.eventSub, logger, app, apiServer);

events(base, discordToken);
eventSub(base);
api(base);

cron.schedule('59 59 23 * * *', () => {
    const processRestartCommand = 'pm2 restart ArikenCompmany';
    execSync(processRestartCommand);
});
