import type { Client } from 'discord.js';
import type { Logger } from '@suzuki3jp/utils';

export const discordReady = (client: Client, logger: Logger) => {
    logger.system('discord client is ready.');
};
