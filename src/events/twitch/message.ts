// モジュールをインポート
import { ArikenCompany } from '../../ArikenCompany';
import { TwitchCommand } from '../../class/TwitchCommand';
import { ValueParser } from '../../class/ValueParser';
import { Message } from '../../twitchjs/index';

export const twitchMessage = async (app: ArikenCompany, message: Message) => {
    const twitchCommand = new TwitchCommand(app, message);
    const reply = (content: string) => {
        message.reply(content);
    };
    twitchCommand.countMessage();
    if (!twitchCommand.isCommand()) return;
    if (twitchCommand.isManageCommand()) {
        if (!twitchCommand.isManager()) return;
        const manageCommandName = twitchCommand.manageCommandName();

        if (manageCommandName === '!oncom') {
            reply(twitchCommand.onCom());
        } else if (manageCommandName === '!offcom') {
            reply(twitchCommand.offCom());
        } else if (manageCommandName === '!addcom') {
            reply(await twitchCommand.addCom());
        } else if (manageCommandName === '!editcom') {
            reply(await twitchCommand.editCom());
        } else if (manageCommandName === '!rmcom') {
            reply(await twitchCommand.removeCom());
        } else if (manageCommandName === '!allow') {
            reply(twitchCommand.allow());
        } else if (manageCommandName === '!deny') {
            reply(twitchCommand.deny());
        } else if (manageCommandName === '!cooltime') {
            reply(twitchCommand.coolTime());
        } else if (manageCommandName === '!setcooltime') {
            reply(twitchCommand.changeCoolTime());
        }
    } else {
        if (!twitchCommand.isOnCom()) return;
        if (!twitchCommand.isPassedCooltime()) return;
        const commandValue = twitchCommand.commandValue();
        if (!commandValue) return;
        twitchCommand.saveCooltime();
        const valueParser = new ValueParser(app);
        const valueParseResult = await valueParser.parse(commandValue, message);
        if (!valueParseResult || valueParseResult.error) return;
        message.channel.send(valueParseResult.parsed);
    }
};
