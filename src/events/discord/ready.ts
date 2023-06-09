// モジュールをインポート
import { ArikenCompany } from '../../ArikenCompany';
import { CommandManager } from '../../class/Command';
import { slashCommands } from '../../class/SlashCommands';

export const discordReady = async (app: ArikenCompany) => {
    const settings = app.DM.getSettings();
    new CommandManager(app).syncCommandPanel();

    await app.streamNotifications.reloadStreamerDataById();
    await app.streamNotifications.syncArikenStatus();
    await app.client.discord.application?.commands.set(slashCommands, settings.discord.guildId);
    app.logger.system('discord client is ready. ' + app.client.discord.user?.username);
};
