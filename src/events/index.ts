import http from 'http';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { TwitchClient } from '@suzuki3jp/twitch.js';
import type { Client } from 'discord.js';
import type { Logger } from '@suzuki3jp/utils';
import type { Express } from 'express';

import { discordReady } from './discord/index';
import { twitchReady, twitchMessage } from './twitch/index';
import { router } from '../api/Router';

const settingsPath = resolve(__dirname, '../data/settings.json');
const settings: { api: { port: number } } = JSON.parse(readFileSync(settingsPath, 'utf-8'));

export const eventsIndex = (
    api: { server: http.Server; app: Express },
    twitchClient: TwitchClient,
    discordClient: Client,
    discordToken: string,
    logger: Logger
) => {
    // client login
    twitchClient.login();
    discordClient.login(discordToken);
    api.server.listen(settings.api.port, () => {
        logger.system(`api is ready. listening at http://localhost:${settings.api.port}/`);
    });
    api.app.use('/', router);

    // discord events
    discordClient.on('ready', () => discordReady(discordClient, logger));

    // twitch events
    twitchClient.on('ready', () => twitchReady(twitchClient, logger));

    twitchClient.on('messageCreate', (message) => twitchMessage(twitchClient, logger, message));
};
