"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordMessage = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
// モジュールをインポート
const DiscordCommand_1 = require("../../class/DiscordCommand");
const ValueParser_1 = require("../../class/ValueParser");
const settingsPath = path_1.default.resolve(__dirname, '../../data/settings.json');
const discordMessage = async (client, message) => {
    if (message.author.bot)
        return;
    const settings = JSON.parse((0, fs_1.readFileSync)(settingsPath, 'utf-8'));
    const discordCommand = new DiscordCommand_1.DiscordCommand(client, message, settings.twitch.manageCommands);
    const reply = (options) => {
        message.reply(options);
    };
    if (!discordCommand.isCommand())
        return;
    if (discordCommand.isManageCommands()) {
        const manageCommandName = discordCommand.manageCommandName();
        if (manageCommandName === '!oncom') {
            reply(discordCommand.onCom());
        }
        else if (manageCommandName === '!offcom') {
            reply(discordCommand.offCom());
        }
        else if (manageCommandName === '!addcom') {
            reply(await discordCommand.addCom());
        }
        else if (manageCommandName === '!editcom') {
            reply(await discordCommand.editCom());
        }
        else if (manageCommandName === '!rmcom') {
            reply(discordCommand.removeCom());
        }
        else if (manageCommandName === '!allow') {
            reply(discordCommand.allow());
        }
        else if (manageCommandName === '!deny') {
            reply(discordCommand.deny());
        }
        else if (manageCommandName === '!cooltime') {
            reply(discordCommand.coolTime());
        }
        else if (manageCommandName === '!setcooltime') {
            reply(discordCommand.changeCoolTime());
        }
    }
    else {
        if (!discordCommand.isOnCom())
            return;
        const commandValue = discordCommand.commandValue();
        if (!commandValue)
            return;
        const valueParser = new ValueParser_1.DiscordValueParser();
        const valueParseResult = await valueParser.parse(commandValue, message);
        if (valueParseResult.status !== 200)
            return;
        reply(valueParseResult.content);
    }
};
exports.discordMessage = discordMessage;
