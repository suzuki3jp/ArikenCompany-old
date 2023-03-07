import { Base } from '../../class/Base';

export const twitchReady = (base: Base) => {
    base.logger.emitLog('info', base.DM.getSettings().twitch.channels.join(', ') + ' のチャットに接続');
    base.logger.emitLog('system', 'twitch client is ready.');
};
