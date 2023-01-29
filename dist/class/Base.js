"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
// モジュールをインポート
const DataManager_1 = require("./DataManager");
class Base {
    twitch;
    discord;
    logger;
    DM;
    constructor(twitch, discord, logger) {
        this.twitch = twitch;
        this.discord = discord;
        this.logger = logger;
        this.DM = new DataManager_1.DataManager();
    }
}
exports.Base = Base;
