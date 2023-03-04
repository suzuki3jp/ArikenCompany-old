"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
// nodeモジュールをインポート
const body_parser_1 = require("body-parser");
const http_1 = require("http");
const index_1 = require("./routes/index");
const api = (base) => {
    const settings = base.DM.getSettings();
    base.api.server.listen(settings.api.port, () => {
        if (base.api.server instanceof http_1.Server) {
            base.logger.emitLog('system', `API起動完了。at: http://localhost:${settings.api.port}/`);
        }
        else {
            base.logger.emitLog('system', `API起動完了。at: https://suzuki-dev.com:${settings.api.port}`);
        }
    });
    base.api.app.use((0, body_parser_1.json)());
    base.api.app.use((0, body_parser_1.urlencoded)({ extended: true }));
    base.api.app.get(API_ENDPOINTS.chatters, (req, res) => (0, index_1.getChatters)(req, res, base));
    base.api.app.get(API_ENDPOINTS.status, (req, res) => (0, index_1.getStatus)(req, res, base));
    // コマンド関係のエンドポイント
    base.api.app.get(API_ENDPOINTS.commands.get, (req, res) => (0, index_1.getCommands)(req, res, base));
    base.api.app.post(API_ENDPOINTS.commands.on, (req, res) => (0, index_1.onCommands)(req, res, base));
    base.api.app.post(API_ENDPOINTS.commands.off, (req, res) => (0, index_1.offCommands)(req, res, base));
    base.api.app.post(API_ENDPOINTS.commands.add, (req, res) => (0, index_1.addCommands)(req, res, base));
    base.api.app.post(API_ENDPOINTS.commands.edit, (req, res) => (0, index_1.editCommands)(req, res, base));
    base.api.app.post(API_ENDPOINTS.commands.remove, (req, res) => (0, index_1.removeCommands)(req, res, base));
    // クールタイム関係のエンドポイント
    base.api.app.get(API_ENDPOINTS.cooltime.get, (req, res) => (0, index_1.getCooltime)(req, res, base));
    base.api.app.post(API_ENDPOINTS.cooltime.set, (req, res) => (0, index_1.setCooltime)(req, res, base));
    // マネージャー関係のエンドポイント
    base.api.app.get(API_ENDPOINTS.managers.get, (req, res) => (0, index_1.getManagers)(req, res, base));
    base.api.app.post(API_ENDPOINTS.managers.allow, (req, res) => (0, index_1.allowManagers)(req, res, base));
    base.api.app.post(API_ENDPOINTS.managers.deny, (req, res) => (0, index_1.denyManagers)(req, res, base));
};
exports.api = api;
const API_ENDPOINTS = {
    chatters: '/chatters',
    status: '/status',
    commands: {
        get: '/commands',
        on: '/commands/on',
        off: '/commands/off',
        add: '/commands/add',
        edit: '/commands/edit',
        remove: '/commands/remove',
    },
    cooltime: {
        get: '/cooltime',
        set: '/cooltime/set',
    },
    managers: {
        get: '/managers',
        allow: '/managers/allow',
        deny: '/managers/deny',
    },
};
