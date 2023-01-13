"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitchMessage = void 0;
const ValueParser_1 = require("../../class/ValueParser");
const twitchMessage = async (twitchCommand, message) => {
    const reply = (content) => {
        message.reply(content);
    };
    twitchCommand.countMessage();
    if (!twitchCommand.isCommand())
        return;
    if (twitchCommand.isManageCommand()) {
        if (!twitchCommand.isManager())
            return;
        const manageCommandName = twitchCommand.manageCommandName();
        if (manageCommandName === '!oncom') {
            reply(twitchCommand.onCom());
        }
        else if (manageCommandName === '!offcom') {
            reply(twitchCommand.offCom());
        }
        else if (manageCommandName === '!addcom') {
            reply(await twitchCommand.addCom());
        }
        else if (manageCommandName === '!editcom') {
            reply(await twitchCommand.editCom());
        }
        else if (manageCommandName === '!rmcom') {
            reply(twitchCommand.removeCom());
        }
        else if (manageCommandName === '!allow') {
            reply(twitchCommand.allow());
        }
        else if (manageCommandName === '!deny') {
            reply(twitchCommand.deny());
        }
        else if (manageCommandName === '!cooltime') {
            reply(twitchCommand.coolTime());
        }
        else if (manageCommandName === '!setcooltime') {
            reply(twitchCommand.changeCoolTime());
        }
    }
    else {
        if (!twitchCommand.isOnCom())
            return;
        if (!twitchCommand.isPassedCooltime())
            return;
        twitchCommand.saveCooltime();
        const commandValue = twitchCommand.commandValue();
        if (!commandValue)
            return;
        const valueParser = new ValueParser_1.ValueParser();
        const valueParseResult = await valueParser.parse(commandValue, message);
        if (valueParseResult.status !== 200)
            return;
        message.channel.send(valueParseResult.content);
    }
};
exports.twitchMessage = twitchMessage;
