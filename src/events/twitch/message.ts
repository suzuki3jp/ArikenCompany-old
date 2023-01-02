import { TwitchClient, Message } from '@suzuki3jp/twitch.js';
import type { Logger } from '@suzuki3jp/utils';

import { TwitchCommand } from '../../class/TwitchCommand';
import { twitch } from '../../data/settings.json';

export const twitchMessage = async (client: TwitchClient, logger: Logger, message: Message) => {
    const twitchCommand = new TwitchCommand(client, message, twitch.manageCommands);

    twitchCommand.countMessage();
    if (!twitchCommand.isCommand()) return;
    if (twitchCommand.isManageCommand()) {
        if (!twitchCommand.isManager()) return;
        const manageCommandName = twitchCommand.manageCommandName();

        if (manageCommandName === '!addcom') {
            message.reply(await twitchCommand.addCom());
        }

        if (manageCommandName === '!editcom') {
            message.reply(await twitchCommand.editCom());
        }

        if (manageCommandName === '!rmcom') {
            message.reply(twitchCommand.removeCom());
        }
    } else {
    }
};
