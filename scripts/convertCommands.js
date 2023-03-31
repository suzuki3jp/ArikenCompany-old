// [#52](https://github.com/suzuki3jp/ArikenCompany/issues/52)でのCommandsデータ構造の変更に伴い、従来のデータから新データに変換するためのscript

/**
 * ```ts
 * type OldCommandsData = Record<string, string>;
 * ```
 */

// convert to ↓

/**
 * ```ts
 * interface NewCommandsData {
 *     commands: {
 *         _id: string;
 *         name: string;
 *         message: string;
 *         created_at: string;
 *         updated_at: string;
 *         last_used_at: string;
 *         count: number;
 *     }[];
 * }
 * ```
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const commandsPath = resolve(__dirname, '../data/Commands.json');

const convertCommands = () => {
    const oldCommands = JSON.parse(readFileSync(commandsPath, 'utf-8'));
    const commandEntries = Object.entries(oldCommands);

    let newCommands = { commands: [] };
    commandEntries.forEach((c) => {
        newCommands.commands.push({
            _id: randomUUID(),
            name: c[0],
            message: c[1],
            created_at: dayjs().toISOString(),
            updated_at: dayjs().toISOString(),
            last_used_at: dayjs().toISOString(),
            count: 0,
        });
    });
    const data = JSON.stringify(newCommands, null, '\t');
    writeFileSync(commandsPath, data, 'utf-8');
};

convertCommands();
