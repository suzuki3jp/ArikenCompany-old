"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managers = void 0;
// モジュールをインポート
const DataManager_1 = require("../../class/DataManager");
const managers = (req, res) => {
    const managers = new DataManager_1.DataManager().getManagers();
    res.status(200);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.json(managers);
};
exports.managers = managers;
