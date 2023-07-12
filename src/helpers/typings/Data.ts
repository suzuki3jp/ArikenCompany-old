export interface SettingsJson {
    api: {
        isSecure: boolean;
        port: number;
    };
    twitch: {
        channels: string[];
    };
    discord: {
        guildId: string;
    };
    mongoUrl: string;
}

export interface DotEnv {
    DISCORD_TOKEN: string;
    TWITCH_CLIENTID: string;
    TWITCH_CLIENTSECRET: string;
    TWITCH_TOKEN: string;
    TWITCH_REFRESHTOKEN: string;
    EVENTSUB_SECRET: string;
}

export type JsonTypes = SettingsJson;
