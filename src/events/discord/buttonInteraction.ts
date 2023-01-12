import type { Client, ButtonInteraction } from 'discord.js';
import { DiscordButton } from '../../class/DiscordButton';

export const buttonInteraction = (client: Client, interaction: ButtonInteraction) => {
    const button = new DiscordButton(client, interaction);

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
        default:
            break;
    }
};
