// nodeモジュールをインポート
import { Logger } from '@suzuki3jp/logger';
import cron from 'node-cron';
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
import { restartPm2Process } from './utils/Pm2';

const logger = new Logger(false);

(async () => {
    // クライアント定義
    const { twitch, discord } = await createClients(logger);
    const apiServer = createApiServer(app);
    const base = new Base({
        twitchApi: twitch.api,
        twitchChat: twitch.chat,
        twitchEventSub: twitch.eventSub,
        discord: discord.client,
        logger,
        apiApp: app,
        apiServer,
    });

    events(base, discord.token);
    eventSub(base);
    api(base);

    cron.schedule('59 59 11,23 * * *', () => {
        base.logger.system(`Periodic process restart in progress...`);
        restartPm2Process(base);
    });
})();
