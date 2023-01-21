// nodeモジュールをインポート
import type { Logger } from '@suzuki3jp/utils';
import type { Client } from 'discord.js';

// モジュールをインポート
import { CommandManager } from '../../class/Command';
import { DataManager } from '../../class/DataManager';
import { slashCommands } from '../../data/SlashCommands';

// JSON Data Manager
const DM = new DataManager();

export const discordReady = async (client: Client, logger: Logger) => {
    const settings = DM.getSettings();
    new CommandManager().syncCommandPanel(client);

    await client.application?.commands.set(slashCommands, settings.discord.guildId);
    logger.system('discord client is ready.');
};
