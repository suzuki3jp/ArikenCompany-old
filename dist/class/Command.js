"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const utils_1 = require("@suzuki3jp/utils");
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
// モジュールをインポート
const CommandManagers_1 = require("./CommandManagers");
const Embed_1 = require("../utils/Embed");
const ValueParser_1 = require("./ValueParser");
const settingsPath = (0, path_1.resolve)(__dirname, '../data/settings.json');
const commandsFilePath = (0, path_1.resolve)(__dirname, '../data/Commands.json');
const publicCommandsPath = (0, path_1.resolve)(__dirname, '../data/PublicCommands.json');
class CommandManager extends CommandManagers_1.CommandManagersManager {
    valueParser;
    discordValueParser;
    constructor() {
        super();
        this.valueParser = new ValueParser_1.ValueParser();
        this.discordValueParser = new ValueParser_1.DiscordValueParser();
    }
    async addCom(commandName, value, message) {
        if (message instanceof discord_js_1.Message) {
            // discord
            const commands = JSON.parse((0, fs_1.readFileSync)(commandsFilePath, 'utf-8'));
            const name = commandName.toLowerCase();
            if (commands[name])
                return manageCommandError.existCommandName;
            const valueResult = await this.discordValueParser.parse(value, message);
            if (valueResult.status !== 200)
                return valueResult.content;
            commands[name] = value;
            const writeData = JSON.stringify(commands, null, '\t');
            (0, fs_1.writeFileSync)(commandsFilePath, writeData, 'utf-8');
            this.createPublicList();
            return `${name} を追加しました`;
        }
        else {
            // twitch
            const commands = JSON.parse((0, fs_1.readFileSync)(commandsFilePath, 'utf-8'));
            const name = commandName.toLowerCase();
            if (commands[name])
                return manageCommandError.existCommandName;
            const valueResult = await this.valueParser.parse(value, message);
            if (valueResult.status !== 200)
                return valueResult.content;
            commands[name] = value;
            const writeData = JSON.stringify(commands, null, '\t');
            (0, fs_1.writeFileSync)(commandsFilePath, writeData, 'utf-8');
            this.createPublicList();
            return `${name} を追加しました`;
        }
    }
    async editCom(commandName, value, message) {
        if (message instanceof discord_js_1.Message) {
            const commands = JSON.parse((0, fs_1.readFileSync)(commandsFilePath, 'utf-8'));
            const name = commandName.toLowerCase();
            if (!commands[name])
                return manageCommandError.notExistCommandName;
            const valueResult = await this.discordValueParser.parse(value, message);
            if (valueResult.status !== 200)
                return valueResult.content;
            commands[name] = value;
            const writeData = JSON.stringify(commands, null, '\t');
            (0, fs_1.writeFileSync)(commandsFilePath, writeData, 'utf-8');
            this.createPublicList();
            return `${name} を ${value} に変更しました`;
        }
        else {
            const commands = JSON.parse((0, fs_1.readFileSync)(commandsFilePath, 'utf-8'));
            const name = commandName.toLowerCase();
            if (!commands[name])
                return manageCommandError.notExistCommandName;
            const valueResult = await this.valueParser.parse(value, message);
            if (valueResult.status !== 200)
                return valueResult.content;
            commands[name] = value;
            const writeData = JSON.stringify(commands, null, '\t');
            (0, fs_1.writeFileSync)(commandsFilePath, writeData, 'utf-8');
            this.createPublicList();
            return `${name} を ${value} に変更しました`;
        }
    }
    removeCom(commandName) {
        const commands = JSON.parse((0, fs_1.readFileSync)(commandsFilePath, 'utf-8'));
        const name = commandName.toLowerCase();
        if (!commands[name])
            return manageCommandError.notExistCommandName;
        delete commands[name];
        const writeData = JSON.stringify(commands, null, '\t');
        (0, fs_1.writeFileSync)(commandsFilePath, writeData, 'utf-8');
        this.createPublicList();
        return `${name} を削除しました`;
    }
    async syncCommandPanel(client) {
        const settings = JSON.parse((0, fs_1.readFileSync)(settingsPath, 'utf-8'));
        const newPage = (0, Embed_1.createCommandPanelEmbeds)()[0];
        const manageCommandChannel = client.channels.cache.get(settings.discord.manageCommandChannelId);
        if (manageCommandChannel instanceof discord_js_1.TextChannel) {
            if (!settings.discord.manageCommandPanelId)
                return;
            const panel = await manageCommandChannel.messages.fetch(settings.discord.manageCommandPanelId);
            const components = panel.components;
            if (components[0].components[0] instanceof discord_js_1.MessageButton &&
                components[0].components[1] instanceof discord_js_1.MessageButton) {
                components[0].components[0].setDisabled(true);
                components[0].components[1].setDisabled(false);
                panel.edit({ embeds: [newPage], components });
            }
        }
        else
            return;
    }
    createPublicList() {
        const commands = JSON.parse((0, fs_1.readFileSync)(commandsFilePath, 'utf-8'));
        let publicCommands = {};
        utils_1.ObjectUtils.forEach(commands, (key, value) => {
            if (typeof value !== 'string' || typeof key !== 'string')
                return;
            const parsedData = new ValueParser_1.PubValueParser().parse(value);
            publicCommands[key] = parsedData.content;
        });
        const writeData = JSON.stringify(publicCommands, null, '\t');
        (0, fs_1.writeFileSync)(publicCommandsPath, writeData, 'utf-8');
        return publicCommands;
    }
}
exports.CommandManager = CommandManager;
const manageCommandError = {
    existCommandName: '存在するコマンド名です',
    notExistCommandName: '存在しないコマンド名です',
};
