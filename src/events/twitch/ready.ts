import { Base } from '../../class/Base';

export const twitchReady = (base: Base) => {
    base.logger.emitLog('system', 'twitch client is ready.');
};
