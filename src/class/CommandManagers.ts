import { CoolTimeManager } from './CoolTime';
import type { TwitchCommand } from './TwitchCommand';

import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

const managersPath = resolve(__dirname, '../data/Managers.json');
const settingsPath = resolve(__dirname, '../data/settings.json');

export class CommandManagersManager extends CoolTimeManager {
    constructor() {
        super();
    }

    isManagersByTarget(target: string) {
        const managersData: { managers: string[] } = JSON.parse(
            readFileSync(managersPath, {
                encoding: 'utf-8',
            })
        );
        if (managersData.managers.includes(target)) return true;
        return false;
    }

    currentCommandStatus(): boolean {
        const settings: { twitch: { command: boolean } } = JSON.parse(
            readFileSync(settingsPath, { encoding: 'utf-8' })
        );
        return settings.twitch.command;
    }

    on(): string {
        const settings: { twitch: { command: boolean } } = JSON.parse(
            readFileSync(settingsPath, { encoding: 'utf-8' })
        );
        if (settings.twitch.command) return managersError.alreadyOn;
        settings.twitch.command = true;
        const newSettings = JSON.stringify(settings, null, '\t');
        writeFileSync(settingsPath, newSettings, { encoding: 'utf-8' });
        return 'コマンドを有効にしました';
    }

    off(): string {
        const settings: { twitch: { command: boolean } } = JSON.parse(
            readFileSync(settingsPath, { encoding: 'utf-8' })
        );
        if (!settings.twitch.command) return managersError.alreadyOff;
        settings.twitch.command = false;
        const newSettings = JSON.stringify(settings, null, '\t');
        writeFileSync(settingsPath, newSettings, { encoding: 'utf-8' });
        return 'コマンドを無効にしました';
    }

    allow(twitchCommand: TwitchCommand, target: string): string {
        if (this.isManagersByTarget(target)) return managersError.alreadyManager;
        const managers: { managers: string[] } = JSON.parse(readFileSync(managersPath, { encoding: 'utf-8' }));
        managers.managers.push(target);
        const newManagersData = JSON.stringify(managers, null, '\t');
        writeFileSync(managersPath, newManagersData, { encoding: 'utf-8' });
        return `${target} に管理者権限を付与しました`;
    }

    deny(twitchCommand: TwitchCommand, target: string): string {
        if (!this.isManagersByTarget(target)) return managersError.isNotAlreadyManager;
        const managers: { managers: string[] } = JSON.parse(readFileSync(managersPath, { encoding: 'utf-8' }));
        const targetIndex = managers.managers.findIndex((value, index) => value === target);
        managers.managers.splice(targetIndex, 1);
        const newManagersData = JSON.stringify(managers, null, '\t');
        writeFileSync(managersPath, newManagersData, { encoding: 'utf-8' });
        return `${target} から管理者権限を剥奪しました`;
    }
}

const managersError = {
    alreadyOn: 'すでにコマンドは有効です',
    alreadyOff: 'すでにコマンドは無効です',
    alreadyManager: 'すでに管理者権限を所持しています',
    isNotAlreadyManager: '管理者権限を所持していません',
};
