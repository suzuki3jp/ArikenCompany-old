"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managers = exports.chatters = exports.commands = void 0;
// モジュールをインポート
var commands_1 = require("./commands");
Object.defineProperty(exports, "commands", { enumerable: true, get: function () { return commands_1.commands; } });
var chatters_1 = require("./chatters");
Object.defineProperty(exports, "chatters", { enumerable: true, get: function () { return chatters_1.chatters; } });
var managers_1 = require("./managers");
Object.defineProperty(exports, "managers", { enumerable: true, get: function () { return managers_1.managers; } });
