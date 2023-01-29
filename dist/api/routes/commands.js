"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
// モジュールをインポート
const DataManager_1 = require("../../class/DataManager");
const commands = (req, res) => {
    const commands = new DataManager_1.DataManager().getPublicCommands();
    res.status(200);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.json(commands);
};
exports.commands = commands;
