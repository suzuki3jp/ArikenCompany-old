// nodeモジュールをインポート
import { Message as TwitchMessage } from '@suzuki3jp/twitch.js';
import dayjs from 'dayjs';
import { Message as DiscordMessage, TextChannel } from 'discord.js';
import { randomUUID } from 'crypto';

// モジュールをインポート
import { Base } from './Base';
import { CommandsJson, PublicCommandsJson, TwitchCommand } from './JsonTypes';
import { createCommandPanelEmbeds, currentPage } from '../utils/Embed';
import { DummyMessage, PubValueParser, ValueParser } from './ValueParser';

export class CommandManager extends Base {
    public valueParser: ValueParser;
    constructor(base: Base) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this.valueParser = new ValueParser(this);
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
        this.logger.info('Command has been enabled.');
        return result;
    }

    off(): string {
        const settings = this.DM.getSettings();
        if (!settings.twitch.command) return manageCommandError.alreadyOff;
        settings.twitch.command = false;
        this.DM.setSettings(settings);
        const result = 'コマンドを無効にしました';
        this.logger.info('Command has been disabled.');
        return result;
    }

    currentCommandStatus(): boolean {
        this.logger.debug('Checking current status of command...');
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
            _id: randomUUID(),
            name,
            message: value,
            created_at: dayjs().toISOString(),
            updated_at: dayjs().toISOString(),
            last_used_at: dayjs().toISOString(),
            count: 0,
        };

        commands.commands.push(newCommand);
        this.DM.setCommands(commands);
        this.logger.info(`Added command. [${name}](${value})`);
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
                count: command.count,
            };
            return newCommands.commands.push(newCommand);
        });

        this.DM.setCommands(newCommands);
        this.logger.info(`Edited command. [${name}](${value})`);
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
        this.logger.info(`Removed command. [${name}]`);
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
            if (command.name === name) {
                newCommands.commands.push({
                    _id: command._id,
                    name: command.name,
                    message: command.message,
                    created_at: command.created_at,
                    updated_at: command.updated_at,
                    last_used_at: dayjs().toISOString(),
                    count: command.count + 1,
                });
            } else {
                newCommands.commands.push(command);
            }
        });
        this.DM.setCommands(newCommands);
        this.logger.debug(`Updated last_used_at. [${name}]`);
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
            this.logger.debug(`Synchronized command panel. current page: ${currentPageNum}`);
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
        this.logger.debug('Created public command list.');
        return publicCommands;
    }
}

const manageCommandError = {
    existCommandName: 'すでに存在するコマンド名です',
    notExistCommandName: '存在しないコマンド名です',
    alreadyOn: 'すでにコマンドは有効です',
    alreadyOff: 'すでにコマンドは無効です',
};
