import { JSTDate } from '@suzuki3jp/utils';
import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

import type { TwitchCommand } from './TwitchCommand';

const cooltimePath = resolve(__dirname, '../data/Cooltime.json');
const settingsPath = resolve(__dirname, '../data/settings.json');

export class CoolTimeManager {
    constructor() {}

    currentCoolTime(): number {
        const settings: { twitch: { cooltime: number } } = JSON.parse(readFileSync(settingsPath, 'utf-8'));
        return settings.twitch.cooltime;
    }

    changeCoolTime(newCoolTime: string | number): string {
        const settings: { twitch: { cooltime: number } } = JSON.parse(readFileSync(settingsPath, 'utf-8'));
        if (!String(newCoolTime).match(/^\d+$/)) return CoolTimeError.invalidCoolTime;
        settings.twitch.cooltime = Number(newCoolTime);
        const newSettings = JSON.stringify(settings, null, '\t');
        writeFileSync(cooltimePath, newSettings, 'utf-8');
        return `クールタイムを${newCoolTime}秒に変更しました`;
    }

    save(twitchCommand: TwitchCommand) {
        if (twitchCommand.isVip()) return;
        const commandName = twitchCommand.command.commandName;
        const cooltimes = JSON.parse(readFileSync(cooltimePath, 'utf-8'));

        cooltimes[commandName] = JSTDate.getDate().getTime();
        const writeData = JSON.stringify(cooltimes, null, '\t');
        writeFileSync(cooltimePath, writeData, 'utf-8');
    }

    isPassedCoolTime(twitchCommand: TwitchCommand): boolean {
        if (twitchCommand.isVip()) return true;
        const cooltimes: Record<string, number> = JSON.parse(readFileSync(cooltimePath, 'utf-8'));
        if (!cooltimes[twitchCommand.command.commandName]) return true;

        const currentCooltime = this.currentCoolTime();
        const currentTime = JSTDate.getDate().getTime();
        const diffTime = currentTime - cooltimes[twitchCommand.command.commandName];
        if (currentCooltime < diffTime) return true;
        return false;
    }
}

const CoolTimeError = {
    invalidCoolTime: '無効なクールタイムです。指定できるのは半角数字のみです。単位記述しないでください',
};
