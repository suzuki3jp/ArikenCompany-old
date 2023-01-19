"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManagersManager = void 0;
// nodeモジュールをインポート
const fs_1 = require("fs");
const path_1 = require("path");
// モジュールをインポート
const CoolTime_1 = require("./CoolTime");
const managersPath = (0, path_1.resolve)(__dirname, '../data/Managers.json');
const settingsPath = (0, path_1.resolve)(__dirname, '../data/settings.json');
class CommandManagersManager extends CoolTime_1.CoolTimeManager {
    constructor() {
        super();
    }
    isManagersByTarget(target) {
        const managersData = JSON.parse((0, fs_1.readFileSync)(managersPath, {
            encoding: 'utf-8',
        }));
        if (managersData.managers.includes(target))
            return true;
        return false;
    }
    currentCommandStatus() {
        const settings = JSON.parse((0, fs_1.readFileSync)(settingsPath, 'utf-8'));
        return settings.twitch.command;
    }
    on() {
        const settings = JSON.parse((0, fs_1.readFileSync)(settingsPath, 'utf-8'));
        if (settings.twitch.command)
            return managersError.alreadyOn;
        settings.twitch.command = true;
        const newSettings = JSON.stringify(settings, null, '\t');
        (0, fs_1.writeFileSync)(settingsPath, newSettings, 'utf-8');
        return 'コマンドを有効にしました';
    }
    off() {
        const settings = JSON.parse((0, fs_1.readFileSync)(settingsPath, 'utf-8'));
        if (!settings.twitch.command)
            return managersError.alreadyOff;
        settings.twitch.command = false;
        const newSettings = JSON.stringify(settings, null, '\t');
        (0, fs_1.writeFileSync)(settingsPath, newSettings, 'utf-8');
        return 'コマンドを無効にしました';
    }
    allow(target) {
        if (this.isManagersByTarget(target))
            return managersError.alreadyManager;
        const managers = JSON.parse((0, fs_1.readFileSync)(managersPath, 'utf-8'));
        managers.managers.push(target);
        const newManagersData = JSON.stringify(managers, null, '\t');
        (0, fs_1.writeFileSync)(managersPath, newManagersData, 'utf-8');
        return `${target} に管理者権限を付与しました`;
    }
    deny(target) {
        if (!this.isManagersByTarget(target))
            return managersError.isNotAlreadyManager;
        const managers = JSON.parse((0, fs_1.readFileSync)(managersPath, 'utf-8'));
        const targetIndex = managers.managers.findIndex((value, index) => value === target);
        managers.managers.splice(targetIndex, 1);
        const newManagersData = JSON.stringify(managers, null, '\t');
        (0, fs_1.writeFileSync)(managersPath, newManagersData, 'utf-8');
        return `${target} から管理者権限を剥奪しました`;
    }
}
exports.CommandManagersManager = CommandManagersManager;
const managersError = {
    alreadyOn: 'すでにコマンドは有効です',
    alreadyOff: 'すでにコマンドは無効です',
    alreadyManager: 'すでに管理者権限を所持しています',
    isNotAlreadyManager: '管理者権限を所持していません',
};
