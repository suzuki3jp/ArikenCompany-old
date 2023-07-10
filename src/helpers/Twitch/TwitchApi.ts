import { ApiClient } from '@twurple/api';

import { TwitchAuth } from '@/helpers/Twitch/TwitchAuth';

export class TwitchApi extends ApiClient {
    constructor(public auth: TwitchAuth) {
        super({ authProvider: auth });
    }
}
