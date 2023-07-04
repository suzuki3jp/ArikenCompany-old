import { valueOf } from '@/helpers/typings';

class ArikenCompanyError extends Error {
    constructor(...messages: string[]) {
        super();
        this.name = 'ArikenCompanyError';
        this.message = messages.join(' ');
    }
}

export const ErrorMessages = {
    FileNotFound: (path: string) => `${path} not found.`,
};

export const makeError = (...messages: string[]): ArikenCompanyError => {
    return new ArikenCompanyError(...messages);
};
