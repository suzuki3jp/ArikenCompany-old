// nodeモジュールをインポート
import type { Client, Message, MessagePayload, ReplyMessageOptions } from 'discord.js';

// モジュールをインポート
import { DataManager } from '../../class/DataManager';
import { DiscordCommand } from '../../class/DiscordCommand';
import { DiscordValueParser } from '../../class/ValueParser';

// JSON Data Manager
const DM = new DataManager();

export const discordMessage = async (client: Client, message: Message) => {
    if (message.author.bot) return;
    const settings = DM.getSettings();
    const discordCommand = new DiscordCommand(client, message, settings.twitch.manageCommands);
    const reply = (options: string | MessagePayload | ReplyMessageOptions) => {
        message.reply(options);
    };

    if (!discordCommand.isCommand()) return;

    if (discordCommand.isManageCommands()) {
        const manageCommandName = discordCommand.manageCommandName();

        if (manageCommandName === '!oncom') {
            reply(discordCommand.onCom());
        } else if (manageCommandName === '!offcom') {
            reply(discordCommand.offCom());
        } else if (manageCommandName === '!addcom') {
            reply(await discordCommand.addCom());
        } else if (manageCommandName === '!editcom') {
            reply(await discordCommand.editCom());
        } else if (manageCommandName === '!rmcom') {
            reply(discordCommand.removeCom());
        } else if (manageCommandName === '!allow') {
            reply(discordCommand.allow());
        } else if (manageCommandName === '!deny') {
            reply(discordCommand.deny());
        } else if (manageCommandName === '!cooltime') {
            reply(discordCommand.coolTime());
        } else if (manageCommandName === '!setcooltime') {
            reply(discordCommand.changeCoolTime());
        }
    } else {
        if (!discordCommand.isOnCom()) return;
        const commandValue = discordCommand.commandValue();
        if (!commandValue) return;
        const valueParser = new DiscordValueParser();
        const valueParseResult = await valueParser.parse(commandValue, message);
        if (valueParseResult.status !== 200) return;
        reply(valueParseResult.content);
    }
};
