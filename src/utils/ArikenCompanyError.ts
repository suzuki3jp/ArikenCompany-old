class ArikenCompanyError extends Error {
    constructor(...messages: string[]) {
        super(messages.join(' '));
        this.name = 'ArikenCompanyError';
    }
}

export const ErrorMessages = {
    // managing command error
    InvalidArgs: '必要な引数が入力されていません。',
    InvalidCoolDownArgs: (period: string) => `クールダウンが不正な値です。 [${period}]`,
    CommandExists: 'コマンドがすでに存在します。',
    CommandNotExists: 'コマンドが存在しません。',

    // file error
    FileNotFoud: (path: string) => `File not found. ${path}`,

    // env error
    EnvNotFound: (env: string) => `${env} not found in .env file.`,
};

export const makeError = (message: string): ArikenCompanyError => {
    return new ArikenCompanyError(message);
};
