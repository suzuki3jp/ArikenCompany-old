// nodeモジュールをインポート
import { Logger, Options } from '@suzuki3jp/logger';
import cron from 'node-cron';
import pm2 from 'pm2';
import dotenv from 'dotenv';
import express from 'express';
const app = express();
dotenv.config();

// モジュールをインポート
import { api } from './api/index';
import { Base } from './class/Base';
import { events } from './events/index';
import { eventSub } from './eventSub/index';
import { createApiServer } from './utils/API';
import { createClients } from './utils/Client';

const logger = new Logger(false);

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

cron.schedule('59 59 11,23 * * *', () => {
    base.logger.system(`Periodic process restart in progress...`);
    pm2.connect((e) => {
        if (e) {
            base.logger.err(`Failed to connect to pm2.`);
        } else {
            const processName = 'ArikenCompany';
            pm2.list((e, list) => {
                if (e) {
                    base.logger.err('Failed to get list of pm2 processes.');
                } else {
                    pm2.restart(processName, (e, proc) => {
                        if (e) {
                            base.logger.err('Failed to restart pm2 process.');
                            pm2.disconnect();
                        } else {
                            base.logger.system('Sucess to restart pm2 process.');
                            pm2.disconnect();
                        }
                    });
                }
            });
        }
    });
});
