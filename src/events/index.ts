// モジュールをインポート
import { Base } from '../class/Base';
import { discordInteraction, discordMessage, discordReady } from './discord/index';
import { twitchMessage, twitchReady } from './twitch/index';

export const events = (base: Base, discordToken: string) => {
    // discord events
    base.discord.on('ready', () => discordReady(base));

    base.discord.on('messageCreate', (message) => discordMessage(base, message));

    base.discord.on('interactionCreate', (interaction) => discordInteraction(base, interaction));

    // twitch events
    base.twitch.on('ready', () => twitchReady(base));

    base.twitch.on('messageCreate', (message) => twitchMessage(base, message));

    // logger events
    base.logger.on('debug', (msg) => {
        if (process.argv.includes('--debug')) {
            console.log(msg);
        }
    });

    base.logger.on('system', (msg) => {
        console.log(msg);
        base.logger.appendToCsv(msg);
    });

    base.logger.on('info', (msg) => {
        console.log(msg);
        base.logger.appendToCsv(msg);
    });

    // client login
    base.twitch.login();
    base.discord.login(discordToken);
};
