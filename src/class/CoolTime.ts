// nodeモジュールをインポート
import { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import { JST, Logger } from '@suzuki3jp/utils';
import { Client as Discord } from 'discord.js';

// モジュールをインポート
import { Base } from './Base';
import type { TwitchCommand } from './TwitchCommand';

export class CoolTimeManager extends Base {
    constructor(twitchClient: Twitch, discordClient: Discord, logger: Logger) {
        super(twitchClient, discordClient, logger);
    }

    currentCoolTime(): number {
        const settings = super.DM.getSettings();
        return settings.twitch.cooltime;
    }

    changeCoolTime(newCoolTime: string | number): string {
        const settings = super.DM.getSettings();
        if (!String(newCoolTime).match(/^\d+$/)) return CoolTimeError.invalidCoolTime;
        settings.twitch.cooltime = Number(newCoolTime);
        super.DM.setSettings(settings);
        return `クールタイムを${newCoolTime}秒に変更しました`;
    }

    save(twitchCommand: TwitchCommand) {
        if (twitchCommand.isVip()) return;
        const commandName = twitchCommand.command.commandName;
        const cooltimes = super.DM.getCooltime();

        cooltimes[commandName] = JST.getDate().getTime();
        super.DM.setCooltime(cooltimes);
    }

    isPassedCoolTime(twitchCommand: TwitchCommand): boolean {
        if (twitchCommand.isVip()) return true;
        const cooltimes = super.DM.getCooltime();
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
