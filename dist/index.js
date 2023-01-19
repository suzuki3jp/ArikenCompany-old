"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// nodeモジュールをインポート
const utils_1 = require("@suzuki3jp/utils");
const dotenv_1 = __importDefault(require("dotenv"));
const discord_js_1 = require("discord.js");
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// モジュールをインポート
const twitch_js_1 = require("@suzuki3jp/twitch.js");
const settings_json_1 = require("./data/settings.json");
const index_1 = require("./events/index");
dotenv_1.default.config();
const twitchToken = process.env.TWITCH_TOKEN;
const twitchRefreshToken = process.env.TWITCH_REFRESHTOKEN;
const twitchClientId = process.env.TWITCH_CLIENTID;
const twitchClientSecret = process.env.TWITCH_CLIENTSECRET;
const discordToken = process.env.DISCORD_TOKEN;
const loggerOptions = {
    isSaveLogToCsv: true,
    logFilePath: path_1.default.resolve(__dirname, './data/log/log.csv'),
};
const logger = new utils_1.Logger(loggerOptions);
// .env
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
        (0, fs_1.writeFileSync)(path_1.default.resolve(__dirname, '../.env'), newEnvData, 'utf-8');
        logger.info('twitch token on resfresh.');
    };
    // initial function
    (async () => {
        const authConfig = {
            accessToken: twitchToken,
            refreshToken: twitchRefreshToken,
            clientId: twitchClientId,
            clientSecret: twitchClientSecret,
            onRefresh,
        };
        const twitchOptions = { channels: settings_json_1.twitch.channels };
        const discordOptions = {
            intents: Object.values(discord_js_1.Intents.FLAGS),
        };
        const twitchClient = new twitch_js_1.TwitchClient(authConfig, twitchOptions);
        const discordClient = new discord_js_1.Client(discordOptions);
        const apiServer = https_1.default.createServer({
            key: (0, fs_1.readFileSync)(`/etc/letsencrypt/live/suzuki-dev.com-0001/privkey.pem`),
            cert: (0, fs_1.readFileSync)(`/etc/letsencrypt/live/suzuki-dev.com-0001/cert.pem`),
        }, app);
        (0, index_1.eventsIndex)({ server: apiServer, app }, twitchClient, discordClient, discordToken, logger);
    })();
}
else {
    throw new utils_1.CustomError('ENV_ERROR', 'environment variables are invalid.');
}
