class ArikenCompanyError extends Error {
    constructor(...messages: string[]) {
        super();
        this.name = 'ArikenCompanyError';
        this.message = messages.join(' ');
    }
}

export const ErrorMessages = {
    CantStartArikenCompany: 'Can not start ArikenCompany. Call start() after calling setup().',
    FileNotFound: (path: string) => `${path} not found.`,
    EnvNotFound: (env: string) => `${env} not found in .env file.`,
    TwitchTokenRefreshFailed: `Twitch token refresh failed.`,
};

export const makeError = (...messages: string[]): ArikenCompanyError => {
    return new ArikenCompanyError(...messages);
};
