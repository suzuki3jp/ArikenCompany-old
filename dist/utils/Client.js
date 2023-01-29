"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClients = void 0;
const twitch_js_1 = require("@suzuki3jp/twitch.js");
const utils_1 = require("@suzuki3jp/utils");
const discord_js_1 = require("discord.js");
// モジュールをインポート
const DataManager_1 = require("../class/DataManager");
const DM = new DataManager_1.DataManager();
// 環境変数を変数に代入
const twitchToken = process.env.TWITCH_TOKEN;
const twitchRefreshToken = process.env.TWITCH_REFRESHTOKEN;
const twitchClientId = process.env.TWITCH_CLIENTID;
const twitchClientSecret = process.env.TWITCH_CLIENTSECRET;
const discordToken = process.env.DISCORD_TOKEN;
const createClients = (logger) => {
    if (!discordToken)
        throw new utils_1.CustomError('ENV_ERROR', '.env content is invalid.');
    return { twitch: createTwitchClient(logger), discord: { client: createDiscordClient(), token: discordToken } };
};
exports.createClients = createClients;
const createTwitchClient = (logger) => {
    const { authConfig, options } = createTwitchClientOptions(logger);
    return new twitch_js_1.TwitchClient(authConfig, options);
};
const createDiscordClient = () => {
    return new discord_js_1.Client(createDiscordClientOptions());
};
const createTwitchClientOptions = (logger) => {
    if (twitchToken && twitchClientId && twitchClientSecret && twitchRefreshToken && discordToken) {
        const onRefresh = (tokenInfo) => {
            const newToken = tokenInfo.accessToken;
            const newRefreshToken = tokenInfo.refreshToken;
            const envDataObj = {
                TWITCH_TOKEN: newToken,
                TWITCH_REFRESHTOKEN: newRefreshToken,
                TWITCH_CLIENTID: twitchClientId,
                TWITCH_CLIENTSECRET: twitchClientSecret,
                DISCORD_TOKEN: discordToken,
            };
            const newEnvData = utils_1.Env.parseToEnv(envDataObj);
            DM.setEnv(newEnvData);
            logger.info('Twitchのトークンがリフレッシュされました');
        };
        const authConfig = {
            accessToken: twitchToken,
            refreshToken: twitchRefreshToken,
            clientId: twitchClientId,
            clientSecret: twitchClientSecret,
            onRefresh,
        };
        return { authConfig, options: { channels: DM.getSettings().twitch.channels } };
    }
    else {
        throw new utils_1.CustomError('ENV_ERROR', '.env content is invalid.');
    }
};
const createDiscordClientOptions = () => {
    return { intents: Object.values(discord_js_1.Intents.FLAGS) };
};
