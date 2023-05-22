// nodeモジュールをインポート
import { ArrayUtils, JST, RequestClient, StringUtils } from '@suzuki3jp/utils';
import { Message as TwitchMessage } from '@suzuki3jp/twitch.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import { Message as DiscordMessage } from 'discord.js';
import { Agent } from 'https';
dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault('Asia/Tokyo');

// モジュールをインポート
import { Base } from './Base';
import { CommandManager } from './Command';

export class ValueParser extends Base {
    private results: { value: ParseResult | null; code: ParseResult | null } | null;
    private req: RequestClient;
    private managers: { command: CommandManager };

    constructor(base: Base) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this.results = null;
        this.req = new RequestClient();
        this.managers = {
            command: new CommandManager(this),
        };
    }

    async parse(
        value: string,
        message: TwitchMessage | DiscordMessage | DummyMessage,
        aliased?: boolean
    ): Promise<ParseResult | null> {
        this.results = { value: new ParseResult(value), code: null };
        const startBracketLength = StringUtils.countBy(value, '${');
        const endBracketLength = StringUtils.countBy(value, '}');

        if (startBracketLength <= endBracketLength) {
            // 構文的に有効な場合
            const length = value.length;
            let index = 0;

            while (index < length) {
                if (value[index] === '$' && value[index + 1] === '{') {
                    const startIndex = index + 2;
                    const endIndex = value.indexOf('}', startIndex);

                    index = index + endIndex;
                    const codeRow = value.slice(startIndex, endIndex);
                    const parseCodeResult = await this.parseCode(codeRow, { message, aliased, moded: false });
                    if (!parseCodeResult || parseCodeResult.error) {
                        if (!parseCodeResult) this.results.value?.replaceAll(ErrorCodes.UnknownError);
                        if (parseCodeResult) this.results.value?.replaceAll(parseCodeResult.parsed);
                        this.results.value?.setError(true);
                    } else this.results.value?.push(parseCodeResult.parsed);

                    index = endIndex + 1;
                } else {
                    this.results.value?.push(value[index]);
                    index = index + 1;
                }
            }

            return this.results.value;
        } else {
            // 構文的に無効な場合
            this.results.value?.replaceAll(ErrorCodes.SyntaxError.InvalidBrackets);
            this.results.value?.setError(true);
            return this.results.value;
        }
    }

    private async parseCode(
        code: string,
        options: {
            message: TwitchMessage | DiscordMessage | DummyMessage;
            aliased?: boolean;
            moded?: boolean;
        }
    ): Promise<ParseResult | null> {
        const { message, aliased, moded } = options;
        code = code.trim();
        code = code.replaceAll(/ +/g, ' ');
        const [variable, ...args] = code.split(' ');
        if (!this.results) this.results = { value: null, code: null };
        this.results.code = new ParseResult(code);

        switch (variable) {
            case 'fetch':
                if (!args[0]) {
                    this.results.code.replaceAll(ErrorCodes.SyntaxError.FetchInvalidArgs);
                    this.results.code.setError(true);
                    return this.results.code;
                } else {
                    this.results.code.push(await this.parseFetch(args[0]));
                    return this.results.code;
                }
                break;
            case 'random':
                if (args.length === 0) {
                    this.results.code.replaceAll(ErrorCodes.SyntaxError.RandomInvalidArgs);
                    this.results.code.setError(true);
                    return this.results.code;
                } else {
                    this.results.code.push(this.parseRandom(args));
                    return this.results.code;
                }
                break;
            case 'alias':
                if (!args[0].startsWith('!')) {
                    this.results.code.replaceAll(ErrorCodes.SyntaxError.AliasInvalidArgs);
                    this.results.code.setError(true);
                    return this.results.code;
                } else if (aliased) {
                    this.results.code.replaceAll(ErrorCodes.SyntaxError.AliasLoop);
                    this.results.code.setError(true);
                    return this.results.code;
                } else {
                    this.results.code.push(await this.parseAlias(args[0], message));
                    return this.results.code;
                }
                break;
            case 'mod':
                if (moded) {
                    this.results.code.replaceAll(ErrorCodes.SyntaxError.ModLoop);
                    this.results.code.setError(true);
                    return this.results.code;
                } else {
                    this.results.code.push(await this.parseMod(args, message));
                    return this.results.code;
                }
                break;
            case 'diff':
                const [date, time, ..._] = args;
                if (this.validateDate(date) && this.validateTime(time)) {
                    this.results.code.push(this.parseDiff(date, time));
                    return this.results.code;
                } else {
                    if (!this.validateDate(date)) {
                        this.results.code.replaceAll(ErrorCodes.ValidationError.Date);
                        this.results.code.setError(true);
                        return this.results.code;
                    } else {
                        this.results.code.replaceAll(ErrorCodes.ValidationError.Time);
                        this.results.code.setError(true);
                        return this.results.code;
                    }
                }
                break;
            case 'channel':
                this.results.code.push(this.parseChannel(message));
                return this.results.code;
                break;
            case 'game':
                this.results.code.push(await this.parseGame(message));
                return this.results.code;
                break;
            case 'title':
                this.results.code.push(await this.parseTitle(message));
                return this.results.code;
                break;
            case 'user':
                this.results.code.push(this.parseUser(message));
                return this.results.code;
                break;
            case 'time':
                this.results.code.push(this.parseTime());
                return this.results.code;
                break;
            default:
                if (moded) {
                    this.results.code.push(code);
                    return this.results.code;
                } else {
                    this.results.code.replaceAll(ErrorCodes.ReferenceError.VariableNotExit(variable));
                    this.results.code.setError(true);
                    return this.results.code;
                }
                break;
        }
    }

    private async parseFetch(url: string): Promise<string> {
        const res = await this.req.get({ url, config: { httpsAgent: new Agent({ rejectUnauthorized: false }) } });

        if (res.status !== 200) return ErrorCodes.RemoteServerError(res.status);
        return res.data.toString();
    }

    private parseRandom(choices: string[]): string {
        return ArrayUtils.random(choices);
    }

    private async parseAlias(
        commandName: string,
        message: TwitchMessage | DiscordMessage | DummyMessage
    ): Promise<string> {
        commandName = commandName.toLowerCase();
        const command = this.managers.command.getCommandByName(commandName);
        if (command) {
            const parser = new ValueParser(this);
            const result = await parser.parse(command.message, message, true);
            if (result?.error) {
                this.results?.code?.replaceAll(result.parsed);
                this.results?.code?.setError(true);
                return result.parsed;
            } else return result?.parsed ?? '';
        } else {
            this.results?.code?.replaceAll(ErrorCodes.ReferenceError.AliasNotExist(commandName));
            this.results?.code?.setError(true);
            return ErrorCodes.ReferenceError.AliasNotExist(commandName);
        }
    }

    private async parseMod(args: string[], message: TwitchMessage | DiscordMessage | DummyMessage): Promise<string> {
        let isMod = false;
        if (message instanceof TwitchMessage) isMod = message.member.isMod;
        if (message instanceof DiscordMessage) {
            const { modRoleId } = this.DM.getSettings().discord;
            isMod = message.member?.roles.cache.has(modRoleId) ?? false;
        }
        if (message instanceof DummyMessage) {
            isMod = message.user.isMod;
        }

        if (isMod) {
            const parser = new ValueParser(this);
            const result = await parser.parseCode(args.join(' '), { message, moded: true });

            if (result?.error) {
                this.results?.code?.replaceAll(result.parsed);
                this.results?.code?.setError(true);
                return result.parsed;
            } else return result?.parsed ?? '';
        } else {
            this.results?.code?.replaceAll(ErrorCodes.PermissionError.onlyMods);
            this.results?.code?.setError(true);
            return ErrorCodes.PermissionError.onlyMods;
        }
    }

    private parseDiff(date: string, time: string): string {
        const now = dayjs.tz(undefined);
        const specifiedDate = dayjs.tz(`${date} ${time}`);
        const absoluteDiff = Math.abs(now.diff(specifiedDate));

        // 取得したミリ秒差をフォーマットする
        const sec = Math.floor(absoluteDiff / 1000);
        const hour = Math.floor(sec / 3600);
        const min = Math.floor((sec % 3600) / 60);
        const rem = sec % 60;
        return `${hour}:${min}:${rem}`;
    }

    private validateDate(date: string): boolean {
        // 2023/05/18 のような形にvalidateする
        const delimiter = '/';
        const delimiterCount = StringUtils.countBy(date, delimiter);
        if (delimiterCount !== 2) return false;

        const arr = date.split(delimiter);
        if (arr[0].length < 4) return false;
        if (arr[1].length !== 2) return false;
        if (arr[2].length !== 2) return false;

        let isNum = true;
        arr.forEach((d) => (isNum = !isNaN(Number(d))));
        return isNum;
    }

    private validateTime(time: string): boolean {
        // 23:02:59 のような形にvalidateする
        const delimiter = ':';
        const delimiterCount = StringUtils.countBy(time, delimiter);
        if (delimiterCount !== 2) return false;

        const arr = time.split(delimiter);
        if (arr[0].length !== 2) return false;
        if (arr[1].length !== 2) return false;
        if (arr[2].length !== 2) return false;

        let isNum = true;
        arr.forEach((t) => (isNum = !isNaN(Number(t))));
        return isNum;
    }

    private parseChannel(message: TwitchMessage | DiscordMessage | DummyMessage): string {
        if (message instanceof TwitchMessage) return message.channel.name;
        if (message instanceof DummyMessage) return message.channel.name;
        if (message.inGuild()) return message.channel.name;
        return ErrorCodes.PlatformError.Channel;
    }

    private async parseGame(message: TwitchMessage | DiscordMessage | DummyMessage): Promise<string> {
        if (!(message instanceof TwitchMessage)) {
            this.results?.code?.replaceAll(ErrorCodes.PlatformError.Game);
            this.results?.code?.setError(true);
            return ErrorCodes.PlatformError.Game;
        }
        const channel = await this.twitch._api.channels.getChannelInfoById(message.channel.id);
        if (!channel) return ErrorCodes.TwitchAPIError.CanNotGetGame;
        return channel.gameName;
    }

    private async parseTitle(message: TwitchMessage | DiscordMessage | DummyMessage): Promise<string> {
        if (!(message instanceof TwitchMessage)) {
            this.results?.code?.replaceAll(ErrorCodes.PlatformError.Title);
            this.results?.code?.setError(true);
            return ErrorCodes.PlatformError.Title;
        } else {
            const channel = await this.twitch._api.channels.getChannelInfoById('');
            if (!channel) return ErrorCodes.TwitchAPIError.CanNotGetTitle;
            return channel.title;
        }
    }

    private parseUser(message: TwitchMessage | DiscordMessage | DummyMessage): string {
        if (message instanceof TwitchMessage) return message.member.displayName;
        if (message instanceof DiscordMessage) return message.author.tag;
        return message.user.name;
    }

    private parseTime(): string {
        const date = dayjs.tz(undefined);
        return `${date.year}/${date.month}/${date.day} ${date.hour}:${date.minute}:${date.second}`;
    }
}

export class ParseResult {
    original: string;
    parsed: string;
    error: boolean;

    constructor(original: string) {
        this.original = original;
        this.parsed = '';
        this.error = false;
    }

    /**
     * `this.parsed`に文字列を追記する
     *
     * **エラーが既出の場合pushしません**
     * @param str 追記する文字列
     * @returns 追記後の`this.parsed`
     */
    push(str: string) {
        if (this.error) return;
        this.parsed = `${this.parsed}${str}`;
        return this.parsed;
    }

    /**
     * `this.parsed`を全て置き換える
     * @param str 置き換える文字列
     * @returns 置き換えた後の`this.parsed`
     */
    replaceAll(str: string) {
        this.parsed = str;
        return;
    }

    /**
     * Resultをエラーとしてマークする
     *
     * **この関数を実行した後は`this.parsed`がロックされ、`this.push()`が機能しないようになる**
     * @param bool
     */
    setError(bool: boolean) {
        this.error = bool;
    }
}

export class PubValueParser {
    parse(value: string): ParseResult {
        // 構文的に有効な場合
        const length = value.length;
        let index = 0;
        const result = new ParseResult(value);

        while (index < length) {
            if (value[index] === '$') {
                const startIndex = index + 2;
                const endIndex = value.indexOf('}', startIndex);
                index = index + endIndex;
                const code = value.slice(startIndex, endIndex);
                const parseCodeResult = this.parseCode(code);

                result.push(parseCodeResult);
                index = index + 1;
            } else {
                result.push(value[index]);
                index = index + 1;
            }
        }

        return result;
    }

    private parseCode(code: string): string {
        const [variable, ...args] = code.split(' ');

        switch (variable) {
            case 'fetch':
                return '[fetch]';
                break;
            default:
                return `${variable} ${args.join(' ')}`;
                break;
        }
    }
}

export const ErrorCodes = {
    RemoteServerError: (status: string | number) =>
        `RemoteServerError: リモートサーバーからエラーが返されました [code: ${status}]`,
    SyntaxError: {
        FetchInvalidArgs: 'SyntaxError: fetch は半角スペースの後にurlを指定する必要があります',
        RandomInvalidArgs: 'SyntaxError: random は半角スペースを使用して選択肢を指定する必要があります',
        AliasInvalidArgs: 'SyntaxError: alias は半角スペースの後に ![コマンド名] でコマンドを指定する必要があります',
        AliasLoop:
            'SyntaxError: alias を使用しているコマンドに対してaliasを行うことはできません。これは無限ループを防ぐためです。',
        ModLoop:
            'SyntaxError: mod を使用したコード内で二個目のmod を使用することはできません。これは無限ループを防ぐためです。',
        InvalidBrackets: 'SyntaxError: {}の対応関係が崩れています。',
    },
    ReferenceError: {
        AliasNotExist: (command: string) => `ReferenceError: alias先のコマンドが存在しません [command: ${command}]`,
        VariableNotExit: (variable: string) =>
            `ReferenceError: 変数または関数が見つかりません。 [variable: ${variable}]`,
    },
    PermissionError: {
        onlyMods: 'PermissionError: このコマンドはモデレーター専用です。',
    },
    ValidationError: {
        Date: 'ValidationError: 日付の指定方法が間違っています。(例: 2023/05/18)',
        Time: 'ValidationError: 時刻の指定方法が間違っています。(例: 23:59:05)',
    },
    PlatformError: {
        Game: 'PlatformError: このプラットフォームではこの変数を使用することができません。 game',
        Title: 'PlatformError: このプラットフォームではこの変数を使用することができません。 title',
        Channel: 'PlatformError: このプラットフォームではこの変数を使用することができません。 channel',
    },
    TwitchAPIError: {
        CanNotGetTitle: 'TwitchAPIError: チャンネルのタイトルを取得できませんでした。',
        CanNotGetGame: 'TwitchAPIError: チャンネルのゲームを取得できませんでした。',
    },
    UnknownError: 'UnknownError: 何らかの要因で処理が失敗しました。',
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
