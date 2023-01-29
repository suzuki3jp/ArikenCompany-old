"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// nodeモジュールをインポート
const utils_1 = require("@suzuki3jp/utils");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
dotenv_1.default.config();
// モジュールをインポート
const index_1 = require("./api/index");
const DataManager_1 = require("./class/DataManager");
const index_2 = require("./events/index");
const API_1 = require("./utils/API");
const Client_1 = require("./utils/Client");
const DM = new DataManager_1.DataManager();
const loggerOptions = {
    isSaveLogToCsv: true,
    logFilePath: DM._paths.log,
};
const logger = new utils_1.Logger(loggerOptions);
// クライアント定義
const clientInfo = (0, Client_1.createClients)(logger);
const twitchClient = clientInfo.twitch;
const discordClient = clientInfo.discord.client;
const discordToken = clientInfo.discord.token;
const apiServer = (0, API_1.createApiServer)(app);
(0, index_2.events)(twitchClient, discordClient, discordToken, logger);
(0, index_1.api)(app, apiServer, logger);
