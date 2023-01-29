// nodeモジュールをインポート
import { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import { Logger } from '@suzuki3jp/utils';
import type { Client as Discord, Message, MessagePayload, ReplyMessageOptions } from 'discord.js';

// モジュールをインポート
import { DiscordCommand } from '../../class/DiscordCommand';
import { ValueParser } from '../../class/ValueParser';

export const discordMessage = async (
    twitchClient: Twitch,
    discordClient: Discord,
    logger: Logger,
    message: Message
) => {
    if (message.author.bot) return;
    const discordCommand = new DiscordCommand(twitchClient, discordClient, logger, message);
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
        const valueParser = new ValueParser();
        const valueParseResult = await valueParser.parse(commandValue, message);
        if (valueParseResult.status !== 200) return;
        reply(valueParseResult.content);
    }
};
