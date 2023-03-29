// nodeモジュールをインポート
import { Message as TwitchMessage } from '@suzuki3jp/twitch.js';
import { ObjectUtils } from '@suzuki3jp/utils';
import dayjs from 'dayjs';
import { Message as DiscordMessage, TextChannel } from 'discord.js';
import uniqueString from 'unique-string';

// モジュールをインポート
import { Base } from './Base';
import { CommandsJson, PublicCommandsJson, TwitchCommand } from './JsonTypes';
import { createCommandPanelEmbeds, currentPage } from '../utils/Embed';
import { DummyMessage, PubValueParser, ValueParser } from './ValueParser';

export class CommandManager extends Base {
    public valueParser: ValueParser;
    constructor(base: Base) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this.valueParser = new ValueParser();
    }

    getCommandByName(name: string): TwitchCommand | null {
        const { commands } = this.DM.getCommands();
        const result = commands.filter((command) => command.name === name);
        if (result.length === 0) return null;
        return result[0];
    }

    getCommandById(id: string): TwitchCommand | null {
        const { commands } = this.DM.getCommands();
        const result = commands.filter((command) => command._id === id);
        if (result.length === 0) return null;
        return result[0];
    }

    on(): string {
        const settings = this.DM.getSettings();
        if (settings.twitch.command) return manageCommandError.alreadyOn;
        settings.twitch.command = true;
        this.DM.setSettings(settings);
        const result = 'コマンドを有効にしました';
        this.logger.emitLog('debug', result);
        return result;
    }

    off(): string {
        const settings = this.DM.getSettings();
        if (!settings.twitch.command) return manageCommandError.alreadyOff;
        settings.twitch.command = false;
        this.DM.setSettings(settings);
        const result = 'コマンドを無効にしました';
        this.logger.emitLog('debug', result);
        return result;
    }

    currentCommandStatus(): boolean {
        this.logger.emitLog('debug', '現在のコマンドのステータスを確認中');
        return this.DM.getSettings().twitch.command;
    }

    async addCom(
        commandName: string,
        value: string,
        message: TwitchMessage | DiscordMessage | DummyMessage
    ): Promise<string> {
        const commands = this.DM.getCommands();
        const name = commandName.toLowerCase();
        if (this.getCommandByName(name)) return manageCommandError.existCommandName;

        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200) return valueResult.content;
        const newCommand: TwitchCommand = {
            _id: uniqueString(),
            name,
            message: value,
            created_at: dayjs().toISOString(),
            updated_at: dayjs().toISOString(),
            last_used_at: dayjs().toISOString(),
        };

        commands.commands.push(newCommand);
        this.DM.setCommands(commands);
        this.emitDebug(`追加したコマンドのデータをファイルに反映 [${name}](${value})`);
        this.createPublicList();
        await this.syncCommandPanel();
        return `${name} を追加しました`;
    }

    async editCom(
        commandName: string,
        value: string,
        message: TwitchMessage | DiscordMessage | DummyMessage
    ): Promise<string> {
        const commands = this.DM.getCommands();
        const name = commandName.toLowerCase();
        if (!this.getCommandByName(name)) return manageCommandError.notExistCommandName;

        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200) return valueResult.content;
        let newCommands: CommandsJson = { commands: [] };
        commands.commands.forEach((command) => {
            if (command.name !== name) return newCommands.commands.push(command);
            const newCommand: TwitchCommand = {
                name,
                _id: command._id,
                message: value,
                updated_at: dayjs().toISOString(),
                created_at: command.created_at,
                last_used_at: command.last_used_at,
            };
            return newCommands.commands.push(newCommand);
        });

        this.DM.setCommands(newCommands);
        this.emitDebug(`編集したコマンドのデータをファイルに反映 [${name}](${value})`);
        this.createPublicList();
        await this.syncCommandPanel();
        return `${name} を ${value} に変更しました`;
    }

    async removeCom(commandName: string): Promise<string> {
        const commands = this.DM.getCommands();
        const name = commandName.toLowerCase();
        if (!this.getCommandByName(name)) return manageCommandError.notExistCommandName;
        let newCommands: CommandsJson = {
            commands: [],
        };
        commands.commands.forEach((command) => {
            if (command.name !== name) return newCommands.commands.push(command);
            return;
        });

        this.DM.setCommands(newCommands);
        this.emitDebug(`削除したコマンドのデータをファイルに反映 [${name}]`);
        this.createPublicList();
        await this.syncCommandPanel();
        return `${name} を削除しました`;
    }

    updateLastUsedAt(name: string) {
        const commands = this.DM.getCommands();
        name = name.toLowerCase();
        if (!this.getCommandByName(name)) return;

        let newCommands: CommandsJson = { commands: [] };
        commands.commands.forEach((command) => {
            if (command.name === name) return newCommands.commands.push(command);
            return newCommands.commands.push({
                _id: command._id,
                name: command.name,
                message: command.message,
                created_at: command.created_at,
                updated_at: command.updated_at,
                last_used_at: dayjs().toISOString(),
            });
        });
        return;
    }

    async syncCommandPanel() {
        const settings = this.DM.getSettings();
        const pages = createCommandPanelEmbeds();
        const manageCommandChannel = this.discord.channels.cache.get(settings.discord.manageCommandChannelId);
        if (manageCommandChannel instanceof TextChannel) {
            if (!settings.discord.manageCommandPanelId) return;
            const panel = await manageCommandChannel.messages.fetch(settings.discord.manageCommandPanelId);
            const components = panel.components;
            const currentPageNum = currentPage(panel.embeds[0]);
            const currentPageIndex = currentPageNum - 1;
            this.emitDebug(`コマンドパネルを同期 現在のページ: ${currentPageNum}`);
            panel.edit({ embeds: [pages[currentPageIndex]], components });
        } else return;
    }

    createPublicList(): PublicCommandsJson {
        const { commands } = this.DM.getCommands();
        let publicCommands: PublicCommandsJson = {};
        commands.forEach((command) => {
            const parsedData = new PubValueParser().parse(command.message);
            publicCommands[command.name] = parsedData.content;
        });

        this.DM.setPublicCommands(publicCommands);
        this.emitDebug('PublicCommandListを作成');
        return publicCommands;
    }
}

const manageCommandError = {
    existCommandName: 'すでに存在するコマンド名です',
    notExistCommandName: '存在しないコマンド名です',
    alreadyOn: 'すでにコマンドは有効です',
    alreadyOff: 'すでにコマンドは無効です',
};
