"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
// モジュールをインポート
const DataManager_1 = require("./DataManager");
class Base {
    api;
    twitch;
    discord;
    eventSub;
    logger;
    DM;
    constructor(twitch, discord, eventSub, logger, apiApp, apiServer) {
        this.api = {
            app: apiApp,
            server: apiServer,
        };
        this.twitch = twitch;
        this.discord = discord;
        this.eventSub = eventSub;
        this.logger = logger;
        this.DM = new DataManager_1.DataManager();
    }
    emitDebug(message) {
        this.logger.emitLog('debug', message);
    }
    getMe() {
        return this;
    }
}
exports.Base = Base;
