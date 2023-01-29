// nodeモジュールをインポート
import { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import { Logger } from '@suzuki3jp/utils';
import { Client as Discord, CommandInteraction, MessageActionRow } from 'discord.js';

// モジュールをインポート
import { DiscordSlashCommand } from '../../class/DiscordSlashCommand';
import { addTemplateButton, commandManagerActionRow, pageManagerActionRow } from '../../data/Components';
import { createCommandPanelEmbeds } from '../../utils/Embed';

export const commandInteraction = async (
    twitchClient: Twitch,
    discordClient: Discord,
    logger: Logger,
    interaction: CommandInteraction
) => {
    const slashCommandInteraction = new DiscordSlashCommand(twitchClient, discordClient, logger, interaction);
    const settings = slashCommandInteraction.DM.getSettings();

    if (slashCommandInteraction.isMod()) {
        if (interaction.options.getSubcommand() === 'panel') {
            pageManagerActionRow.components[0].setDisabled(true);
            const panel = await interaction.channel?.send({
                embeds: [createCommandPanelEmbeds()[0]],
                components: [pageManagerActionRow, commandManagerActionRow],
            });
            settings.discord.manageCommandPanelId = panel?.id ?? null;
            slashCommandInteraction.DM.setSettings(settings);
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
