// nodeモジュールをインポート
import { MessageEmbed } from 'discord.js';
import { APIEmbed } from 'discord-api-types/v9';

// モジュールをインポート
import { DataManager } from '../class/DataManager';

// JSON Data Manager
const DM = new DataManager();

export const createCommandPanelEmbeds = (): MessageEmbed[] => {
    const commands = DM.getCommands();
    const commandsArr = Object.entries(commands);
    const pagesLength = Math.floor(commandsArr.length / 10) + 1;
    let index = 0;
    const embeds: MessageEmbed[] = [];
    while (index < pagesLength) {
        if (pagesLength - 1 !== index) {
            const pageElements = commandsArr.splice(0, 10);
            const pageContent = '**' + pageElements.join('\n**').split(',').join('** ');

            const embed: MessageEmbed = new MessageEmbed({
                title: 'コマンド一覧',
                description: 'ボタンを押して変更する内容を入力',
                fields: [
                    {
                        name: '------------------------',
                        value: pageContent,
                    },
                ],
                footer: {
                    text: `現在のページ ${index + 1} / ${pagesLength}`,
                },
            });
            embeds.push(embed);
        } else {
            const pageElements = commandsArr.splice(0);
            const pageContent = '**' + pageElements.join('\n**').split(',').join('** ');

            const embed: MessageEmbed = new MessageEmbed({
                title: 'コマンド一覧',
                description: 'ボタンを押して変更する内容を入力',
                fields: [
                    {
                        name: '------------------------',
                        value: pageContent,
                    },
                ],
                footer: {
                    text: `現在のページ ${index + 1} / ${pagesLength}`,
                },
            });
            embeds.push(embed);
        }
        index++;
    }
    return embeds;
};

export const currentPage = (embed: MessageEmbed | APIEmbed): number => {
    if (embed.footer?.text) {
        const currentFooterText = embed.footer.text;
        const [footerTitle, currentPage, _, pageLength] = currentFooterText.split(' ');
        return parseInt(currentPage);
    } else {
        return 0;
    }
};

export const isFirstPageByFooter = (embed: MessageEmbed | APIEmbed): boolean => {
    return currentPage(embed) === 1;
};

export const isLastPageByFooter = (embed: MessageEmbed | APIEmbed): boolean => {
    if (embed.footer?.text) {
        const currentFooterText = embed.footer.text;
        const [footerTitle, currentPage, _, pageLength] = currentFooterText.split(' ');
        return currentPage === pageLength;
    } else {
        return false;
    }
};
