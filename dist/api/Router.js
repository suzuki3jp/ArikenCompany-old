"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const index_1 = require("./routes/index");
exports.router = (0, express_1.Router)().get('/commands', index_1.commands).get('/managers', index_1.managers).get('/chatters', index_1.chatters);
