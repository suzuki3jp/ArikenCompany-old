// nodeモジュールをインポート
import { Message as TwitchMessage } from '@suzuki3jp/twitch.js';
import { ObjectUtils } from '@suzuki3jp/utils';
import { Message as DiscordMessage, MessageButton, TextChannel } from 'discord.js';

// モジュールをインポート
import { Base } from './Base';
import { PublicCommandsJson } from '../data/JsonTypes';
import { createCommandPanelEmbeds } from '../utils/Embed';
import { PubValueParser, ValueParser } from './ValueParser';

export class CommandManager extends Base {
    public valueParser: ValueParser;
    constructor(base: Base) {
        super(base.twitch, base.discord, base.eventSub, base.logger);
        this.valueParser = new ValueParser();
    }

    on(): string {
        const settings = super.DM.getSettings();
        if (settings.twitch.command) return manageCommandError.alreadyOn;
        settings.twitch.command = true;
        super.DM.setSettings(settings);
        return 'コマンドを有効にしました';
    }

    off(): string {
        const settings = super.DM.getSettings();
        if (!settings.twitch.command) return manageCommandError.alreadyOff;
        settings.twitch.command = false;
        super.DM.setSettings(settings);
        return 'コマンドを無効にしました';
    }

    currentCommandStatus(): boolean {
        return super.DM.getSettings().twitch.command;
    }

    async addCom(commandName: string, value: string, message: TwitchMessage | DiscordMessage): Promise<string> {
        const commands = super.DM.getCommands();
        const name = commandName.toLowerCase();
        if (commands[name]) return manageCommandError.existCommandName;

        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200) return valueResult.content;

        commands[name] = value;
        super.DM.setCommands(commands);
        this.createPublicList();
        return `${name} を追加しました`;
    }

    async editCom(commandName: string, value: string, message: TwitchMessage | DiscordMessage): Promise<string> {
        const commands = super.DM.getCommands();
        const name = commandName.toLowerCase();
        if (!commands[name]) return manageCommandError.notExistCommandName;

        const valueResult = await this.valueParser.parse(value, message);
        if (valueResult.status !== 200) return valueResult.content;

        commands[name] = value;
        super.DM.setCommands(commands);
        this.createPublicList();
        return `${name} を ${value} に変更しました`;
    }

    removeCom(commandName: string): string {
        const commands = super.DM.getCommands();
        const name = commandName.toLowerCase();
        if (!commands[name]) return manageCommandError.notExistCommandName;
        delete commands[name];
        super.DM.setCommands(commands);
        this.createPublicList();
        return `${name} を削除しました`;
    }

    async syncCommandPanel() {
        const settings = super.DM.getSettings();
        const newPage = createCommandPanelEmbeds()[0];
        const manageCommandChannel = super.discord.channels.cache.get(settings.discord.manageCommandChannelId);
        if (manageCommandChannel instanceof TextChannel) {
            if (!settings.discord.manageCommandPanelId) return;
            const panel = await manageCommandChannel.messages.fetch(settings.discord.manageCommandPanelId);
            const components = panel.components;
            if (
                components[0].components[0] instanceof MessageButton &&
                components[0].components[1] instanceof MessageButton
            ) {
                components[0].components[0].setDisabled(true);
                components[0].components[1].setDisabled(false);
                panel.edit({ embeds: [newPage], components });
            }
        } else return;
    }

    createPublicList(): PublicCommandsJson {
        const commands = super.DM.getCommands();
        let publicCommands: PublicCommandsJson = {};
        ObjectUtils.forEach(commands, (key, value) => {
            if (typeof value !== 'string' || typeof key !== 'string') return;
            const parsedData = new PubValueParser().parse(value);
            publicCommands[key] = parsedData.content;
        });

        super.DM.setPublicCommands(publicCommands);
        return publicCommands;
    }
}

const manageCommandError = {
    existCommandName: '存在するコマンド名です',
    notExistCommandName: '存在しないコマンド名です',
    alreadyOn: 'すでにコマンドは有効です',
    alreadyOff: 'すでにコマンドは無効です',
};
