// nodeモジュールをインポート
import type { TwitchClient } from '@suzuki3jp/twitch.js';
import type { Logger } from '@suzuki3jp/utils';
import type { Client } from 'discord.js';
import type { Express } from 'express';
import http from 'http';

// モジュールをインポート
import { router } from '../api/Router';
import { DataManager } from '../class/DataManager';
import { TwitchCommand } from '../class/TwitchCommand';
import { discordInteraction, discordMessage, discordReady } from './discord/index';
import { twitchMessage, twitchReady } from './twitch/index';

// JSON Data Manager
const DM = new DataManager();

const settings = DM.getSettings();

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

    discordClient.on('messageCreate', (message) => discordMessage(discordClient, message));

    discordClient.on('interactionCreate', (interaction) => discordInteraction(discordClient, interaction));

    // twitch events
    twitchClient.on('ready', () => twitchReady(twitchClient, logger));

    twitchClient.on('messageCreate', (message) =>
        twitchMessage(new TwitchCommand(twitchClient, discordClient, message, settings.twitch.manageCommands), message)
    );
};
