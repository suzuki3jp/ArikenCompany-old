import { ArikenCompanyApi } from '@/api/ArikenCompanyApi';
import { DotEnv } from '@/helpers/DataManager/DotEnv';
import { ApiSSLManager } from '@/helpers/DataManager/ApiSSLManager';
import { SettingsJson } from '@/helpers/DataManager/SettingsJson';
import { makeError, ErrorMessages } from '@/helpers/errors/ArikenCompanyError';
import { Logger } from '@/helpers/Logger/Logger';
import { TwitchAuth } from '@/helpers/Twitch/TwitchAuth';

export class ArikenCompany {
    public apiSSL: ApiSSLManager = new ApiSSLManager();
    public settings: SettingsJson = new SettingsJson();
    public logger: Logger = new Logger('ArikenCompany');
    public dotenv: DotEnv = new DotEnv();

    public api: ArikenCompanyApi = new ArikenCompanyApi(this);
    public twitchAuth: TwitchAuth | null;

    private ready: boolean = false;
    constructor() {
        this.twitchAuth = null;
    }

    isReady(): this is this & { twitchAuth: TwitchAuth } {
        return this.ready;
    }

    public start() {
        if (!this.isReady()) throw makeError(ErrorMessages.CantStartArikenCompany);
        this.api.listen();
    }

    public async setup() {
        this.twitchAuth = await TwitchAuth.build(this);
        this.ready = true;
    }
}
