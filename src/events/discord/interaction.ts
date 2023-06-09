// nodeモジュールをインポート
import type { Interaction } from 'discord.js';

// モジュールをインポート
import { commandInteraction } from './commandInteraction';
import { buttonInteraction } from './buttonInteraction';
import { modalInteraction } from './modalInteraction';
import { ArikenCompany } from '../../ArikenCompany';

export const discordInteraction = (app: ArikenCompany, interaction: Interaction) => {
    if (interaction.isButton()) return buttonInteraction(app, interaction);
    if (interaction.isCommand()) return commandInteraction(app, interaction);
    if (interaction.isModalSubmit()) return modalInteraction(app, interaction);
};
