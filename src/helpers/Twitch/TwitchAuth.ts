import { RefreshingAuthProvider } from '@twurple/auth';

import { ArikenCompany } from '@/ArikenCompany';
import { makeError, ErrorMessages } from '@/helpers/errors/ArikenCompanyError';
import { LogMessages, Logger } from '@/helpers/Logger/Logger';

export class TwitchAuth extends RefreshingAuthProvider {
    private logger: Logger;
    constructor(private client: ArikenCompany) {
        const { dotenv } = client;
        const logger = client.logger.createChild('TwitchAuth');

        super({
            clientId: dotenv.cache.TWITCH_CLIENTID,
            clientSecret: dotenv.cache.TWITCH_CLIENTSECRET,
            onRefresh: (userId, newTokens) => {
                if (!newTokens.refreshToken) throw makeError(ErrorMessages.TwitchTokenRefreshFailed);

                client.dotenv.set('TWITCH_TOKEN', newTokens.accessToken);
                client.dotenv.set('TWITCH_REFRESHTOKEN', newTokens.refreshToken);

                logger.info(LogMessages.refreshedTwitchToken);
            },
        });
        this.logger = logger;
    }

    private async addToken(): Promise<string> {
        const { dotenv } = this.client;
        const userId = await this.addUserForToken(
            {
                accessToken: dotenv.cache.TWITCH_TOKEN,
                refreshToken: dotenv.cache.TWITCH_REFRESHTOKEN,
                expiresIn: 0,
                obtainmentTimestamp: 0,
            },
            ['chat']
        );
        this.logger.info(LogMessages.addedToken(userId));
        return userId;
    }

    public static async build(client: ArikenCompany): Promise<TwitchAuth> {
        const auth = new TwitchAuth(client);
        await auth.addToken();
        return auth;
    }
}
