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
