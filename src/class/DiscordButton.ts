import { Client, ButtonInteraction, GuildMember, MessageButton, Message } from 'discord.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { CommandManager } from '../class/Command';
import { ComponentCustomIds, addTemplateModal, addModal, editModal, removeModal } from '../data/Components';
import { isFirstPageByFooter, isLastPageByFooter, createCommandPanelEmbeds, currentPage } from '../utils/Embed';

const settingsPath = resolve(__dirname, '../data/settings.json');

export class DiscordButton extends CommandManager {
    public client: Client;
    public interaction: ButtonInteraction;
    public member: GuildMember | null;
    public type: ButtonTypes;
    public customId: string;

    constructor(client: Client, interaction: ButtonInteraction) {
        super();
        this.client = client;
        this.interaction = interaction;
        this.member = this.interaction.guild?.members.resolve(this.interaction.user) ?? null;
        this.customId = this.interaction.customId;
        this.type = this.buttonType();
    }

    buttonType(): ButtonTypes {
        if (this.customId === ComponentCustomIds.button.add) return 'commandAdd';
        if (this.customId === ComponentCustomIds.button.edit) return 'commandEdit';
        if (this.customId === ComponentCustomIds.button.remove) return 'commandRemove';
        if (this.customId === ComponentCustomIds.button.next) return 'panelNext';
        if (this.customId === ComponentCustomIds.button.previous) return 'panelPrevious';
        if (this.customId === ComponentCustomIds.button.addTemplate) return 'templateAdd';
        if (this.customId.startsWith(ComponentCustomIds.button.commandTemplate)) return 'template';
        return 'site';
    }

    isMod(): boolean {
        const settings: { discord: { modRoleId: string } } = JSON.parse(readFileSync(settingsPath, 'utf-8'));
        return this.member?.roles.cache.has(settings.discord.modRoleId) ?? false;
    }

    next() {
        const manageCommandPanel = this.interaction.message;
        const embeds = manageCommandPanel.embeds;
        const components = manageCommandPanel.components;
        if (!components || !isMessage(manageCommandPanel)) return;
        const isFirstPage = isFirstPageByFooter(this.interaction.message.embeds[0]);
        const currentPageNumber = currentPage(this.interaction.message.embeds[0]);
        const newPage = createCommandPanelEmbeds()[currentPageNumber];
        if (isFirstPage) {
            // 最初のページから次のページに遷移したとき、戻るボタンの無効化を解除
            if (components[0].components[0] instanceof MessageButton) {
                components[0].components[0].setDisabled(false);
            }
            embeds[0] = newPage;
            manageCommandPanel.edit({
                embeds,
                // @ts-ignore
                components,
            });
            this.interaction.deferUpdate();
        } else if (isLastPageByFooter(newPage)) {
            // 最後のページに遷移したとき、次へボタンを無効化
            if (components[0].components[1] instanceof MessageButton) {
                components[0].components[1].setDisabled(true);
            }
            embeds[0] = newPage;
            manageCommandPanel.edit({
                embeds,
                // @ts-ignore
                components,
            });
            this.interaction.deferUpdate();
        } else {
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
        if (!components || !isMessage(manageCommandPanel)) return;
        const isLastPage = isLastPageByFooter(this.interaction.message.embeds[0]);
        const currentPageNumber = currentPage(this.interaction.message.embeds[0]);
        const newPage = createCommandPanelEmbeds()[currentPageNumber - 2];
        if (isLastPage) {
            // 最後のページから戻ったときに次へボタンを有効化する
            if (components[0].components[1] instanceof MessageButton) {
                components[0].components[1].setDisabled(false);
            }
            embeds[0] = newPage;
            manageCommandPanel.edit({
                embeds,
                // @ts-ignore
                components,
            });
            this.interaction.deferUpdate();
        } else if (isFirstPageByFooter(newPage)) {
            // 最初のページに戻る時に戻るボタンを無効化する
            if (components[0].components[0] instanceof MessageButton) {
                components[0].components[0].setDisabled(true);
            }
            embeds[0] = newPage;
            manageCommandPanel.edit({
                embeds,
                // @ts-ignore
                components,
            });
            this.interaction.deferUpdate();
        } else {
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
        this.interaction.showModal(addTemplateModal);
    }

    editCommandByTemlate() {
        const targetCommand = this.interaction.message.embeds[0].title;
        const value = this.interaction.component.label;
        if (!targetCommand || !value) return;
        if (this.interaction.message instanceof Message) {
            super.editCom(targetCommand, value, this.interaction.message);
            super.syncCommandPanel(this.interaction.client);
            this.interaction.deferUpdate();
        } else return;
    }

    async addCommand() {
        await this.interaction.showModal(addModal);
    }

    async editCommand() {
        await this.interaction.showModal(editModal);
    }

    async removeCommand() {
        await this.interaction.showModal(removeModal);
    }

    async reply(content: string, ephemeral?: boolean) {
        await this.interaction.reply({ content, ephemeral: ephemeral ?? false });
    }
}

export type ButtonTypes =
    | 'commandAdd'
    | 'commandEdit'
    | 'commandRemove'
    | 'panelNext'
    | 'panelPrevious'
    | 'templateAdd'
    | 'template'
    | 'site';

const isMessage = (data: any): data is Message => {
    return true;
};
