import { Message, MessageButton } from 'discord.js';
import type { Client, ButtonInteraction } from 'discord.js';
import { ComponentCustomIds } from '../../data/Components';
import { createCommandPanelEmbeds, currentPage, isFirstPageByFooter, isLastPageByFooter } from '../../utils/Embed';

export const buttonInteraction = (client: Client, interaction: ButtonInteraction) => {
    if (interaction.customId === ComponentCustomIds.button.next) {
        if (interaction.message.embeds[0]) {
            const manageCommandPanel = interaction.message;
            const embeds = manageCommandPanel.embeds;
            const components = manageCommandPanel.components;
            if (!components || !isMessage(manageCommandPanel)) return;
            const isFirstPage = isFirstPageByFooter(interaction.message.embeds[0]);
            const currentPageNumber = currentPage(interaction.message.embeds[0]);
            const newPage = createCommandPanelEmbeds()[currentPageNumber];
            if (isFirstPage) {
                // 最初のページから次のページに遷移したとき、戻るボタンの無効化を解除
                if (components[0].components[0] instanceof MessageButton) {
                    components[0].components[0].setDisabled(false);
                }
                embeds[0] = newPage;
                manageCommandPanel.edit({
                    embeds,
                    // @ts-ignore
                    components,
                });
                interaction.deferUpdate();
            } else if (isLastPageByFooter(newPage)) {
                // 最後のページに遷移したとき、次へボタンを無効化
                if (components[0].components[1] instanceof MessageButton) {
                    components[0].components[1].setDisabled(true);
                }
                embeds[0] = newPage;
                manageCommandPanel.edit({
                    embeds,
                    // @ts-ignore
                    components,
                });
                interaction.deferUpdate();
            } else {
                embeds[0] = newPage;
                manageCommandPanel.edit({
                    embeds,
                    // @ts-ignore
                    components,
                });
                interaction.deferUpdate();
            }
        }
    } else if (interaction.customId === ComponentCustomIds.button.previous) {
        const manageCommandPanel = interaction.message;
        const embeds = manageCommandPanel.embeds;
        const components = manageCommandPanel.components;
        if (!components || !isMessage(manageCommandPanel)) return;
        const isLastPage = isLastPageByFooter(interaction.message.embeds[0]);
        const currentPageNumber = currentPage(interaction.message.embeds[0]);
        const newPage = createCommandPanelEmbeds()[currentPageNumber - 2];
        if (isLastPage) {
            // 最後のページから戻ったときに次へボタンを有効化する
            if (components[0].components[1] instanceof MessageButton) {
                components[0].components[1].setDisabled(false);
            }
            embeds[0] = newPage;
            manageCommandPanel.edit({
                embeds,
                // @ts-ignore
                components,
            });
            interaction.deferUpdate();
        } else if (isFirstPageByFooter(newPage)) {
            // 最初のページに戻る時に戻るボタンを無効化する
            if (components[0].components[0] instanceof MessageButton) {
                components[0].components[0].setDisabled(true);
            }
            embeds[0] = newPage;
            manageCommandPanel.edit({
                embeds,
                // @ts-ignore
                components,
            });
            interaction.deferUpdate();
        } else {
            embeds[0] = newPage;
            manageCommandPanel.edit({
                embeds,
                // @ts-ignore
                components,
            });
            interaction.deferUpdate();
        }
    }
};

const isMessage = (data: any): data is Message => {
    return true;
};
