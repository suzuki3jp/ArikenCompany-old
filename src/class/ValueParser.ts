// nodeモジュールをインポート
import { ArrayUtils, JST, RequestClient, StringUtils } from '@suzuki3jp/utils';
import { Message as TwitchMessage } from '@suzuki3jp/twitch.js';
import { Message as DiscordMessage, TextChannel } from 'discord.js';
import { Agent } from 'https';

// モジュールをインポート
import { DataManager } from './DataManager';

// JSON Data Manager
const DM = new DataManager();

class ValueVariables {
    _req: RequestClient;

    constructor() {
        this._req = new RequestClient();
    }

    getTime(): string {
        return JST.getDateString();
    }

    getChannel(message: TwitchMessage | DiscordMessage | DummyMessage): string {
        if (message instanceof TwitchMessage) {
            return message.channel.name;
        } else if (message.channel instanceof TextChannel) {
            return message.channel.name;
        } else if (message instanceof DummyMessage) {
            return message.channel.name;
        } else return ParseErrorMessages.invalidDiscordChannel;
    }

    getUser(message: TwitchMessage | DiscordMessage | DummyMessage): string {
        if (message instanceof TwitchMessage) {
            return message.member.name;
        } else if (message instanceof DummyMessage) {
            return message.user.name;
        } else {
            return message.author.tag;
        }
    }

    async fetch(url: string): Promise<string> {
        const result = await this._req.get({ url, config: { httpsAgent: new Agent({ rejectUnauthorized: false }) } });
        return result.data.toString();
    }

    random(choices: Array<string>): string {
        return ArrayUtils.random(choices);
    }

    getCommandByAlias(commandName: string): string {
        const { commands } = DM.getCommands();
        const result = commands.filter((command) => command.name === commandName);
        if (result.length === 0) return ParseErrorMessages.commandNotFound;
        return result[0].message;
    }

    isMod(message: TwitchMessage | DiscordMessage | DummyMessage): boolean {
        if (message instanceof TwitchMessage) {
            return message.member.isMod;
        } else if (message instanceof DiscordMessage) {
            const settings = DM.getSettings();
            return message.member?.roles.cache.has(settings.discord.modRoleId) ?? false;
        } else return message.user.isMod;
    }
}

export class ValueParser extends ValueVariables {
    public variablesLength: { fetch: number; random: number };
    constructor() {
        super();
        this.variablesLength = {
            fetch: 6,
            random: 7,
        };
    }

    async parse(
        value: string,
        message: TwitchMessage | DiscordMessage | DummyMessage,
        aliased?: boolean
    ): Promise<ValueParseResult> {
        const startBracketLength = StringUtils.countBy(value, '{');
        const endBracketLength = StringUtils.countBy(value, '}');

        if (startBracketLength === endBracketLength) {
            // 構文的に有効な場合
            const length = value.length;
            let index = 0;
            const result: ValueParseResult = {
                status: 200,
                content: '',
            };

            while (index < length) {
                if (value[index] === '$') {
                    const startIndex = index + 2;
                    const endIndex = value.indexOf('}', startIndex);
                    index = index + endIndex;
                    const codeRaw = value.slice(startIndex, endIndex);
                    const parsedCode = await this._parseCode(codeRaw, message, aliased);
                    if (parsedCode.status === 200) {
                        result.status = parsedCode.status;
                        result.content = result.content + parsedCode.content;
                    } else {
                        result.status = parsedCode.status;
                        result.content = parsedCode.content;
                    }
                    index = endIndex + 1;
                } else {
                    result.content = result.content + value[index];
                    index = index + 1;
                }
            }

            return result;
        } else {
            // 構文的に無効な場合
            const result: ValueParseResult = {
                status: 400,
                content: ParseErrorMessages.invalidBrackets,
            };
            return result;
        }
    }

    async _parseCode(
        codeRaw: string,
        message: TwitchMessage | DiscordMessage | DummyMessage,
        aliased?: boolean
    ): Promise<ParseCodeResult> {
        const result = await this._parseVariables(codeRaw.trim(), message, aliased);
        if (result.status === 200) return result;
        if (result.status === 403) return result;
        if (result.status === 400) return result;
        return { status: result.status, content: ParseErrorMessages.variablesNotFound };
    }

    async _parseFetch(codeRaw: string): Promise<string> {
        const url = codeRaw.slice(this.variablesLength.fetch);
        return await super.fetch(url);
    }

    _parseRandom(codeRaw: string): string {
        const choices = codeRaw.slice(this.variablesLength.random).split(' ');
        return super.random(choices);
    }

    async _parseAlias(
        codeRaw: string,
        message: TwitchMessage | DiscordMessage | DummyMessage
    ): Promise<ValueParseResult> {
        const targetCommand = codeRaw.slice(6).toLowerCase();
        return await this.parse(super.getCommandByAlias(targetCommand), message, true);
    }

    async _parseMod(codeRaw: string, message: TwitchMessage | DiscordMessage | DummyMessage): Promise<ParseModResult> {
        const newCodeRaw = codeRaw.slice(4);
        if (super.isMod(message)) {
            const result = await this._parseVariables(newCodeRaw, message);
            if (result.status === 200) return result;
            return { status: 200, content: result.content };
        } else return { status: 403, content: ParseErrorMessages.isOnlyMods };
    }

    async _parseVariables(
        codeRaw: string,
        message: TwitchMessage | DiscordMessage | DummyMessage,
        aliased?: boolean
    ): Promise<{ status: 200 | 400 | 403 | 404; content: string }> {
        if (codeRaw.startsWith('fetch ')) {
            return {
                status: 200,
                content: await this._parseFetch(codeRaw),
            };
        } else if (codeRaw.startsWith('random ')) {
            return {
                status: 200,
                content: this._parseRandom(codeRaw),
            };
        } else if (codeRaw.startsWith('alias ')) {
            if (aliased) {
                return {
                    status: 400,
                    content:
                        'alias先のコマンドの内容でalias関数を使用することはできません。これは無限ループを防ぐためです。',
                };
            } else {
                return {
                    status: (await this._parseAlias(codeRaw, message)).status,
                    content: (await this._parseAlias(codeRaw, message)).content,
                };
            }
        } else if (codeRaw.startsWith('channel')) {
            return {
                status: 200,
                content: super.getChannel(message),
            };
        } else if (codeRaw.startsWith('user')) {
            return {
                status: 200,
                content: super.getUser(message),
            };
        } else if (codeRaw.startsWith('time')) {
            return {
                status: 200,
                content: super.getTime(),
            };
        } else if (codeRaw.startsWith('mod ')) {
            return {
                status: (await this._parseMod(codeRaw, message)).status,
                content: (await this._parseMod(codeRaw, message)).content,
            };
        } else {
            return {
                status: 404,
                content: codeRaw,
            };
        }
    }
}

export class PubValueParser {
    parse(value: string): ValueParseResult {
        const startBracketLength = StringUtils.countBy(value, '{');
        const endBracketLength = StringUtils.countBy(value, '}');

        if (startBracketLength === endBracketLength) {
            // 構文的に有効な場合
            const length = value.length;
            let index = 0;
            const result: ValueParseResult = {
                status: 200,
                content: '',
            };

            while (index < length) {
                if (value[index] === '$') {
                    const startIndex = index + 2;
                    const endIndex = value.indexOf('}', startIndex);
                    index = index + endIndex;
                    const codeRaw = value.slice(startIndex, endIndex);
                    const parsedCode = this.parseCode(codeRaw);

                    result.status = parsedCode.status;
                    result.content = result.content + parsedCode.content;
                    index = index + 1;
                } else {
                    result.content = result.content + value[index];
                    index = index + 1;
                }
            }

            return result;
        } else {
            // 構文的に無効な場合
            const result: ValueParseResult = {
                status: 400,
                content: '${}の対応関係が崩れています',
            };
            return result;
        }
    }

    private parseCode(codeRaw: string): ParseCodeResult {
        if (codeRaw.startsWith('fetch ')) {
            return {
                status: 200,
                content: '[fetch]',
            };
        } else {
            return {
                status: 200,
                content: `\$\{${codeRaw}\}`,
            };
        }
    }
}

export interface ValueParseResult {
    status: ParseStatus;
    content: string;
}

export interface ParseCodeResult {
    status: 200 | 400 | 403 | 404;
    content: string;
}

export interface ParseModResult {
    status: 200 | 400 | 403 | 404;
    content: string;
}

export type ParseStatus = 200 | 400 | 403 | 404;

const ParseErrorMessages = {
    invalidDiscordChannel: 'テキストチャンネル以外でこの変数は使用できません',
    invalidBrackets: '${}の対応関係が崩れています',
    isOnlyMods: 'モデレータ専用コマンドです',
    variablesNotFound: '変数が見つかりませんでした',
    commandNotFound: 'コマンドが見つかりませんでした',
};

export class DummyMessage {
    channel: { name: 'DummyChannelName' };
    user: { name: 'DummyUserName'; isMod: true };
    constructor() {
        this.channel = {
            name: 'DummyChannelName',
        };
        this.user = {
            name: 'DummyUserName',
            isMod: true,
        };
    }
}

// ${fetch https://example.com}hoge
// ${random huge huge huge}
// ${alias !hg}
// ${time}
// ${channel}
// ${user}
// ${mod fetch https://example.com}

// 200 - 成功
// 400 - 構文が無効
// 403 - 権限不足
// 404 - 変数が見つからない
