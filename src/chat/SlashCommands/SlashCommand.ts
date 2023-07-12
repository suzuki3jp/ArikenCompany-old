import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ArikenCompanyChat } from '@/chat/ArikenCompanyChat';

export interface SlashCommand {
    data: SlashCommandBuilder;
    exec: (client: ArikenCompanyChat, interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const isSlashCommand = (data: any): data is SlashCommand => {
    if (!(data.data instanceof SlashCommandBuilder)) return false;
    if (typeof data.exec !== 'function') return false;
    return true;
};
