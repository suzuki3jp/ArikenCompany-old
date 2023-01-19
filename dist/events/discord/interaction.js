"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordInteraction = void 0;
// モジュールをインポート
const commandInteraction_1 = require("./commandInteraction");
const buttonInteraction_1 = require("./buttonInteraction");
const modalInteraction_1 = require("./modalInteraction");
const discordInteraction = (client, interaction) => {
    if (interaction.isCommand())
        return (0, commandInteraction_1.commandInteraction)(client, interaction);
    if (interaction.isButton())
        return (0, buttonInteraction_1.buttonInteraction)(client, interaction);
    if (interaction.isModalSubmit())
        return (0, modalInteraction_1.modalInteraction)(client, interaction);
};
exports.discordInteraction = discordInteraction;
