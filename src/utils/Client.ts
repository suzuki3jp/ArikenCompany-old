// nodeモジュールをインポート
import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import { Logger } from '@suzuki3jp/logger';
import { Client as Discord, ClientOptions as DiscordClientOptions, Intents } from 'discord.js';

// モジュールをインポート
import { DataManager } from '../class/DataManager';
import { dotenv } from './Env';
import { DotEnv } from '../class/JsonTypes';

const DM = new DataManager();

export const createClients = async (
    logger: Logger
): Promise<{
    twitch: { chat: ChatClient; api: ApiClient; eventSub: EventSubWsListener };
    discord: {
        client: Discord;
        token: string;
    };
}> => {
    const { TWITCH_CLIENTID, TWITCH_CLIENTSECRET, TWITCH_TOKEN, TWITCH_REFRESHTOKEN, DISCORD_TOKEN } = dotenv();
    const {
        twitch: { channels },
    } = DM.getSettings();

    // twitch clients
    const auth = new RefreshingAuthProvider({
        clientId: TWITCH_CLIENTID,
        clientSecret: TWITCH_CLIENTSECRET,
        onRefresh: (userId, newTokens) => {
            if (!newTokens.refreshToken) throw new Error('Twitch token refresh error.');
            const newEnv: DotEnv = {
                TWITCH_CLIENTID,
                TWITCH_CLIENTSECRET,
                TWITCH_REFRESHTOKEN: newTokens.refreshToken,
                TWITCH_TOKEN: newTokens.accessToken,
                DISCORD_TOKEN,
            };
            DM.setEnv(newEnv);
            logger.info('Twitch token has been refreshed.');
        },
    });
    await auth.addUserForToken({
        accessToken: TWITCH_TOKEN,
        refreshToken: TWITCH_REFRESHTOKEN,
        expiresIn: 0,
        obtainmentTimestamp: 0,
    });
    const twitchApi = new ApiClient({ authProvider: auth });
    const twitchChat = new ChatClient({ authProvider: auth, channels });
    const twitchEventSub = new EventSubWsListener({ apiClient: twitchApi });

    // discord client
    const discordClient = new Discord({ intents: Object.values(Intents.FLAGS) });

    return {
        twitch: { chat: twitchChat, api: twitchApi, eventSub: twitchEventSub },
        discord: { client: discordClient, token: DISCORD_TOKEN },
    };
};
