import { Collection, ColorResolvable } from 'discord.js';

import { DataPath } from '../../constants';
import { CommandsData, CommandData } from '../../typings/index';
import { FileManager } from '../FileManager';

export class CommandsJSON extends FileManager<CommandsData> {
    public cache: Collection<string, CommandData>;

    constructor() {
        super(DataPath.commands);
        this.cache = new Collection(null);
        this.refreshCache();
    }

    write(data: string | CommandsData): void {
        super.write(data);
        this.refreshCache();
    }

    writeFromCache() {
        this.write(this.toJSON());
    }

    refreshCache() {
        const data = this.read();
        data.commands.forEach((it) => this.cache.set(it._id, it));
    }

    toJSON(): CommandsData {
        return {
            total: this.cache.size,
            commands: this.cache.toJSON(),
        };
    }
}
