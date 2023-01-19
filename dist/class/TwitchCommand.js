"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchCommand = void 0;
// nodeモジュールをインポート
const twitch_js_1 = require("@suzuki3jp/twitch.js");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
// モジュールをインポート
const Command_1 = require("./Command");
// paths
const managersPath = path_1.default.resolve(__dirname, '../data/Managers.json');
const messageCounterPath = path_1.default.resolve(__dirname, '../data/MessageCounter.json');
const commandsPath = path_1.default.resolve(__dirname, '../data/Commands.json');
class TwitchCommand extends Command_1.CommandManager {
    client;
    discordClient;
    command;
    message;
    constructor(client, discordClient, message, manageCommands) {
        super();
        this.client = client;
        this.discordClient = discordClient;
        this.command = new twitch_js_1.CommandParser(message.content, { manageCommands });
        this.message = message;
    }
    isCommand() {
        return this.command.isCommand();
    }
    isManageCommand() {
        return this.command.isManageCommand();
    }
    isManager() {
        const managersData = JSON.parse((0, fs_1.readFileSync)(managersPath, {
            encoding: 'utf-8',
        }));
        if (this.message.member.isMod)
            return true;
        if (this.message.member.isBroadCaster)
            return true;
        if (managersData.managers.includes(this.message.member.name))
            return true;
        return false;
    }
    isVip() {
        const managersData = JSON.parse((0, fs_1.readFileSync)(managersPath, {
            encoding: 'utf-8',
        }));
        if (this.message.member.isVip)
            return true;
        if (this.message.member.isBroadCaster)
            return true;
        if (this.message.member.isMod)
            return true;
        if (managersData.managers.includes(this.message.member.name))
            return true;
        return false;
    }
    countMessage() {
        const MessageCounter = JSON.parse((0, fs_1.readFileSync)(messageCounterPath, 'utf-8'));
        if (MessageCounter[this.message.member.name]) {
            MessageCounter[this.message.member.name] = MessageCounter[this.message.member.name] + 1;
            const newData = JSON.stringify(MessageCounter, null, '\t');
            (0, fs_1.writeFileSync)(messageCounterPath, newData, 'utf-8');
        }
        else {
            MessageCounter[this.message.member.name] = 1;
            const newData = JSON.stringify(MessageCounter, null, '\t');
            (0, fs_1.writeFileSync)(messageCounterPath, newData, 'utf-8');
        }
    }
    manageCommandName() {
        const commandName = this.command.commandName;
        switch (commandName) {
            case '!oncom':
                return '!oncom';
            case '!offcom':
                return '!offcom';
            case '!addcom':
                return '!addcom';
            case '!editcom':
                return '!editcom';
            case '!removecom':
                return '!rmcom';
            case '!rmcom':
                return '!rmcom';
            case '!cooltime':
                return '!cooltime';
            case '!ct':
                return '!cooltime';
            case '!setcooltime':
                return '!setcooltime';
            case '!setct':
                return '!setcooltime';
            case '!allow':
                return '!allow';
            case '!deny':
                return '!deny';
            default:
                return 'none';
        }
    }
    isOnCom() {
        return super.currentCommandStatus();
    }
    onCom() {
        return super.on();
    }
    offCom() {
        return super.off();
    }
    async addCom() {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        const result = await super.addCom(targetCommand, value, this.message);
        await super.syncCommandPanel(this.discordClient);
        return result;
    }
    async editCom() {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        const result = await super.editCom(targetCommand, value, this.message);
        await super.syncCommandPanel(this.discordClient);
        return result;
    }
    removeCom() {
        const targetCommand = this.command.commandsArg[0];
        const result = super.removeCom(targetCommand);
        super.syncCommandPanel(this.discordClient);
        return result;
    }
    commandValue() {
        const Commands = JSON.parse((0, fs_1.readFileSync)(commandsPath, 'utf-8'));
        const result = Commands[this.command.commandName];
        return result ?? null;
    }
    coolTime() {
        return String(super.currentCoolTime());
    }
    isPassedCooltime() {
        return super.isPassedCoolTime(this);
    }
    saveCooltime() {
        super.save(this);
    }
    changeCoolTime() {
        const newCoolTime = this.command.commandsArg[0];
        return super.changeCoolTime(newCoolTime);
    }
    allow() {
        const allowManager = this.command.commandsArg[0];
        return super.allow(allowManager);
    }
    deny() {
        const denyManager = this.command.commandsArg[0];
        return super.deny(denyManager);
    }
}
exports.TwitchCommand = TwitchCommand;
