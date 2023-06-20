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
         * 接続するチャットのチャンネル名
         */
        channels: string[];
    };
}

export interface CommandsData {
    total: number;
    status: boolean;
    coolDown: number;
    commands: CommandData[];
}

export interface CommandData {
    _id: string;
    name: string;
    content: string;
    created_at: string;
    updated_at: string;
    used_at: string;
    count: number;
}

export type JsonTypes = SettingsData | CommandsData;

export interface DateJSON {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliSeconds: number;
}
