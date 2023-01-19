export type CommandsJson = Record<string, string>;

export type CooltimeJson = Record<string, number>;

export interface ManagersJson {
    managers: string[];
}

export type MessageCounterJson = Record<string, number>;

export type PublicCommandsJson = Record<string, string>;

export interface SettingsJson {
    discord: {
        modRoleId: string;
        guildId: string;
        manageCommandChannelId: string;
        manageCommandPanelId: string | null;
    };
    twitch: {
        channelName: string;
        channels: string[];
        manageCommands: string[];
        command: boolean;
        cooltime: number;
    };
    api: {
        port: number;
    };
}
