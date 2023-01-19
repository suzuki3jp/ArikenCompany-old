import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { Client } from 'discord.js';
import type { Logger } from '@suzuki3jp/utils';

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
