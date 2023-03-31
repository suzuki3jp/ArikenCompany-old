import { ChattersJson } from '../class/JsonTypes';

export const convertPublicChatters = (chatters: ChattersJson): Record<string, number> => {
    let result: Record<string, number> = {};
    chatters.chatters.forEach((chatter) => {
        result[chatter.name] = chatter.messageCount;
    });
    return result;
};
