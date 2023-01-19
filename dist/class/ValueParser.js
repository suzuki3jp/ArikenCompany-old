"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubValueParser = exports.DiscordValueParser = exports.ValueParser = void 0;
// nodeモジュールをインポート
const utils_1 = require("@suzuki3jp/utils");
const discord_js_1 = require("discord.js");
const https_1 = require("https");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
// paths
const commandsPath = path_1.default.resolve(__dirname, '../data/Commands.json');
const settingsPath = path_1.default.resolve(__dirname, '../data/settings.json');
class ValueParser {
    async parse(value, message) {
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
                    const parsedCode = await this.parseCode(codeRaw, message);
                    if (parsedCode.status === 200) {
                        result.status = parsedCode.status;
                        result.content = result.content + parsedCode.content;
                    }
                    else {
                        result.status = parsedCode.status;
                        result.content = parsedCode.content;
                    }
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
    async parseCode(codeRaw, message) {
        if (codeRaw.startsWith('fetch ')) {
            return {
                status: 200,
                content: await this.parseFetch(codeRaw),
            };
        }
        else if (codeRaw.startsWith('random ')) {
            return {
                status: 200,
                content: this.parseRandom(codeRaw),
            };
        }
        else if (codeRaw.startsWith('alias ')) {
            return {
                status: 200,
                content: this.parseAlias(codeRaw),
            };
        }
        else if (codeRaw.startsWith('channel')) {
            return {
                status: 200,
                content: message.channel.name,
            };
        }
        else if (codeRaw.startsWith('user')) {
            return {
                status: 200,
                content: message.member.name,
            };
        }
        else if (codeRaw.startsWith('time')) {
            return {
                status: 200,
                content: utils_1.JST.getDateString(),
            };
        }
        else if (codeRaw.startsWith('mod ')) {
            return {
                status: (await this.parseMod(codeRaw, message)).status,
                content: (await this.parseMod(codeRaw, message)).content,
            };
        }
        else {
            return {
                status: 404,
                content: '変数が見つかりませんでした',
            };
        }
    }
    async parseFetch(codeRaw) {
        const url = codeRaw.slice(6);
        const req = new utils_1.Request();
        const res = await req.get(url, { httpsAgent: new https_1.Agent({ rejectUnauthorized: false }) });
        return res.data.toString();
    }
    parseRandom(codeRaw) {
        const choices = codeRaw.slice(7).split(' ');
        const choice = utils_1.ArrayUtils.random(choices);
        return choice;
    }
    parseAlias(codeRaw) {
        const targetCommand = codeRaw.slice(6).toLowerCase();
        const commands = JSON.parse((0, fs_1.readFileSync)(commandsPath, 'utf-8'));
        return commands[targetCommand];
    }
    async parseMod(codeRaw, message) {
        const newCodeRaw = codeRaw.slice(4);
        if (message.member.isMod) {
            if (newCodeRaw.startsWith('fetch ')) {
                return {
                    status: 200,
                    content: await this.parseFetch(newCodeRaw),
                };
            }
            else if (newCodeRaw.startsWith('random ')) {
                return {
                    status: 200,
                    content: this.parseRandom(newCodeRaw),
                };
            }
            else if (newCodeRaw.startsWith('time')) {
                return {
                    status: 200,
                    content: utils_1.JST.getDateString(),
                };
            }
            else if (newCodeRaw.startsWith('channel')) {
                return {
                    status: 200,
                    content: message.channel.name,
                };
            }
            else if (newCodeRaw.startsWith('user')) {
                return {
                    status: 200,
                    content: message.member.name,
                };
            }
            else if (newCodeRaw.startsWith('alias ')) {
                return {
                    status: 200,
                    content: this.parseAlias(newCodeRaw),
                };
            }
            else {
                return {
                    status: 200,
                    content: newCodeRaw,
                };
            }
        }
        else {
            return {
                status: 403,
                content: 'モデレータ専用コマンドです。',
            };
        }
    }
}
exports.ValueParser = ValueParser;
class DiscordValueParser {
    async parse(value, message) {
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
                    const parsedCode = await this.parseCode(codeRaw, message);
                    if (parsedCode.status === 200) {
                        result.status = parsedCode.status;
                        result.content = result.content + parsedCode.content;
                    }
                    else {
                        result.status = parsedCode.status;
                        result.content = parsedCode.content;
                    }
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
    async parseCode(codeRaw, message) {
        if (codeRaw.startsWith('fetch ')) {
            return {
                status: 200,
                content: await this.parseFetch(codeRaw),
            };
        }
        else if (codeRaw.startsWith('random ')) {
            return {
                status: 200,
                content: this.parseRandom(codeRaw),
            };
        }
        else if (codeRaw.startsWith('alias ')) {
            return {
                status: 200,
                content: this.parseAlias(codeRaw),
            };
        }
        else if (codeRaw.startsWith('channel')) {
            if (message.channel instanceof discord_js_1.TextChannel) {
                return {
                    status: 200,
                    content: message.channel.name,
                };
            }
            else {
                return {
                    status: 404,
                    content: 'テキストチャンネル以外でこの変数は使用できません',
                };
            }
        }
        else if (codeRaw.startsWith('user')) {
            return {
                status: 200,
                content: message.member?.nickname ?? message.author.username,
            };
        }
        else if (codeRaw.startsWith('time')) {
            return {
                status: 200,
                content: utils_1.JST.getDateString(),
            };
        }
        else if (codeRaw.startsWith('mod ')) {
            return {
                status: (await this.parseMod(codeRaw, message)).status,
                content: (await this.parseMod(codeRaw, message)).content,
            };
        }
        else {
            return {
                status: 404,
                content: '変数が見つかりませんでした',
            };
        }
    }
    async parseFetch(codeRaw) {
        const url = codeRaw.slice(6);
        const req = new utils_1.Request();
        const res = await req.get(url, { httpsAgent: new https_1.Agent({ rejectUnauthorized: false }) });
        return res.data.toString();
    }
    parseRandom(codeRaw) {
        const choices = codeRaw.slice(7).split(' ');
        const choice = utils_1.ArrayUtils.random(choices);
        return choice;
    }
    parseAlias(codeRaw) {
        const targetCommand = codeRaw.slice(6).toLowerCase();
        const commands = JSON.parse((0, fs_1.readFileSync)(commandsPath, 'utf-8'));
        return commands[targetCommand];
    }
    async parseMod(codeRaw, message) {
        const newCodeRaw = codeRaw.slice(4);
        const settings = JSON.parse((0, fs_1.readFileSync)(settingsPath, 'utf-8'));
        if (message.member?.roles.cache.has(settings.discord.modRoleId)) {
            if (newCodeRaw.startsWith('fetch ')) {
                return {
                    status: 200,
                    content: await this.parseFetch(newCodeRaw),
                };
            }
            else if (newCodeRaw.startsWith('random ')) {
                return {
                    status: 200,
                    content: this.parseRandom(newCodeRaw),
                };
            }
            else if (newCodeRaw.startsWith('time')) {
                return {
                    status: 200,
                    content: utils_1.JST.getDateString(),
                };
            }
            else if (newCodeRaw.startsWith('channel')) {
                if (message.channel instanceof discord_js_1.TextChannel) {
                    return {
                        status: 200,
                        content: message.channel.name,
                    };
                }
                else {
                    return {
                        status: 403,
                        content: 'テキストチャンネル以外でこの変数は使用できません',
                    };
                }
            }
            else if (newCodeRaw.startsWith('user')) {
                return {
                    status: 200,
                    content: message.member.nickname ?? message.author.username,
                };
            }
            else if (newCodeRaw.startsWith('alias ')) {
                return {
                    status: 200,
                    content: this.parseAlias(newCodeRaw),
                };
            }
            else {
                return {
                    status: 200,
                    content: newCodeRaw,
                };
            }
        }
        else {
            return {
                status: 403,
                content: 'モデレータ専用コマンドです。',
            };
        }
    }
}
exports.DiscordValueParser = DiscordValueParser;
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
                content: codeRaw,
            };
        }
    }
}
exports.PubValueParser = PubValueParser;
// ${fetch https://example.com}hoge
// ${random huge huge huge}
// ${alias !hg}
// ${time}
// ${channel}
// ${user}
// ${mod fetch https://example.com}
// 200 - 成功
// 404 - 変数が見つからない
// 400 - 構文が無効
// 403 - 権限不足
