import { Env } from '@suzuki3jp/utils';
import { config } from 'dotenv';
import { writeFileSync } from 'fs';
config();

import { DataPath } from '../constants/index';
import { DotEnvData } from '../typings/index';

export class DotEnv {
    public DISCORD_TOKEN: string;

    public TWITCH_CLIENTID: string;
    public TWITCH_CLIENTSECRET: string;
    public TWITCH_HTTPSECRET: string;
    public TWITCH_TOKEN: string;
    public TWITCH_REFRESHTOKEN: string;

    constructor() {
        const {
            DISCORD_TOKEN,
            TWITCH_CLIENTID,
            TWITCH_CLIENTSECRET,
            TWITCH_HTTPSECRET,
            TWITCH_TOKEN,
            TWITCH_REFRESHTOKEN,
        } = process.env;

        if (!DISCORD_TOKEN) throw envError('DISCORD_TOKEN');
        if (!TWITCH_CLIENTID) throw envError('TWITCH_CLIENTID');
        if (!TWITCH_CLIENTSECRET) throw envError('TWITCH_CLIENTSECRET');
        if (!TWITCH_HTTPSECRET) throw envError('TWITCH_HTTPSECRET');
        if (!TWITCH_TOKEN) throw envError('TWITCH_TOKEN');
        if (!TWITCH_REFRESHTOKEN) throw envError('TWITCH_REFRESHTOKEN');

        this.DISCORD_TOKEN = DISCORD_TOKEN;
        this.TWITCH_CLIENTID = TWITCH_CLIENTID;
        this.TWITCH_CLIENTSECRET = TWITCH_CLIENTSECRET;
        this.TWITCH_HTTPSECRET = TWITCH_HTTPSECRET;
        this.TWITCH_TOKEN = TWITCH_TOKEN;
        this.TWITCH_REFRESHTOKEN = TWITCH_REFRESHTOKEN;
    }

    save(): DotEnvData {
        const data = this.toJSON();
        writeFileSync(DataPath.env, Env.parseToEnv(data), 'utf-8');
        return data;
    }

    toJSON(): DotEnvData {
        return {
            DISCORD_TOKEN: this.DISCORD_TOKEN,
            TWITCH_CLIENTID: this.TWITCH_CLIENTID,
            TWITCH_CLIENTSECRET: this.TWITCH_CLIENTSECRET,
            TWITCH_HTTPSECRET: this.TWITCH_HTTPSECRET,
            TWITCH_REFRESHTOKEN: this.TWITCH_REFRESHTOKEN,
            TWITCH_TOKEN: this.TWITCH_TOKEN,
        };
    }
}

const envError = (env: string) => new Error(`${env} not found in .env file.`);
