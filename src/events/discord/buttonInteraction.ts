// nodeモジュールをインポート
import { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import { Logger } from '@suzuki3jp/utils';
import type { ButtonInteraction, Client as Discord } from 'discord.js';
import { DiscordButton } from '../../class/DiscordButton';

export const buttonInteraction = (
    twitchClient: Twitch,
    discordClient: Discord,
    logger: Logger,
    interaction: ButtonInteraction
) => {
    const button = new DiscordButton(twitchClient, discordClient, logger, interaction);

    // コマンドパネルページネーション
    switch (button.type) {
        case 'panelNext':
            button.next();
            break;
        case 'panelPrevious':
            button.previous();
            break;
        case 'templateAdd':
            button.addTemplate();
            break;
        case 'template':
            button.editCommandByTemlate();
            break;
        case 'commandAdd':
            button.addCommand();
            break;
        case 'commandEdit':
            button.editCommand();
            break;
        case 'commandRemove':
            button.removeCommand();
            break;
        default:
            break;
    }
};
