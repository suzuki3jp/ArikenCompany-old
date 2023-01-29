// nodeモジュールをインポート
import { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import { Logger } from '@suzuki3jp/utils';
import { Client as Discord, CommandInteraction } from 'discord.js';

// モジュールをインポート
import { DiscordSlashCommand } from '../../class/DiscordSlashCommand';

export const commandInteraction = async (
    twitchClient: Twitch,
    discordClient: Discord,
    logger: Logger,
    interaction: CommandInteraction
) => {
    const slashCommandInteraction = new DiscordSlashCommand(twitchClient, discordClient, logger, interaction);

    if (slashCommandInteraction.isMod()) {
        switch (slashCommandInteraction.subCommand) {
            case 'panel':
                slashCommandInteraction.setupPanel();
                break;
            case 'template':
                slashCommandInteraction.setupTemplate();
                break;
            default:
                break;
        }
    } else return slashCommandInteraction.reply('このコマンドを実行する権限がありません。');
};
