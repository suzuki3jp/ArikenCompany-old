"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeOfflineEvent = exports.subscribeOnlineEvent = void 0;
const TwitchStream_1 = require("../class/TwitchStream");
const subscribeOnlineEvent = (base, id) => {
    base.eventSub.subscribeToStreamOnlineEvents(id, (event) => new TwitchStream_1.TwitchStream(base, event).turnOnline());
    base.logger.info(`Listening stream event-sub ${id}`);
};
exports.subscribeOnlineEvent = subscribeOnlineEvent;
const subscribeOfflineEvent = (base, id) => {
    base.eventSub.subscribeToStreamOfflineEvents(id, (event) => new TwitchStream_1.TwitchStream(base, event).turnOffline());
    base.logger.info(`Listening stream event-sub ${id}`);
};
exports.subscribeOfflineEvent = subscribeOfflineEvent;
