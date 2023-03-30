import { Base } from '../../class/Base';

export const twitchReady = (base: Base) => {
    base.logger.info(`Connected twitch chat to ${base.DM.getSettings().twitch.channels.join(', ')}`);
    base.logger.system('twitch client is ready.');
};
