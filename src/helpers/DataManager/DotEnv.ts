import { config } from 'dotenv';
import { Env } from '@suzuki3jp/utils';

import { FilePaths } from '@/constants/FilePaths';
import { DotEnv as IDotEnv } from '@/helpers/typings';
import { DataManager } from '@/helpers/DataManager/DataManager';
import { makeError, ErrorMessages } from '@/helpers/errors/ArikenCompanyError';

export class DotEnv {
    public cache: IDotEnv = this.read();

    private path: string = FilePaths.env;
    private manager: DataManager = new DataManager(this.path);

    public set(env: keyof IDotEnv, value: string) {
        this.cache[env] = value;
        this.writeFromCache();
        this.refreshCache();
    }

    private writeFromCache() {
        const data = Env.parseToEnv(this.cache);
        this.manager.write(data);
    }

    private refreshCache() {
        this.cache = this.read();
    }

    private read(): IDotEnv {
        config();
        const { DISCORD_TOKEN, TWITCH_CLIENTID, TWITCH_CLIENTSECRET, TWITCH_TOKEN, TWITCH_REFRESHTOKEN, EVENTSUB_SECRET } = process.env;

        if (!DISCORD_TOKEN) throw makeError(ErrorMessages.EnvNotFound('DISCORD_TOKEN'));
        if (!TWITCH_CLIENTID) throw makeError(ErrorMessages.EnvNotFound('TWITCH_CLIENTID'));
        if (!TWITCH_CLIENTSECRET) throw makeError(ErrorMessages.EnvNotFound('TWITCH_CLIENTSECRET'));
        if (!TWITCH_TOKEN) throw makeError(ErrorMessages.EnvNotFound('TWITCH_TOKEN'));
        if (!TWITCH_REFRESHTOKEN) throw makeError(ErrorMessages.EnvNotFound('TWITCH_REFRESHTOKEN'));
        if (!EVENTSUB_SECRET) throw makeError(ErrorMessages.EnvNotFound('EVENTSUB_SECRET'));

        return {
            DISCORD_TOKEN,
            TWITCH_CLIENTID,
            TWITCH_CLIENTSECRET,
            TWITCH_REFRESHTOKEN,
            TWITCH_TOKEN,
            EVENTSUB_SECRET,
        };
    }
}
