// モジュールをインポート
import { CoolTimeManager } from './CoolTime';
import { DataManager } from './DataManager';

// JSON Data Manager
const DM = new DataManager();

export class CommandManagersManager extends CoolTimeManager {
    constructor() {
        super();
    }

    isManagersByTarget(target: string) {
        const managersData = DM.getManagers();
        if (managersData.managers.includes(target)) return true;
        return false;
    }

    currentCommandStatus(): boolean {
        const settings = DM.getSettings();
        return settings.twitch.command;
    }

    on(): string {
        const settings = DM.getSettings();
        if (settings.twitch.command) return managersError.alreadyOn;
        settings.twitch.command = true;
        DM.setSettings(settings);
        return 'コマンドを有効にしました';
    }

    off(): string {
        const settings = DM.getSettings();
        if (!settings.twitch.command) return managersError.alreadyOff;
        settings.twitch.command = false;
        DM.setSettings(settings);
        return 'コマンドを無効にしました';
    }

    allow(target: string): string {
        if (this.isManagersByTarget(target)) return managersError.alreadyManager;
        const managers = DM.getManagers();
        managers.managers.push(target);
        DM.setManagers(managers);
        return `${target} に管理者権限を付与しました`;
    }

    deny(target: string): string {
        if (!this.isManagersByTarget(target)) return managersError.isNotAlreadyManager;
        const managers = DM.getManagers();
        const targetIndex = managers.managers.findIndex((value, index) => value === target);
        managers.managers.splice(targetIndex, 1);
        DM.setManagers(managers);
        return `${target} から管理者権限を剥奪しました`;
    }
}

const managersError = {
    alreadyOn: 'すでにコマンドは有効です',
    alreadyOff: 'すでにコマンドは無効です',
    alreadyManager: 'すでに管理者権限を所持しています',
    isNotAlreadyManager: '管理者権限を所持していません',
};
