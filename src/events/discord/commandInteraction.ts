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
        if (slashCommandInteraction.subCommand === 'panel') return slashCommandInteraction.setupPanel();
        if (slashCommandInteraction.subCommand === 'template') return slashCommandInteraction.setupTemplate();
    } else return slashCommandInteraction.reply('このコマンドを実行する権限がありません。');
};
