// モジュールをインポート
import { Base } from './Base';

export class ManagersManager extends Base {
    constructor(base: Base) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
    }

    isManagersByTarget(target: string) {
        return this.DM.getManagers().managers.includes(target);
    }

    allow(target: string): string {
        if (this.isManagersByTarget(target)) return managersError.alreadyManager;
        const managers = this.DM.getManagers();
        managers.managers.push(target);
        this.DM.setManagers(managers);
        this.logger.info(`Added manager. ${target}`);
        return `${target} に管理者権限を付与しました`;
    }

    deny(target: string): string {
        if (!this.isManagersByTarget(target)) return managersError.isNotAlreadyManager;
        const managers = this.DM.getManagers();
        const targetIndex = managers.managers.findIndex((value, index) => value === target);
        managers.managers.splice(targetIndex, 1);
        this.DM.setManagers(managers);
        this.logger.info(`Removed manager. ${target}`);
        return `${target} から管理者権限を剥奪しました`;
    }
}

const managersError = {
    alreadyManager: 'すでに管理者権限を所持しています',
    isNotAlreadyManager: '管理者権限を所持していません',
};
