import { readFileSync, writeFileSync, existsSync } from 'fs';

import { makeError, ErrorMessages } from '@/helpers/errors/ArikenCompanyError';
import { JsonTypes } from '@/helpers/typings';

const { parse, stringify } = JSON;

export class DataManager<DataType extends JsonTypes> {
    constructor(private path: string) {
        if (!existsSync(this.path)) throw makeError(ErrorMessages.FileNotFound(this.path));
    }

    protected read(): DataType {
        return parse(readFileSync(this.path, 'utf-8'));
    }

    protected write(data: DataType | string) {
        if (typeof data === 'string') {
            writeFileSync(this.path, data, 'utf-8');
        } else {
            data = stringify(data, null, '\t');
            writeFileSync(this.path, data, 'utf-8');
        }
    }
}
