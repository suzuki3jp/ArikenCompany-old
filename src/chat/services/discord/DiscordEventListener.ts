import { ClientEvents } from 'discord.js';

import { ArikenCompanyChat } from '@/chat/ArikenCompanyChat';

export interface DiscordEventListener<T extends keyof ClientEvents = keyof ClientEvents> {
    once?: boolean;
    name: T;
    handler: (client: ArikenCompanyChat, ...args: ClientEvents[T]) => Promise<void> | void;
}

export const isDiscordEventListener = (data: any): data is DiscordEventListener => {
    if (typeof data.once !== 'undefined' && typeof data.once !== 'boolean') return false;
    if (typeof data.name !== 'string') return false;
    if (typeof data.handler !== 'function') return false;
    return true;
};
