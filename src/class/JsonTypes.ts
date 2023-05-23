export type CooltimeJson = Record<string, number>;

export interface ManagersJson {
    managers: string[];
}

export type PublicCommandsJson = Record<string, string>;

export interface SettingsJson {
    /**
     * discordに関する設定
     */
    discord: {
        /**
         * 管理者ロールID
         */
        modRoleId: string;

        /**
         * aricordギルドID
         */
        guildId: string;

        /**
         * コマンド管理パネルのチャンネル
         */
        manageCommandChannelId: string;

        /**
         * コマンド管理パネルのメッセージID
         */
        manageCommandPanelId: string | null;
    };

    /**
     * twitchに関する設定
     */
    twitch: {
        /**
         * ログインしているチャンネル名
         */
        channelName: string;

        /**
         * 接続しているチャンネル名
         */
        channels: string[];

        /**
         * コマンド管理コマンドの配列
         */
        manageCommands: string[];

        /**
         * コマンドが現在有効かどうか
         */
        command: boolean;

        /**
         * コマンドのクールタイム時間（秒）
         */
        cooltime: number;
    };

    /**
     * APIに関する設定
     */
    api: {
        /**
         * ポート
         */
        port: number;

        /**
         * HTTPSを使用するかどうか
         */
        isSecure: boolean;

        /**
         * 現在有効なAPIキー
         */
        key: string;
    };

    /**
     * サイトのリンク
     */
    web: string;
}

export interface StreamStatusJson {
    users: TwitchStreamer[];
}

export interface TwitchStreamer {
    id: string;
    name: string;
    displayName: string;
    isStreaming: boolean;
    notificationChannelId: string;
}

export type CommandsJson = {
    commands: TwitchCommand[];
};

export interface TwitchCommand {
    _id: string;
    name: string;
    message: string;
    created_at: string;
    updated_at: string;
    last_used_at: string;
    count: number;
}

export interface ChattersJson {
    chatters: TwitchChatter[];
}

export interface TwitchChatter {
    _id: string;
    name: string;
    displayName: string;
    messageCount: number;
}
