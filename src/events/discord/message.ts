// nodeモジュールをインポート
import type { Message, MessagePayload, ReplyMessageOptions } from 'discord.js';

// モジュールをインポート
import { Base } from '../../class/Base';
import { DiscordCommand } from '../../class/DiscordCommand';
import { ValueParser } from '../../class/ValueParser';

export const discordMessage = async (base: Base, message: Message) => {
    if (message.author.bot) return;
    const discordCommand = new DiscordCommand(base, message);
    const reply = (options: string | MessagePayload | ReplyMessageOptions) => {
        message.reply(options);
    };
    setTimeout(() => {}, 0);

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
            reply(await discordCommand.removeCom());
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
        const valueParser = new ValueParser();
        const valueParseResult = await valueParser.parse(commandValue, message);
        if (valueParseResult.status !== 200) return;
        reply(valueParseResult.content);
    }
};
