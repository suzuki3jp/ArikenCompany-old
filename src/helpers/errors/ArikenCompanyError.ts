class ArikenCompanyError extends Error {
    constructor(...messages: string[]) {
        super();
        this.name = 'ArikenCompanyError';
        this.message = messages.join(' ');
    }
}

export const ErrorMessages = {
    CantStartArikenCompany: 'Can not start ArikenCompany. Call start() after calling setup().',
    CantSetupChat: `Can not setup chat. setup chat after calling ArikenCompany.setup().`,
    FileNotFound: (path: string) => `${path} not found.`,
    EnvNotFound: (env: string) => `${env} not found in .env file.`,
    TwitchTokenRefreshFailed: `Twitch token refresh failed.`,
    InvalidSlashCommandData: (path: string) => `Invalid slash command data. ${path}`,
    InvalidDiscordEventListener: (path: string) => `Invalid discord event listener. ${path}`,
};

export const makeError = (...messages: string[]): ArikenCompanyError => {
    return new ArikenCompanyError(...messages);
};
