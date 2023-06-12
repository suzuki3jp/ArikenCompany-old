import { writeFileSync, readFileSync, existsSync } from 'fs';

import { ArikenCompanyError } from '../utils/index';

export class FileManager<FileType> {
    constructor(private path: string) {
        if (!existsSync(this.path)) throw new ArikenCompanyError(`File not found.`, this.path);
    }

    read(): FileType {
        return JSON.parse(readFileSync(this.path, 'utf-8'));
    }

    write(data: FileType | string) {
        if (typeof data === 'string') {
            writeFileSync(this.path, data, 'utf-8');
        } else {
            data = JSON.stringify(data, null, '\t');
            writeFileSync(this.path, data, 'utf-8');
        }
    }
}
