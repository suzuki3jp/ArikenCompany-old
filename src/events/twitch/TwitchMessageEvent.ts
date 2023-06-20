import { PrivateMessage } from '@twurple/chat';

import { ArikenCompany, TwitchMessage, TwitchChatCommand, ChatManageCommand } from '../../structures/index';
import { LogMessages } from '../../utils/index';

export class TwitchMessageEvent {
    constructor(private client: ArikenCompany) {
        this.client.logger.system(LogMessages.LoadedTwitchMessageEvent);
    }

    async execute(channelName: string, userName: string, content: string, info: PrivateMessage) {
        const message = new TwitchMessage(this.client, channelName, content, info);
        const command = new TwitchChatCommand(this.client, message);
        this.client.logger.debug(LogMessages.SentTwitchChat(userName, channelName, content));

        await new ChatManageCommand(this.client, command).execute();
    }
}
