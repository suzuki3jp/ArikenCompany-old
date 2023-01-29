"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonInteraction = void 0;
const DiscordButton_1 = require("../../class/DiscordButton");
const buttonInteraction = (twitchClient, discordClient, logger, interaction) => {
    const button = new DiscordButton_1.DiscordButton(twitchClient, discordClient, logger, interaction);
    // コマンドパネルページネーション
    switch (button.type) {
        case 'panelNext':
            button.next();
            break;
        case 'panelPrevious':
            button.previous();
            break;
        case 'templateAdd':
            button.addTemplate();
            break;
        case 'template':
            button.editCommandByTemlate();
            break;
        case 'commandAdd':
            button.addCommand();
            break;
        case 'commandEdit':
            button.editCommand();
            break;
        case 'commandRemove':
            button.removeCommand();
            break;
        default:
            break;
    }
};
exports.buttonInteraction = buttonInteraction;
