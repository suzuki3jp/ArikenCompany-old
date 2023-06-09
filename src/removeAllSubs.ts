import { StaticAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { dotenv } from './utils/Env';
(async () => {
    const envs = dotenv();
    const auth = new StaticAuthProvider(envs.TWITCH_CLIENTID, envs.TWITCH_TOKEN);
    const api = new ApiClient({ authProvider: auth });
    console.log(await api.eventSub.getSubscriptions());
    await api.eventSub.deleteAllSubscriptions();
    console.log(await api.eventSub.getSubscriptions());
})();
