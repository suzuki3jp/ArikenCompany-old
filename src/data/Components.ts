import { MessageButton, Modal, TextInputComponent, MessageActionRow, ModalActionRowComponent } from 'discord.js';
import { MessageButtonStyles, TextInputStyles } from 'discord.js/typings/enums';

export const ComponentCustomIds = {
    button: {
        next: 'nextButton',
        previous: 'previousButton',
        add: 'addButton',
        edit: 'editButton',
        remove: 'removeButton',
        site: 'siteButton',
        addTemplate: 'addTemplateButton',
    },
    text: {
        commandName: 'targetCommandInput',
        value: 'valueInput',
    },
    modal: {
        add: 'addModal',
        edit: 'editModal',
        remove: 'removeModal',
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
    },
};

const ArikenCompanyHP = 'https://arikencompany.github.io/pages/home.html';

// Buttons
export const nextButton = new MessageButton()
    .setCustomId(ComponentCustomIds.button.next)
    .setStyle(MessageButtonStyles.PRIMARY)
    .setLabel(ComponentLabels.button.next);
export const previousButton = new MessageButton()
    .setCustomId(ComponentCustomIds.button.previous)
    .setStyle(MessageButtonStyles.PRIMARY)
    .setLabel(ComponentLabels.button.previous);

export const addButton = new MessageButton()
    .setCustomId(ComponentCustomIds.button.add)
    .setStyle(MessageButtonStyles.SUCCESS)
    .setLabel(ComponentLabels.button.add);
export const editButton = new MessageButton()
    .setCustomId(ComponentCustomIds.button.edit)
    .setStyle(MessageButtonStyles.SUCCESS)
    .setLabel(ComponentLabels.button.edit);
export const removeButton = new MessageButton()
    .setCustomId(ComponentCustomIds.button.remove)
    .setStyle(MessageButtonStyles.SUCCESS)
    .setLabel(ComponentLabels.button.remove);
export const siteButton = new MessageButton()
    .setLabel(ComponentLabels.button.site)
    .setStyle(MessageButtonStyles.LINK)
    .setURL(ArikenCompanyHP);

export const addTemplateButton = new MessageButton()
    .setCustomId(ComponentCustomIds.button.addTemplate)
    .setLabel(ComponentLabels.button.addTemplate)
    .setStyle(MessageButtonStyles.DANGER);

// TextInputs
const targetCommandInput = new TextInputComponent()
    .setCustomId(ComponentCustomIds.text.commandName)
    .setLabel(ComponentLabels.text.commandName)
    .setValue('!')
    .setStyle(TextInputStyles.SHORT);

const valueInput = new TextInputComponent()
    .setCustomId(ComponentCustomIds.text.value)
    .setLabel(ComponentLabels.text.value)
    .setStyle(TextInputStyles.PARAGRAPH);

// ActionRows
export const pageManagerActionRow = new MessageActionRow().addComponents(previousButton, nextButton);
export const commandManagerActionRow = new MessageActionRow().addComponents(
    addButton,
    editButton,
    removeButton,
    siteButton
);

const commandNameInputActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(targetCommandInput);
const valueInputActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(valueInput);

// Modals
export const addModal = new Modal()
    .setCustomId(ComponentCustomIds.modal.add)
    .setTitle(ComponentLabels.modal.add)
    .addComponents(commandNameInputActionRow, valueInputActionRow);

export const editModal = new Modal()
    .setCustomId(ComponentCustomIds.modal.edit)
    .setTitle(ComponentLabels.modal.edit)
    .addComponents(commandNameInputActionRow, valueInputActionRow);

export const removeModal = new Modal()
    .setCustomId(ComponentCustomIds.modal.remove)
    .setTitle(ComponentLabels.modal.remove)
    .addComponents(commandNameInputActionRow);
