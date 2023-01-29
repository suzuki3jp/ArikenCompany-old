import { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import { Logger } from '@suzuki3jp/utils';
import { Client as Discord, CommandInteraction, MessageActionRow } from 'discord.js';
import { addTemplateButton, commandManagerActionRow, pageManagerActionRow } from '../data/Components';
import { createCommandPanelEmbeds } from '../utils/Embed';

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

    async setupPanel() {
        pageManagerActionRow.components[0].setDisabled(true);
        const settings = super.DM.getSettings();
        const panel = await this.interaction.channel?.send({
            embeds: [createCommandPanelEmbeds()[0]],
            components: [pageManagerActionRow, commandManagerActionRow],
        });
        settings.discord.manageCommandPanelId = panel?.id ?? null;
        super.DM.setSettings(settings);
    }

    setupTemplate() {
        const targetCommandName = this.interaction.options.getString('command');
        if (!targetCommandName) return;
        this.interaction.channel?.send({
            embeds: [
                {
                    title: targetCommandName,
                    description: 'ボタンを押すとあらかじめ設定された値に変更',
                },
            ],
            components: [new MessageActionRow().addComponents(addTemplateButton)],
        });
    }
}
