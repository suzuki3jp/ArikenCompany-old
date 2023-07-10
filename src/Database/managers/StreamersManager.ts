import { ArikenCompany } from '@/ArikenCompany';
import { StreamersModel, IStreamer } from '@/Database/models/Streamers';
import { Database } from '@/Database/Database';
import { Optional } from '@/helpers/typings';
import { LogMessages, Logger } from '@/helpers/Logger/Logger';
import { UTC } from '@/helpers/date/UTC';

export class StreamersManager {
    private model;
    private logger: Logger;

    constructor(private client: ArikenCompany, db: Database) {
        this.model = StreamersModel;
        this.logger = db.logger.createChild('Streamers');
    }

    public async getStreamerById(id: string): Promise<IStreamer | null> {
        const d = await this.model.find({ id }).exec();
        if (d.length === 0) return null;
        return d[0];
    }

    public async getAll(): Promise<IStreamer[]> {
        return await this.model.find({}).exec();
    }

    public async addStremer(data: Optional<IStreamer, 'created_at' | 'updated_at'>): Promise<IStreamer | null> {
        const now = new UTC().toISOString();
        const { id, notificationChannelId } = data;
        const user = await this.client.twitchApi?.getUserById(id);
        if (!user) return null;

        const newData: IStreamer = {
            id,
            notificationChannelId,
            created_at: now,
            updated_at: now,
        };

        const d = new this.model(newData);
        await d.save();
        this.logger.info(LogMessages.addedStreamer(d.id));
        return newData;
    }

    public async removeStreamer(id: string): Promise<IStreamer | null> {
        const result = await this.model.findOneAndDelete({ id }).exec();
        if (result) this.logger.info(LogMessages.removedStreamer(result.id));
        return result;
    }
}
