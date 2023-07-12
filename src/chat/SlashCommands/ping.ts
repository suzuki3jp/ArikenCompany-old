import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import { ArikenCompanyChat } from '@/chat/ArikenCompanyChat';
import { SlashCommand } from './SlashCommand';

const ping: SlashCommand = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies client ping.'),
    exec: async (client: ArikenCompanyChat, interaction: ChatInputCommandInteraction) => {
        interaction.reply({ content: `${interaction.client.ws.ping}` });
    },
};

export default ping;
