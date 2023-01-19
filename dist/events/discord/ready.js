"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordReady = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
// モジュールをインポート
const Command_1 = require("../../class/Command");
const SlashCommands_1 = require("../../data/SlashCommands");
// paths
const settingsPath = (0, path_1.resolve)(__dirname, '../../data/settings.json');
const discordReady = async (client, logger) => {
    const settings = JSON.parse((0, fs_1.readFileSync)(settingsPath, 'utf-8'));
    new Command_1.CommandManager().syncCommandPanel(client);
    await client.application?.commands.set(SlashCommands_1.slashCommands, settings.discord.guildId);
    logger.system('discord client is ready.');
};
exports.discordReady = discordReady;
