// nodeモジュールをインポート
import { CommandParser } from '@suzuki3jp/twitch.js';
import type { TwitchClient, Message } from '@suzuki3jp/twitch.js';
import type { Client } from 'discord.js';

// モジュールをインポート
import { CommandManager } from './Command';
import { DataManager } from './DataManager';

// JSON Data Manager
const DM = new DataManager();

export class TwitchCommand extends CommandManager {
    public client: TwitchClient;
    public discordClient: Client;
    public command: CommandParser;
    public message: Message;

    constructor(client: TwitchClient, discordClient: Client, message: Message, manageCommands: string[]) {
        super();
        this.client = client;
        this.discordClient = discordClient;
        this.command = new CommandParser(message.content, { manageCommands });
        this.message = message;
    }

    isCommand(): boolean {
        return this.command.isCommand();
    }

    isManageCommand(): boolean {
        return this.command.isManageCommand();
    }

    isManager(): boolean {
        const managersData = DM.getManagers();
        if (this.message.member.isMod) return true;
        if (this.message.member.isBroadCaster) return true;
        if (managersData.managers.includes(this.message.member.name)) return true;
        return false;
    }

    isVip(): boolean {
        const managersData = DM.getManagers();
        if (this.message.member.isVip) return true;
        if (this.message.member.isBroadCaster) return true;
        if (this.message.member.isMod) return true;
        if (managersData.managers.includes(this.message.member.name)) return true;
        return false;
    }

    countMessage(): void {
        const MessageCounter = DM.getMessageCounter();
        if (MessageCounter[this.message.member.name]) {
            MessageCounter[this.message.member.name] = MessageCounter[this.message.member.name] + 1;
            DM.setMessageCounter(MessageCounter);
        } else {
            MessageCounter[this.message.member.name] = 1;
            DM.setMessageCounter(MessageCounter);
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
        return super.currentCommandStatus();
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
        await super.syncCommandPanel(this.discordClient);
        return result;
    }

    async editCom(): Promise<string> {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        const result = await super.editCom(targetCommand, value, this.message);
        await super.syncCommandPanel(this.discordClient);
        return result;
    }

    removeCom(): string {
        const targetCommand = this.command.commandsArg[0];
        const result = super.removeCom(targetCommand);
        super.syncCommandPanel(this.discordClient);
        return result;
    }

    commandValue(): string | null {
        const Commands = DM.getCommands();
        const result = Commands[this.command.commandName];
        return result ?? null;
    }

    coolTime(): string {
        return String(super.currentCoolTime());
    }

    isPassedCooltime(): boolean {
        return super.isPassedCoolTime(this);
    }

    saveCooltime(): void {
        super.save(this);
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
