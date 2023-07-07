import { ArikenCompanyApi } from '@/api/ArikenCompanyApi';
import { ApiSSLManager } from '@/helpers/DataManager/ApiSSLManager';
import { SettingsJson } from '@/helpers/DataManager/SettingsJson';
import { Logger } from '@/helpers/Logger/Logger';

export class ArikenCompany {
    public apiSSL: ApiSSLManager = new ApiSSLManager();
    public settings: SettingsJson = new SettingsJson();
    public logger: Logger = new Logger('ArikenCompany');
    public api: ArikenCompanyApi = new ArikenCompanyApi(this);

    constructor() {}

    public start() {
        this.api.listen();
    }
}
