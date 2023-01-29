"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagersManager = void 0;
// モジュールをインポート
const Base_1 = require("./Base");
class ManagersManager extends Base_1.Base {
    constructor(twitchClient, discordClient, logger) {
        super(twitchClient, discordClient, logger);
    }
    isManagersByTarget(target) {
        return super.DM.getManagers().managers.includes(target);
    }
    allow(target) {
        if (this.isManagersByTarget(target))
            return managersError.alreadyManager;
        const managers = super.DM.getManagers();
        managers.managers.push(target);
        super.DM.setManagers(managers);
        return `${target} に管理者権限を付与しました`;
    }
    deny(target) {
        if (!this.isManagersByTarget(target))
            return managersError.isNotAlreadyManager;
        const managers = super.DM.getManagers();
        const targetIndex = managers.managers.findIndex((value, index) => value === target);
        managers.managers.splice(targetIndex, 1);
        super.DM.setManagers(managers);
        return `${target} から管理者権限を剥奪しました`;
    }
}
exports.ManagersManager = ManagersManager;
const managersError = {
    alreadyManager: 'すでに管理者権限を所持しています',
    isNotAlreadyManager: '管理者権限を所持していません',
};
