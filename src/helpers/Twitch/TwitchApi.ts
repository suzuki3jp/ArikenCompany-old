import { ApiClient, HelixUser } from '@twurple/api';

import { TwitchAuth } from '@/helpers/Twitch/TwitchAuth';

export class TwitchApi extends ApiClient {
    constructor(public auth: TwitchAuth) {
        super({ authProvider: auth });
    }

    async getUserById(id: string): Promise<HelixUser | null> {
        return await this.users.getUserById(id);
    }
}
