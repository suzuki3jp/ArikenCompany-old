import { CommandInteraction, MessageActionRow, Formatters } from 'discord.js';

import { ApiAuthManager } from './ApiAuth';
import { addTemplateButton, createCommandPanelActionRow } from './Components';
import { TwitchStreamerData } from './JsonTypes';
import { createCommandPanelEmbeds } from '../utils/Embed';
import { restartPm2Process } from '../utils/Pm2';
import { ArikenCompany } from '../ArikenCompany';

export class DiscordSlashCommand extends ArikenCompany {
    public interaction: CommandInteraction;
    public command: string;
    public subCommand: string | null;

    constructor(app: ArikenCompany, interaction: CommandInteraction) {
        super(app);
        this.interaction = interaction;
        this.command = this.interaction.commandName;
        this.subCommand = this.interaction.options.getSubcommand();
    }

    isMod(): boolean {
        const modRoleId = this.DM.getSettings().discord.modRoleId;
        const member = this.interaction.guild?.members.resolve(this.interaction.user);

        if (!member) return false;
        return member.roles.cache.has(modRoleId);
    }

    async setupPanel() {
        const { pageController, commandController } = createCommandPanelActionRow(this);
        pageController.components[0].setDisabled(true);
        const settings = this.DM.getSettings();
        const panel = await this.interaction.channel?.send({
            embeds: [createCommandPanelEmbeds()[0]],
            components: [pageController, commandController],
        });
        settings.discord.manageCommandPanelId = panel?.id ?? null;
        this.DM.setSettings(settings);
    }

    setupTemplate() {
        const targetCommandName = this.interaction.options.getString('command');
        if (!targetCommandName) return;
        this.interaction.channel?.send({
            embeds: [
                {
                    title: targetCommandName,
                    description: 'ボタンを押すとあらかじめ設定された値に変更',
                },
            ],
            components: [new MessageActionRow().addComponents(addTemplateButton)],
        });
    }

    async setupNotification(): Promise<string> {
        // スラコマから指定のユーザー名を抜き出し、既に登録されていないか確認する
        const name = this.interaction.options.getString('user')?.trim();
        if (!name) return ErrorMessages.isNotDefinedUserInput;

        // TwitchAPIから指定のユーザーを取得する
        const user = await this.client.twitch.api.users.getUserByName(name);
        if (!user) return ErrorMessages.twitchUser404;

        const streamer = this.streamNotifications.cache.get(user.id);
        if (streamer) return ErrorMessages.alreadyRegisterd;

        if (!this.interaction.channel) return ErrorMessages.unknownError;

        const streamNotification = await this.streamNotifications.addStreamNotification(user.id, this.interaction.channel.id);
        if (!streamNotification) return ErrorMessages.twitchUser404;

        return `${streamNotification.displayName}(${streamNotification.name}) の配信開始通知を${Formatters.channelMention(streamNotification.notificationChannelId)}に送信するよう設定しました。`;
    }

    getApiKey(): string {
        const apiAuthManager = new ApiAuthManager(this);
        return apiAuthManager.getKey();
    }

    refreshApiKey(): string {
        const apiAuthManager = new ApiAuthManager(this);
        apiAuthManager.refreshKey();
        const newApiKey = apiAuthManager.getKey();
        return `APIキーを変更しました。 新APIキー: ${newApiKey}`;
    }

    /**
     *
     * @param content
     * @param ephemeral デフォルトでtrue
     */
    reply(content: string, ephemeral?: boolean) {
        this.interaction.reply({ content, ephemeral: ephemeral ?? true });
    }
}

const ErrorMessages = {
    unknownError: '予期せぬエラーによって処理を実行できませんでした。',
    alreadyRegisterd: 'このユーザーの通知はすでに追加されています。',
    isNotDefinedUserInput: 'コマンドのuserに通知を登録するユーザーのTwitchIDを入力してください。',
    twitchUser404: '指定のTwitchユーザーが見つかりませんでした。',
};
