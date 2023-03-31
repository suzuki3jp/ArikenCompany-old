"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordReady = void 0;
const Command_1 = require("../../class/Command");
const SlashCommands_1 = require("../../class/SlashCommands");
const discordReady = async (base) => {
    const settings = base.DM.getSettings();
    new Command_1.CommandManager(base).syncCommandPanel();
    await base.discord.application?.commands.set(SlashCommands_1.slashCommands, settings.discord.guildId);
    base.logger.system('discord client is ready.');
};
exports.discordReady = discordReady;
