"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordSlashCommand = void 0;
const discord_js_1 = require("discord.js");
const ApiAuth_1 = require("./ApiAuth");
const Base_1 = require("./Base");
const Components_1 = require("./Components");
const Embed_1 = require("../utils/Embed");
const EventSub_1 = require("../utils/EventSub");
class DiscordSlashCommand extends Base_1.Base {
    interaction;
    command;
    subCommand;
    constructor(base, interaction) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this.interaction = interaction;
        this.command = this.interaction.commandName;
        this.subCommand = this.interaction.options.getSubcommand();
    }
    isMod() {
        const modRoleId = this.DM.getSettings().discord.modRoleId;
        const member = this.interaction.guild?.members.resolve(this.interaction.user);
        if (!member)
            return false;
        return member.roles.cache.has(modRoleId);
    }
    async setupPanel() {
        Components_1.pageManagerActionRow.components[0].setDisabled(true);
        const settings = this.DM.getSettings();
        const panel = await this.interaction.channel?.send({
            embeds: [(0, Embed_1.createCommandPanelEmbeds)()[0]],
            components: [Components_1.pageManagerActionRow, Components_1.commandManagerActionRow],
        });
        settings.discord.manageCommandPanelId = panel?.id ?? null;
        this.DM.setSettings(settings);
    }
    setupTemplate() {
        const targetCommandName = this.interaction.options.getString('command');
        if (!targetCommandName)
            return;
        this.interaction.channel?.send({
            embeds: [
                {
                    title: targetCommandName,
                    description: 'ボタンを押すとあらかじめ設定された値に変更',
                },
            ],
            components: [new discord_js_1.MessageActionRow().addComponents(Components_1.addTemplateButton)],
        });
    }
    async setupNotification() {
        // スラコマから指定のユーザー名を抜き出し、既に登録されていないか確認する
        const name = this.interaction.options.getString('user')?.trim();
        if (!name)
            return ErrorMessages.isNotDefinedUserInput;
        const users = this.DM.getStreamStatus().users;
        const oldUsers = users.filter((value) => value.name === name);
        if (oldUsers.length !== 0)
            return ErrorMessages.alreadyRegisterd;
        if (!this.interaction.channel)
            return ErrorMessages.unknownError;
        // TwitchAPIから指定のユーザーを取得する
        const user = await this.twitch._api.users.getUserByName(name);
        if (!user)
            return ErrorMessages.twitchUser404;
        // 取得したユーザーから配信を取得する
        const stream = await user.getStream();
        // 取得した情報からTwitchStreamerを作成する
        const newUser = {
            id: user.id,
            name: user.name,
            displayName: user.displayName,
            isStreaming: stream ? true : false,
            notificationChannelId: this.interaction.channel.id,
        };
        // EventSubリスナーを登録する
        (0, EventSub_1.subscribeOnlineEvent)(this.getMe(), newUser.id);
        (0, EventSub_1.subscribeOfflineEvent)(this.getMe(), newUser.id);
        // StreamStatusJsonにプッシュする
        users.push(newUser);
        this.DM.setStreamStatus({ users });
        const result = `${newUser.displayName}(${newUser.name}) の配信開始通知を${discord_js_1.Formatters.channelMention(newUser.notificationChannelId)}に送信するよう設定しました。`;
        return result;
    }
    getApiKey() {
        const apiAuthManager = new ApiAuth_1.ApiAuthManager(this);
        return apiAuthManager.getKey();
    }
    refreshApiKey() {
        const apiAuthManager = new ApiAuth_1.ApiAuthManager(this);
        apiAuthManager.refreshKey();
        const newApiKey = apiAuthManager.getKey();
        return `APIキーを変更しました。 新APIキー: ${newApiKey}`;
    }
    /**
     *
     * @param content
     * @param ephemeral デフォルトでtrue
     */
    reply(content, ephemeral) {
        this.interaction.reply({ content, ephemeral: ephemeral ?? true });
    }
}
exports.DiscordSlashCommand = DiscordSlashCommand;
const ErrorMessages = {
    unknownError: '予期せぬエラーによって処理を実行できませんでした。',
    alreadyRegisterd: 'このユーザーの通知はすでに追加されています。',
    isNotDefinedUserInput: 'コマンドのuserに通知を登録するユーザーのTwitchIDを入力してください。',
    twitchUser404: '指定のTwitchユーザーが見つかりませんでした。',
};
