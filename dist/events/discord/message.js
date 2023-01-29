"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordMessage = void 0;
// モジュールをインポート
const DiscordCommand_1 = require("../../class/DiscordCommand");
const ValueParser_1 = require("../../class/ValueParser");
const discordMessage = async (twitchClient, discordClient, logger, message) => {
    if (message.author.bot)
        return;
    const discordCommand = new DiscordCommand_1.DiscordCommand(twitchClient, discordClient, logger, message);
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
        const valueParser = new ValueParser_1.ValueParser();
        const valueParseResult = await valueParser.parse(commandValue, message);
        if (valueParseResult.status !== 200)
            return;
        reply(valueParseResult.content);
    }
};
exports.discordMessage = discordMessage;
