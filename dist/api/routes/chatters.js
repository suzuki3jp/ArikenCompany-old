"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatters = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const messageCounterPath = (0, path_1.resolve)(__dirname, '../../data/MessageCounter.json');
const chatters = (req, res) => {
    const chatters = JSON.parse((0, fs_1.readFileSync)(messageCounterPath, 'utf-8'));
    res.status(200);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.json(chatters);
};
exports.chatters = chatters;
