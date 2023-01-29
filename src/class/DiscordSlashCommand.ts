import { CommandInteraction, MessageActionRow } from 'discord.js';
import { addTemplateButton, commandManagerActionRow, pageManagerActionRow } from '../data/Components';
import { createCommandPanelEmbeds } from '../utils/Embed';

import { Base } from './Base';

export class DiscordSlashCommand extends Base {
    public interaction: CommandInteraction;
    public subCommand: string | null;

    constructor(base: Base, interaction: CommandInteraction) {
        super(base.twitch, base.discord, base.eventSub, base.logger);
        this.interaction = interaction;
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

    /**
     *
     * @param content
     * @param ephemeral デフォルトでtrue
     */
    reply(content: string, ephemeral?: boolean) {
        this.interaction.reply({ content, ephemeral: ephemeral ?? true });
    }
}
