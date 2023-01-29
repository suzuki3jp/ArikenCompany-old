"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatters = void 0;
// モジュールをインポート
const DataManager_1 = require("../../class/DataManager");
const chatters = (req, res) => {
    const chatters = new DataManager_1.DataManager().getMessageCounter();
    res.status(200);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.json(chatters);
};
exports.chatters = chatters;
