// nodeモジュールをインポート
import { json as bodyToJson, urlencoded } from 'body-parser';

// モジュールをインポート
import { addCommands, allowManagers, denyManagers, editCommands, getChatters, getCommands, getCooltime, getManagers, getStatus, offCommands, onCommands, removeCommands, setCooltime } from './routes/index';
import { ArikenCompany } from '../ArikenCompany';

export const api = (app: ArikenCompany) => {
    app.api.app.use(bodyToJson());
    app.api.app.use(urlencoded({ extended: true }));

    app.api.app.get(API_ENDPOINTS.chatters, (req, res) => getChatters(req, res, app));
    app.api.app.get(API_ENDPOINTS.status, (req, res) => getStatus(req, res, app));

    // コマンド関係のエンドポイント
    app.api.app.get(API_ENDPOINTS.commands.get, (req, res) => getCommands(req, res, app));
    app.api.app.post(API_ENDPOINTS.commands.on, (req, res) => onCommands(req, res, app));
    app.api.app.post(API_ENDPOINTS.commands.off, (req, res) => offCommands(req, res, app));
    app.api.app.post(API_ENDPOINTS.commands.add, (req, res) => addCommands(req, res, app));
    app.api.app.post(API_ENDPOINTS.commands.edit, (req, res) => editCommands(req, res, app));
    app.api.app.post(API_ENDPOINTS.commands.remove, (req, res) => removeCommands(req, res, app));

    // クールタイム関係のエンドポイント
    app.api.app.get(API_ENDPOINTS.cooltime.get, (req, res) => getCooltime(req, res, app));
    app.api.app.post(API_ENDPOINTS.cooltime.set, (req, res) => setCooltime(req, res, app));

    // マネージャー関係のエンドポイント
    app.api.app.get(API_ENDPOINTS.managers.get, (req, res) => getManagers(req, res, app));
    app.api.app.post(API_ENDPOINTS.managers.allow, (req, res) => allowManagers(req, res, app));
    app.api.app.post(API_ENDPOINTS.managers.deny, (req, res) => denyManagers(req, res, app));
};

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
