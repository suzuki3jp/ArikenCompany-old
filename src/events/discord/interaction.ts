// nodeモジュールをインポート
import { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import { Logger } from '@suzuki3jp/utils';
import type { Client as Discord, Interaction } from 'discord.js';

// モジュールをインポート
import { commandInteraction } from './commandInteraction';
import { buttonInteraction } from './buttonInteraction';
import { modalInteraction } from './modalInteraction';

export const discordInteraction = (
    twitchClient: Twitch,
    discordClient: Discord,
    logger: Logger,
    interaction: Interaction
) => {
    if (interaction.isButton()) return buttonInteraction(twitchClient, discordClient, logger, interaction);
    if (interaction.isCommand()) return commandInteraction(twitchClient, discordClient, logger, interaction);
    if (interaction.isModalSubmit()) return modalInteraction(twitchClient, discordClient, logger, interaction);
};
