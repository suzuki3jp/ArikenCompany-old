import mongoose, { connect, Connection } from 'mongoose';

import { ArikenCompany } from '@/ArikenCompany';
import { StreamersManager } from '@/Database/managers/StreamersManager';
import { LogMessages, Logger } from '@/helpers/Logger/Logger';

export class Database {
    private connection: Connection;
    private logger: Logger;
    private url: string;

    public streamers: StreamersManager;

    constructor(private client: ArikenCompany) {
        this.connection = mongoose.connection;
        this.logger = this.client.logger.createChild('Database');
        this.url = this.client.settings.cache.mongoUrl;

        this.connection.once('open', () => this.onOpen());

        this.streamers = new StreamersManager(this.client);
    }

    public async connect() {
        await connect(this.url);
    }

    private onOpen() {
        this.logger.system(LogMessages.connectedToMongoDB(this.url));
    }
}
