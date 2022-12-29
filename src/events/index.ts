import type { TwitchClient } from '../TwitchClient/index';
import type { Client } from 'discord.js';
import type { Logger } from '@suzuki3jp/utils';

import { discordReady } from './discord/index';
import { twitchReady } from './twitch/index';

export const eventsIndex = (
    twitchClient: TwitchClient,
    discordClient: Client,
    discordToken: string,
    logger: Logger
) => {
    // client login
    twitchClient.login();
    discordClient.login(discordToken);

    // discord events
    discordClient.on('ready', () => discordReady(discordClient, logger));

    // twitch events
    twitchClient.on('ready', () => twitchReady(twitchClient, logger));
};
