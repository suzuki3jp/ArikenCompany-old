"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandInteraction = void 0;
// モジュールをインポート
const DiscordSlashCommand_1 = require("../../class/DiscordSlashCommand");
const commandInteraction = async (base, interaction) => {
    const slashCommandInteraction = new DiscordSlashCommand_1.DiscordSlashCommand(base, interaction);
    if (slashCommandInteraction.isMod()) {
        if (slashCommandInteraction.command === 'setup') {
            switch (slashCommandInteraction.subCommand) {
                case 'panel':
                    slashCommandInteraction.setupPanel();
                    break;
                case 'template':
                    slashCommandInteraction.setupTemplate();
                    break;
                case 'notification':
                    slashCommandInteraction.reply(await slashCommandInteraction.setupNotification());
                    break;
                default:
                    break;
            }
        }
        else if (slashCommandInteraction.command === 'key') {
            switch (slashCommandInteraction.subCommand) {
                case 'get':
                    slashCommandInteraction.reply(`現在のAPIキー: ${slashCommandInteraction.getApiKey()}`);
                    break;
                case 'refresh':
                    slashCommandInteraction.reply(slashCommandInteraction.refreshApiKey());
                    break;
                default:
                    break;
            }
        }
    }
    else
        return slashCommandInteraction.reply('このコマンドを実行する権限がありません。');
};
exports.commandInteraction = commandInteraction;
