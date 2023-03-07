// nodeモジュールをインポート
import { CommandParser } from '@suzuki3jp/twitch.js';
import type { Message as TwitchMessage } from '@suzuki3jp/twitch.js';

// モジュールをインポート
import { Base } from './Base';
import { CommandManager } from './Command';
import { CoolTimeManager } from './CoolTime';
import { ManagersManager } from './Managers';

export class TwitchCommand extends Base {
    public command: CommandParser;
    public message: TwitchMessage;
    public _commandManager: CommandManager;
    public _managersManager: ManagersManager;
    public _cooltimeManager: CoolTimeManager;

    constructor(base: Base, message: TwitchMessage) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this.command = new CommandParser(message.content, {
            manageCommands: this.DM.getSettings().twitch.manageCommands,
        });
        this.message = message;
        this._commandManager = new CommandManager(this.getMe());
        this._managersManager = new ManagersManager(this.getMe());
        this._cooltimeManager = new CoolTimeManager(this.getMe());
    }

    isCommand(): boolean {
        return this.command.isCommand();
    }

    isManageCommand(): boolean {
        return this.command.isManageCommand();
    }

    isManager(): boolean {
        const managersData = this.DM.getManagers();
        if (this.message.member.isMod) return true;
        if (this.message.member.isBroadCaster) return true;
        if (managersData.managers.includes(this.message.member.name)) return true;
        return false;
    }

    isVip(): boolean {
        const managersData = this.DM.getManagers();
        if (this.message.member.isVip) return true;
        if (this.message.member.isBroadCaster) return true;
        if (this.message.member.isMod) return true;
        if (managersData.managers.includes(this.message.member.name)) return true;
        return false;
    }

    countMessage(): void {
        const MessageCounter = this.DM.getMessageCounter();
        if (MessageCounter[this.message.member.name]) {
            MessageCounter[this.message.member.name] = MessageCounter[this.message.member.name] + 1;
            this.DM.setMessageCounter(MessageCounter);
        } else {
            MessageCounter[this.message.member.name] = 1;
            this.DM.setMessageCounter(MessageCounter);
        }
    }

    manageCommandName():
        | '!oncom'
        | '!offcom'
        | '!addcom'
        | '!editcom'
        | '!rmcom'
        | '!cooltime'
        | '!setcooltime'
        | '!allow'
        | '!deny'
        | 'none' {
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

    isOnCom(): boolean {
        return this._commandManager.currentCommandStatus();
    }

    onCom(): string {
        return this._commandManager.on();
    }

    offCom(): string {
        return this._commandManager.off();
    }

    async addCom(): Promise<string> {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        const result = await this._commandManager.addCom(targetCommand, value, this.message);
        return result;
    }

    async editCom(): Promise<string> {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        const result = await this._commandManager.editCom(targetCommand, value, this.message);
        return result;
    }

    async removeCom(): Promise<string> {
        const targetCommand = this.command.commandsArg[0];
        const result = await this._commandManager.removeCom(targetCommand);
        return result;
    }

    commandValue(): string | null {
        const Commands = this.DM.getCommands();
        const result = Commands[this.command.commandName];
        return result ?? null;
    }

    coolTime(): string {
        return this._cooltimeManager.currentCoolTime().toString();
    }

    isPassedCooltime(): boolean {
        return this._cooltimeManager.isPassedCoolTime(this);
    }

    saveCooltime(): void {
        this._cooltimeManager.save(this);
    }

    changeCoolTime(): string {
        const newCoolTime = this.command.commandsArg[0];
        return this._cooltimeManager.changeCoolTime(newCoolTime);
    }

    allow(): string {
        const allowManager = this.command.commandsArg[0];
        return this._managersManager.allow(allowManager);
    }

    deny(): string {
        const denyManager = this.command.commandsArg[0];
        return this._managersManager.deny(denyManager);
    }
}
