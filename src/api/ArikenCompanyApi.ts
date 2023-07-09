import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { Express } from 'express';
import { Server as HTTP, createServer as createHTTP } from 'http';
import { Server as HTTPS, createServer as createHTTPS } from 'https';
import path from 'path';

import { ArikenCompany } from '@/ArikenCompany';
import { LogMessages, Logger } from '@/helpers/Logger/Logger';

export class ArikenCompanyApi {
    public app: Express;
    public server: HTTP | HTTPS;

    private logger: Logger;
    constructor(private client: ArikenCompany) {
        const { settings } = this.client;

        this.app = createExpressServer({ controllers: [path.resolve(__dirname, './Controllers/*.js')] });
        this.server = !settings.cache.api.isSecure ? createHTTP(this.app) : createHTTPS(this.client.apiSSL.read(), this.app);
        this.logger = this.client.logger.createChild('API');
    }

    load404Hadler() {
        this.app.use((req, res) => {
            if (!res.writableEnded) {
                res.status(404).json({
                    status: 404,
                    message: `${req.url} not found.`,
                });
            }
            res.end();
        });
    }

    public listen() {
        const { api } = this.client.settings.cache;

        this.load404Hadler();
        this.app.listen(api.port, () => {
            this.logger.system(LogMessages.startedApi(api.port));
        });
    }
}
