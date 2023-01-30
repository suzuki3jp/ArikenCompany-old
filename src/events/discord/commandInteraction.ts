// nodeモジュールをインポート
import { CommandInteraction } from 'discord.js';
import { Base } from '../../class/Base';

// モジュールをインポート
import { DiscordSlashCommand } from '../../class/DiscordSlashCommand';

export const commandInteraction = async (base: Base, interaction: CommandInteraction) => {
    const slashCommandInteraction = new DiscordSlashCommand(base, interaction);

    if (slashCommandInteraction.isMod()) {
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
    } else return slashCommandInteraction.reply('このコマンドを実行する権限がありません。');
};
