import { ArikenCompany } from '../ArikenCompany';
import { TwitchStream } from '../class/TwitchStream';

export const subscribeOnlineEvent = (app: ArikenCompany, id: string) => {
    app.client.twitch.eventSub.onStreamOnline(id, (event) => new TwitchStream(app, event).turnOnline());
    app.logger.info(`Listening stream event-sub ${id}`);
};

export const subscribeOfflineEvent = (app: ArikenCompany, id: string) => {
    app.client.twitch.eventSub.onStreamOffline(id, (event) => new TwitchStream(app, event).turnOffline());
    app.logger.info(`Listening stream event-sub ${id}`);
};
