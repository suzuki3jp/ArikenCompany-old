import { writeFileSync, readFileSync } from 'fs';

export class FileManager<FileType> {
    constructor(private path: string) {}

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
