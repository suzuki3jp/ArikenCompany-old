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

export interface CommandsData {
    total: number;
    commands: CommandData[];
}

export interface CommandData {
    name: string;
    content: string;
    created_at: string;
    updated_at: string;
    used_at: string;
    count: number;
}

export type JsonTypes = SettingsData;
