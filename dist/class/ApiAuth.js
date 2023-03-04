"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAuthManager = void 0;
const Base_1 = require("./Base");
class ApiAuthManager extends Base_1.Base {
    constructor(base) {
        super(base.twitch, base.discord, base.eventSub, base.logger, base.api.app, base.api.server);
    }
    getKey() {
        return this.DM.getSettings().api.key;
    }
    compareKey(key) {
        return this.getKey() === key;
    }
    refreshKey() {
        const newKey = this._generateKey();
        const settingsData = this.DM.getSettings();
        settingsData.api.key = newKey;
        this.DM.setSettings(settingsData);
    }
    _generateKey() {
        const API_KEY_LENGTH = 30;
        const CHARS_LENGTH = API_KEY_CHARS.length;
        let generatingKeys = [];
        let i = 0;
        while (i < API_KEY_LENGTH) {
            const keyIndex = Math.floor(Math.random() * CHARS_LENGTH);
            generatingKeys.push(API_KEY_CHARS[keyIndex]);
            i++;
        }
        return generatingKeys.join('');
    }
}
exports.ApiAuthManager = ApiAuthManager;
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
