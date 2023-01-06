import { CoolTimeManager } from './CoolTime';
import type { TwitchCommand } from './TwitchCommand';

import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

const managersPath = resolve(__dirname, '../data/Managers.json');

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
    alreadyManager: 'すでに管理者権限を所持しています',
    isNotAlreadyManager: '管理者権限を所持していません',
};
