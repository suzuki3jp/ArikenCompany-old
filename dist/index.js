"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// nodeモジュールをインポート
const logger_1 = require("@suzuki3jp/logger");
const node_cron_1 = __importDefault(require("node-cron"));
const pm2_1 = __importDefault(require("pm2"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
dotenv_1.default.config();
// モジュールをインポート
const index_1 = require("./api/index");
const Base_1 = require("./class/Base");
const DataManager_1 = require("./class/DataManager");
const index_2 = require("./events/index");
const index_3 = require("./eventSub/index");
const API_1 = require("./utils/API");
const Client_1 = require("./utils/Client");
const DM = new DataManager_1.DataManager();
const loggerOptions = {
    path: DM._paths.log,
};
const logger = new logger_1.Logger(true, loggerOptions);
// クライアント定義
const clientInfo = (0, Client_1.createClients)(logger);
const twitchClient = clientInfo.twitch;
const discordClient = clientInfo.discord.client;
const discordToken = clientInfo.discord.token;
const apiServer = (0, API_1.createApiServer)(app);
const base = new Base_1.Base(twitchClient, discordClient, clientInfo.eventSub, logger, app, apiServer);
(0, index_2.events)(base, discordToken);
(0, index_3.eventSub)(base);
(0, index_1.api)(base);
node_cron_1.default.schedule('59 59 11,23 * * *', () => {
    base.logger.emitLog('info', 'プロセスの定期再起動を実行中');
    pm2_1.default.connect((e) => {
        if (e) {
            console.error(e);
        }
        else {
            const processName = 'ArikenCompany';
            pm2_1.default.list((e, list) => {
                if (e) {
                    console.error(e);
                }
                else {
                    pm2_1.default.restart(processName, (e, proc) => {
                        if (e) {
                            base.logger.emitLog('info', '再起動中にエラーが発生');
                            console.error(e);
                            pm2_1.default.disconnect();
                        }
                        else {
                            base.logger.emitLog('info', 'プロセスを正常に再起動しました');
                            pm2_1.default.disconnect();
                        }
                    });
                }
            });
        }
    });
});
