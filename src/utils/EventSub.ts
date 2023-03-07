import { Base } from '../class/Base';
import { TwitchStream } from '../class/TwitchStream';

export const subscribeOnlineEvent = (base: Base, id: string) => {
    base.eventSub.subscribeToStreamOnlineEvents(id, (event) => new TwitchStream(base, event).turnOnline());
    base.emitDebug(`${id}の配信オンラインeventSubをリッスン`);
};

export const subscribeOfflineEvent = (base: Base, id: string) => {
    base.eventSub.subscribeToStreamOfflineEvents(id, (event) => new TwitchStream(base, event).turnOffline());
    base.emitDebug(`${id}の配信オフラインeventSubをリッスン`);
};
