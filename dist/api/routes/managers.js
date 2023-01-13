"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managers = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const managersPath = (0, path_1.resolve)(__dirname, '../../data/Managers.json');
const managers = (req, res) => {
    const managers = JSON.parse((0, fs_1.readFileSync)(managersPath, 'utf-8'));
    res.status(200);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.json(managers);
};
exports.managers = managers;
