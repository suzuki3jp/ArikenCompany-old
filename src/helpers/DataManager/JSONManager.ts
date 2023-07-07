import { DataManager } from '@/helpers/DataManager/DataManager';
import { JsonTypes } from '@/helpers/typings';

const { parse, stringify } = JSON;

export class JSONManager<DataType extends JsonTypes> {
    private dataManager: DataManager;

    constructor(private path: string) {
        this.dataManager = new DataManager(this.path);
    }

    protected read(): DataType {
        return parse(this.dataManager.read());
    }

    protected write(data: DataType | string) {
        if (typeof data === 'string') {
            this.dataManager.write(data);
        } else {
            data = stringify(data, null, '\t');
            this.dataManager.write(data);
        }
    }
}
