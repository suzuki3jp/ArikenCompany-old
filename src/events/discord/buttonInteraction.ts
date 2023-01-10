import {} from 'discord.js';
import type { Client, ButtonInteraction } from 'discord.js';
import { ComponentCustomIds } from '../../data/Components';
import { createCommandPanelEmbeds, currentPage, isFirstPageByFooter, isLastPageByFooter } from '../../utils/Embed';

export const buttonInteraction = (client: Client, interaction: ButtonInteraction) => {
    if (interaction.customId === ComponentCustomIds.button.next) {
        if (interaction.message.embeds[0]) {
            const manageCommandPanel = interaction.message;
            const embeds = manageCommandPanel.embeds;
            const components = manageCommandPanel.components;
            const isFirstPage = isFirstPageByFooter(interaction.message.embeds[0]);
            const currentPageNumber = currentPage(interaction.message.embeds[0]);
            const newPage = createCommandPanelEmbeds()[currentPageNumber + 1];
            if (isFirstPage) {
            } else {
            }
        }
    } else if (interaction.customId === ComponentCustomIds.button.previous) {
    }
};
