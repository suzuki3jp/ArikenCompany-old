// nodeモジュールをインポート
import type { Interaction } from 'discord.js';

// モジュールをインポート
import { Base } from '../../class/Base';
import { commandInteraction } from './commandInteraction';
import { buttonInteraction } from './buttonInteraction';
import { modalInteraction } from './modalInteraction';

export const discordInteraction = (base: Base, interaction: Interaction) => {
    if (interaction.isButton()) return buttonInteraction(base, interaction);
    if (interaction.isCommand()) return commandInteraction(base, interaction);
    if (interaction.isModalSubmit()) return modalInteraction(base, interaction);
};
