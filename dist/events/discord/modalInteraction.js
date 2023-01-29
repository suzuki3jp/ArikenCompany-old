"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modalInteraction = void 0;
const discord_js_1 = require("discord.js");
// モジュールをインポート
const DiscordModal_1 = require("../../class/DiscordModal");
const modalInteraction = async (twitchClient, discordClient, logger, interaction) => {
    const modal = new DiscordModal_1.DiscordModal(twitchClient, discordClient, logger, interaction);
    if (interaction.message instanceof discord_js_1.Message) {
        switch (modal.type) {
            case 'templateAdd':
                modal.reply(await modal.addTemplate(), true);
                break;
            case 'commandAdd':
                modal.reply(await modal.addCommand(), true);
                break;
            case 'commandEdit':
                modal.reply(await modal.editCommand(), true);
                break;
            case 'commandRemove':
                modal.reply(await modal.removeCommand(), true);
                break;
            default:
                break;
        }
    }
};
exports.modalInteraction = modalInteraction;
