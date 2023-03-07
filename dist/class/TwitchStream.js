"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeArikenActivity = exports.ARIKEN_TWITCH_ID = exports.TwitchStream = void 0;
const utils_1 = require("@suzuki3jp/utils");
const Base_1 = require("./Base");
const discord_js_1 = require("discord.js");
class TwitchStream extends Base_1.Base {
    users;
    user;
    userIndex;
    constructor(base, event) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
        this.users = this.DM.getStreamStatus().users;
        this.user = null;
        this.userIndex = null;
        this.users.forEach((value, index) => {
            if (value.id !== event.broadcasterId)
                return;
            this.userIndex = index;
            this.user = value;
        });
    }
    async turnOnline() {
        if (this.userIndex === null || this.user === null)
            return;
        const channel = await this.discord.channels.fetch(this.user.notificationChannelId);
        const stream = await this.twitch._api.streams.getStreamByUserId(this.user.id);
        if (!channel || !stream)
            return;
        this._updateData(true);
        this._changeDiscordActivity();
        const embeds = this._createOnStreamEmbed(stream);
        if (channel instanceof discord_js_1.TextChannel) {
            channel.send({ content: '@everyone', embeds });
            this.logger.emitLog('info', '配信開始通知を送信');
        }
        else {
            this.logger.emitLog('debug', '配信開始通知を送信しようとしたチャンネルがTextChannelではなかったため送信不可');
        }
    }
    async turnOffline() {
        this._updateData(false);
        this._changeDiscordActivity();
    }
    _updateData(isStreaming) {
        if (this.userIndex === null || this.user === null)
            return;
        this.users.splice(this.userIndex, 1);
        this.user.isStreaming = isStreaming;
        this.users.push(this.user);
        this.DM.setStreamStatus({ users: this.users });
    }
    _createOnStreamEmbed(stream) {
        const embed = {
            title: `${stream.userDisplayName}が配信を開始しました`,
            url: `https://www.twitch.tv/${stream.userName}`,
            description: `**タイトル**: ${stream.title}, **ゲーム**: ${stream.gameName}`,
            footer: {
                text: utils_1.JST.getDateString(),
            },
        };
        // @ts-expect-error
        return [new discord_js_1.MessageEmbed(embed)];
    }
    _changeDiscordActivity() {
        if (!this.user)
            return;
        if (this.user.name !== exports.ARIKEN_TWITCH_ID)
            return;
        const isStreaming = this.user.isStreaming;
        (0, exports.changeArikenActivity)(isStreaming, this);
    }
}
exports.TwitchStream = TwitchStream;
exports.ARIKEN_TWITCH_ID = 'arikendebu';
const changeArikenActivity = (isStreaming, base) => {
    const streamingStr = 'ありけん: 配信中';
    if (isStreaming) {
        base.discord.user?.setPresence({
            activities: [{ name: streamingStr, type: 'STREAMING', url: 'https://www.twitch.tv/arikendebu' }],
            status: 'online',
        });
        base.logger.emitLog('info', 'discordのアクティビティを配信中に変更');
    }
    else {
        base.discord.user?.setPresence({
            status: 'idle',
        });
        base.logger.emitLog('info', 'discordのアクティビティを配信外に変更');
    }
};
exports.changeArikenActivity = changeArikenActivity;
