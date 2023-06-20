import { writeFileSync, readFileSync, existsSync } from 'fs';

import { makeError, ErrorMessages } from '../utils/index';
import { JsonTypes } from '../typings';

export class FileManager<FileType extends JsonTypes> {
    constructor(private path: string) {
        if (!existsSync(this.path)) throw makeError(ErrorMessages.FileNotFoud(this.path));
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
