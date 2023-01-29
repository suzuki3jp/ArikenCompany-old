"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchCommand = void 0;
// nodeモジュールをインポート
const twitch_js_1 = require("@suzuki3jp/twitch.js");
// モジュールをインポート
const Base_1 = require("./Base");
const Command_1 = require("./Command");
const CoolTime_1 = require("./CoolTime");
const Managers_1 = require("./Managers");
class TwitchCommand extends Base_1.Base {
    command;
    message;
    _commandManager;
    _managersManager;
    _cooltimeManager;
    constructor(twitchClient, discordClient, message, logger) {
        super(twitchClient, discordClient, logger);
        this.command = new twitch_js_1.CommandParser(message.content, {
            manageCommands: super.DM.getSettings().twitch.manageCommands,
        });
        this.message = message;
        this._commandManager = new Command_1.CommandManager(twitchClient, discordClient, logger);
        this._managersManager = new Managers_1.ManagersManager(twitchClient, discordClient, logger);
        this._cooltimeManager = new CoolTime_1.CoolTimeManager(twitchClient, discordClient, logger);
    }
    isCommand() {
        return this.command.isCommand();
    }
    isManageCommand() {
        return this.command.isManageCommand();
    }
    isManager() {
        const managersData = super.DM.getManagers();
        if (this.message.member.isMod)
            return true;
        if (this.message.member.isBroadCaster)
            return true;
        if (managersData.managers.includes(this.message.member.name))
            return true;
        return false;
    }
    isVip() {
        const managersData = super.DM.getManagers();
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
        const MessageCounter = super.DM.getMessageCounter();
        if (MessageCounter[this.message.member.name]) {
            MessageCounter[this.message.member.name] = MessageCounter[this.message.member.name] + 1;
            super.DM.setMessageCounter(MessageCounter);
        }
        else {
            MessageCounter[this.message.member.name] = 1;
            super.DM.setMessageCounter(MessageCounter);
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
        return this._commandManager.currentCommandStatus();
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
        await this._commandManager.syncCommandPanel();
        return result;
    }
    async editCom() {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        const result = await this._commandManager.editCom(targetCommand, value, this.message);
        await this._commandManager.syncCommandPanel();
        return result;
    }
    removeCom() {
        const targetCommand = this.command.commandsArg[0];
        const result = this._commandManager.removeCom(targetCommand);
        this._commandManager.syncCommandPanel();
        return result;
    }
    commandValue() {
        const Commands = super.DM.getCommands();
        const result = Commands[this.command.commandName];
        return result ?? null;
    }
    coolTime() {
        return this._cooltimeManager.currentCoolTime().toString();
    }
    isPassedCooltime() {
        return this._cooltimeManager.isPassedCoolTime(this);
    }
    saveCooltime() {
        this._cooltimeManager.save(this);
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
exports.TwitchCommand = TwitchCommand;
