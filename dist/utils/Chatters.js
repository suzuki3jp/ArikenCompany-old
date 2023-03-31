"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPublicChatters = void 0;
const convertPublicChatters = (chatters) => {
    let result = {};
    chatters.chatters.forEach((chatter) => {
        result[chatter.name] = chatter.messageCount;
    });
    return result;
};
exports.convertPublicChatters = convertPublicChatters;
