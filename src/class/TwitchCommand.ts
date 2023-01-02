import { CommandParser } from '@suzuki3jp/twitch.js';
import type { TwitchClient, Message } from '@suzuki3jp/twitch.js';
import { writeFileSync, readFileSync } from 'fs';
import path from 'path';

import { CommandManager } from './Command';
const managersData: { managers: string[] } = JSON.parse(
    readFileSync(path.resolve(__dirname, '../data/Managers.json'), {
        encoding: 'utf-8',
    })
);
const MessageCounter = JSON.parse(
    readFileSync(path.resolve(__dirname, '../data/MessageCounter.json'), { encoding: 'utf-8' })
);

export class TwitchCommand extends CommandManager {
    public client: TwitchClient;
    public command: CommandParser;
    public message: Message;

    constructor(client: TwitchClient, message: Message, manageCommands: string[]) {
        super();
        this.client = client;
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
        if (this.message.member.isMod) return true;
        if (this.message.member.isBroadCaster) return true;
        if (managersData.managers.includes(this.message.member.name)) return true;
        return false;
    }

    isVip(): boolean {
        if (this.message.member.isVip) return true;
        if (this.message.member.isBroadCaster) return true;
        if (this.message.member.isMod) return true;
        return false;
    }

    countMessage(): void {
        if (MessageCounter[this.message.member.name]) {
            MessageCounter[this.message.member.name] = MessageCounter[this.message.member.name] + 1;
            const newData = JSON.stringify(MessageCounter, null, '\t');
            writeFileSync(path.resolve(__dirname, '../data/MessageCounter.json'), newData, { encoding: 'utf-8' });
        } else {
            MessageCounter[this.message.member.name] = 1;
            const newData = JSON.stringify(MessageCounter, null, '\t');
            writeFileSync(path.resolve(__dirname, '../data/MessageCounter.json'), newData, { encoding: 'utf-8' });
        }
    }

    manageCommandName():
        | '!addcom'
        | '!editcom'
        | '!rmcom'
        | '!cooltime'
        | '!setcooltime'
        | '!allow'
        | '!deny'
        | 'none' {
        const commandName = this.command.commandName.toLowerCase();

        switch (commandName) {
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

    async addCom(): Promise<string> {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        return await super.addCom(targetCommand, value, this.message);
    }

    async editCom(): Promise<string> {
        const targetCommand = this.command.commandsArg[0];
        const value = this.command.commandsArg.slice(1).join(' ');
        return await super.editCom(targetCommand, value, this.message);
    }

    removeCom(): string {
        const targetCommand = this.command.commandsArg[0];
        return super.removeCom(targetCommand);
    }
}
