// nodeモジュールをインポート
import { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import type { Logger } from '@suzuki3jp/utils';
import type { Client as Discord } from 'discord.js';

// モジュールをインポート
import { CommandManager } from '../../class/Command';
import { DataManager } from '../../class/DataManager';
import { slashCommands } from '../../data/SlashCommands';

// JSON Data Manager
const DM = new DataManager();

export const discordReady = async (twitchClient: Twitch, discordClient: Discord, logger: Logger) => {
    const settings = DM.getSettings();
    new CommandManager(twitchClient, discordClient, logger).syncCommandPanel();

    await discordClient.application?.commands.set(slashCommands, settings.discord.guildId);
    logger.system('discord client is ready.');
};
