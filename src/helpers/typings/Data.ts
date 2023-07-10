export interface SettingsJson {
    api: {
        isSecure: boolean;
        port: number;
    };
    mongoUrl: string;
}

export interface DotEnv {
    TWITCH_CLIENTID: string;
    TWITCH_CLIENTSECRET: string;
    TWITCH_TOKEN: string;
    TWITCH_REFRESHTOKEN: string;
}

export type JsonTypes = SettingsJson;
