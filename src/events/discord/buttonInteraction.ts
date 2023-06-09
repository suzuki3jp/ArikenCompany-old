// nodeモジュールをインポート
import type { ButtonInteraction } from 'discord.js';
import { DiscordButton } from '../../class/DiscordButton';
import { ArikenCompany } from '../../ArikenCompany';

export const buttonInteraction = (app: ArikenCompany, interaction: ButtonInteraction) => {
    const button = new DiscordButton(app, interaction);

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
