import { Collection, ColorResolvable } from 'discord.js';

import { DataPath } from '../../constants';
import { CommandsData, CommandData } from '../../typings/index';
import { FileManager } from '../FileManager';

export class CommandsJSON extends FileManager<CommandsData> {
    public total: number;
    public status: boolean;
    public coolDown: number;
    public cache: Collection<string, CommandData>;

    constructor() {
        super(DataPath.commands);
        this.cache = new Collection(null);
        this.total = 0;
        this.coolDown = 0;
        this.status = false;
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
        const { commands, total, coolDown, status } = this.read();
        commands.forEach((it) => this.cache.set(it._id, it));
        this.total = total;
        this.coolDown = coolDown;
        this.status = status;
    }

    toJSON(): CommandsData {
        return {
            total: this.cache.size,
            status: this.status,
            coolDown: this.coolDown,
            commands: this.cache.toJSON(),
        };
    }
}
