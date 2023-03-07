"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = void 0;
const index_1 = require("./discord/index");
const index_2 = require("./twitch/index");
const events = (base, discordToken) => {
    // discord events
    base.discord.on('ready', () => (0, index_1.discordReady)(base));
    base.discord.on('messageCreate', (message) => (0, index_1.discordMessage)(base, message));
    base.discord.on('interactionCreate', (interaction) => (0, index_1.discordInteraction)(base, interaction));
    // twitch events
    base.twitch.on('ready', () => (0, index_2.twitchReady)(base));
    base.twitch.on('messageCreate', (message) => (0, index_2.twitchMessage)(base, message));
    // logger events
    base.logger.on('debug', (msg) => {
        if (process.argv.includes('--debug')) {
            console.log(msg);
        }
    });
    base.logger.on('system', (msg) => {
        console.log(msg);
        base.logger.appendToCsv(msg);
    });
    base.logger.on('info', (msg) => {
        console.log(msg);
        base.logger.appendToCsv(msg);
    });
    // client login
    base.twitch.login();
    base.discord.login(discordToken);
};
exports.events = events;
