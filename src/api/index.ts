// nodeモジュールをインポート
import { Logger } from '@suzuki3jp/utils';
import type { Express } from 'express';
import { Server as HTTP } from 'http';
import { Server as HTTPS } from 'https';

// モジュールをインポート
import { DataManager } from '../class/DataManager';
import { router } from './Router';

export const api = (app: Express, server: HTTP | HTTPS, logger: Logger) => {
    const DM = new DataManager();
    const settings = DM.getSettings();

    server.listen(settings.api.port, () => {
        if (server instanceof HTTP) {
            logger.system(`API起動完了。at: http://localhost:${settings.api.port}/`);
        } else {
            logger.system(`API起動完了。at: https://suzuki-dev.com:${settings.api.port}`);
        }
    });
    app.use('/', router);
};
