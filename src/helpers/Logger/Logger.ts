import { JST } from '@/helpers/date/index';

export class Logger {
    public parent: Logger | null;

    constructor(public name: string, parent?: Logger) {
        this.parent = parent ?? null;
    }

    public createChild(name: string): Logger {
        return new Logger(name, this);
    }

    public error(...messages: string[]) {
        this.log('error', ...messages);
    }

    public system(...messages: string[]) {
        this.log('system', ...messages);
    }

    public info(...messages: string[]) {
        this.log('info', ...messages);
    }

    public debug(...messages: string[]) {
        this.log('debug', ...messages);
    }

    private log(level: LogLevel, ...messages: string[]) {
        console.log(this.makeMessage(level, ...messages));
    }

    private makeMessage(level: LogLevel, ...messages: string[]): string {
        let parents: Logger[] = [];
        let child: Logger = this;

        while (child.parent) {
            parents.unshift(child.parent);
            child = child.parent;
        }

        return [`[${new JST().toString()} JST]`, `[${[...parents, this].map((i) => i.name).join('/')}]`, `[${level.toUpperCase()}]`, ...messages].join(' ');
    }
}

type LogLevel = 'error' | 'system' | 'info' | 'debug';

export const LogMessages = {
    startingArikenCompany: 'Starting ArikenCompany...',
    startedArikenCompany: 'Started ArikenCompany.',
    startedApi: (port: number) => `Started ArikenCompany api. listening port: ${port}`,

    refreshedTwitchToken: `Refreshed Twitch token.`,
    addedToken: (userId: string) => `Added user.${userId} token.`,
};
