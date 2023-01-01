import { Request, ArrayUtils, JSTDate, StringUtils } from '@suzuki3jp/utils';
import type { Message } from '@suzuki3jp/twitch.js';
import { Agent } from 'https';
import path from 'path';
import { readFileSync } from 'fs';

const commands: Record<string, string> = JSON.parse(
    readFileSync(path.resolve(__dirname, '../data/Commands.json'), { encoding: 'utf-8' })
);

export class ValueParser {
    async parse(value: string, message: Message): Promise<ValueParseResult> {
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
                    index = index + endIndex - 5;
                    const codeRaw = value.slice(startIndex, endIndex);
                    const parsedCode = await this.parseCode(codeRaw, message);
                    if (parsedCode.status === 200) {
                        result.status = parsedCode.status;
                        result.content = result.content + parsedCode.content;
                    } else {
                        result.status = parsedCode.status;
                        result.content = parsedCode.content;
                    }
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

    private async parseCode(codeRaw: string, message: Message): Promise<ParseCodeResult> {
        if (codeRaw.startsWith('fetch ')) {
            return {
                status: 200,
                content: await this.parseFetch(codeRaw),
            };
        } else if (codeRaw.startsWith('random ')) {
            return {
                status: 200,
                content: this.parseRandom(codeRaw),
            };
        } else if (codeRaw.startsWith('alias ')) {
            return {
                status: 200,
                content: this.parseAlias(codeRaw),
            };
        } else if (codeRaw.startsWith('channel')) {
            return {
                status: 200,
                content: message.channel.name,
            };
        } else if (codeRaw.startsWith('user')) {
            return {
                status: 200,
                content: message.member.name,
            };
        } else if (codeRaw.startsWith('time')) {
            return {
                status: 200,
                content: JSTDate.getDateString(),
            };
        } else if (codeRaw.startsWith('mod ')) {
            return {
                status: (await this.parseMod(codeRaw, message)).status,
                content: (await this.parseMod(codeRaw, message)).content,
            };
        } else {
            return {
                status: 404,
                content: '変数が見つかりませんでした',
            };
        }
    }

    private async parseFetch(codeRaw: string): Promise<string> {
        const url = codeRaw.slice(6);
        const req = new Request();
        const res = await req.get(url, { httpsAgent: new Agent({ rejectUnauthorized: false }) });
        return res.data.toString();
    }

    private parseRandom(codeRaw: string): string {
        const choices = codeRaw.slice(7).split(' ');
        const choice: string = ArrayUtils.random(choices);
        return choice;
    }

    private parseAlias(codeRaw: string): string {
        const targetCommand = codeRaw.slice(6);
        return commands[targetCommand];
    }

    private async parseMod(codeRaw: string, message: Message): Promise<ParseModResult> {
        const newCodeRaw = codeRaw.slice(4);

        if (message.member.isMod) {
            if (newCodeRaw.startsWith('fetch ')) {
                return {
                    status: 200,
                    content: await this.parseFetch(newCodeRaw),
                };
            } else if (newCodeRaw.startsWith('random ')) {
                return {
                    status: 200,
                    content: this.parseRandom(newCodeRaw),
                };
            } else if (newCodeRaw.startsWith('time')) {
                return {
                    status: 200,
                    content: JSTDate.getDateString(),
                };
            } else if (newCodeRaw.startsWith('channel')) {
                return {
                    status: 200,
                    content: message.channel.name,
                };
            } else if (newCodeRaw.startsWith('user')) {
                return {
                    status: 200,
                    content: message.member.name,
                };
            } else if (newCodeRaw.startsWith('alias ')) {
                return {
                    status: 200,
                    content: this.parseAlias(newCodeRaw),
                };
            } else {
                return {
                    status: 200,
                    content: newCodeRaw,
                };
            }
        } else {
            return {
                status: 403,
                content: 'モデレータ専用コマンドです。',
            };
        }
    }
}

export interface ValueParseResult {
    status: ParseStatus;
    content: string;
}

export interface ParseCodeResult {
    status: 200 | 403 | 404;
    content: string;
}

export interface ParseModResult {
    status: 200 | 403;
    content: string;
}

export type ParseStatus = 200 | 400 | 403 | 404;

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
