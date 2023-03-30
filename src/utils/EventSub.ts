import { Base } from '../class/Base';
import { TwitchStream } from '../class/TwitchStream';

export const subscribeOnlineEvent = (base: Base, id: string) => {
    base.eventSub.subscribeToStreamOnlineEvents(id, (event) => new TwitchStream(base, event).turnOnline());
    base.logger.info(`Listening stream event-sub ${id}`);
};

export const subscribeOfflineEvent = (base: Base, id: string) => {
    base.eventSub.subscribeToStreamOfflineEvents(id, (event) => new TwitchStream(base, event).turnOffline());
    base.logger.info(`Listening stream event-sub ${id}`);
};
