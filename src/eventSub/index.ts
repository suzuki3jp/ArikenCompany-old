import { ArikenCompany } from '../ArikenCompany';
import { TwitchStream } from '../class/TwitchStream';

export const eventSub = async (app: ArikenCompany) => {
    const eventsub = new TwitchStream(app);
    app.logger.system(`Twitch event-sub client is ready.`);
};
