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
    constructor(base) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this.valueParser = new ValueParser_1.ValueParser();
    }
    on() {
        const settings = this.DM.getSettings();
        if (settings.twitch.command)
            return manageCommandError.alreadyOn;
        settings.twitch.command = true;
        this.DM.setSettings(settings);
        const result = 'コマンドを有効にしました';
        this.logger.emitLog('debug', result);
        return result;
    }
    off() {
        const settings = this.DM.getSettings();
        if (!settings.twitch.command)
            return manageCommandError.alreadyOff;
        settings.twitch.command = false;
        this.DM.setSettings(settings);
        const result = 'コマンドを無効にしました';
        this.logger.emitLog('debug', result);
        return result;
    }
    currentCommandStatus() {
        this.logger.emitLog('debug', '現在のコマンドのステータスを確認中');
        return this.DM.getSettings().twitch.command;
    }
    async addCom(commandName, value, message) {
        const commands = this.DM.getCommands();
        const name = commandName.toLowerCase();
        if (commands[name])
            return manageCommandError.existCommandName;
        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200)
            return valueResult.content;
        commands[name] = value;
        this.emitDebug(`変数内のコマンドを追加 [${name}](${value})`);
        this.DM.setCommands(commands);
        this.emitDebug(`追加したコマンドのデータをファイルに反映 [${name}](${value})`);
        this.createPublicList();
        await this.syncCommandPanel();
        return `${name} を追加しました`;
    }
    async editCom(commandName, value, message) {
        const commands = this.DM.getCommands();
        const name = commandName.toLowerCase();
        if (!commands[name])
            return manageCommandError.notExistCommandName;
        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200)
            return valueResult.content;
        commands[name] = value;
        this.emitDebug(`変数内のコマンドを編集 [${name}](${value})`);
        this.DM.setCommands(commands);
        this.emitDebug(`編集したコマンドのデータをファイルに反映 [${name}](${value})`);
        this.createPublicList();
        await this.syncCommandPanel();
        return `${name} を ${value} に変更しました`;
    }
    async removeCom(commandName) {
        const commands = this.DM.getCommands();
        const name = commandName.toLowerCase();
        if (!commands[name])
            return manageCommandError.notExistCommandName;
        delete commands[name];
        this.emitDebug(`変数内のコマンドを削除 [${name}]`);
        this.DM.setCommands(commands);
        this.emitDebug(`削除したコマンドのデータをファイルに反映 [${name}]`);
        this.createPublicList();
        await this.syncCommandPanel();
        return `${name} を削除しました`;
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
            this.emitDebug(`コマンドパネルを同期 現在のページ: ${currentPageNum}`);
            panel.edit({ embeds: [pages[currentPageIndex]], components });
        }
        else
            return;
    }
    createPublicList() {
        const commands = this.DM.getCommands();
        let publicCommands = {};
        utils_1.ObjectUtils.forEach(commands, (key, value) => {
            if (typeof value !== 'string' || typeof key !== 'string')
                return;
            const parsedData = new ValueParser_1.PubValueParser().parse(value);
            publicCommands[key] = parsedData.content;
        });
        this.DM.setPublicCommands(publicCommands);
        this.emitDebug('PublicCommandListを作成');
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
