import express, { Express } from 'express';
import { Server as HTTP, createServer as createHTTP } from 'http';
import { Server as HTTPS, createServer as createHTTPS } from 'https';

import { ArikenCompany } from '@/ArikenCompany';
import { LogMessages, Logger } from '@/helpers/Logger/Logger';

export class ArikenCompanyApi {
    public app: Express = express();
    public server: HTTP | HTTPS;

    private logger: Logger;
    constructor(private client: ArikenCompany) {
        const { settings } = this.client;

        this.server = !settings.cache.api.isSecure ? createHTTP(this.app) : createHTTPS(this.client.apiSSL.read(), this.app);
        this.logger = this.client.logger.createChild('Api');
    }

    private registerRoutes() {
        this.app.use((req, res) => {
            res.status(404).send('Page not found.');
        });

        this.logger.system(LogMessages.registerdApiRoutes);
    }

    public listen() {
        const { api } = this.client.settings.cache;

        this.registerRoutes();
        this.app.listen(api.port, () => {
            this.logger.system(LogMessages.startedApi(api.port));
        });
    }
}
