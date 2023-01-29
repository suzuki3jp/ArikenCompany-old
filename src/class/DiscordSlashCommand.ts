import { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import { Logger } from '@suzuki3jp/utils';
import { Client as Discord, CommandInteraction, GuildMemberRoleManager } from 'discord.js';

import { Base } from './Base';

export class DiscordSlashCommand extends Base {
    public subCommand: string | null;

    constructor(twitchClient: Twitch, discordClient: Discord, logger: Logger, public interaction: CommandInteraction) {
        super(twitchClient, discordClient, logger);
        this.subCommand = this.interaction.options.getSubcommand();
    }

    isMod(): boolean {
        const modRoleId = super.DM.getSettings().discord.modRoleId;
        const member = this.interaction.guild?.members.resolve(this.interaction.user);

        if (!member) return false;
        return member.roles.cache.has(modRoleId);
    }
}
