// nodeモジュールをインポート
import { JST } from '@suzuki3jp/utils';

// モジュールをインポート
import { DataManager } from './DataManager';
import type { TwitchCommand } from './TwitchCommand';

// JSON Data Manager
const DM = new DataManager();

export class CoolTimeManager {
    constructor() {}

    currentCoolTime(): number {
        const settings = DM.getSettings();
        return settings.twitch.cooltime;
    }

    changeCoolTime(newCoolTime: string | number): string {
        const settings = DM.getSettings();
        if (!String(newCoolTime).match(/^\d+$/)) return CoolTimeError.invalidCoolTime;
        settings.twitch.cooltime = Number(newCoolTime);
        DM.setSettings(settings);
        return `クールタイムを${newCoolTime}秒に変更しました`;
    }

    save(twitchCommand: TwitchCommand) {
        if (twitchCommand.isVip()) return;
        const commandName = twitchCommand.command.commandName;
        const cooltimes = DM.getCooltime();

        cooltimes[commandName] = JST.getDate().getTime();
        DM.setCooltime(cooltimes);
    }

    isPassedCoolTime(twitchCommand: TwitchCommand): boolean {
        if (twitchCommand.isVip()) return true;
        const cooltimes = DM.getCooltime();
        if (!cooltimes[twitchCommand.command.commandName]) return true;

        const currentCooltime = this.currentCoolTime() * 1000;
        const currentTime = JST.getDate().getTime();
        const diffTime = currentTime - cooltimes[twitchCommand.command.commandName];
        if (currentCooltime < diffTime) return true;
        return false;
    }
}

const CoolTimeError = {
    invalidCoolTime: '無効なクールタイムです。指定できるのは半角数字のみです。単位記述しないでください',
};
