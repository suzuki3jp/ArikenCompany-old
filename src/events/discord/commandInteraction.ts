import { Client, ChatInputCommandInteraction, ButtonBuilder } from 'discord.js';
import { pageManagerActionRow, commandManagerActionRow } from '../../data/Components';
import { createCommandPanelEmbeds } from '../../utils/Embed';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const settingsPath = resolve(__dirname, '../../data/settings.json');

export const commandInteraction = (client: Client, interaction: ChatInputCommandInteraction) => {
    const settings: { discord: { modRoleId: string } } = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    const member = interaction.guild?.members.resolve(interaction.user);

    if (member?.roles.cache.has(settings.discord.modRoleId)) {
        if (interaction.options.getSubcommand() === 'panel') {
            if (pageManagerActionRow.components[0] instanceof ButtonBuilder) {
                pageManagerActionRow.components[0].setDisabled(true);
            }
            interaction.channel?.send({
                embeds: [createCommandPanelEmbeds()[0]],
                // @ts-ignore
                components: [pageManagerActionRow, commandManagerActionRow],
            });
        } else if (interaction.options.getSubcommand() === 'template') {
        }
    } else {
        interaction.reply({ content: 'このコマンドを実行する権限がありません', ephemeral: true });
    }
};
