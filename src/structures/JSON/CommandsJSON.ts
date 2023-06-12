import { DataPath } from '../../constants';
import { CommandsData } from '../../typings/index';
import { FileManager } from '../FileManager';

export class CommandsJSON extends FileManager<CommandsData> {
    public cache: CommandsData;

    constructor() {
        super(DataPath.commands);
        this.cache = this.read();
    }

    write(data: string | CommandsData): void {
        super.write(data);
        this.cache = this.read();
    }

    toJSON(): CommandsData {
        return this.cache;
    }
}
