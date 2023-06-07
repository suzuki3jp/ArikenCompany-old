import { ArikenCompany } from '../../ArikenCompany';

export const twitchReady = (app: ArikenCompany) => {
    app.logger.info(`Connected twitch chat to ${app.DM.getSettings().twitch.channels.join(', ')}`);
    app.logger.system('twitch client is ready.');
};
