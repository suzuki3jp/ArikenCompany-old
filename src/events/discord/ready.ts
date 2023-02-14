// モジュールをインポート
import { Base } from '../../class/Base';
import { CommandManager } from '../../class/Command';
import { slashCommands } from '../../class/SlashCommands';

export const discordReady = async (base: Base) => {
    const settings = base.DM.getSettings();
    new CommandManager(base).syncCommandPanel();

    await base.discord.application?.commands.set(slashCommands, settings.discord.guildId);
    base.logger.emitLog('system', 'discord client is ready.');
};
