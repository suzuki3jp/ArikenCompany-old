// nodeモジュールをインポート
import type { AccessToken } from '@twurple/auth';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import { TwitchClient as Twitch, AuthConfig, ClientOptions as TwitchClientOptions } from '@suzuki3jp/twitch.js';
import { CustomError, Env } from '@suzuki3jp/utils';
import { Logger } from '@suzuki3jp/logger';
import { Client as Discord, ClientOptions as DiscordClientOptions, Intents } from 'discord.js';

// モジュールをインポート
import { DataManager } from '../class/DataManager';

const DM = new DataManager();

// 環境変数を変数に代入
const twitchToken = process.env.TWITCH_TOKEN;
const twitchRefreshToken = process.env.TWITCH_REFRESHTOKEN;
const twitchClientId = process.env.TWITCH_CLIENTID;
const twitchClientSecret = process.env.TWITCH_CLIENTSECRET;
const discordToken = process.env.DISCORD_TOKEN;

export const createClients = (
    logger: Logger
): { twitch: Twitch; eventSub: EventSubWsListener; discord: { client: Discord; token: string } } => {
    if (!discordToken) throw new CustomError('ENV_ERROR', '.env content is invalid.');
    const twitch = createTwitchClient(logger);
    return {
        twitch,
        eventSub: createEventSubClient(twitch),
        discord: { client: createDiscordClient(), token: discordToken },
    };
};

const createTwitchClient = (logger: Logger): Twitch => {
    const { authConfig, options } = createTwitchClientOptions(logger);
    return new Twitch(authConfig, options);
};

const createDiscordClient = (): Discord => {
    return new Discord(createDiscordClientOptions());
};

const createEventSubClient = (twitchClient: Twitch) => {
    return new EventSubWsListener({ apiClient: twitchClient._api });
};

const createTwitchClientOptions = (logger: Logger): { authConfig: AuthConfig; options: TwitchClientOptions } => {
    if (twitchToken && twitchClientId && twitchClientSecret && twitchRefreshToken && discordToken) {
        const onRefresh = (tokenInfo: AccessToken) => {
            const newToken = tokenInfo.accessToken;
            const newRefreshToken = tokenInfo.refreshToken;
            const envDataObj = {
                TWITCH_TOKEN: newToken,
                TWITCH_REFRESHTOKEN: newRefreshToken,
                TWITCH_CLIENTID: twitchClientId,
                TWITCH_CLIENTSECRET: twitchClientSecret,
                DISCORD_TOKEN: discordToken,
            };
            const newEnvData = Env.parseToEnv(envDataObj);

            DM.setEnv(newEnvData);
            logger.emitLog('system', 'Twitchのトークンがリフレッシュされました');
        };

        const authConfig: AuthConfig = {
            accessToken: twitchToken,
            refreshToken: twitchRefreshToken,
            clientId: twitchClientId,
            clientSecret: twitchClientSecret,
            onRefresh,
        };
        return { authConfig, options: { channels: DM.getSettings().twitch.channels } };
    } else {
        throw new CustomError('ENV_ERROR', '.env content is invalid.');
    }
};

const createDiscordClientOptions = (): DiscordClientOptions => {
    return { intents: Object.values(Intents.FLAGS) };
};
