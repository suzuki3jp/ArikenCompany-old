import logColor from 'chalk';

import { JSTController } from '../index';

export class Logger {
    private isDebugMode: boolean;

    constructor() {
        this.isDebugMode = process.argv.includes('--debug');
    }

    system(...messages: string[]) {
        this.writeLog('SYSTEM', ...messages);
    }

    info(...messages: string[]) {
        this.writeLog('INFO', ...messages);
    }

    debug(...messages: string[]) {
        if (!this.isDebugMode) return;
        this.writeLog('DEBUG', ...messages);
    }

    writeLog(level: LogLevel, ...messages: string[]) {
        console.log(this.makeLog(level, ...messages));
    }

    makeLog(level: LogLevel, ...messages: string[]): string {
        const now = new JSTController();
        return ColorizeLog[level](`[${now.toString()} JST] [${level}] - ${messages.join('')}`);
    }
}

type LogLevel = 'SYSTEM' | 'INFO' | 'DEBUG';

const ColorizeLog = {
    SYSTEM: logColor.blue,
    DEBUG: logColor.gray,
    INFO: logColor.green,
};
