"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLastPageByFooter = exports.isFirstPageByFooter = exports.currentPage = exports.createCommandPanelEmbeds = void 0;
// nodeモジュールをインポート
const discord_js_1 = require("discord.js");
// モジュールをインポート
const DataManager_1 = require("../class/DataManager");
// JSON Data Manager
const DM = new DataManager_1.DataManager();
const createCommandPanelEmbeds = () => {
    const commands = DM.getCommands();
    const commandsArr = Object.entries(commands);
    const pagesLength = Math.floor(commandsArr.length / 10) + 1;
    let index = 0;
    const embeds = [];
    while (index < pagesLength) {
        if (pagesLength - 1 !== index) {
            const pageElements = commandsArr.splice(0, 10);
            const pageContent = '**' + pageElements.join('\n**').split(',').join('** ');
            const embed = new discord_js_1.MessageEmbed({
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
        else {
            const pageElements = commandsArr.splice(0);
            const pageContent = '**' + pageElements.join('\n**').split(',').join('** ');
            const embed = new discord_js_1.MessageEmbed({
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
exports.createCommandPanelEmbeds = createCommandPanelEmbeds;
const currentPage = (embed) => {
    if (embed.footer?.text) {
        const currentFooterText = embed.footer.text;
        const [footerTitle, currentPage, _, pageLength] = currentFooterText.split(' ');
        return parseInt(currentPage);
    }
    else {
        return 0;
    }
};
exports.currentPage = currentPage;
const isFirstPageByFooter = (embed) => {
    return (0, exports.currentPage)(embed) === 1;
};
exports.isFirstPageByFooter = isFirstPageByFooter;
const isLastPageByFooter = (embed) => {
    if (embed.footer?.text) {
        const currentFooterText = embed.footer.text;
        const [footerTitle, currentPage, _, pageLength] = currentFooterText.split(' ');
        return currentPage === pageLength;
    }
    else {
        return false;
    }
};
exports.isLastPageByFooter = isLastPageByFooter;
