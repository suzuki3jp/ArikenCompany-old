import { Client as Discord, FetchChannelOptions } from 'discord.js';
import { ChatClient as Twitch } from '@twurple/chat';

import { ArikenCompany } from '@/ArikenCompany';
import { ErrorMessages, makeError } from '@/helpers/errors/ArikenCompanyError';
import { LogMessages, Logger } from '@/helpers/Logger/Logger';

export class ArikenCompanyChat {
    public logger: Logger;
    public discord: Discord;
    public twitch: Twitch;

    constructor(private client: ArikenCompany) {
        if (!this.client.isReady()) throw makeError(ErrorMessages.CantSetupChat);
        const {
            twitch: { channels },
        } = this.client.settings.cache;

        this.logger = this.client.logger.createChild('Chat');
        this.discord = new Discord({ intents: ['Guilds', 'MessageContent'] });
        this.twitch = new Twitch({ authProvider: this.client.twitchApi.auth, channels });
    }

    async start() {
        await this.discord.login(this.client.dotenv.cache.DISCORD_TOKEN);
        await this.twitch.connect();
        this.logger.info(LogMessages.startedArikenCompanyChats);
        return;
    }

    public async fetchDiscordChannel(id: string, options?: FetchChannelOptions) {
        return await this.discord.channels.fetch(id, options);
    }
}
