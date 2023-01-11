import { Client, CommandInteraction, MessageActionRow } from 'discord.js';
import { pageManagerActionRow, commandManagerActionRow, addTemplateButton } from '../../data/Components';
import { createCommandPanelEmbeds } from '../../utils/Embed';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const settingsPath = resolve(__dirname, '../../data/settings.json');

export const commandInteraction = async (client: Client, interaction: CommandInteraction) => {
    const settings: { discord: { modRoleId: string; manageCommandPanelId: string | null } } = JSON.parse(
        readFileSync(settingsPath, 'utf-8')
    );
    const member = interaction.guild?.members.resolve(interaction.user);

    if (member?.roles.cache.has(settings.discord.modRoleId)) {
        if (interaction.options.getSubcommand() === 'panel') {
            pageManagerActionRow.components[0].setDisabled(true);
            const panel = await interaction.channel?.send({
                embeds: [createCommandPanelEmbeds()[0]],
                components: [pageManagerActionRow, commandManagerActionRow],
            });
            settings.discord.manageCommandPanelId = panel?.id ?? null;
            const writeData = JSON.stringify(settings, null, '\t');
            writeFileSync(settingsPath, writeData, 'utf-8');
        } else if (interaction.options.getSubcommand() === 'template') {
            const targetCommandName = interaction.options.getString('command');
            if (!targetCommandName) return;
            interaction.channel?.send({
                embeds: [
                    {
                        title: targetCommandName,
                        description: 'ボタンを押すとあらかじめ設定された値に変更',
                    },
                ],
                components: [new MessageActionRow().addComponents(addTemplateButton)],
            });
        }
    } else {
        interaction.reply({ content: 'このコマンドを実行する権限がありません', ephemeral: true });
    }
};
