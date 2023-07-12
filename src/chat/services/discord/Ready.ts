import { Events, ClientEvents } from 'discord.js';

import { ArikenCompanyChat } from '@/chat/ArikenCompanyChat';
import { DiscordEventListener } from './DiscordEventListener';
import { LogMessages } from '@/helpers/Logger/Logger';

const ready: DiscordEventListener<Events.ClientReady> = {
    once: true,
    name: Events.ClientReady,
    handler: async (client: ArikenCompanyChat, ...args: ClientEvents[Events.ClientReady]) => {
        const [readiedDiscord] = args;

        client.registerSlashCommands();
        client.logger.system(LogMessages.readyDiscordClient(readiedDiscord.user.username));
    },
};

export default ready;
