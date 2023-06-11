import { ArikenCompanyDiscord } from './ArikenCompanyDiscord';
import { ArikenCompanyTwitch } from './ArikenCompanyTwitch';
import { DotEnv } from '../index';
import { SettingsJSON } from '../JSON/SettingsJSON';
import { Logger } from '../../utils/index';

export class ArikenCompany {
    public logger: Logger;
    public dotenv: DotEnv;
    public discord: ArikenCompanyDiscord;
    public settings: SettingsJSON;
    public twitch: ArikenCompanyTwitch;

    constructor() {
        this.logger = new Logger();
        this.dotenv = new DotEnv();
        this.discord = new ArikenCompanyDiscord(this);
        this.settings = new SettingsJSON();
        this.twitch = new ArikenCompanyTwitch(this);
    }

    async start() {
        this.logger.system('Starting app...');
        await this.discord.start();
        await this.twitch.start();
    }
}
