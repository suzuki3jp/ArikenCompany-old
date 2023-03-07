"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoolTimeManager = void 0;
// nodeモジュールをインポート
const utils_1 = require("@suzuki3jp/utils");
// モジュールをインポート
const Base_1 = require("./Base");
class CoolTimeManager extends Base_1.Base {
    constructor(base) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
    }
    currentCoolTime() {
        const settings = this.DM.getSettings();
        return settings.twitch.cooltime;
    }
    changeCoolTime(newCoolTime) {
        const settings = this.DM.getSettings();
        if (!String(newCoolTime).match(/^\d+$/))
            return CoolTimeError.invalidCoolTime;
        settings.twitch.cooltime = Number(newCoolTime);
        this.DM.setSettings(settings);
        return `クールタイムを${newCoolTime}秒に変更しました`;
    }
    save(twitchCommand) {
        if (twitchCommand.isVip())
            return;
        const commandName = twitchCommand.command.commandName;
        const cooltimes = this.DM.getCooltime();
        cooltimes[commandName] = utils_1.JST.getDate().getTime();
        this.DM.setCooltime(cooltimes);
    }
    isPassedCoolTime(twitchCommand) {
        if (twitchCommand.isVip())
            return true;
        const cooltimes = this.DM.getCooltime();
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
