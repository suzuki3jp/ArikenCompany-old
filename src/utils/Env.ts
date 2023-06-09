import { config } from 'dotenv';
config();

import { DotEnv } from '../class/JsonTypes';

export const dotenv = (): DotEnv => {
    const { TWITCH_TOKEN, TWITCH_REFRESHTOKEN, TWITCH_CLIENTID, TWITCH_CLIENTSECRET, DISCORD_TOKEN, TWITCH_HTTPSECRET } = process.env;

    if (!TWITCH_TOKEN) throw envError('TWITCH_TOKEN');
    if (!TWITCH_CLIENTID) throw envError('TWITCH_REFRESHTOKEN');
    if (!TWITCH_CLIENTSECRET) throw envError('TWITCH_CLIENTSECRET');
    if (!TWITCH_REFRESHTOKEN) throw envError('TWITCH_REFRESHTOKEN');
    if (!DISCORD_TOKEN) throw envError('DISCORD_TOKEN');
    if (!TWITCH_HTTPSECRET) throw envError('TWITCH_HTTPSECRET');

    return { TWITCH_CLIENTID, TWITCH_CLIENTSECRET, TWITCH_REFRESHTOKEN, TWITCH_TOKEN, DISCORD_TOKEN, TWITCH_HTTPSECRET };
};

const envError = (env: string): Error => new Error(`${env} not found in .env file.`);
