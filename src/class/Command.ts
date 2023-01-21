// nodeモジュールをインポート
import { Message as TwitchMessage } from '@suzuki3jp/twitch.js';
import { ObjectUtils } from '@suzuki3jp/utils';
import { Client, Message as DiscordMessage, MessageButton, TextChannel } from 'discord.js';

// モジュールをインポート
import { CommandManagersManager } from './CommandManagers';
import { DataManager } from './DataManager';
import { PublicCommandsJson } from '../data/JsonTypes';
import { createCommandPanelEmbeds } from '../utils/Embed';
import { DiscordValueParser, PubValueParser, ValueParser } from './ValueParser';

// JSON Data Manager
const DM = new DataManager();

export class CommandManager extends CommandManagersManager {
    public valueParser: ValueParser;
    public discordValueParser: DiscordValueParser;
    constructor() {
        super();
        this.valueParser = new ValueParser();
        this.discordValueParser = new DiscordValueParser();
    }

    async addCom(commandName: string, value: string, message: TwitchMessage | DiscordMessage): Promise<string> {
        if (message instanceof DiscordMessage) {
            // discord
            const commands = DM.getCommands();
            const name = commandName.toLowerCase();
            if (commands[name]) return manageCommandError.existCommandName;

            const valueResult = await this.discordValueParser.parse(value, message);
            if (valueResult.status !== 200) return valueResult.content;

            commands[name] = value;
            DM.setCommands(commands);
            this.createPublicList();
            return `${name} を追加しました`;
        } else {
            // twitch
            const commands = DM.getCommands();
            const name = commandName.toLowerCase();
            if (commands[name]) return manageCommandError.existCommandName;

            const valueResult = await this.valueParser.parse(value, message);
            if (valueResult.status !== 200) return valueResult.content;

            commands[name] = value;
            DM.setCommands(commands);
            this.createPublicList();
            return `${name} を追加しました`;
        }
    }

    async editCom(commandName: string, value: string, message: TwitchMessage | DiscordMessage): Promise<string> {
        if (message instanceof DiscordMessage) {
            const commands = DM.getCommands();
            const name = commandName.toLowerCase();
            if (!commands[name]) return manageCommandError.notExistCommandName;

            const valueResult = await this.discordValueParser.parse(value, message);
            if (valueResult.status !== 200) return valueResult.content;

            commands[name] = value;
            DM.setCommands(commands);
            this.createPublicList();
            return `${name} を ${value} に変更しました`;
        } else {
            const commands = DM.getCommands();
            const name = commandName.toLowerCase();
            if (!commands[name]) return manageCommandError.notExistCommandName;

            const valueResult = await this.valueParser.parse(value, message);
            if (valueResult.status !== 200) return valueResult.content;

            commands[name] = value;
            DM.setCommands(commands);
            this.createPublicList();
            return `${name} を ${value} に変更しました`;
        }
    }

    removeCom(commandName: string): string {
        const commands = DM.getCommands();
        const name = commandName.toLowerCase();
        if (!commands[name]) return manageCommandError.notExistCommandName;
        delete commands[name];
        DM.setCommands(commands);
        this.createPublicList();
        return `${name} を削除しました`;
    }

    async syncCommandPanel(client: Client) {
        const settings = DM.getSettings();
        const newPage = createCommandPanelEmbeds()[0];
        const manageCommandChannel = client.channels.cache.get(settings.discord.manageCommandChannelId);
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
        const commands = DM.getCommands();
        let publicCommands: PublicCommandsJson = {};
        ObjectUtils.forEach(commands, (key, value) => {
            if (typeof value !== 'string' || typeof key !== 'string') return;
            const parsedData = new PubValueParser().parse(value);
            publicCommands[key] = parsedData.content;
        });

        DM.setPublicCommands(publicCommands);
        return publicCommands;
    }
}

const manageCommandError = {
    existCommandName: '存在するコマンド名です',
    notExistCommandName: '存在しないコマンド名です',
};
