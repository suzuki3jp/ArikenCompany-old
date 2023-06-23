import { Message as DiscordMessage } from 'discord.js';

import { ArikenCompany } from '../ArikenCompany/ArikenCompany';
import { TwitchMessage } from '../twitch/TwitchMessage';

export class BaseChatCommand {
    public splited: string[];
    public name: string;
    public args: string[];
    public isManageCommand: boolean;
    public platform: 'DISCORD' | 'TWITCH';

    constructor(private client: ArikenCompany, public message: DiscordMessage | TwitchMessage) {
        this.splited = this.parseArgs(this.message.content);
        this.name = this.splited[0];
        this.args = Array.from(this.splited).slice(1);
        this.isManageCommand = this.checkIsManageCommand(this.name);
        this.platform = message instanceof DiscordMessage ? 'DISCORD' : 'TWITCH';
    }

    private parseArgs(content: string): string[] {
        const [first, ...args] = content.split(' ');
        if (!first.startsWith('!') && !first.startsWith('！')) return [first, ...args];
        return [`!${first.slice(1)}`, ...args];
    }

    private checkIsManageCommand(command: string): boolean {
        if (command === '!addcom') return true;
        if (command === '!editcom') return true;
        if (command === '!rmcom') return true;
        if (command === '!oncom') return true;
        if (command === '!offcom') return true;
        if (command === '!cooldown') return true;
        if (command === '!setcooldown') return true;
        return false;
    }
}
