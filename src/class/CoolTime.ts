import { JST } from '@suzuki3jp/utils';
import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

import type { TwitchCommand } from './TwitchCommand';
import { SettingsJson, CooltimeJson } from '../data/JsonTypes';

const cooltimePath = resolve(__dirname, '../data/Cooltime.json');
const settingsPath = resolve(__dirname, '../data/settings.json');

export class CoolTimeManager {
    constructor() {}

    currentCoolTime(): number {
        const settings: SettingsJson = JSON.parse(readFileSync(settingsPath, 'utf-8'));
        return settings.twitch.cooltime;
    }

    changeCoolTime(newCoolTime: string | number): string {
        const settings: SettingsJson = JSON.parse(readFileSync(settingsPath, 'utf-8'));
        if (!String(newCoolTime).match(/^\d+$/)) return CoolTimeError.invalidCoolTime;
        settings.twitch.cooltime = Number(newCoolTime);
        const newSettings = JSON.stringify(settings, null, '\t');
        writeFileSync(settingsPath, newSettings, 'utf-8');
        return `クールタイムを${newCoolTime}秒に変更しました`;
    }

    save(twitchCommand: TwitchCommand) {
        if (twitchCommand.isVip()) return;
        const commandName = twitchCommand.command.commandName;
        const cooltimes: CooltimeJson = JSON.parse(readFileSync(cooltimePath, 'utf-8'));

        cooltimes[commandName] = JST.getDate().getTime();
        const writeData = JSON.stringify(cooltimes, null, '\t');
        writeFileSync(cooltimePath, writeData, 'utf-8');
    }

    isPassedCoolTime(twitchCommand: TwitchCommand): boolean {
        if (twitchCommand.isVip()) return true;
        const cooltimes: CooltimeJson = JSON.parse(readFileSync(cooltimePath, 'utf-8'));
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
