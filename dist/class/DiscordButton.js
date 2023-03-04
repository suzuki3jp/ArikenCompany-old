"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordButton = void 0;
// nodeモジュールをインポート
const discord_js_1 = require("discord.js");
// モジュールをインポート
const Base_1 = require("./Base");
const Command_1 = require("./Command");
const Components_1 = require("./Components");
const Embed_1 = require("../utils/Embed");
class DiscordButton extends Base_1.Base {
    interaction;
    member;
    type;
    customId;
    _commandManager;
    constructor(base, interaction) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this.interaction = interaction;
        this.member = this.interaction.guild?.members.resolve(this.interaction.user) ?? null;
        this.customId = this.interaction.customId;
        this.type = this.buttonType();
        this._commandManager = new Command_1.CommandManager(this.getMe());
    }
    buttonType() {
        if (this.customId === Components_1.ComponentCustomIds.button.add)
            return 'commandAdd';
        if (this.customId === Components_1.ComponentCustomIds.button.edit)
            return 'commandEdit';
        if (this.customId === Components_1.ComponentCustomIds.button.remove)
            return 'commandRemove';
        if (this.customId === Components_1.ComponentCustomIds.button.next)
            return 'panelNext';
        if (this.customId === Components_1.ComponentCustomIds.button.previous)
            return 'panelPrevious';
        if (this.customId === Components_1.ComponentCustomIds.button.addTemplate)
            return 'templateAdd';
        if (this.customId.startsWith(Components_1.ComponentCustomIds.button.commandTemplate))
            return 'template';
        return 'site';
    }
    isMod() {
        const settings = this.DM.getSettings();
        return this.member?.roles.cache.has(settings.discord.modRoleId) ?? false;
    }
    next() {
        const manageCommandPanel = this.interaction.message;
        const embeds = manageCommandPanel.embeds;
        const components = manageCommandPanel.components;
        if (!components || !isMessage(manageCommandPanel))
            return;
        const isFirstPage = (0, Embed_1.isFirstPageByFooter)(this.interaction.message.embeds[0]);
        const currentPageNumber = (0, Embed_1.currentPage)(this.interaction.message.embeds[0]);
        const newPage = (0, Embed_1.createCommandPanelEmbeds)()[currentPageNumber];
        if (isFirstPage) {
            // 最初のページから次のページに遷移したとき、戻るボタンの無効化を解除
            if (components[0].components[0] instanceof discord_js_1.MessageButton) {
                components[0].components[0].setDisabled(false);
            }
            embeds[0] = newPage;
            manageCommandPanel.edit({
                embeds,
                // @ts-ignore
                components,
            });
            this.interaction.deferUpdate();
        }
        else if ((0, Embed_1.isLastPageByFooter)(newPage)) {
            // 最後のページに遷移したとき、次へボタンを無効化
            if (components[0].components[1] instanceof discord_js_1.MessageButton) {
                components[0].components[1].setDisabled(true);
            }
            embeds[0] = newPage;
            manageCommandPanel.edit({
                embeds,
                // @ts-ignore
                components,
            });
            this.interaction.deferUpdate();
        }
        else {
            embeds[0] = newPage;
            manageCommandPanel.edit({
                embeds,
                // @ts-ignore
                components,
            });
            this.interaction.deferUpdate();
        }
    }
    previous() {
        const manageCommandPanel = this.interaction.message;
        const embeds = manageCommandPanel.embeds;
        const components = manageCommandPanel.components;
        if (!components || !isMessage(manageCommandPanel))
            return;
        const isLastPage = (0, Embed_1.isLastPageByFooter)(this.interaction.message.embeds[0]);
        const currentPageNumber = (0, Embed_1.currentPage)(this.interaction.message.embeds[0]);
        const newPage = (0, Embed_1.createCommandPanelEmbeds)()[currentPageNumber - 2];
        if (isLastPage) {
            // 最後のページから戻ったときに次へボタンを有効化する
            if (components[0].components[1] instanceof discord_js_1.MessageButton) {
                components[0].components[1].setDisabled(false);
            }
            embeds[0] = newPage;
            manageCommandPanel.edit({
                embeds,
                // @ts-ignore
                components,
            });
            this.interaction.deferUpdate();
        }
        else if ((0, Embed_1.isFirstPageByFooter)(newPage)) {
            // 最初のページに戻る時に戻るボタンを無効化する
            if (components[0].components[0] instanceof discord_js_1.MessageButton) {
                components[0].components[0].setDisabled(true);
            }
            embeds[0] = newPage;
            manageCommandPanel.edit({
                embeds,
                // @ts-ignore
                components,
            });
            this.interaction.deferUpdate();
        }
        else {
            embeds[0] = newPage;
            manageCommandPanel.edit({
                embeds,
                // @ts-ignore
                components,
            });
            this.interaction.deferUpdate();
        }
    }
    addTemplate() {
        this.interaction.showModal(Components_1.addTemplateModal);
    }
    async editCommandByTemlate() {
        const targetCommand = this.interaction.message.embeds[0].title;
        const value = this.interaction.component.label;
        if (!targetCommand || !value)
            return;
        if (this.interaction.message instanceof discord_js_1.Message) {
            await this._commandManager.editCom(targetCommand, value, this.interaction.message);
            await this._commandManager.syncCommandPanel();
            this.interaction.deferUpdate();
        }
        else
            return;
    }
    async addCommand() {
        await this.interaction.showModal(Components_1.addModal);
    }
    async editCommand() {
        await this.interaction.showModal(Components_1.editModal);
    }
    async removeCommand() {
        await this.interaction.showModal(Components_1.removeModal);
    }
    async reply(content, ephemeral) {
        await this.interaction.reply({ content, ephemeral: ephemeral ?? false });
    }
}
exports.DiscordButton = DiscordButton;
const isMessage = (data) => {
    return true;
};
