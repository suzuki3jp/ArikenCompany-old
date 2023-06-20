import { ArikenCompanyDiscord } from './ArikenCompanyDiscord';
import { ArikenCompanyTwitch } from './ArikenCompanyTwitch';
import { DotEnv } from '../index';
import { SettingsJSON } from '../JSON/SettingsJSON';
import { LogMessages, Logger } from '../../utils/index';
import { CommandsJSON } from '../JSON/CommandsJSON';

export class ArikenCompany {
    public logger: Logger;
    public commands: CommandsJSON;
    public dotenv: DotEnv;
    public discord: ArikenCompanyDiscord;
    public settings: SettingsJSON;
    public twitch: ArikenCompanyTwitch;

    constructor() {
        this.logger = new Logger();
        this.commands = new CommandsJSON();
        this.dotenv = new DotEnv();
        this.discord = new ArikenCompanyDiscord(this);
        this.settings = new SettingsJSON();
        this.twitch = new ArikenCompanyTwitch(this);
    }

    async start() {
        this.logger.system(LogMessages.StartingApp);
        await this.discord.start();
        await this.twitch.start();
    }
}
