import { ArikenCompany } from '../ArikenCompany';
import { TwitchStreamer } from '../class/JsonTypes';

export const syncStreamStatusJson = async (app: ArikenCompany) => {
    const { users } = app.DM.getStreamStatus();
    users.forEach(async (user, index) => {
        const currentUserStatus = await app.client.twitch.api.channels.getChannelInfoById(user.id);
        if (currentUserStatus) {
            const stream = await app.client.twitch.api.streams.getStreamByUserId(currentUserStatus.id);
            const newTwitchStreamer: TwitchStreamer = {
                id: currentUserStatus.id,
                name: currentUserStatus.name,
                displayName: currentUserStatus.displayName,
                isStreaming: stream ? true : false,
                notificationChannelId: user.notificationChannelId,
            };
            users.splice(index, 1);
            users.splice(index, 0, newTwitchStreamer);
            app.DM.setStreamStatus({ users });
        } else return;
    });
};
