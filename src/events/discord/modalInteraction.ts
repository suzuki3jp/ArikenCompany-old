// nodeモジュールをインポート
import { TwitchClient as Twitch } from '@suzuki3jp/twitch.js';
import { Logger } from '@suzuki3jp/utils';
import { Message } from 'discord.js';
import type { Client as Discord, ModalSubmitInteraction } from 'discord.js';

// モジュールをインポート
import { Base } from '../../class/Base';
import { DiscordModal } from '../../class/DiscordModal';

export const modalInteraction = async (base: Base, interaction: ModalSubmitInteraction) => {
    const modal = new DiscordModal(base, interaction);

    if (interaction.message instanceof Message) {
        switch (modal.type) {
            case 'templateAdd':
                modal.reply(await modal.addTemplate(), true);
                break;
            case 'commandAdd':
                modal.reply(await modal.addCommand(), true);
                break;
            case 'commandEdit':
                modal.reply(await modal.editCommand(), true);
                break;
            case 'commandRemove':
                modal.reply(await modal.removeCommand(), true);
                break;
            default:
                break;
        }
    }
};
