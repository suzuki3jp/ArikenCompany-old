// nodeモジュールをインポート
import { CommandParser } from '@suzuki3jp/twitch.js';
import type { Client, Message } from 'discord.js';

// モジュールをインポート
import { CommandManager } from './Command';
import { DataManager } from './DataManager';

// JSON Data Manager
const DM = new DataManager();

export class DiscordCommand extends CommandManager {
    public client: Client;
    public message: Message;
    public command: CommandParser;

    constructor(client: Client, message: Message, manageCommands: string[]) {
        super();
        this.client = client;
        this.message = message;
        this.command = new CommandParser(message.content, { manageCommands });
    }

    isCommand(): boolean {
        return this.command.isCommand();
    }

    isManageCommands(): boolean {
        return this.command.isManageCommand();
    }

    isManager(): boolean {
        const settings = DM.getSettings();
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
        return super.currentCommandStatus();
    }

    commandValue(): string | null {
        const Commands = DM.getCommands();
        const result = Commands[this.command.commandName];
        return result ?? null;
    }

    onCom(): string {
        return super.on();
    }

    offCom(): string {
        return super.off();
    }

    async addCom(): Promise<string> {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        const result = await super.addCom(targetCommand, value, this.message);
        await super.syncCommandPanel(this.client);
        return result;
    }

    async editCom(): Promise<string> {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        const result = await super.editCom(targetCommand, value, this.message);
        await super.syncCommandPanel(this.client);
        return result;
    }

    removeCom(): string {
        const targetCommand = this.command.commandsArg[0];
        const result = super.removeCom(targetCommand);
        super.syncCommandPanel(this.client);
        return result;
    }

    coolTime(): string {
        return String(super.currentCoolTime());
    }

    changeCoolTime(): string {
        const newCoolTime = this.command.commandsArg[0];
        return super.changeCoolTime(newCoolTime);
    }

    allow(): string {
        const allowManager = this.command.commandsArg[0];
        return super.allow(allowManager);
    }

    deny(): string {
        const denyManager = this.command.commandsArg[0];
        return super.deny(denyManager);
    }
}
