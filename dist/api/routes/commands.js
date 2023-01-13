"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const publicCommandsPath = (0, path_1.resolve)(__dirname, '../../data/PublicCommands.json');
const commands = (req, res) => {
    const commands = JSON.parse((0, fs_1.readFileSync)(publicCommandsPath, 'utf-8'));
    res.status(200);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.json(commands);
};
exports.commands = commands;
