import { Message as DiscordMessage } from 'discord.js';

import { ArikenCompany } from '../ArikenCompany/ArikenCompany';
import { BaseChatCommand } from './BaseChatCommand';
import { TwitchMessage } from '../twitch/TwitchMessage';
import { CommandManager } from '../../managers/index';
import { ErrorMessages, LogMessages } from '../../utils/index';

export class ChatManageCommand {
    private commandManager: CommandManager;

    constructor(private client: ArikenCompany, private command: BaseChatCommand) {
        this.commandManager = new CommandManager(this.client);
    }

    async execute() {
        if (!this.command.isManageCommand) return;
        if (!this.isByManager()) return;
        this.client.logger.debug(LogMessages.RanManageCommand(this.command.platform.toLowerCase()));

        if (this.command.name === '!addcom') return await this.addCom();
        if (this.command.name === '!editcom') return await this.editCom();
        if (this.command.name === '!rmcom') return await this.removeCom();

        if (this.command.name === '!oncom') return await this.enableCom();
        if (this.command.name === '!offcom') return await this.disableCom();

        if (this.command.name === '!cooldown') {
            if (this.command.args[0]) return await this.setCoolDown();
            return await this.getCoolDown();
        }
    }

    private async addCom() {
        const commandName = this.command.args[0];
        const commandContent = this.command.args[1];

        // 引数が正しいか確認する
        if (!commandName || !commandContent) return this.reply(ErrorMessages.InvalidArgs);

        const result = this.commandManager.addCommandByName(commandName, commandContent);

        if (!result) return this.reply(ErrorMessages.CommandExists);
        this.client.logger.info(LogMessages.AddedCommandBy(this.getBy));
        await this.reply(`コマンドを追加しました ${result.name} ${result.content}`);
        return;
    }

    private async editCom() {
        const commandName = this.command.args[0];
        const commandContent = this.command.args[1];

        // 引数が正しいか確認する
        if (!commandName || !commandContent) return this.reply(ErrorMessages.InvalidArgs);

        const result = this.commandManager.editCommandByName(commandName, commandContent);

        if (!result) return this.reply(ErrorMessages.CommandNotExists);
        this.client.logger.info(LogMessages.EditedCommandBy(this.getBy));
        await this.reply(`コマンドを編集しました。 ${result.name} ${result.content}`);
        return;
    }

    private async removeCom() {
        const commandName = this.command.args[0];

        // 引数が正しいか確認する
        if (!commandName) return this.reply(ErrorMessages.InvalidArgs);

        const result = this.commandManager.removeCommandByName(commandName);

        if (!result) return this.reply(ErrorMessages.CommandNotExists);
        this.client.logger.info(LogMessages.RemovedCommandBy(this.getBy));
        await this.reply(`コマンドを削除しました。 ${result.name}`);
        return;
    }

    private async enableCom() {
        this.commandManager.enable();
        this.client.logger.info(LogMessages.EnabledCommandsBy(this.getBy));
        await this.reply(`コマンドを有効にしました。`);
    }

    private async disableCom() {
        this.commandManager.disable();
        this.client.logger.info(LogMessages.DisabledCommandsBy(this.getBy));
        await this.reply(`コマンドを無効にしました。`);
    }

    private async getCoolDown() {
        await this.reply(`現在のコマンドのクールタイム -> ${this.commandManager.getCoolDown()}s`);
    }

    private async setCoolDown() {
        const period = this.command.args[0];

        if (!period) return this.reply(ErrorMessages.InvalidArgs);
        const result = this.commandManager.setCoolDown(period);
        if (!result) return this.reply(ErrorMessages.InvalidCoolDownArgs(period));
        this.client.logger.info(LogMessages.SetCoolDownBy(this.getBy));
        await this.reply(`コマンドのクールタイムを変更しました。 -> ${result}s`);
    }

    private async reply(content: string) {
        if (this.command.platform === 'DISCORD') {
            const message = this.command.message as DiscordMessage;
            await message.reply({ content });
        } else {
            const message = this.command.message as TwitchMessage;
            await message.reply(content);
        }
    }

    private get getBy() {
        if (this.command.platform === 'DISCORD') {
            const message = this.command.message as DiscordMessage;
            return message.author.username;
        } else {
            const message = this.command.message as TwitchMessage;
            return message.user.name;
        }
    }

    private isByManager(): boolean {
        if (this.command.platform === 'DISCORD') {
            const message = this.command.message as DiscordMessage;
            return message.member?.roles.cache.has(this.client.settings.cache.discord.modRoleId) ?? false;
        } else {
            const message = this.command.message as TwitchMessage;
            return message.user.isBroadCaster || message.user.isMod;
        }
    }
}
