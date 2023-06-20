import { Client, IntentsBitField, Partials } from 'discord.js';

import { ArikenCompany } from './ArikenCompany';
import { DiscordReadyEvent } from '../../events/discord/index';
import { LogMessages } from '../../utils';

export class ArikenCompanyDiscord {
    private client: ArikenCompany;
    public discordClient: Client;

    constructor(client: ArikenCompany) {
        this.client = client;
        this.discordClient = new Client({ intents: ALL_INTENTS, partials: ALL_PARTIALS });
    }

    eventsLoad() {
        this.discordClient.on('debug', (...args) => this.client.logger.debug(...args));
        this.discordClient.on('ready', (...args) => new DiscordReadyEvent(this.client).execute(...args));
        this.client.logger.system(LogMessages.LoadedDiscordEvents);
    }

    async start() {
        this.eventsLoad();
        await this.discordClient.login(this.client.dotenv.DISCORD_TOKEN);
        this.client.logger.system(LogMessages.StartedDiscord);
    }
}

const ALL_INTENTS = Object.values(IntentsBitField.Flags)
    .map((v) => +v)
    .filter(Number.isInteger);
const ALL_PARTIALS = [Partials.User, Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember];
