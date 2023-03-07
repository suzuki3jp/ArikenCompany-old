// nodeモジュールをインポート
import { CommandInteraction } from 'discord.js';
import { Base } from '../../class/Base';

// モジュールをインポート
import { DiscordSlashCommand } from '../../class/DiscordSlashCommand';

export const commandInteraction = async (base: Base, interaction: CommandInteraction) => {
    const slashCommandInteraction = new DiscordSlashCommand(base, interaction);

    if (slashCommandInteraction.isMod()) {
        if (slashCommandInteraction.command === 'setup') {
            switch (slashCommandInteraction.subCommand) {
                case 'panel':
                    slashCommandInteraction.setupPanel();
                    break;
                case 'template':
                    slashCommandInteraction.setupTemplate();
                    break;
                case 'notification':
                    slashCommandInteraction.reply(await slashCommandInteraction.setupNotification());
                    break;
                default:
                    break;
            }
        } else if (slashCommandInteraction.command === 'key') {
            switch (slashCommandInteraction.subCommand) {
                case 'get':
                    slashCommandInteraction.reply(`現在のAPIキー: ${slashCommandInteraction.getApiKey()}`);
                    break;
                case 'refresh':
                    slashCommandInteraction.reply(slashCommandInteraction.refreshApiKey());
                    break;
                default:
                    break;
            }
        }
    } else return slashCommandInteraction.reply('このコマンドを実行する権限がありません。');
};
