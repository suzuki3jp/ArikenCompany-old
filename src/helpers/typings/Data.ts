export interface SettingsJson {
    api: {
        isSecure: boolean;
        port: number;
    };
}

export type JsonTypes = SettingsJson;
