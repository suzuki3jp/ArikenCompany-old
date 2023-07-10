import { ArikenCompany } from '@/ArikenCompany';
import { StreamersModel, IStreamer } from '@/Database/models/Streamers';
import { Optional } from '@/helpers/typings';
import { UTC } from '@/helpers/date/UTC';

export class StreamersManager {
    private model;

    constructor(private client: ArikenCompany) {
        this.model = StreamersModel;
    }

    async getStreamerById(id: string): Promise<IStreamer | null> {
        const d = await this.model.find({ id }).exec();
        if (d.length === 0) return null;
        return d[0];
    }

    async addStremer(data: Optional<IStreamer, 'isStreaming' | 'created_at' | 'updated_at'>): Promise<IStreamer | null> {
        const now = new UTC().toISOString();
        const { id, notificationChannelId } = data;
        const user = await this.client.twitchApi?.getUserById(id);
        if (!user) return null;

        const stream = await user.getStream();
        const newData: IStreamer = {
            id,
            notificationChannelId,
            isStreaming: Boolean(stream),
            created_at: now,
            updated_at: now,
        };

        const d = new this.model(newData);
        await d.save();
        return newData;
    }

    async removeStreamer(id: string): Promise<IStreamer | null> {
        return await this.model.findOneAndDelete({ id }).exec();
    }
}
