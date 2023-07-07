import { resolve } from 'path';

const resolvePath = (relativePath: string) => resolve(__dirname, relativePath);

export class FilePaths {
    public static readonly env: string = resolvePath('../../.env');
    public static readonly settings: string = resolvePath('../../data/settings.json');
    public static readonly apiSSL: { key: string; cert: string } = {
        key: '/etc/letsencrypt/live/api.suzuki3jp.xyz/privkey.pem',
        cert: '/etc/letsencrypt/live/api.suzuki3jp.xyz/fullchain.pem',
    };
}
