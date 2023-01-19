"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoolTimeManager = void 0;
// nodeモジュールをインポート
const utils_1 = require("@suzuki3jp/utils");
const fs_1 = require("fs");
const path_1 = require("path");
const cooltimePath = (0, path_1.resolve)(__dirname, '../data/Cooltime.json');
const settingsPath = (0, path_1.resolve)(__dirname, '../data/settings.json');
class CoolTimeManager {
    constructor() { }
    currentCoolTime() {
        const settings = JSON.parse((0, fs_1.readFileSync)(settingsPath, 'utf-8'));
        return settings.twitch.cooltime;
    }
    changeCoolTime(newCoolTime) {
        const settings = JSON.parse((0, fs_1.readFileSync)(settingsPath, 'utf-8'));
        if (!String(newCoolTime).match(/^\d+$/))
            return CoolTimeError.invalidCoolTime;
        settings.twitch.cooltime = Number(newCoolTime);
        const newSettings = JSON.stringify(settings, null, '\t');
        (0, fs_1.writeFileSync)(settingsPath, newSettings, 'utf-8');
        return `クールタイムを${newCoolTime}秒に変更しました`;
    }
    save(twitchCommand) {
        if (twitchCommand.isVip())
            return;
        const commandName = twitchCommand.command.commandName;
        const cooltimes = JSON.parse((0, fs_1.readFileSync)(cooltimePath, 'utf-8'));
        cooltimes[commandName] = utils_1.JST.getDate().getTime();
        const writeData = JSON.stringify(cooltimes, null, '\t');
        (0, fs_1.writeFileSync)(cooltimePath, writeData, 'utf-8');
    }
    isPassedCoolTime(twitchCommand) {
        if (twitchCommand.isVip())
            return true;
        const cooltimes = JSON.parse((0, fs_1.readFileSync)(cooltimePath, 'utf-8'));
        if (!cooltimes[twitchCommand.command.commandName])
            return true;
        const currentCooltime = this.currentCoolTime() * 1000;
        const currentTime = utils_1.JST.getDate().getTime();
        const diffTime = currentTime - cooltimes[twitchCommand.command.commandName];
        if (currentCooltime < diffTime)
            return true;
        return false;
    }
}
exports.CoolTimeManager = CoolTimeManager;
const CoolTimeError = {
    invalidCoolTime: '無効なクールタイムです。指定できるのは半角数字のみです。単位記述しないでください',
};
