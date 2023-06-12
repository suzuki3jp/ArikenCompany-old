import path from 'path';

const resolvePath = (relativePath: string) => path.resolve(__dirname, relativePath);

export class DataPath {
    public static readonly commands: string = resolvePath('../../data/Commands.json');
    public static readonly env: string = resolvePath('../../.env');
    public static readonly settings: string = resolvePath('../../data/settings.json');
}
