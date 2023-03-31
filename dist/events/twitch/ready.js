"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitchReady = void 0;
const twitchReady = (base) => {
    base.logger.info(`Connected twitch chat to ${base.DM.getSettings().twitch.channels.join(', ')}`);
    base.logger.system('twitch client is ready.');
};
exports.twitchReady = twitchReady;
