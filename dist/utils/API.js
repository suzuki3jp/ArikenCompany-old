"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiServer = void 0;
const http_1 = require("http");
const https_1 = require("https");
// モジュールをインポート
const DataManager_1 = require("../class/DataManager");
const DM = new DataManager_1.DataManager();
const settings = DM.getSettings();
const createApiServer = (app) => {
    if (!settings.api.isSecure)
        return (0, http_1.createServer)(app);
    return (0, https_1.createServer)({
        key: DM.getKey(),
        cert: DM.getCert(),
    }, app);
};
exports.createApiServer = createApiServer;
