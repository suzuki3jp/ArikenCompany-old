"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyMessage = exports.PubValueParser = exports.ValueParser = void 0;
// nodeモジュールをインポート
const utils_1 = require("@suzuki3jp/utils");
const twitch_js_1 = require("@suzuki3jp/twitch.js");
const discord_js_1 = require("discord.js");
const https_1 = require("https");
// モジュールをインポート
const DataManager_1 = require("./DataManager");
const Base_1 = require("./Base");
// JSON Data Manager
const DM = new DataManager_1.DataManager();
class ValueVariables extends Base_1.Base {
    _req;
    constructor(base) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this._req = new utils_1.RequestClient();
    }
    getTime() {
        return utils_1.JST.getDateString();
    }
    async getTitle(message) {
        if (message instanceof twitch_js_1.Message) {
            const stream = await this.twitch._api.streams.getStreamByUserId(message.channel.id);
            if (!stream)
                return '配信がオフラインの時はタイトルを取得できません。';
            return `${stream.title}`;
        }
        else
            return 'このプラットフォームでは`title`変数は使用できません';
    }
    async getGame(message) {
        if (message instanceof twitch_js_1.Message) {
            const stream = await this.twitch._api.streams.getStreamByUserId(message.channel.id);
            if (!stream)
                return '配信がオフラインの時はゲームを取得できません。';
            return `${stream.gameName}`;
        }
        else
            return 'このプラットフォームでは`game`変数は使用できません';
    }
    getChannel(message) {
        if (message instanceof twitch_js_1.Message) {
            return message.channel.name;
        }
        else if (message.channel instanceof discord_js_1.TextChannel) {
            return message.channel.name;
        }
        else if (message instanceof DummyMessage) {
            return message.channel.name;
        }
        else
            return ParseErrorMessages.invalidDiscordChannel;
    }
    getUser(message) {
        if (message instanceof twitch_js_1.Message) {
            return message.member.name;
        }
        else if (message instanceof DummyMessage) {
            return message.user.name;
        }
        else {
            return message.author.tag;
        }
    }
    async fetch(url) {
        const result = await this._req.get({ url, config: { httpsAgent: new https_1.Agent({ rejectUnauthorized: false }) } });
        return result.data.toString();
    }
    random(choices) {
        return utils_1.ArrayUtils.random(choices);
    }
    getCommandByAlias(commandName) {
        const { commands } = DM.getCommands();
        const result = commands.filter((command) => command.name === commandName);
        if (result.length === 0)
            return ParseErrorMessages.commandNotFound;
        return result[0].message;
    }
    isMod(message) {
        if (message instanceof twitch_js_1.Message) {
            return message.member.isMod;
        }
        else if (message instanceof discord_js_1.Message) {
            const settings = DM.getSettings();
            return message.member?.roles.cache.has(settings.discord.modRoleId) ?? false;
        }
        else
            return message.user.isMod;
    }
}
class ValueParser extends Base_1.Base {
    variablesLength;
    variablesManager;
    constructor(base) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this.variablesManager = new ValueVariables(this);
        this.variablesLength = {
            alias: 6,
            fetch: 6,
            random: 7,
            mod: 4,
        };
    }
    async parse(value, message, aliased) {
        const startBracketLength = utils_1.StringUtils.countBy(value, '{');
        const endBracketLength = utils_1.StringUtils.countBy(value, '}');
        if (startBracketLength === endBracketLength) {
            // 構文的に有効な場合
            const length = value.length;
            let index = 0;
            const result = {
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
                    }
                    else {
                        result.status = parsedCode.status;
                        result.content = parsedCode.content;
                    }
                    index = endIndex + 1;
                }
                else {
                    result.content = result.content + value[index];
                    index = index + 1;
                }
            }
            return result;
        }
        else {
            // 構文的に無効な場合
            const result = {
                status: 400,
                content: ParseErrorMessages.invalidBrackets,
            };
            return result;
        }
    }
    async _parseCode(codeRaw, message, aliased) {
        const result = await this._parseVariables(codeRaw.trim(), message, aliased);
        if (result.status === 200)
            return result;
        if (result.status === 403)
            return result;
        if (result.status === 400)
            return result;
        return { status: result.status, content: ParseErrorMessages.variablesNotFound };
    }
    async _parseFetch(codeRaw) {
        const url = codeRaw.slice(this.variablesLength.fetch);
        return await this.variablesManager.fetch(url);
    }
    _parseRandom(codeRaw) {
        const choices = codeRaw.slice(this.variablesLength.random).split(' ');
        return this.variablesManager.random(choices);
    }
    async _parseAlias(codeRaw, message) {
        const targetCommand = codeRaw.slice(this.variablesLength.alias).toLowerCase();
        return await this.parse(this.variablesManager.getCommandByAlias(targetCommand), message, true);
    }
    async _parseMod(codeRaw, message) {
        const newCodeRaw = codeRaw.slice(this.variablesLength.mod);
        if (this.variablesManager.isMod(message)) {
            const result = await this._parseVariables(newCodeRaw, message);
            if (result.status === 200)
                return result;
            return { status: 200, content: result.content };
        }
        else
            return { status: 403, content: ParseErrorMessages.isOnlyMods };
    }
    async _parseVariables(codeRaw, message, aliased) {
        if (codeRaw.startsWith('fetch ')) {
            return {
                status: 200,
                content: await this._parseFetch(codeRaw),
            };
        }
        else if (codeRaw.startsWith('random ')) {
            return {
                status: 200,
                content: this._parseRandom(codeRaw),
            };
        }
        else if (codeRaw.startsWith('alias ')) {
            if (aliased) {
                return {
                    status: 400,
                    content: 'alias先のコマンドの内容でalias関数を使用することはできません。これは無限ループを防ぐためです。',
                };
            }
            else {
                return {
                    status: (await this._parseAlias(codeRaw, message)).status,
                    content: (await this._parseAlias(codeRaw, message)).content,
                };
            }
        }
        else if (codeRaw.startsWith('channel')) {
            return {
                status: 200,
                content: this.variablesManager.getChannel(message),
            };
        }
        else if (codeRaw.startsWith('user')) {
            return {
                status: 200,
                content: this.variablesManager.getUser(message),
            };
        }
        else if (codeRaw.startsWith('time')) {
            return {
                status: 200,
                content: this.variablesManager.getTime(),
            };
        }
        else if (codeRaw.startsWith('mod ')) {
            return {
                status: (await this._parseMod(codeRaw, message)).status,
                content: (await this._parseMod(codeRaw, message)).content,
            };
        }
        else if (codeRaw.startsWith('title')) {
            return {
                status: 200,
                content: await this.variablesManager.getTitle(message),
            };
        }
        else if (codeRaw.startsWith('game')) {
            return {
                status: 200,
                content: await this.variablesManager.getGame(message),
            };
        }
        else {
            return {
                status: 404,
                content: codeRaw,
            };
        }
    }
}
exports.ValueParser = ValueParser;
class PubValueParser {
    parse(value) {
        const startBracketLength = utils_1.StringUtils.countBy(value, '{');
        const endBracketLength = utils_1.StringUtils.countBy(value, '}');
        if (startBracketLength === endBracketLength) {
            // 構文的に有効な場合
            const length = value.length;
            let index = 0;
            const result = {
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
                }
                else {
                    result.content = result.content + value[index];
                    index = index + 1;
                }
            }
            return result;
        }
        else {
            // 構文的に無効な場合
            const result = {
                status: 400,
                content: '${}の対応関係が崩れています',
            };
            return result;
        }
    }
    parseCode(codeRaw) {
        if (codeRaw.startsWith('fetch ')) {
            return {
                status: 200,
                content: '[fetch]',
            };
        }
        else {
            return {
                status: 200,
                content: `\$\{${codeRaw}\}`,
            };
        }
    }
}
exports.PubValueParser = PubValueParser;
const ParseErrorMessages = {
    invalidDiscordChannel: 'テキストチャンネル以外でこの変数は使用できません',
    invalidBrackets: '${}の対応関係が崩れています',
    isOnlyMods: 'モデレータ専用コマンドです',
    variablesNotFound: '変数が見つかりませんでした',
    commandNotFound: 'コマンドが見つかりませんでした',
};
class DummyMessage {
    channel;
    user;
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
exports.DummyMessage = DummyMessage;
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
