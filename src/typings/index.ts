export interface DotEnvData {
    DISCORD_TOKEN: string;
    TWITCH_CLIENTID: string;
    TWITCH_CLIENTSECRET: string;
    TWITCH_REFRESHTOKEN: string;
    TWITCH_TOKEN: string;
    TWITCH_HTTPSECRET: string;
}

export interface SettingsData {
    twitch: {
        /**
         * 認証しているユーザーのid
         */
        id: string;

        /**
         * 接続するチャットのチャンネル名
         */
        channels: string[];
    };
}

export type JsonTypes = SettingsData;
