import { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import { EventSubWsListener } from '@twurple/eventsub-ws';

import { Base } from '../class/Base';
import { TwitchStream } from '../class/TwitchStream';

export const eventSub = (base: Base, eventSub: EventSubWsListener) => {
    const { users } = base.DM.getStreamStatus();
    users.forEach((value) => {
        eventSub.subscribeToStreamOnlineEvents(value.id, (event) => new TwitchStream(base, event).turnOnline());
        eventSub.subscribeToStreamOfflineEvents(value.id, (event) => new TwitchStream(base, event).turnOffline());
    });

    eventSub.start();
};
