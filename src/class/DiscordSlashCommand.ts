import { CommandInteraction, MessageActionRow, Formatters } from 'discord.js';

import { Base } from './Base';
import { addTemplateButton, commandManagerActionRow, pageManagerActionRow } from '../data/Components';
import { TwitchUser } from '../data/JsonTypes';
import { createCommandPanelEmbeds } from '../utils/Embed';
import { subscribeOfflineEvent, subscribeOnlineEvent } from '../utils/EventSub';

export class DiscordSlashCommand extends Base {
    public interaction: CommandInteraction;
    public subCommand: string | null;

    constructor(base: Base, interaction: CommandInteraction) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this.interaction = interaction;
        this.subCommand = this.interaction.options.getSubcommand();
    }

    isMod(): boolean {
        const modRoleId = this.DM.getSettings().discord.modRoleId;
        const member = this.interaction.guild?.members.resolve(this.interaction.user);

        if (!member) return false;
        return member.roles.cache.has(modRoleId);
    }

    async setupPanel() {
        pageManagerActionRow.components[0].setDisabled(true);
        const settings = this.DM.getSettings();
        const panel = await this.interaction.channel?.send({
            embeds: [createCommandPanelEmbeds()[0]],
            components: [pageManagerActionRow, commandManagerActionRow],
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
        const users = this.DM.getStreamStatus().users;
        const oldUsers = users.filter((value) => value.name === name);
        if (oldUsers.length !== 0) return ErrorMessages.alreadyRegisterd;
        if (!this.interaction.channel) return ErrorMessages.unknownError;

        // TwitchAPIから指定のユーザーを取得する
        const user = await this.twitch._api.users.getUserByName(name);
        if (!user) return ErrorMessages.twitchUser404;

        // 取得したユーザーから配信を取得する
        const stream = await user.getStream();

        // 取得した情報からTwitchUserを作成する
        const newUser: TwitchUser = {
            id: user.id,
            name: user.name,
            displayName: user.displayName,
            isStreaming: stream ? true : false,
            notificationChannelId: this.interaction.channel.id,
        };

        // EventSubリスナーを登録する
        subscribeOnlineEvent(this.getMe(), newUser.id);
        subscribeOfflineEvent(this.getMe(), newUser.id);

        // StreamStatusJsonにプッシュする
        users.push(newUser);
        this.DM.setStreamStatus({ users });

        const result = `${newUser.displayName}(${newUser.name}) の配信開始通知を${Formatters.channelMention(
            newUser.notificationChannelId
        )}に送信するよう設定しました。`;
        return result;
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
