"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = void 0;
// モジュールをインポート
const DataManager_1 = require("../class/DataManager");
const TwitchCommand_1 = require("../class/TwitchCommand");
const index_1 = require("./discord/index");
const index_2 = require("./twitch/index");
// JSON Data Manager
const DM = new DataManager_1.DataManager();
const settings = DM.getSettings();
const events = (twitchClient, discordClient, discordToken, logger) => {
    // client login
    twitchClient.login();
    discordClient.login(discordToken);
    // discord events
    discordClient.on('ready', () => (0, index_1.discordReady)(twitchClient, discordClient, logger));
    discordClient.on('messageCreate', (message) => (0, index_1.discordMessage)(twitchClient, discordClient, logger, message));
    discordClient.on('interactionCreate', (interaction) => (0, index_1.discordInteraction)(twitchClient, discordClient, logger, interaction));
    // twitch events
    twitchClient.on('ready', () => (0, index_2.twitchReady)(twitchClient, logger));
    twitchClient.on('messageCreate', (message) => (0, index_2.twitchMessage)(new TwitchCommand_1.TwitchCommand(twitchClient, discordClient, message, logger), message));
};
exports.events = events;
