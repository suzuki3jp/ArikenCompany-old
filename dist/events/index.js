"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsIndex = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
// モジュールをインポート
const Router_1 = require("../api/Router");
const TwitchCommand_1 = require("../class/TwitchCommand");
const index_1 = require("./discord/index");
const index_2 = require("./twitch/index");
const settingsPath = (0, path_1.resolve)(__dirname, '../data/settings.json');
const settings = JSON.parse((0, fs_1.readFileSync)(settingsPath, 'utf-8'));
const eventsIndex = (api, twitchClient, discordClient, discordToken, logger) => {
    // client login
    twitchClient.login();
    discordClient.login(discordToken);
    api.server.listen(settings.api.port, () => {
        logger.system(`api is ready. listening at http://localhost:${settings.api.port}/`);
    });
    api.app.use('/', Router_1.router);
    // discord events
    discordClient.on('ready', () => (0, index_1.discordReady)(discordClient, logger));
    discordClient.on('messageCreate', (message) => (0, index_1.discordMessage)(discordClient, message));
    discordClient.on('interactionCreate', (interaction) => (0, index_1.discordInteraction)(discordClient, interaction));
    // twitch events
    twitchClient.on('ready', () => (0, index_2.twitchReady)(twitchClient, logger));
    twitchClient.on('messageCreate', (message) => (0, index_2.twitchMessage)(new TwitchCommand_1.TwitchCommand(twitchClient, discordClient, message, settings.twitch.manageCommands), message));
};
exports.eventsIndex = eventsIndex;
