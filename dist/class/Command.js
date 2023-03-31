"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const discord_js_1 = require("discord.js");
const crypto_1 = require("crypto");
// モジュールをインポート
const Base_1 = require("./Base");
const Embed_1 = require("../utils/Embed");
const ValueParser_1 = require("./ValueParser");
class CommandManager extends Base_1.Base {
    valueParser;
    constructor(base) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this.valueParser = new ValueParser_1.ValueParser(this);
    }
    getCommandByName(name) {
        const { commands } = this.DM.getCommands();
        const result = commands.filter((command) => command.name === name);
        if (result.length === 0)
            return null;
        return result[0];
    }
    getCommandById(id) {
        const { commands } = this.DM.getCommands();
        const result = commands.filter((command) => command._id === id);
        if (result.length === 0)
            return null;
        return result[0];
    }
    on() {
        const settings = this.DM.getSettings();
        if (settings.twitch.command)
            return manageCommandError.alreadyOn;
        settings.twitch.command = true;
        this.DM.setSettings(settings);
        const result = 'コマンドを有効にしました';
        this.logger.info('Command has been enabled.');
        return result;
    }
    off() {
        const settings = this.DM.getSettings();
        if (!settings.twitch.command)
            return manageCommandError.alreadyOff;
        settings.twitch.command = false;
        this.DM.setSettings(settings);
        const result = 'コマンドを無効にしました';
        this.logger.info('Command has been disabled.');
        return result;
    }
    currentCommandStatus() {
        this.logger.debug('Checking current status of command...');
        return this.DM.getSettings().twitch.command;
    }
    async addCom(commandName, value, message) {
        const commands = this.DM.getCommands();
        const name = commandName.toLowerCase();
        if (this.getCommandByName(name))
            return manageCommandError.existCommandName;
        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200)
            return valueResult.content;
        const newCommand = {
            _id: (0, crypto_1.randomUUID)(),
            name,
            message: value,
            created_at: (0, dayjs_1.default)().toISOString(),
            updated_at: (0, dayjs_1.default)().toISOString(),
            last_used_at: (0, dayjs_1.default)().toISOString(),
            count: 0,
        };
        commands.commands.push(newCommand);
        this.DM.setCommands(commands);
        this.logger.info(`Added command. [${name}](${value})`);
        this.createPublicList();
        await this.syncCommandPanel();
        return `${name} を追加しました`;
    }
    async editCom(commandName, value, message) {
        const commands = this.DM.getCommands();
        const name = commandName.toLowerCase();
        if (!this.getCommandByName(name))
            return manageCommandError.notExistCommandName;
        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200)
            return valueResult.content;
        let newCommands = { commands: [] };
        commands.commands.forEach((command) => {
            if (command.name !== name)
                return newCommands.commands.push(command);
            const newCommand = {
                name,
                _id: command._id,
                message: value,
                updated_at: (0, dayjs_1.default)().toISOString(),
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
    async removeCom(commandName) {
        const commands = this.DM.getCommands();
        const name = commandName.toLowerCase();
        if (!this.getCommandByName(name))
            return manageCommandError.notExistCommandName;
        let newCommands = {
            commands: [],
        };
        commands.commands.forEach((command) => {
            if (command.name !== name)
                return newCommands.commands.push(command);
            return;
        });
        this.DM.setCommands(newCommands);
        this.logger.info(`Removed command. [${name}]`);
        this.createPublicList();
        await this.syncCommandPanel();
        return `${name} を削除しました`;
    }
    updateLastUsedAt(name) {
        const commands = this.DM.getCommands();
        name = name.toLowerCase();
        if (!this.getCommandByName(name))
            return;
        let newCommands = { commands: [] };
        commands.commands.forEach((command) => {
            if (command.name === name) {
                newCommands.commands.push({
                    _id: command._id,
                    name: command.name,
                    message: command.message,
                    created_at: command.created_at,
                    updated_at: command.updated_at,
                    last_used_at: (0, dayjs_1.default)().toISOString(),
                    count: command.count + 1,
                });
            }
            else {
                newCommands.commands.push(command);
            }
        });
        this.DM.setCommands(newCommands);
        this.logger.debug(`Updated last_used_at. [${name}]`);
        return;
    }
    async syncCommandPanel() {
        const settings = this.DM.getSettings();
        const pages = (0, Embed_1.createCommandPanelEmbeds)();
        const manageCommandChannel = this.discord.channels.cache.get(settings.discord.manageCommandChannelId);
        if (manageCommandChannel instanceof discord_js_1.TextChannel) {
            if (!settings.discord.manageCommandPanelId)
                return;
            const panel = await manageCommandChannel.messages.fetch(settings.discord.manageCommandPanelId);
            const components = panel.components;
            const currentPageNum = (0, Embed_1.currentPage)(panel.embeds[0]);
            const currentPageIndex = currentPageNum - 1;
            this.logger.debug(`Synchronized command panel. current page: ${currentPageNum}`);
            panel.edit({ embeds: [pages[currentPageIndex]], components });
        }
        else
            return;
    }
    createPublicList() {
        const { commands } = this.DM.getCommands();
        let publicCommands = {};
        commands.forEach((command) => {
            const parsedData = new ValueParser_1.PubValueParser().parse(command.message);
            publicCommands[command.name] = parsedData.content;
        });
        this.DM.setPublicCommands(publicCommands);
        this.logger.debug('Created public command list.');
        return publicCommands;
    }
}
exports.CommandManager = CommandManager;
const manageCommandError = {
    existCommandName: 'すでに存在するコマンド名です',
    notExistCommandName: '存在しないコマンド名です',
    alreadyOn: 'すでにコマンドは有効です',
    alreadyOff: 'すでにコマンドは無効です',
};
