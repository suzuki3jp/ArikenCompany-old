import { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import { Logger } from '@suzuki3jp/utils';
import { Client as Discord, CommandInteraction } from 'discord.js';

import { Base } from './Base';

export class DiscordSlashCommand extends Base {
    constructor(twitchClient: Twitch, discordClient: Discord, logger: Logger, public interaction: CommandInteraction) {
        super(twitchClient, discordClient, logger);
    }
}
