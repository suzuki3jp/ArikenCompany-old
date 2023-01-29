// nodeモジュールをインポート
import type { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import type { Logger } from '@suzuki3jp/utils';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import type { Client as Discord } from 'discord.js';

// モジュールをインポート
import { DataManager } from './DataManager';

export class Base {
    public twitch: Twitch;
    public discord: Discord;
    public eventSub: EventSubWsListener;
    public logger: Logger;
    public DM: DataManager;

    constructor(twitch: Twitch, discord: Discord, eventSub: EventSubWsListener, logger: Logger) {
        this.twitch = twitch;
        this.discord = discord;
        this.eventSub = eventSub;
        this.logger = logger;
        this.DM = new DataManager();
    }

    getMe(): Base {
        return this;
    }
}
