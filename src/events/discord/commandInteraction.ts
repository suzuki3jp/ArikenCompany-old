// nodeモジュールをインポート
import { Client, CommandInteraction, MessageActionRow } from 'discord.js';

// モジュールをインポート
import { DataManager } from '../../class/DataManager';
import { addTemplateButton, commandManagerActionRow, pageManagerActionRow } from '../../data/Components';
import { createCommandPanelEmbeds } from '../../utils/Embed';

// JSON Data Manager
const DM = new DataManager();

export const commandInteraction = async (client: Client, interaction: CommandInteraction) => {
    const settings = DM.getSettings();
    const member = interaction.guild?.members.resolve(interaction.user);

    if (member?.roles.cache.has(settings.discord.modRoleId)) {
        if (interaction.options.getSubcommand() === 'panel') {
            pageManagerActionRow.components[0].setDisabled(true);
            const panel = await interaction.channel?.send({
                embeds: [createCommandPanelEmbeds()[0]],
                components: [pageManagerActionRow, commandManagerActionRow],
            });
            settings.discord.manageCommandPanelId = panel?.id ?? null;
            DM.setSettings(settings);
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
