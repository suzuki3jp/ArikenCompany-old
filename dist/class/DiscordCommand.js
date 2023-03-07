"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordCommand = void 0;
// nodeモジュールをインポート
const twitch_js_1 = require("@suzuki3jp/twitch.js");
// モジュールをインポート
const Base_1 = require("./Base");
const Command_1 = require("./Command");
const CoolTime_1 = require("./CoolTime");
const Managers_1 = require("./Managers");
class DiscordCommand extends Base_1.Base {
    message;
    command;
    _commandManager;
    _cooltimeManager;
    _managersManager;
    constructor(base, message) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this.message = message;
        this.command = new twitch_js_1.CommandParser(message.content, {
            manageCommands: this.DM.getSettings().twitch.manageCommands,
        });
        this._commandManager = new Command_1.CommandManager(this.getMe());
        this._cooltimeManager = new CoolTime_1.CoolTimeManager(this.getMe());
        this._managersManager = new Managers_1.ManagersManager(this.getMe());
    }
    isCommand() {
        return this.command.isCommand();
    }
    isManageCommands() {
        return this.command.isManageCommand();
    }
    isManager() {
        const settings = this.DM.getSettings();
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
        return this._commandManager.currentCommandStatus();
    }
    commandValue() {
        const Commands = this.DM.getCommands();
        const result = Commands[this.command.commandName];
        return result ?? null;
    }
    onCom() {
        return this._commandManager.on();
    }
    offCom() {
        return this._commandManager.off();
    }
    async addCom() {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        const result = await this._commandManager.addCom(targetCommand, value, this.message);
        return result;
    }
    async editCom() {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        const result = await this._commandManager.editCom(targetCommand, value, this.message);
        return result;
    }
    async removeCom() {
        const targetCommand = this.command.commandsArg[0];
        const result = await this._commandManager.removeCom(targetCommand);
        return result;
    }
    coolTime() {
        return String(this._cooltimeManager.currentCoolTime());
    }
    changeCoolTime() {
        const newCoolTime = this.command.commandsArg[0];
        return this._cooltimeManager.changeCoolTime(newCoolTime);
    }
    allow() {
        const allowManager = this.command.commandsArg[0];
        return this._managersManager.allow(allowManager);
    }
    deny() {
        const denyManager = this.command.commandsArg[0];
        return this._managersManager.deny(denyManager);
    }
}
exports.DiscordCommand = DiscordCommand;
