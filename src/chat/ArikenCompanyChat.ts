import { readdirSync } from 'fs';
import { resolve } from 'path';
import { Client as Discord, FetchChannelOptions, Collection } from 'discord.js';
import { ChatClient as Twitch } from '@twurple/chat';

import { ArikenCompany } from '@/ArikenCompany';
import { isDiscordEventListener } from '@/chat/services/discord/DiscordEventListener';
import { SlashCommand, isSlashCommand } from '@/chat/SlashCommands/SlashCommand';
import { FilePaths } from '@/constants/FilePaths';
import { ErrorMessages, makeError } from '@/helpers/errors/ArikenCompanyError';
import { LogMessages, Logger } from '@/helpers/Logger/Logger';

export class ArikenCompanyChat {
    public logger: Logger;
    public discord: Discord;
    public twitch: Twitch;

    public slashCommands: Collection<string, SlashCommand>;
    constructor(private client: ArikenCompany) {
        if (!this.client.isReady()) throw makeError(ErrorMessages.CantSetupChat);
        const {
            twitch: { channels },
        } = this.client.settings.cache;

        this.logger = this.client.logger.createChild('Chat');
        this.discord = new Discord({ intents: ['Guilds', 'MessageContent'] });
        this.twitch = new Twitch({ authProvider: this.client.twitchApi.auth, channels });

        this.slashCommands = new Collection();
        this.loadSlashCommands();
        this.loadDiscordEvents();
    }

    public async start() {
        await this.discord.login(this.client.dotenv.cache.DISCORD_TOKEN);
        await this.twitch.connect();
        this.logger.info(LogMessages.startedArikenCompanyChats);
        return;
    }

    public async fetchDiscordChannel(id: string, options?: FetchChannelOptions) {
        return await this.discord.channels.fetch(id, options);
    }

    private async loadDiscordEvents() {
        const eventFilePaths = readdirSync(FilePaths.discordEventsDir).filter((p) => p.endsWith('.js') && p !== 'DiscordEventListener.js');

        for (const eventFilePath of eventFilePaths) {
            const completeEventFilePath = resolve(FilePaths.discordEventsDir, eventFilePath);
            const event = (await import(completeEventFilePath)).default;

            if (isDiscordEventListener(event)) {
                this.discord[event.once ? 'once' : 'on'](event.name, (...args) => event.handler(this, ...args));
                this.logger.debug(LogMessages.loadedDiscordEvent(event.name));
            } else throw makeError(ErrorMessages.InvalidDiscordEventListener(eventFilePath));

            this.logger.info(LogMessages.loadedDiscordEvent());
        }
    }

    private async loadSlashCommands() {
        const commandFilePaths = readdirSync(FilePaths.slashCommandsDir).filter((p) => p.endsWith('.js') && p !== 'SlashCommand.js');

        for (const commandFilePath of commandFilePaths) {
            const completeCommandFilePath = resolve(FilePaths.slashCommandsDir, commandFilePath);
            const command = (await import(completeCommandFilePath)).default;

            if (isSlashCommand(command)) {
                this.slashCommands.set(command.data.name, command);
                this.logger.debug(LogMessages.loadedSlashCommand(command.data.name));
            } else throw makeError(ErrorMessages.InvalidSlashCommandData(commandFilePath));

            this.logger.info(LogMessages.loadedSlashCommand());
        }
    }

    public registerSlashCommands() {
        const commands = Array.from(this.slashCommands.values()).map((d) => d.data.toJSON());
        this.discord.application?.commands.set(commands, this.client.settings.cache.discord.guildId);
    }
}
