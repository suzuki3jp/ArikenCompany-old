// nodeモジュールをインポート
import { Express } from 'express';
import { Server as HTTP, createServer as createHTTP } from 'http';
import { Server as HTTPS, createServer as createHTTPS } from 'https';

// モジュールをインポート
import { DataManager } from '../class/DataManager';

const DM = new DataManager();
const settings = DM.getSettings();

export const createApiServer = (app: Express): HTTP | HTTPS => {
    if (!settings.api.isSecure) return createHTTP(app);
    return createHTTPS(
        {
            key: DM.getKey(),
            cert: DM.getCert(),
        },
        app
    );
};
