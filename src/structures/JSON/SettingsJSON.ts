import { DataPath } from '../../constants/index';
import { SettingsData } from '../../typings/index';
import { FileManager } from '../FileManager';

export class SettingsJSON extends FileManager<SettingsData> {
    cache: SettingsData;

    constructor() {
        super(DataPath.settings);
        this.cache = this.read();
    }

    write(data: string | SettingsData): void {
        super.write(data);
        this.cache = this.read();
    }

    toJSON(): SettingsData {
        return this.cache;
    }
}
