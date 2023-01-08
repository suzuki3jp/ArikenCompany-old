import type { Client, Message } from 'discord.js';
import { CommandParser } from '@suzuki3jp/twitch.js';
import { writeFileSync, readFileSync } from 'fs';
import path from 'path';

// paths
const settingsPath = path.resolve(__dirname, '../data/settings.json');
const commandsPath = path.resolve(__dirname, '../data/Commands.json');

import { CommandManager } from './Command';

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
        const settings: { discord: { modRoleId: string } } = JSON.parse(readFileSync(settingsPath, 'utf-8'));
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
        const Commands: Record<string, string> = JSON.parse(readFileSync(commandsPath, 'utf-8'));
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
