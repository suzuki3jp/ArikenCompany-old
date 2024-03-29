// nodeモジュールをインポート
import { randomUUID } from 'crypto';
import { Message, MessageActionRow, MessageButton, ModalSubmitInteraction } from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';

// モジュールをインポート
import { CommandManager } from './Command';
import { ComponentCustomIds } from './Components';
import { ArikenCompany } from '../ArikenCompany';

export class DiscordModal extends ArikenCompany {
    public interaction: ModalSubmitInteraction;
    public customId: any;
    public type: ModalTypes;
    public commandName: string | null;
    public value: string | null;
    public _commandManager: CommandManager;

    constructor(app: ArikenCompany, modalInteraction: ModalSubmitInteraction) {
        super(app);
        this.interaction = modalInteraction;
        this.customId = this.interaction.customId;
        this._commandManager = new CommandManager(this);
        this.type = this.modalType();
        try {
            this.commandName = this.interaction.fields.getTextInputValue(ComponentCustomIds.text.commandName);
        } catch {
            this.commandName = null;
        }

        try {
            this.value = this.interaction.fields.getTextInputValue(ComponentCustomIds.text.value);
        } catch {
            this.value = null;
        }
    }

    modalType(): ModalTypes {
        if (this.customId === ComponentCustomIds.modal.add) return 'commandAdd';
        if (this.customId === ComponentCustomIds.modal.edit) return 'commandEdit';
        if (this.customId === ComponentCustomIds.modal.remove) return 'commandRemove';
        return 'templateAdd';
    }

    async addTemplate(): Promise<AddTemplateResult> {
        if (!this.value) return '予期せぬエラー';
        const BUTTON_LABEL_MAX_LENGTH = 80;
        const BUTTON_MAX_LENGTH_PER_ROW = 5;
        const ACTION_ROW_MAX_LENGTH_PER_MESSAGE = 5;
        if (BUTTON_LABEL_MAX_LENGTH < this.value.length) {
            return 'テンプレートに追加する内容は80字未満である必要があります';
        } else {
            const components = this.interaction.message?.components;
            if (!components) return '予期せぬエラー';
            if (components) {
                const newButton = new MessageButton()
                    .setCustomId(ComponentCustomIds.button.commandTemplate + randomUUID())
                    .setLabel(this.value)
                    .setStyle(MessageButtonStyles.PRIMARY);
                const messageActionRowLength = components.length;
                const lastRowLength = components[messageActionRowLength - 1].components.length;

                if (messageActionRowLength === ACTION_ROW_MAX_LENGTH_PER_MESSAGE && lastRowLength === BUTTON_MAX_LENGTH_PER_ROW) {
                    // ボタンが5行5個づつで一つのメッセージに付けることのできる最大数だった場合
                    return 'これ以上このメッセージにテンプレートを追加できません';
                } else if (lastRowLength === BUTTON_MAX_LENGTH_PER_ROW) {
                    if (!isMessage(this.interaction.message)) return '予期せぬエラー';
                    // 最後の行がすでにボタンがマックスだった場合
                    const newActionRow = new MessageActionRow().addComponents(newButton);
                    // @ts-expect-error
                    components.push(newActionRow);
                    // @ts-expect-error
                    await this.interaction.message?.edit({ components });
                    return 'テンプレートを追加しました';
                } else {
                    // @ts-expect-error
                    components[messageActionRowLength - 1].addComponents(newButton);
                    // @ts-expect-error
                    await this.interaction.message?.edit({ components });
                    return 'テンプレートを追加しました';
                }
            } else return '予期せぬエラー';
        }
    }

    async addCommand(): Promise<string> {
        if (this.commandName && this.value && this.interaction.message instanceof Message) {
            const result = await this._commandManager.addCom(this.commandName, this.value, this.interaction.message);
            await this._commandManager.syncCommandPanel();
            return result;
        } else return '予期せぬエラーによって処理を実行できませんでした';
    }

    async editCommand(): Promise<string> {
        if (this.commandName && this.value && this.interaction.message instanceof Message) {
            const result = await this._commandManager.editCom(this.commandName, this.value, this.interaction.message);
            await this._commandManager.syncCommandPanel();
            return result;
        } else return '予期せぬエラーによって処理を実行できませんでした';
    }

    async removeCommand() {
        if (this.commandName) {
            const result = await this._commandManager.removeCom(this.commandName);
            await this._commandManager.syncCommandPanel();
            return result;
        } else return '予期せぬエラーによって処理を実行できませんでした';
    }

    async reply(content: string, ephemeral?: boolean) {
        const isEphemeral = ephemeral ?? false;
        await this.interaction.reply({ content, ephemeral: isEphemeral });
    }
}

export type ModalTypes = 'commandAdd' | 'commandEdit' | 'commandRemove' | 'templateAdd';
export type AddTemplateResult = 'テンプレートに追加する内容は80字未満である必要があります' | 'これ以上このメッセージにテンプレートを追加できません' | 'テンプレートを追加しました' | '予期せぬエラー';

const isMessage = (data: any): data is Message => {
    return true;
};

const isMessageActionRow = (data: any): data is MessageActionRow[] => {
    return true;
};
