"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoolTimeManager = void 0;
// nodeモジュールをインポート
const dayjs_1 = __importDefault(require("dayjs"));
// モジュールをインポート
const Base_1 = require("./Base");
const Command_1 = require("./Command");
class CoolTimeManager extends Base_1.Base {
    _commandManager;
    constructor(base) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this._commandManager = new Command_1.CommandManager(this);
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
        this.logger.info(`Cooltime has been changed ${newCoolTime} seconds.`);
        return `クールタイムを${newCoolTime}秒に変更しました`;
    }
    save(twitchCommand) {
        const commandName = twitchCommand.command.commandName;
        this._commandManager.updateLastUsedAt(commandName);
    }
    isPassedCoolTime(twitchCommand) {
        if (twitchCommand.isVip())
            return true;
        const { commandName } = twitchCommand.command;
        const command = this._commandManager.getCommandByName(commandName);
        if (!command)
            return true;
        const currentCooltime = this.currentCoolTime() * 1000;
        const currentDate = (0, dayjs_1.default)();
        const lastUsedDate = (0, dayjs_1.default)(command.last_used_at);
        const diffMilliSeconds = currentDate.diff(lastUsedDate);
        if (currentCooltime < diffMilliSeconds)
            return true;
        return false;
    }
}
exports.CoolTimeManager = CoolTimeManager;
const CoolTimeError = {
    invalidCoolTime: '無効なクールタイムです。指定できるのは半角数字のみです。単位記述しないでください',
};
