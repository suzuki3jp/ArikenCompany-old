import { Base } from '../class/Base';
import { subscribeOfflineEvent, subscribeOnlineEvent } from '../utils/EventSub';

export const eventSub = (base: Base) => {
    const { users } = base.DM.getStreamStatus();
    users.forEach((value) => {
        subscribeOnlineEvent(base, value.id);
        subscribeOfflineEvent(base, value.id);
    });

    base.eventSub.start();
};
