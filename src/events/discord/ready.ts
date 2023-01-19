// nodeモジュールをインポート
import type { Logger } from '@suzuki3jp/utils';
import type { Client } from 'discord.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// モジュールをインポート
import { CommandManager } from '../../class/Command';
import { slashCommands } from '../../data/SlashCommands';
import { SettingsJson } from '../../data/JsonTypes';

// paths
const settingsPath = resolve(__dirname, '../../data/settings.json');

export const discordReady = async (client: Client, logger: Logger) => {
    const settings: SettingsJson = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    new CommandManager().syncCommandPanel(client);

    await client.application?.commands.set(slashCommands, settings.discord.guildId);
    logger.system('discord client is ready.');
};
