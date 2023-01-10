import {
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} from 'discord.js';

export const ComponentCustomIds = {
    button: {
        next: 'nextButton',
        previous: 'previousButton',
        add: 'addButton',
        edit: 'editButton',
        remove: 'removeButton',
        site: 'siteButton',
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
export const nextButton = new ButtonBuilder()
    .setCustomId(ComponentCustomIds.button.next)
    .setStyle(ButtonStyle.Primary)
    .setLabel(ComponentLabels.button.next);
export const previousButton = new ButtonBuilder()
    .setCustomId(ComponentCustomIds.button.previous)
    .setStyle(ButtonStyle.Primary)
    .setLabel(ComponentLabels.button.previous);

export const addButton = new ButtonBuilder()
    .setCustomId(ComponentCustomIds.button.add)
    .setStyle(ButtonStyle.Success)
    .setLabel(ComponentLabels.button.add);
export const editButton = new ButtonBuilder()
    .setCustomId(ComponentCustomIds.button.edit)
    .setStyle(ButtonStyle.Success)
    .setLabel(ComponentLabels.button.edit);
export const removeButton = new ButtonBuilder()
    .setCustomId(ComponentCustomIds.button.remove)
    .setStyle(ButtonStyle.Success)
    .setLabel(ComponentLabels.button.remove);
export const siteButton = new ButtonBuilder()
    .setLabel(ComponentLabels.button.site)
    .setStyle(ButtonStyle.Link)
    .setURL(ArikenCompanyHP);

// TextInputs
const targetCommandInput = new TextInputBuilder()
    .setCustomId(ComponentCustomIds.text.commandName)
    .setLabel(ComponentLabels.text.commandName)
    .setValue('!')
    .setStyle(TextInputStyle.Short);

const valueInput = new TextInputBuilder()
    .setCustomId(ComponentCustomIds.text.value)
    .setLabel(ComponentLabels.text.value)
    .setStyle(TextInputStyle.Paragraph);

// ActionRows
export const pageManagerActionRow = new ActionRowBuilder().addComponents(previousButton, nextButton);
export const commandManagerActionRow = new ActionRowBuilder().addComponents(
    addButton,
    editButton,
    removeButton,
    siteButton
);

const commandNameInputActionRow = new ActionRowBuilder().addComponents(targetCommandInput);
const valueInputActionRow = new ActionRowBuilder().addComponents(valueInput);

// Modals
export const addModal = new ModalBuilder()
    .setCustomId(ComponentCustomIds.modal.add)
    .setTitle(ComponentLabels.modal.add)
    // @ts-ignore
    .addComponents(commandNameInputActionRow, valueInputActionRow);

export const editModal = new ModalBuilder()
    .setCustomId(ComponentCustomIds.modal.edit)
    .setTitle(ComponentLabels.modal.edit)
    // @ts-ignore
    .addComponents(commandNameInputActionRow, valueInputActionRow);

export const removeModal = new ModalBuilder()
    .setCustomId(ComponentCustomIds.modal.remove)
    .setTitle(ComponentLabels.modal.remove)
    // @ts-ignore
    .addComponents(commandNameInputActionRow);
