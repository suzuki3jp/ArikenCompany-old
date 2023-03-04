"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventSub = void 0;
const TwitchStream_1 = require("../class/TwitchStream");
const EventSub_1 = require("../utils/EventSub");
const StreamStatus_1 = require("../utils/StreamStatus");
const eventSub = async (base) => {
    await (0, StreamStatus_1.syncStreamStatusJson)(base);
    const { users } = base.DM.getStreamStatus();
    users.forEach((user) => {
        (0, EventSub_1.subscribeOnlineEvent)(base, user.id);
        (0, EventSub_1.subscribeOfflineEvent)(base, user.id);
        if (user.name !== TwitchStream_1.ARIKEN_TWITCH_ID)
            return;
        base.discord.on('ready', () => (0, TwitchStream_1.changeArikenActivity)(user.isStreaming, base));
    });
    base.eventSub.start();
};
exports.eventSub = eventSub;
