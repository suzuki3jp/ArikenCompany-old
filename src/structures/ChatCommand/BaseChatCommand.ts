import { Message as DiscordMessage } from 'discord.js';

import { ArikenCompany } from '../ArikenCompany/ArikenCompany';
import { TwitchMessage } from '../twitch/TwitchMessage';

export class BaseChatCommand {
    public splited: string[];

    public name: string;
    public args: string[];
    constructor(private client: ArikenCompany, private message: DiscordMessage | TwitchMessage) {
        this.splited = this.parseArgs(this.message.content);
        this.name = this.splited[0];
        this.args = Array.from(this.splited).slice(1);
    }

    private parseArgs(content: string): string[] {
        const [first, ...args] = content.split(' ');
        if (!first.startsWith('!') && !first.startsWith('！')) return [first, ...args];
        return [`!${first.slice(1)}`, ...args];
    }
}
