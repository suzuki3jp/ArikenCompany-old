"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncStreamStatusJson = void 0;
const syncStreamStatusJson = async (base) => {
    const { users } = base.DM.getStreamStatus();
    users.forEach(async (user, index) => {
        const currentUserStatus = await base.twitch._api.channels.getChannelInfoById(user.id);
        if (currentUserStatus) {
            const stream = await base.twitch._api.streams.getStreamByUserId(currentUserStatus.id);
            const newTwitchStreamer = {
                id: currentUserStatus.id,
                name: currentUserStatus.name,
                displayName: currentUserStatus.displayName,
                isStreaming: stream ? true : false,
                notificationChannelId: user.notificationChannelId,
            };
            users.splice(index, 1);
            users.splice(index, 0, newTwitchStreamer);
            base.DM.setStreamStatus({ users });
        }
        else
            return;
    });
};
exports.syncStreamStatusJson = syncStreamStatusJson;
