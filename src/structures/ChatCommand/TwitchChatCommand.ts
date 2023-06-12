import { ArikenCompany } from '../ArikenCompany/ArikenCompany';
import { TwitchMessage } from '../twitch/TwitchMessage';
import { BaseChatCommand } from './BaseChatCommand';

export class TwitchChatCommand extends BaseChatCommand {
    constructor(client: ArikenCompany, message: TwitchMessage) {
        super(client, message);
    }
}
