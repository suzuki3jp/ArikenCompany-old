// [#52](https://github.com/suzuki3jp/ArikenCompany/issues/52)でのChattersデータ構造の変更に伴い、従来のデータから新データに変換するためのscript

/**
 * ```ts
 * type OldChattersData = Record<string, number>;
 * ```
 */

// convert to ↓

/**
 * ```ts
 * interface NewChattersData {
 *     chatters: { _id: string; name: string; displayName: string; messageCount: number }[];
 * }
 * ```
 */
import readline from 'readline';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { StaticAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { config } from 'dotenv';
config();

class ConsoleUpdater {
    constructor() {
        this.regularLines = 3;
        this.logQueue = [];

        process.stdout.write(Array(this.regularLines + 1).join('\n'));
    }

    /** @private */
    clearAndWrite(text) {
        readline.clearLine(process.stdout);
        process.stdout.write(text);
    }

    update(FetchingUserName, fetchedUsersLength, queueUsersLength) {
        readline.moveCursor(process.stdout, 0, -this.regularLines);
        readline.cursorTo(process.stdout, 0);

        while (this.logQueue.length > 0) {
            this.clearAndWrite(this.logQueue.shift());
        }

        this.clearAndWrite('##### Fetching Twitch Users ... #####\n');
        this.clearAndWrite(`Progress: ${fetchedUsersLength} / ${queueUsersLength}\n`);
        this.clearAndWrite(`Current fetching user: ${FetchingUserName}\n`);
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const chattersPath = resolve(__dirname, '../data/Chatters.json');

const convertChatters = async () => {
    if (!process.env.TWITCH_TOKEN || !process.env.TWITCH_CLIENTID) throw new Error('.env value is invalid.');
    const auth = new StaticAuthProvider(process.env.TWITCH_CLIENTID, process.env.TWITCH_TOKEN);
    const api = new ApiClient({ authProvider: auth });

    const oldChatters = JSON.parse(readFileSync(chattersPath, 'utf-8'));
    const chatterEntries = Object.entries(oldChatters);

    const consoleUpdater = new ConsoleUpdater();

    let newChatters = { chatters: [] };
    for (let i = 0; i < chatterEntries.length; i++) {
        const u = await fetch(chatterEntries[i], i, chatterEntries, api, consoleUpdater);
        if (u) {
            newChatters.chatters.push(u);
        }
    }

    const data = JSON.stringify(newChatters, null, '\t');
    writeFileSync(chattersPath, data, 'utf-8');
};

function fetch(c, i, a, api, cu) {
    // レートリミットを回避するために100msタイムアウトする
    // twitch api のレートリミットは 800req/m
    // https://dev.twitch.tv/docs/api/guide/#rate-limits
    return new Promise((resolve) => {
        setTimeout(async () => {
            const user = await api.users.getUserByName(c[0]);
            if (!user) return resolve(null);
            cu.update(user.name, i + 1, a.length);
            resolve({
                _id: user.id,
                name: user.name,
                displayName: user.displayName,
                messageCount: c[1],
            });
        }, 80);
    });
}

convertChatters();
