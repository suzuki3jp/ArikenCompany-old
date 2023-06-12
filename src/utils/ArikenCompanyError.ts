export class ArikenCompanyError extends Error {
    constructor(...messages: string[]) {
        super(messages.join(' '));
        this.name = 'ArikenCompanyError';
    }
}
