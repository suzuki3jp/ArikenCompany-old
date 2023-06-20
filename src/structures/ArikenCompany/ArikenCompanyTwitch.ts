import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';

import { ArikenCompany } from './ArikenCompany';
import { TwitchReadyEvent, TwitchMessageEvent } from '../../events/twitch/index';
import { LogMessages } from '../../utils';

export class ArikenCompanyTwitch {
    private client: ArikenCompany;

    public auth: RefreshingAuthProvider;
    public api: ApiClient;
    public chat: ChatClient;

    constructor(client: ArikenCompany) {
        this.client = client;

        this.auth = new RefreshingAuthProvider({
            clientId: this.client.dotenv.TWITCH_CLIENTID,
            clientSecret: this.client.dotenv.TWITCH_CLIENTSECRET,
            onRefresh: (userId, token) => {
                if (!token.refreshToken) throw new Error(LogMessages.TokenRefreshFailed);
                this.client.dotenv.TWITCH_TOKEN = token.accessToken;
                this.client.dotenv.TWITCH_REFRESHTOKEN = token.refreshToken;
                this.client.dotenv.save();
                this.client.logger.info(LogMessages.TokenRefreshed);
            },
        });
        this.api = new ApiClient({ authProvider: this.auth });
        this.chat = new ChatClient({ authProvider: this.auth, channels: this.client.settings.cache.twitch.channels });
    }

    eventsLoad() {
        this.chat.onConnect((...args) => new TwitchReadyEvent(this.client).execute(...args));
        this.chat.onMessage((...args) => new TwitchMessageEvent(this.client).execute(...args));
        this.client.logger.system(LogMessages.LoadedTwitchEvents);
    }

    async start() {
        await this.auth.addUserForToken(
            {
                accessToken: this.client.dotenv.TWITCH_TOKEN,
                refreshToken: this.client.dotenv.TWITCH_REFRESHTOKEN,
                expiresIn: 0,
                obtainmentTimestamp: 0,
            },
            ['chat']
        );
        this.eventsLoad();
        await this.chat.connect();
        this.client.logger.system(LogMessages.StartedTwitch);
    }

    async say(channel: string, content: string, replyTo?: string): Promise<void> {
        await this.chat.say(channel, content, { replyTo });
    }
}
