import type { HelixChannel } from '@twurple/api';
import { ArikenCompany } from '../ArikenCompany';

export class Channel extends ArikenCompany {
    /**
     * The id of the channel.
     */
    public id: string;

    /**
     * The name of the name.
     */
    public name: string;

    constructor(app: ArikenCompany, channelName: string, channelId: string) {
        super(app);
        this.name = channelName;
        this.id = channelId;
    }

    /**
     * Get the channel information.
     */
    async getInfo(): Promise<HelixChannel | null> {
        return await this.client.twitch.api.channels.getChannelInfoById(this.id);
    }

    /**
     * Send message to the channel.
     * @param content The content of send message.
     */
    send(content: string) {
        this.client.twitch.chat.say(this.name, content);
    }
}
