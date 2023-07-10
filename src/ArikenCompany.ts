import { ArikenCompanyApi } from '@/api/ArikenCompanyApi';
import { Database } from '@/Database';
import { DotEnv } from '@/helpers/DataManager/DotEnv';
import { ApiSSLManager } from '@/helpers/DataManager/ApiSSLManager';
import { SettingsJson } from '@/helpers/DataManager/SettingsJson';
import { makeError, ErrorMessages } from '@/helpers/errors/ArikenCompanyError';
import { Logger } from '@/helpers/Logger/Logger';
import { TwitchAuth } from '@/helpers/Twitch/TwitchAuth';
import { TwitchApi } from '@/helpers/Twitch/TwitchApi';

export class ArikenCompany {
    public apiSSL: ApiSSLManager = new ApiSSLManager();
    public settings: SettingsJson = new SettingsJson();
    public logger: Logger = new Logger('ArikenCompany');
    public dotenv: DotEnv = new DotEnv();

    public api: ArikenCompanyApi = new ArikenCompanyApi(this);
    public db: Database = new Database(this);
    public twitchApi: TwitchApi | null = null;

    private ready: boolean = false;

    isReady(): this is this & { twitchApi: TwitchApi } {
        return this.ready;
    }

    public start() {
        if (!this.isReady()) throw makeError(ErrorMessages.CantStartArikenCompany);
        this.api.listen();
    }

    public async setup() {
        const auth = await TwitchAuth.build(this);
        this.twitchApi = new TwitchApi(auth);
        await this.db.connect();
        this.ready = true;
    }
}
