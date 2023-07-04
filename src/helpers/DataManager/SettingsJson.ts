import { FilePaths } from '@/constants/FilePaths';
import { DataManager } from '@/helpers/DataManager/DataManager';
import { SettingsJson as ISettingsJson } from '@/helpers/typings';

export class SettingsJson extends DataManager<ISettingsJson> {
    public cache: ISettingsJson;

    constructor() {
        super(FilePaths.settings);
        this.cache = this.read();
    }

    public write(data: ISettingsJson | string) {
        super.write(data);
        this.refreshCache();
    }

    private refreshCache() {
        this.cache = this.read();
    }
}
