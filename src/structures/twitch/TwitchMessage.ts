import { PrivateMessage } from '@twurple/chat';

import { ArikenCompany } from '../ArikenCompany/ArikenCompany';
import { TwitchChannel } from './TwitchChannel';
import { TwitchUser } from './TwitchUser';

export class TwitchMessage {
    private client: ArikenCompany;

    public id: string;
    public content: string;
    public channel: TwitchChannel;
    public user: TwitchUser;
    constructor(client: ArikenCompany, channelName: string, content: string, info: PrivateMessage) {
        if (!info.channelId) throw new Error('Channel was null.');

        this.client = client;
        this.id = info.id;
        this.content = content;
        this.channel = new TwitchChannel(this.client, channelName.slice(1), info.channelId);
        this.user = new TwitchUser(this.client, info.userInfo);
    }

    async reply(content: string) {
        await this.client.twitch.say(this.channel.name, content, this.id);
    }
}
