import { ArikenCompany } from '../../structures/index';

export class TwitchReady {
    constructor(private client: ArikenCompany) {}

    execute() {
        this.client.logger.system(
            `Connected Twitch channels. [${this.client.settings.cache.twitch.channels.join(', ')}]`
        );
    }
}
