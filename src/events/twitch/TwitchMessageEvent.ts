import { PrivateMessage } from '@twurple/chat';

import { ArikenCompany, TwitchMessage, TwitchChatCommand } from '../../structures/index';

export class TwitchMessageEvent {
    constructor(private client: ArikenCompany) {
        this.client.logger.system('Loaded Twitch message event.');
    }

    execute(channelName: string, userName: string, content: string, info: PrivateMessage) {
        const message = new TwitchMessage(this.client, channelName, content, info);
        const command = new TwitchChatCommand(this.client, message);
        this.client.logger.debug(
            `Twitch chat sent by ${message.user.name} in ${message.channel.name}. ${message.content}`
        );
    }
}
