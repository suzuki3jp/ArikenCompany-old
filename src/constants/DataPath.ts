import path from 'path';

const resolvePath = (relativePath: string) => path.resolve(__dirname, relativePath);

export class DataPath {
    public static readonly env: string = resolvePath('../../.env');
}
