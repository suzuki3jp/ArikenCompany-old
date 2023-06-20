import { ClientEvents } from 'discord.js';

import { ArikenCompany } from '../../structures/index';
import { LogMessages } from '../../utils';

export class DiscordReadyEvent {
    private client: ArikenCompany;

    constructor(client: ArikenCompany) {
        this.client = client;
        this.client.logger.system(LogMessages.LoadedDiscordReadyEvent);
    }

    async execute(...args: ClientEvents['ready']) {
        const discord = args[0];

        this.client.logger.system(LogMessages.DiscordReady(discord.user.tag));
    }
}
