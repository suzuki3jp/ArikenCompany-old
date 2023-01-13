"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandInteraction = void 0;
const discord_js_1 = require("discord.js");
const Components_1 = require("../../data/Components");
const Embed_1 = require("../../utils/Embed");
const fs_1 = require("fs");
const path_1 = require("path");
const settingsPath = (0, path_1.resolve)(__dirname, '../../data/settings.json');
const commandInteraction = async (client, interaction) => {
    const settings = JSON.parse((0, fs_1.readFileSync)(settingsPath, 'utf-8'));
    const member = interaction.guild?.members.resolve(interaction.user);
    if (member?.roles.cache.has(settings.discord.modRoleId)) {
        if (interaction.options.getSubcommand() === 'panel') {
            Components_1.pageManagerActionRow.components[0].setDisabled(true);
            const panel = await interaction.channel?.send({
                embeds: [(0, Embed_1.createCommandPanelEmbeds)()[0]],
                components: [Components_1.pageManagerActionRow, Components_1.commandManagerActionRow],
            });
            settings.discord.manageCommandPanelId = panel?.id ?? null;
            const writeData = JSON.stringify(settings, null, '\t');
            (0, fs_1.writeFileSync)(settingsPath, writeData, 'utf-8');
        }
        else if (interaction.options.getSubcommand() === 'template') {
            const targetCommandName = interaction.options.getString('command');
            if (!targetCommandName)
                return;
            interaction.channel?.send({
                embeds: [
                    {
                        title: targetCommandName,
                        description: 'ボタンを押すとあらかじめ設定された値に変更',
                    },
                ],
                components: [new discord_js_1.MessageActionRow().addComponents(Components_1.addTemplateButton)],
            });
        }
    }
    else {
        interaction.reply({ content: 'このコマンドを実行する権限がありません', ephemeral: true });
    }
};
exports.commandInteraction = commandInteraction;
