import { resolve } from 'path';

const resolvePath = (relativePath: string) => resolve(__dirname, relativePath);

export class FilePaths {
    public static readonly env: string = resolvePath('../../.env');
    public static readonly settings: string = resolvePath('../../data/settings.json');
}
