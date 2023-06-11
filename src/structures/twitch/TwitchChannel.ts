import { ArikenCompany } from '../ArikenCompany/ArikenCompany';

export class TwitchChannel {
    private client: ArikenCompany;

    public name: string;
    public id: string;
    constructor(client: ArikenCompany, channelName: string, channelId: string) {
        this.client = client;
        this.name = channelName;
        this.id = channelId;
    }

    async send(content: string) {
        await this.client.twitch.say(this.name, content);
    }
}
