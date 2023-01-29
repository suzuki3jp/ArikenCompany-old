"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordModal = void 0;
const crypto_1 = require("crypto");
const discord_js_1 = require("discord.js");
// モジュールをインポート
const Base_1 = require("./Base");
const Command_1 = require("./Command");
const Components_1 = require("../data/Components");
class DiscordModal extends Base_1.Base {
    interaction;
    customId;
    type;
    commandName;
    value;
    _commandManager;
    constructor(twitchClient, discordClient, logger, modalInteraction) {
        super(twitchClient, discordClient, logger);
        this.interaction = modalInteraction;
        this.customId = this.interaction.customId;
        this._commandManager = new Command_1.CommandManager(super.twitch, super.discord, super.logger);
        this.type = this.modalType();
        try {
            this.commandName = this.interaction.fields.getTextInputValue(Components_1.ComponentCustomIds.text.commandName);
        }
        catch {
            this.commandName = null;
        }
        try {
            this.value = this.interaction.fields.getTextInputValue(Components_1.ComponentCustomIds.text.value);
        }
        catch {
            this.value = null;
        }
    }
    modalType() {
        if (this.customId === Components_1.ComponentCustomIds.modal.add)
            return 'commandAdd';
        if (this.customId === Components_1.ComponentCustomIds.modal.edit)
            return 'commandEdit';
        if (this.customId === Components_1.ComponentCustomIds.modal.remove)
            return 'commandRemove';
        return 'templateAdd';
    }
    async addTemplate() {
        if (!this.value)
            return '予期せぬエラー';
        const BUTTON_LABEL_MAX_LENGTH = 80;
        const BUTTON_MAX_LENGTH_PER_ROW = 5;
        const ACTION_ROW_MAX_LENGTH_PER_MESSAGE = 5;
        if (BUTTON_LABEL_MAX_LENGTH < this.value.length) {
            return 'テンプレートに追加する内容は80字未満である必要があります';
        }
        else {
            const components = this.interaction.message?.components;
            if (!components)
                return '予期せぬエラー';
            if (components) {
                const newButton = new discord_js_1.MessageButton()
                    .setCustomId(Components_1.ComponentCustomIds.button.commandTemplate + (0, crypto_1.randomUUID)())
                    .setLabel(this.value)
                    .setStyle(1 /* MessageButtonStyles.PRIMARY */);
                const messageActionRowLength = components.length;
                const lastRowLength = components[messageActionRowLength - 1].components.length;
                if (messageActionRowLength === ACTION_ROW_MAX_LENGTH_PER_MESSAGE &&
                    lastRowLength === BUTTON_MAX_LENGTH_PER_ROW) {
                    // ボタンが5行5個づつで一つのメッセージに付けることのできる最大数だった場合
                    return 'これ以上このメッセージにテンプレートを追加できません';
                }
                else if (lastRowLength === BUTTON_MAX_LENGTH_PER_ROW) {
                    if (!isMessage(this.interaction.message))
                        return '予期せぬエラー';
                    // 最後の行がすでにボタンがマックスだった場合
                    const newActionRow = new discord_js_1.MessageActionRow().addComponents(newButton);
                    // @ts-expect-error
                    components.push(newActionRow);
                    // @ts-expect-error
                    await this.interaction.message?.edit({ components });
                    return 'テンプレートを追加しました';
                }
                else {
                    // @ts-expect-error
                    components[messageActionRowLength - 1].addComponents(newButton);
                    // @ts-expect-error
                    await this.interaction.message?.edit({ components });
                    return 'テンプレートを追加しました';
                }
            }
            else
                return '予期せぬエラー';
        }
    }
    async addCommand() {
        if (this.commandName && this.value && this.interaction.message instanceof discord_js_1.Message) {
            const result = await this._commandManager.addCom(this.commandName, this.value, this.interaction.message);
            await this._commandManager.syncCommandPanel();
            return result;
        }
        else
            return '予期せぬエラーによって処理を実行できませんでした';
    }
    async editCommand() {
        if (this.commandName && this.value && this.interaction.message instanceof discord_js_1.Message) {
            const result = await this._commandManager.editCom(this.commandName, this.value, this.interaction.message);
            await this._commandManager.syncCommandPanel();
            return result;
        }
        else
            return '予期せぬエラーによって処理を実行できませんでした';
    }
    async removeCommand() {
        if (this.commandName) {
            const result = this._commandManager.removeCom(this.commandName);
            await this._commandManager.syncCommandPanel();
            return result;
        }
        else
            return '予期せぬエラーによって処理を実行できませんでした';
    }
    async reply(content, ephemeral) {
        const isEphemeral = ephemeral ?? false;
        await this.interaction.reply({ content, ephemeral: isEphemeral });
    }
}
exports.DiscordModal = DiscordModal;
const isMessage = (data) => {
    return true;
};
const isMessageActionRow = (data) => {
    return true;
};
