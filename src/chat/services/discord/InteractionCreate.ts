import { Events, ClientEvents } from 'discord.js';

import { ArikenCompanyChat } from '@/chat/ArikenCompanyChat';
import { DiscordEventListener } from './DiscordEventListener';
import { LogMessages } from '@/helpers/Logger/Logger';

const interactionCreate: DiscordEventListener<Events.InteractionCreate> = {
    name: Events.InteractionCreate,
    handler: async (client: ArikenCompanyChat, ...args: ClientEvents[Events.InteractionCreate]) => {
        const [interaction] = args;

        if (interaction.isChatInputCommand()) {
            const command = client.slashCommands.get(interaction.commandName);

            if (!command) return client.logger.error(LogMessages.notFoundSlashCommand(interaction.commandName));

            await command.exec(client, interaction);
        }
    },
};

export default interactionCreate;
