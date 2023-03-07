// nodeモジュールをインポート
import { JST } from '@suzuki3jp/utils';

// モジュールをインポート
import { Base } from './Base';
import type { TwitchCommand } from './TwitchCommand';

export class CoolTimeManager extends Base {
    constructor(base: Base) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
    }

    currentCoolTime(): number {
        const settings = this.DM.getSettings();
        return settings.twitch.cooltime;
    }

    changeCoolTime(newCoolTime: string | number): string {
        const settings = this.DM.getSettings();
        if (!String(newCoolTime).match(/^\d+$/)) return CoolTimeError.invalidCoolTime;
        settings.twitch.cooltime = Number(newCoolTime);
        this.DM.setSettings(settings);
        return `クールタイムを${newCoolTime}秒に変更しました`;
    }

    save(twitchCommand: TwitchCommand) {
        if (twitchCommand.isVip()) return;
        const commandName = twitchCommand.command.commandName;
        const cooltimes = this.DM.getCooltime();

        cooltimes[commandName] = JST.getDate().getTime();
        this.DM.setCooltime(cooltimes);
    }

    isPassedCoolTime(twitchCommand: TwitchCommand): boolean {
        if (twitchCommand.isVip()) return true;
        const cooltimes = this.DM.getCooltime();
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
