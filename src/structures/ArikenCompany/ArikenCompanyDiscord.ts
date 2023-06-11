import { Client, IntentsBitField, Partials } from 'discord.js';

import { ArikenCompany } from './ArikenCompany';
import { DiscordReady } from '../../events/discord/index';

export class ArikenCompanyDiscord {
    private client: ArikenCompany;
    public discordClient: Client;

    constructor(client: ArikenCompany) {
        this.client = client;
        this.discordClient = new Client({ intents: ALL_INTENTS, partials: ALL_PARTIALS });
    }

    eventsLoad() {
        this.discordClient.on('ready', (...args) => new DiscordReady(this.client).execute(...args));
        this.client.logger.system('Loaded discord client events.');
    }

    async start() {
        this.eventsLoad();
        await this.discordClient.login(this.client.dotenv.DISCORD_TOKEN);
        this.client.logger.system('Started discord client.');
    }
}

const ALL_INTENTS = Object.values(IntentsBitField.Flags)
    .map((v) => +v)
    .filter(Number.isInteger);
const ALL_PARTIALS = [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
];
