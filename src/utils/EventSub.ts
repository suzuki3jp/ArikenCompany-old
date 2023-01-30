import { Base } from '../class/Base';
import { TwitchStream } from '../class/TwitchStream';

export const subscribeOnlineEvent = (base: Base, id: string) => {
    base.eventSub.subscribeToStreamOnlineEvents(id, (event) => new TwitchStream(base, event).turnOnline());
};

export const subscribeOfflineEvent = (base: Base, id: string) => {
    base.eventSub.subscribeToStreamOfflineEvents(id, (event) => new TwitchStream(base, event).turnOffline());
};
