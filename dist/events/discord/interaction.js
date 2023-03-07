"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordInteraction = void 0;
const commandInteraction_1 = require("./commandInteraction");
const buttonInteraction_1 = require("./buttonInteraction");
const modalInteraction_1 = require("./modalInteraction");
const discordInteraction = (base, interaction) => {
    if (interaction.isButton())
        return (0, buttonInteraction_1.buttonInteraction)(base, interaction);
    if (interaction.isCommand())
        return (0, commandInteraction_1.commandInteraction)(base, interaction);
    if (interaction.isModalSubmit())
        return (0, modalInteraction_1.modalInteraction)(base, interaction);
};
exports.discordInteraction = discordInteraction;
