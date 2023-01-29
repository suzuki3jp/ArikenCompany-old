"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const utils_1 = require("@suzuki3jp/utils");
const discord_js_1 = require("discord.js");
// モジュールをインポート
const Base_1 = require("./Base");
const Embed_1 = require("../utils/Embed");
const ValueParser_1 = require("./ValueParser");
class CommandManager extends Base_1.Base {
    valueParser;
    constructor(twitchClient, discordClient, logger) {
        super(twitchClient, discordClient, logger);
        this.valueParser = new ValueParser_1.ValueParser();
    }
    on() {
        const settings = super.DM.getSettings();
        if (settings.twitch.command)
            return manageCommandError.alreadyOn;
        settings.twitch.command = true;
        super.DM.setSettings(settings);
        return 'コマンドを有効にしました';
    }
    off() {
        const settings = super.DM.getSettings();
        if (!settings.twitch.command)
            return manageCommandError.alreadyOff;
        settings.twitch.command = false;
        super.DM.setSettings(settings);
        return 'コマンドを無効にしました';
    }
    currentCommandStatus() {
        return super.DM.getSettings().twitch.command;
    }
    async addCom(commandName, value, message) {
        const commands = super.DM.getCommands();
        const name = commandName.toLowerCase();
        if (commands[name])
            return manageCommandError.existCommandName;
        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200)
            return valueResult.content;
        commands[name] = value;
        super.DM.setCommands(commands);
        this.createPublicList();
        return `${name} を追加しました`;
    }
    async editCom(commandName, value, message) {
        const commands = super.DM.getCommands();
        const name = commandName.toLowerCase();
        if (!commands[name])
            return manageCommandError.notExistCommandName;
        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200)
            return valueResult.content;
        commands[name] = value;
        super.DM.setCommands(commands);
        this.createPublicList();
        return `${name} を ${value} に変更しました`;
    }
    removeCom(commandName) {
        const commands = super.DM.getCommands();
        const name = commandName.toLowerCase();
        if (!commands[name])
            return manageCommandError.notExistCommandName;
        delete commands[name];
        super.DM.setCommands(commands);
        this.createPublicList();
        return `${name} を削除しました`;
    }
    async syncCommandPanel() {
        const settings = super.DM.getSettings();
        const newPage = (0, Embed_1.createCommandPanelEmbeds)()[0];
        const manageCommandChannel = super.discord.channels.cache.get(settings.discord.manageCommandChannelId);
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
        const commands = super.DM.getCommands();
        let publicCommands = {};
        utils_1.ObjectUtils.forEach(commands, (key, value) => {
            if (typeof value !== 'string' || typeof key !== 'string')
                return;
            const parsedData = new ValueParser_1.PubValueParser().parse(value);
            publicCommands[key] = parsedData.content;
        });
        super.DM.setPublicCommands(publicCommands);
        return publicCommands;
    }
}
exports.CommandManager = CommandManager;
const manageCommandError = {
    existCommandName: '存在するコマンド名です',
    notExistCommandName: '存在しないコマンド名です',
    alreadyOn: 'すでにコマンドは有効です',
    alreadyOff: 'すでにコマンドは無効です',
};
