import { Schema, model } from 'mongoose';

export interface IStreamer {
    id: string;
    notificationChannelId: string;
    isStreaming: boolean;
    created_at: string;
    updated_at: string;
}

export const StreamerSchema = new Schema({
    id: { type: String, required: true },
    notificationChannelId: { type: String, required: true },
    isStreaming: { type: Boolean, required: true },
    created_at: { type: String, required: true },
    updated_at: { type: String, required: true },
});

export const StreamersModel = model('Streamers', StreamerSchema);
