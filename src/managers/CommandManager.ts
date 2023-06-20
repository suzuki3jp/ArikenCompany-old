import { Collection } from 'discord.js';
import { uid } from 'uid';

import { ArikenCompany } from '../structures';
import { CommandData } from '../typings';
import { UTCController } from '../utils';

export class CommandManager {
    constructor(private client: ArikenCompany) {}

    getCommands(): Collection<string, CommandData> {
        return this.client.commands.cache;
    }

    getCommandById(id: string): CommandData | null {
        return this.getCommands().get(id) ?? null;
    }

    getCommandByName(name: string): CommandData | null {
        const result = this.getCommands().filter((it) => it.name === name);
        return result.first() ?? null;
    }

    addCommandByName(name: string, content: string): CommandData | null {
        const now = new UTCController();
        const command = this.getCommandByName(name);
        if (command) return null;
        const data: CommandData = {
            _id: uid(),
            name: name,
            content: content,
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
            used_at: now.toISOString(),
            count: 0,
        };
        this.client.commands.cache.set(data._id, data);
        this.client.commands.writeFromCache();
        this.client.logger.info(`Added command. ${name} ${content}`);
        return data;
    }

    editCommandByName(name: string, content: string): CommandData | null {
        const now = new UTCController();
        const command = this.getCommandByName(name);
        if (!command) return null;
        const data: CommandData = {
            _id: command._id,
            name: command.name,
            content: command.content,
            created_at: command.created_at,
            updated_at: now.toISOString(),
            used_at: command.used_at,
            count: command.count,
        };
        this.client.commands.cache.set(data._id, data);
        this.client.commands.writeFromCache();
        this.client.logger.info(`Edited command. ${name} ${content}`);
        return data;
    }

    removeCommandByName(name: string): CommandData | null {
        const command = this.getCommandByName(name);
        if (!command) return null;
        this.client.commands.cache.delete(command._id);
        this.client.commands.writeFromCache();
        this.client.logger.info(`Removed command. ${name}`);
        return command;
    }

    updateUsedAtByName(name: string): CommandData | null {
        const now = new UTCController();
        const command = this.getCommandByName(name);
        if (!command) return null;
        const data: CommandData = {
            _id: command._id,
            name: command.name,
            content: command.content,
            created_at: command.created_at,
            updated_at: command.updated_at,
            used_at: now.toISOString(),
            count: command.count,
        };
        this.client.commands.cache.set(data._id, data);
        this.client.commands.writeFromCache();
        this.client.logger.info(`Update command used_at. ${data.name}`);
        return data;
    }

    incrementCountByName(name: string): CommandData | null {
        const command = this.getCommandByName(name);
        if (!command) return null;
        const data: CommandData = {
            _id: command._id,
            name: command.name,
            content: command.content,
            created_at: command.created_at,
            updated_at: command.updated_at,
            used_at: command.used_at,
            count: command.count + 1,
        };
        this.client.commands.cache.set(data._id, data);
        this.client.commands.writeFromCache();
        this.client.logger.info(`Incremented command count. ${data.name}`);
        return data;
    }

    getTotal(): number {
        return this.client.commands.cache.size;
    }
}
