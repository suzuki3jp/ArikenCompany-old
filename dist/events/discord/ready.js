"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordReady = void 0;
// モジュールをインポート
const Command_1 = require("../../class/Command");
const DataManager_1 = require("../../class/DataManager");
const SlashCommands_1 = require("../../data/SlashCommands");
// JSON Data Manager
const DM = new DataManager_1.DataManager();
const discordReady = async (twitchClient, discordClient, logger) => {
    const settings = DM.getSettings();
    new Command_1.CommandManager(twitchClient, discordClient, logger).syncCommandPanel();
    await discordClient.application?.commands.set(SlashCommands_1.slashCommands, settings.discord.guildId);
    logger.system('discord client is ready.');
};
exports.discordReady = discordReady;
