import { APIEmbed } from 'discord.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const commandsPath = resolve(__dirname, '../data/Commands.json');

export const createCommandPanelEmbeds = (): APIEmbed[] => {
    const commands: Record<string, string> = JSON.parse(readFileSync(commandsPath, 'utf-8'));
    const commandsArr = Object.entries(commands);
    const pagesLength = Math.floor(commandsArr.length / 10) + 1;
    let index = 0;
    const embeds: APIEmbed[] = [];
    while (index < pagesLength) {
        if (pagesLength - 1 !== index) {
            const pageElements = commandsArr.splice(0, 10);
            const pageContent = '**' + pageElements.join('\n**').split(',').join('** ');

            const embed: APIEmbed = {
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
            };
            embeds.push(embed);
        } else {
            const pageElements = commandsArr.splice(0);
            const pageContent = '**' + pageElements.join('\n**').split(',').join('** ');

            const embed: APIEmbed = {
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
            };
            embeds.push(embed);
        }
        index++;
    }
    return embeds;
};
