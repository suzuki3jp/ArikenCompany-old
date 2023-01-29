"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordInteraction = void 0;
// モジュールをインポート
const commandInteraction_1 = require("./commandInteraction");
const buttonInteraction_1 = require("./buttonInteraction");
const modalInteraction_1 = require("./modalInteraction");
const discordInteraction = (twitchClient, discordClient, logger, interaction) => {
    if (interaction.isButton())
        return (0, buttonInteraction_1.buttonInteraction)(twitchClient, discordClient, logger, interaction);
    if (interaction.isCommand())
        return (0, commandInteraction_1.commandInteraction)(discordClient, interaction);
    if (interaction.isModalSubmit())
        return (0, modalInteraction_1.modalInteraction)(twitchClient, discordClient, logger, interaction);
};
exports.discordInteraction = discordInteraction;
