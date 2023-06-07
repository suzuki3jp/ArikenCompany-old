// nodeモジュールをインポート
import dayjs from 'dayjs';

// モジュールをインポート
import type { TwitchCommand } from './TwitchCommand';
import { CommandManager } from './Command';
import { ArikenCompany } from '../ArikenCompany';

export class CoolTimeManager extends ArikenCompany {
    public _commandManager: CommandManager;

    constructor(app: ArikenCompany) {
        super(app);
        this._commandManager = new CommandManager(this);
    }

    currentCoolTime(): number {
        const settings = this.DM.getSettings();
        return settings.twitch.cooltime;
    }

    changeCoolTime(newCoolTime: string | number): string {
        const settings = this.DM.getSettings();
        if (!String(newCoolTime).match(/^\d+$/)) return CoolTimeError.invalidCoolTime;
        settings.twitch.cooltime = Number(newCoolTime);
        this.DM.setSettings(settings);
        this.logger.info(`Cooltime has been changed ${newCoolTime} seconds.`);
        return `クールタイムを${newCoolTime}秒に変更しました`;
    }

    save(twitchCommand: TwitchCommand) {
        const commandName = twitchCommand.command.commandName;
        this._commandManager.updateLastUsedAt(commandName);
    }

    isPassedCoolTime(twitchCommand: TwitchCommand): boolean {
        if (twitchCommand.isVip()) return true;
        const { commandName } = twitchCommand.command;
        const command = this._commandManager.getCommandByName(commandName);
        if (!command) return true;

        const currentCooltime = this.currentCoolTime() * 1000;
        const currentDate = dayjs();
        const lastUsedDate = dayjs(command.last_used_at);
        const diffMilliSeconds = currentDate.diff(lastUsedDate);
        if (currentCooltime < diffMilliSeconds) return true;
        return false;
    }
}

const CoolTimeError = {
    invalidCoolTime: '無効なクールタイムです。指定できるのは半角数字のみです。単位記述しないでください',
};
