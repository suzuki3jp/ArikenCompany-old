import { ArikenCompany } from '../../structures/index';
import { LogMessages } from '../../utils';

export class TwitchReadyEvent {
    constructor(private client: ArikenCompany) {
        this.client.logger.system(LogMessages.LoadedTwitchReadyEvent);
    }

    execute() {
        this.client.logger.system(LogMessages.TwitchReady(this.client.settings.cache.twitch.channels));
    }
}
