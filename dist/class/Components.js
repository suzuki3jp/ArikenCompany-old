"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTemplateModal = exports.removeModal = exports.editModal = exports.addModal = exports.commandManagerActionRow = exports.pageManagerActionRow = exports.addTemplateButton = exports.siteButton = exports.removeButton = exports.editButton = exports.addButton = exports.previousButton = exports.nextButton = exports.ComponentCustomIds = void 0;
// nodeモジュールをインポート
const discord_js_1 = require("discord.js");
exports.ComponentCustomIds = {
    button: {
        next: 'nextButton',
        previous: 'previousButton',
        add: 'addButton',
        edit: 'editButton',
        remove: 'removeButton',
        site: 'siteButton',
        addTemplate: 'addTemplateButton',
        commandTemplate: 'template',
    },
    text: {
        commandName: 'targetCommandInput',
        value: 'valueInput',
    },
    modal: {
        add: 'addModal',
        edit: 'editModal',
        remove: 'removeModal',
        addTemplate: 'addTemplateModal',
    },
};
const ComponentLabels = {
    button: {
        next: '▶️',
        previous: '◀️',
        add: 'add',
        edit: 'edit',
        remove: 'remove',
        site: 'HP',
        addTemplate: '追加',
    },
    text: {
        commandName: '操作するコマンド名(!付き)',
        value: `コマンドの内容`,
    },
    modal: {
        add: 'コマンドを追加する',
        edit: 'コマンドを編集する',
        remove: 'コマンドを削除する',
        addTemplate: 'コマンドの定型文を追加する',
    },
};
const ArikenCompanyHP = 'https://arikencompany.github.io/pages/home.html';
// Buttons
exports.nextButton = new discord_js_1.MessageButton()
    .setCustomId(exports.ComponentCustomIds.button.next)
    .setStyle(1 /* MessageButtonStyles.PRIMARY */)
    .setLabel(ComponentLabels.button.next);
exports.previousButton = new discord_js_1.MessageButton()
    .setCustomId(exports.ComponentCustomIds.button.previous)
    .setStyle(1 /* MessageButtonStyles.PRIMARY */)
    .setLabel(ComponentLabels.button.previous);
exports.addButton = new discord_js_1.MessageButton()
    .setCustomId(exports.ComponentCustomIds.button.add)
    .setStyle(3 /* MessageButtonStyles.SUCCESS */)
    .setLabel(ComponentLabels.button.add);
exports.editButton = new discord_js_1.MessageButton()
    .setCustomId(exports.ComponentCustomIds.button.edit)
    .setStyle(3 /* MessageButtonStyles.SUCCESS */)
    .setLabel(ComponentLabels.button.edit);
exports.removeButton = new discord_js_1.MessageButton()
    .setCustomId(exports.ComponentCustomIds.button.remove)
    .setStyle(3 /* MessageButtonStyles.SUCCESS */)
    .setLabel(ComponentLabels.button.remove);
exports.siteButton = new discord_js_1.MessageButton()
    .setLabel(ComponentLabels.button.site)
    .setStyle(5 /* MessageButtonStyles.LINK */)
    .setURL(ArikenCompanyHP);
exports.addTemplateButton = new discord_js_1.MessageButton()
    .setCustomId(exports.ComponentCustomIds.button.addTemplate)
    .setLabel(ComponentLabels.button.addTemplate)
    .setStyle(4 /* MessageButtonStyles.DANGER */);
// TextInputs
const targetCommandInput = new discord_js_1.TextInputComponent()
    .setCustomId(exports.ComponentCustomIds.text.commandName)
    .setLabel(ComponentLabels.text.commandName)
    .setValue('!')
    .setStyle(1 /* TextInputStyles.SHORT */);
const valueInput = new discord_js_1.TextInputComponent()
    .setCustomId(exports.ComponentCustomIds.text.value)
    .setLabel(ComponentLabels.text.value)
    .setStyle(2 /* TextInputStyles.PARAGRAPH */);
// ActionRows
exports.pageManagerActionRow = new discord_js_1.MessageActionRow().addComponents(exports.previousButton, exports.nextButton);
exports.commandManagerActionRow = new discord_js_1.MessageActionRow().addComponents(exports.addButton, exports.editButton, exports.removeButton, exports.siteButton);
const commandNameInputActionRow = new discord_js_1.MessageActionRow().addComponents(targetCommandInput);
const valueInputActionRow = new discord_js_1.MessageActionRow().addComponents(valueInput);
// Modals
exports.addModal = new discord_js_1.Modal()
    .setCustomId(exports.ComponentCustomIds.modal.add)
    .setTitle(ComponentLabels.modal.add)
    .addComponents(commandNameInputActionRow, valueInputActionRow);
exports.editModal = new discord_js_1.Modal()
    .setCustomId(exports.ComponentCustomIds.modal.edit)
    .setTitle(ComponentLabels.modal.edit)
    .addComponents(commandNameInputActionRow, valueInputActionRow);
exports.removeModal = new discord_js_1.Modal()
    .setCustomId(exports.ComponentCustomIds.modal.remove)
    .setTitle(ComponentLabels.modal.remove)
    .addComponents(commandNameInputActionRow);
exports.addTemplateModal = new discord_js_1.Modal()
    .setCustomId(exports.ComponentCustomIds.modal.addTemplate)
    .setTitle(ComponentLabels.modal.addTemplate)
    .addComponents(valueInputActionRow);
