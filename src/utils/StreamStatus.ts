import { Base } from '../class/Base';
import { TwitchStreamer } from '../class/JsonTypes';

export const syncStreamStatusJson = async (base: Base) => {
    const { users } = base.DM.getStreamStatus();
    users.forEach(async (user, index) => {
        const currentUserStatus = await base.twitch._api.channels.getChannelInfoById(user.id);
        if (currentUserStatus) {
            const stream = await base.twitch._api.streams.getStreamByUserId(currentUserStatus.id);
            const newTwitchStreamer: TwitchStreamer = {
                id: currentUserStatus.id,
                name: currentUserStatus.name,
                displayName: currentUserStatus.displayName,
                isStreaming: stream ? true : false,
                notificationChannelId: user.notificationChannelId,
            };
            users.splice(index, 1);
            users.splice(index, 0, newTwitchStreamer);
            base.DM.setStreamStatus({ users });
        } else return;
    });
};
