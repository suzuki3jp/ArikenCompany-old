"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitchReady = void 0;
const twitchReady = (base) => {
    base.logger.emitLog('info', base.DM.getSettings().twitch.channels.join(', ') + ' のチャットに接続');
    base.logger.emitLog('system', 'twitch client is ready.');
};
exports.twitchReady = twitchReady;
