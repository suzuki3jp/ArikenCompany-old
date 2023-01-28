// nodeモジュールをインポート
import { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import { Logger } from '@suzuki3jp/utils';
import { Client as Discord } from 'discord.js';

// モジュールをインポート
import { Base } from './Base';

export class ManagersManager extends Base {
    constructor(twitchClient: Twitch, discordClient: Discord, logger: Logger) {
        super(twitchClient, discordClient, logger);
    }

    isManagersByTarget(target: string) {
        return super.DM.getManagers().managers.includes(target);
    }

    allow(target: string): string {
        if (this.isManagersByTarget(target)) return managersError.alreadyManager;
        const managers = super.DM.getManagers();
        managers.managers.push(target);
        super.DM.setManagers(managers);
        return `${target} に管理者権限を付与しました`;
    }

    deny(target: string): string {
        if (!this.isManagersByTarget(target)) return managersError.isNotAlreadyManager;
        const managers = super.DM.getManagers();
        const targetIndex = managers.managers.findIndex((value, index) => value === target);
        managers.managers.splice(targetIndex, 1);
        super.DM.setManagers(managers);
        return `${target} から管理者権限を剥奪しました`;
    }
}

const managersError = {
    alreadyManager: 'すでに管理者権限を所持しています',
    isNotAlreadyManager: '管理者権限を所持していません',
};
