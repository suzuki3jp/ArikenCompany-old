import type { Client, Interaction } from 'discord.js';
import { commandInteraction } from './commandInteraction';
import { buttonInteraction } from './buttonInteraction';
import { modalInteraction } from './modalInteraction';

export const discordInteraction = (client: Client, interaction: Interaction) => {
    if (interaction.isCommand()) return commandInteraction(client, interaction);
    if (interaction.isButton()) return buttonInteraction(client, interaction);
    if (interaction.isModalSubmit()) return modalInteraction(client, interaction);
};
