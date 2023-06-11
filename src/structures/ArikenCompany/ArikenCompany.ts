import { ArikenCompanyDiscord } from './ArikenCompanyDiscord';
import { DotEnv } from '../index';
import { Logger } from '../../utils/index';

export class ArikenCompany {
    public logger: Logger;
    public dotenv: DotEnv;
    public discord: ArikenCompanyDiscord;

    constructor() {
        this.logger = new Logger();
        this.dotenv = new DotEnv();
        this.discord = new ArikenCompanyDiscord(this);
    }

    async start() {
        this.logger.system('Starting app...');
        await this.discord.start();
    }
}
