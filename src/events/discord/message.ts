import { readFileSync } from 'fs';
import path from 'path';
import type { Client, Message } from 'discord.js';

import { DiscordCommand } from '../../class/DiscordCommand';
import { DiscordValueParser } from '../../class/ValueParser';

const settingsPath = path.resolve(__dirname, '../../data/settings.json');

export const discordMessage = async (client: Client, message: Message) => {
    const settings: { twitch: { manageCommands: string[] } } = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    const discordCommand = new DiscordCommand(client, message, settings.twitch.manageCommands);
    const reply = message.reply;
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
