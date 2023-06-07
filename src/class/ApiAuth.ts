import { ArikenCompany } from '../ArikenCompany';

export class ApiAuthManager extends ArikenCompany {
    constructor(app: ArikenCompany) {
        super(app);
    }

    getKey(): string {
        return this.DM.getSettings().api.key;
    }

    compareKey(key: string): boolean {
        return this.getKey() === key;
    }

    refreshKey() {
        const newKey = this._generateKey();
        const settingsData = this.DM.getSettings();
        settingsData.api.key = newKey;
        this.DM.setSettings(settingsData);
    }

    _generateKey(): string {
        const API_KEY_LENGTH = 30;
        const CHARS_LENGTH = API_KEY_CHARS.length;
        let generatingKeys: string[] = [];
        let i = 0;
        while (i < API_KEY_LENGTH) {
            const keyIndex = Math.floor(Math.random() * CHARS_LENGTH);
            generatingKeys.push(API_KEY_CHARS[keyIndex]);
            i++;
        }
        return generatingKeys.join('');
    }
}

const API_KEY_CHARS = [
    'a',
    'A',
    'b',
    'B',
    'c',
    'C',
    'd',
    'D',
    'e',
    'E',
    'f',
    'F',
    'g',
    'G',
    'h',
    'H',
    'i',
    'I',
    'j',
    'J',
    'k',
    'K',
    'l',
    'L',
    'm',
    'M',
    'n',
    'N',
    'o',
    'O',
    'p',
    'P',
    'q',
    'Q',
    'r',
    'R',
    's',
    'S',
    't',
    'T',
    'u',
    'U',
    'v',
    'V',
    'w',
    'W',
    'x',
    'X',
    'y',
    'Y',
    'z',
    'Z',
    '$',
    '&',
    '%',
];
