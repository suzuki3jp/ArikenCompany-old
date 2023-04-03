// [#60](https://github.com/suzuki3jp/ArikenCompany/issues/60)でのChattersデータ記録のミスのため、messageCountを0 -> 1に変更するscript
/**
 * とりあえず動けばいいやマインドで書いたからだいぶゴミコード
 * 使い捨てコードだしヨシ！
 */

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
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const chattersPath = resolve(__dirname, '../data/Chatters.json');

const convertChatters = async () => {
    const oldChatters = JSON.parse(readFileSync(chattersPath, 'utf-8'));

    let newChatters = { chatters: [] };
    oldChatters.chatters.forEach((c) => {
        if (c.messageCount !== 0) {
            newChatters.chatters.push(c);
        } else {
            const { _id, name, displayName } = c;
            newChatters.chatters.push({ _id, name, displayName, messageCount: 1 });
        }
    });

    const data = JSON.stringify(newChatters, null, '\t');
    writeFileSync(chattersPath, data, 'utf-8');
};

convertChatters();
