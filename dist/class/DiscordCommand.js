"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordCommand = void 0;
const twitch_js_1 = require("@suzuki3jp/twitch.js");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
// paths
const settingsPath = path_1.default.resolve(__dirname, '../data/settings.json');
const commandsPath = path_1.default.resolve(__dirname, '../data/Commands.json');
const Command_1 = require("./Command");
class DiscordCommand extends Command_1.CommandManager {
    client;
    message;
    command;
    constructor(client, message, manageCommands) {
        super();
        this.client = client;
        this.message = message;
        this.command = new twitch_js_1.CommandParser(message.content, { manageCommands });
    }
    isCommand() {
        return this.command.isCommand();
    }
    isManageCommands() {
        return this.command.isManageCommand();
    }
    isManager() {
        const settings = JSON.parse((0, fs_1.readFileSync)(settingsPath, 'utf-8'));
        if (this.message.member?.roles.cache.has(settings.discord.modRoleId))
            return true;
        return false;
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
    commandValue() {
        const Commands = JSON.parse((0, fs_1.readFileSync)(commandsPath, 'utf-8'));
        const result = Commands[this.command.commandName];
        return result ?? null;
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
        await super.syncCommandPanel(this.client);
        return result;
    }
    async editCom() {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        const result = await super.editCom(targetCommand, value, this.message);
        await super.syncCommandPanel(this.client);
        return result;
    }
    removeCom() {
        const targetCommand = this.command.commandsArg[0];
        const result = super.removeCom(targetCommand);
        super.syncCommandPanel(this.client);
        return result;
    }
    coolTime() {
        return String(super.currentCoolTime());
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
exports.DiscordCommand = DiscordCommand;
