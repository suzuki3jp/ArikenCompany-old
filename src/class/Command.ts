import type { Message } from '@suzuki3jp/twitch.js';
import { ValueParser } from './ValueParser';
import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

const commandsFilePath = resolve(__dirname, '../data/Commands.json');

export class CommandManager {
    public valueParser: ValueParser;
    constructor() {
        this.valueParser = new ValueParser();
    }

    async addCom(commandName: string, value: string, message: Message): Promise<string> {
        const commands = JSON.parse(readFileSync(commandsFilePath, { encoding: 'utf-8' }));
        const name = commandName.toLowerCase();
        if (commands[name]) return manageCommandError.existCommandName;

        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200) return valueResult.content;

        commands[name] = value;
        const writeData = JSON.stringify(commands, null, '\t');
        writeFileSync(commandsFilePath, writeData, { encoding: 'utf-8' });
        return `${name} を追加しました`;
    }

    async editCom(commandName: string, value: string, message: Message): Promise<string> {
        const commands = JSON.parse(readFileSync(commandsFilePath, { encoding: 'utf-8' }));
        const name = commandName.toLowerCase();
        if (!commands[name]) return manageCommandError.notExistCommandName;

        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200) return valueResult.content;

        commands[name] = value;
        const writeData = JSON.stringify(commands, null, '\t');
        writeFileSync(commandsFilePath, writeData, { encoding: 'utf-8' });
        return `${name} を ${value} に変更しました`;
    }

    removeCom(commandName: string): string {
        const commands = JSON.parse(readFileSync(commandsFilePath, { encoding: 'utf-8' }));
        const name = commandName.toLowerCase();
        if (!commands[name]) return manageCommandError.notExistCommandName;
        delete commands[name];
        const writeData = JSON.stringify(commands, null, '\t');
        writeFileSync(commandsFilePath, writeData, { encoding: 'utf-8' });
        return `${name} を削除しました`;
    }
}

const manageCommandError = {
    existCommandName: '存在するコマンド名です',
    notExistCommandName: '存在しないコマンド名です',
};
