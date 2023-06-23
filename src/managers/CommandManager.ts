import { Collection } from 'discord.js';
import { uid } from 'uid';

import { ArikenCompany } from '../structures';
import { CommandData } from '../typings';
import { LogMessages, UTCController } from '../utils';

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
        this.client.logger.info(LogMessages.AddedCommand(data.name, data.content));
        return data;
    }

    editCommandByName(name: string, content: string): CommandData | null {
        const now = new UTCController();
        const command = this.getCommandByName(name);
        if (!command) return null;
        const data: CommandData = {
            _id: command._id,
            name: command.name,
            content: content,
            created_at: command.created_at,
            updated_at: now.toISOString(),
            used_at: command.used_at,
            count: command.count,
        };
        this.client.commands.cache.set(data._id, data);
        this.client.commands.writeFromCache();
        this.client.logger.info(LogMessages.EditedCommand(data.name, data.content));
        return data;
    }

    removeCommandByName(name: string): CommandData | null {
        const command = this.getCommandByName(name);
        if (!command) return null;
        this.client.commands.cache.delete(command._id);
        this.client.commands.writeFromCache();
        this.client.logger.info(LogMessages.RemovedCommand(name));
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
        this.client.logger.info(LogMessages.UpdatedCommandUsedAt(data.name));
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
        this.client.logger.info(LogMessages.IncrementedCommandCount(data.name));
        return data;
    }

    enable(): boolean {
        this.client.commands.status = true;
        this.client.commands.writeFromCache();
        this.client.logger.info(LogMessages.EnabledCommands);
        return this.client.commands.status;
    }

    disable(): boolean {
        this.client.commands.status = false;
        this.client.commands.writeFromCache();
        this.client.logger.info(LogMessages.DisabledCommands);
        return this.client.commands.status;
    }

    getCoolDown(): number {
        return this.client.commands.coolDown;
    }

    setCoolDown(period: number | string): number | null {
        if (typeof period === 'string') period = parseInt(period);
        if (isNaN(period)) return null;

        this.client.commands.coolDown = period;
        this.client.commands.writeFromCache();
        this.client.logger.info(LogMessages.SetCoolDown(period));
        return this.client.commands.coolDown;
    }

    getTotal(): number {
        return this.client.commands.cache.size;
    }
}
