import { Base } from '../class/Base';
import { changeArikenActivity, ARIKEN_TWITCH_ID } from '../class/TwitchStream';
import { subscribeOfflineEvent, subscribeOnlineEvent } from '../utils/EventSub';
import { syncStreamStatusJson } from '../utils/StreamStatus';

export const eventSub = async (base: Base) => {
    await syncStreamStatusJson(base);
    const { users } = base.DM.getStreamStatus();
    users.forEach((user) => {
        subscribeOnlineEvent(base, user.id);
        subscribeOfflineEvent(base, user.id);

        if (user.name !== ARIKEN_TWITCH_ID) return;
        base.discord.on('ready', () => changeArikenActivity(user.isStreaming, base));
    });

    base.twitchEventSub.start();
    base.logger.system(`Twitch event-sub client is ready.`);
};
