// モジュールをインポート
import { discordInteraction, discordMessage, discordReady } from './discord/index';
import { twitchMessage, twitchReady } from './twitch/index';
import { Message } from '../twitchjs/index';
import { ArikenCompany } from '../ArikenCompany';

export const events = (app: ArikenCompany) => {
    // discord events
    app.client.discord.on('ready', () => discordReady(app));

    app.client.discord.on('messageCreate', (message) => discordMessage(app, message));

    app.client.discord.on('interactionCreate', (interaction) => discordInteraction(app, interaction));

    // twitch events
    app.client.twitch.chat.onConnect(() => twitchReady(app));

    app.client.twitch.chat.onMessage((channel, user, text, message) => twitchMessage(app, new Message(app, channel, text, message)));

    // logger events
    app.logger.on('debug', (msg) => {
        if (process.argv.includes('--debug')) {
            console.log(msg);
        }
    });

    app.logger.on('system', (msg) => {
        console.log(msg);
        app.logger.appendToCsv(msg);
    });

    app.logger.on('info', (msg) => {
        console.log(msg);
        app.logger.appendToCsv(msg);
    });

    // app start
    app.start();
};
