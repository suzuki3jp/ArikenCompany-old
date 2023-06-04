// nodeモジュールをインポート
import { Message } from 'discord.js';
import type { ModalSubmitInteraction } from 'discord.js';

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
