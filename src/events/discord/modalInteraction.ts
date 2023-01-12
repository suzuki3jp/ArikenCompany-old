import type { Client, ModalSubmitInteraction, MessageButton } from 'discord.js';
import { ComponentCustomIds } from '../../data/Components';
import { DiscordModal } from '../../class/DiscordModal';

export const modalInteraction = async (client: Client, interaction: ModalSubmitInteraction) => {
    const modal = new DiscordModal(client, interaction);

    switch (interaction.customId) {
        case ComponentCustomIds.modal.addTemplate:
            modal.reply(await modal.addTemplate(), true);
            break;
        default:
            break;
    }
};
