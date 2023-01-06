import { TwitchClient, Message } from '@suzuki3jp/twitch.js';
import type { Logger } from '@suzuki3jp/utils';

import { TwitchCommand } from '../../class/TwitchCommand';
import { ValueParser } from '../../class/ValueParser';
import { twitch } from '../../data/settings.json';

export const twitchMessage = async (client: TwitchClient, logger: Logger, message: Message) => {
    const reply = message.reply;
    const twitchCommand = new TwitchCommand(client, message, twitch.manageCommands);

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
            reply(twitchCommand.removeCom());
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
        twitchCommand.saveCooltime();
        const commandValue = twitchCommand.commandValue();
        if (!commandValue) return;
        const valueParser = new ValueParser();
        const valueParseResult = await valueParser.parse(commandValue, message);
        if (valueParseResult.status !== 200) return;
        message.channel.send(valueParseResult.content);
    }
};
