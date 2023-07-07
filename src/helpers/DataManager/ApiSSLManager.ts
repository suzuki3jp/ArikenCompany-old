import { FilePaths } from '@/constants/FilePaths';
import { DataManager } from '@/helpers/DataManager/DataManager';

export class ApiSSLManager {
    private managers: { key: DataManager; cert: DataManager };
    constructor() {
        this.managers = {
            key: new DataManager(FilePaths.apiSSL.key),
            cert: new DataManager(FilePaths.apiSSL.cert),
        };
    }

    read(): { key: string; cert: string } {
        return {
            key: this.managers.key.read(),
            cert: this.managers.cert.read(),
        };
    }
}
