import { ArikenCompany } from '../ArikenCompany';
import { changeArikenActivity, ARIKEN_TWITCH_ID } from '../class/TwitchStream';
import { subscribeOfflineEvent, subscribeOnlineEvent } from '../utils/EventSub';
import { syncStreamStatusJson } from '../utils/StreamStatus';

export const eventSub = async (app: ArikenCompany) => {
    await syncStreamStatusJson(app);
    const { users } = app.DM.getStreamStatus();
    users.forEach((user) => {
        subscribeOnlineEvent(app, user.id);
        subscribeOfflineEvent(app, user.id);

        if (user.name !== ARIKEN_TWITCH_ID) return;
        app.client.discord.on('ready', () => changeArikenActivity(user.isStreaming, app));
    });

    app.client.twitch.eventSub.start();
    app.logger.system(`Twitch event-sub client is ready.`);
};
