import { ClientEvents } from 'discord.js';

import { ArikenCompany } from '../../structures/index';

export class DiscordReadyEvent {
    private client: ArikenCompany;

    constructor(client: ArikenCompany) {
        this.client = client;
    }

    async execute(...args: ClientEvents['ready']) {
        const discord = args[0];

        this.client.logger.system(`Logged in to discord client as ${discord.user.tag}.`);
    }
}
