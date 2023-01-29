"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const http_1 = require("http");
// モジュールをインポート
const DataManager_1 = require("../class/DataManager");
const Router_1 = require("./Router");
const api = (app, server, logger) => {
    const DM = new DataManager_1.DataManager();
    const settings = DM.getSettings();
    server.listen(settings.api.port, () => {
        if (server instanceof http_1.Server) {
            logger.system(`API起動完了。at: http://localhost:${settings.api.port}/`);
        }
        else {
            logger.system(`API起動完了。at: https://suzuki-dev.com:${settings.api.port}`);
        }
    });
    app.use('/', Router_1.router);
};
exports.api = api;
