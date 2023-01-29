// nodeモジュールをインポート
import { TwitchClient as Twitch, CommandParser } from '@suzuki3jp/twitch.js';
import { Logger } from '@suzuki3jp/utils';
import type { Client as Discord, Message } from 'discord.js';

// モジュールをインポート
import { Base } from './Base';
import { CommandManager } from './Command';
import { CoolTimeManager } from './CoolTime';
import { ManagersManager } from './Managers';

export class DiscordCommand extends Base {
    public message: Message;
    public command: CommandParser;
    public _commandManager: CommandManager;
    public _cooltimeManager: CoolTimeManager;
    public _managersManager: ManagersManager;

    constructor(twitchClient: Twitch, discordClient: Discord, logger: Logger, message: Message) {
        super(twitchClient, discordClient, logger);
        this.message = message;
        this.command = new CommandParser(message.content, {
            manageCommands: super.DM.getSettings().twitch.manageCommands,
        });
        this._commandManager = new CommandManager(twitchClient, discordClient, logger);
        this._cooltimeManager = new CoolTimeManager(twitchClient, discordClient, logger);
        this._managersManager = new ManagersManager(twitchClient, discordClient, logger);
    }

    isCommand(): boolean {
        return this.command.isCommand();
    }

    isManageCommands(): boolean {
        return this.command.isManageCommand();
    }

    isManager(): boolean {
        const settings = super.DM.getSettings();
        if (this.message.member?.roles.cache.has(settings.discord.modRoleId)) return true;
        return false;
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

    commandValue(): string | null {
        const Commands = super.DM.getCommands();
        const result = Commands[this.command.commandName];
        return result ?? null;
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
        await this._commandManager.syncCommandPanel();
        return result;
    }

    async editCom(): Promise<string> {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        const result = await this._commandManager.editCom(targetCommand, value, this.message);
        await this._commandManager.syncCommandPanel();
        return result;
    }

    removeCom(): string {
        const targetCommand = this.command.commandsArg[0];
        const result = this._commandManager.removeCom(targetCommand);
        this._commandManager.syncCommandPanel();
        return result;
    }

    coolTime(): string {
        return String(this._cooltimeManager.currentCoolTime());
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
