// nodeモジュールをインポート
import { Message as TwitchMessage } from '@suzuki3jp/twitch.js';
import { ObjectUtils } from '@suzuki3jp/utils';
import { Message as DiscordMessage, MessageButton, TextChannel } from 'discord.js';

// モジュールをインポート
import { Base } from './Base';
import { PublicCommandsJson } from './JsonTypes';
import { createCommandPanelEmbeds, currentPage } from '../utils/Embed';
import { DummyMessage, PubValueParser, ValueParser } from './ValueParser';

export class CommandManager extends Base {
    public valueParser: ValueParser;
    constructor(base: Base) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this.valueParser = new ValueParser();
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
        if (commands[name]) return manageCommandError.existCommandName;

        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200) return valueResult.content;

        commands[name] = value;
        this.emitDebug(`変数内のコマンドを追加 [${name}](${value})`);
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
        if (!commands[name]) return manageCommandError.notExistCommandName;

        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200) return valueResult.content;

        commands[name] = value;
        this.emitDebug(`変数内のコマンドを編集 [${name}](${value})`);
        this.DM.setCommands(commands);
        this.emitDebug(`編集したコマンドのデータをファイルに反映 [${name}](${value})`);
        this.createPublicList();
        await this.syncCommandPanel();
        return `${name} を ${value} に変更しました`;
    }

    async removeCom(commandName: string): Promise<string> {
        const commands = this.DM.getCommands();
        const name = commandName.toLowerCase();
        if (!commands[name]) return manageCommandError.notExistCommandName;
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
        const commands = this.DM.getCommands();
        let publicCommands: PublicCommandsJson = {};
        ObjectUtils.forEach(commands, (key, value) => {
            if (typeof value !== 'string' || typeof key !== 'string') return;
            const parsedData = new PubValueParser().parse(value);
            publicCommands[key] = parsedData.content;
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
