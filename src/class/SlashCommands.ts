// nodeモジュールをインポート
import { ApplicationCommandDataResolvable } from 'discord.js';

const optionTypes = {
    SubCommand: 1,
    SubCommandGroup: 2,
    String: 3,
    Integer: 4,
    Boolean: 5,
    User: 6,
    Channel: 7,
    Role: 8,
    Mentionable: 9,
    Number: 10,
    Attachment: 11,
};

export const slashCommands: ApplicationCommandDataResolvable[] = [
    {
        name: 'setup',
        description: 'ArikenCompany setup command.',
        options: [
            {
                type: optionTypes.SubCommand,
                name: 'panel',
                description: 'setup manage command panel.',
            },
            {
                type: optionTypes.SubCommand,
                name: 'template',
                description: 'setup command value template.',
                options: [
                    {
                        type: optionTypes.String,
                        name: 'command',
                        description: 'target command name.',
                        required: true,
                    },
                ],
            },
            {
                type: optionTypes.SubCommand,
                name: 'notification',
                description: 'setup notification of onStream',
                options: [
                    {
                        type: optionTypes.String,
                        name: 'user',
                        description: 'tracking user name',
                        required: true,
                    },
                ],
            },
        ],
    },
];
