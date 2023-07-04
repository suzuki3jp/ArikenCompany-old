import { LogLevel } from '@/Typings';
import { JST } from '@/helpers/Date/index';

export class Logger {
    constructor() {}

    error(...messages: string[]) {
        this.log('error', ...messages);
    }

    system(...messages: string[]) {
        this.log('system', ...messages);
    }

    info(...messages: string[]) {
        this.log('info', ...messages);
    }

    debug(...messages: string[]) {
        this.log('debug', ...messages);
    }

    private log(level: LogLevel, ...messages: string[]) {
        console.log(this.makeMessage(level, ...messages));
    }

    private makeMessage(level: LogLevel, ...messages: string[]): string {
        const now = new JST().toString();
        return `[${now} JST] [${level.toUpperCase()}] - ${messages.join(' ')}`;
    }
}
