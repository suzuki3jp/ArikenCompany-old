import type { HelixChannel } from '@twurple/api';
import { Base } from '../class/Base';

export class Channel extends Base {
    /**
     * The id of the channel.
     */
    public id: string;

    /**
     * The name of the name.
     */
    public name: string;

    constructor(base: Base, channelName: string, channelId: string) {
        super({ base });
        this.name = channelName;
        this.id = channelId;
    }

    /**
     * Get the channel information.
     */
    async getInfo(): Promise<HelixChannel | null> {
        return await this.twitchApi.channels.getChannelInfoById(this.id);
    }

    /**
     * Send message to the channel.
     * @param content The content of send message.
     */
    send(content: string) {
        this.twitchChat.say(this.name, content);
    }
}
