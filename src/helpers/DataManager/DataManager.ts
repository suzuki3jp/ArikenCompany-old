import { readFileSync, writeFileSync, existsSync } from 'fs';

import { makeError, ErrorMessages } from '@/helpers/errors/ArikenCompanyError';

export class DataManager {
    constructor(private path: string, checkExists: boolean = true) {
        if (!checkExists) return;
        if (!existsSync(this.path)) throw makeError(ErrorMessages.FileNotFound(this.path));
    }

    public read(): string {
        return readFileSync(this.path, 'utf-8');
    }

    public write(data: string) {
        writeFileSync(this.path, data, 'utf-8');
    }
}
