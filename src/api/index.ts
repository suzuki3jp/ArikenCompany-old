// nodeモジュールをインポート
import { json as bodyToJson, urlencoded } from 'body-parser';
import { Server as HTTP } from 'http';

// モジュールをインポート
import { Base } from '../class/Base';
import {
    addCommands,
    allowManagers,
    denyManagers,
    editCommands,
    getChatters,
    getCommands,
    getCooltime,
    getManagers,
    getStatus,
    offCommands,
    onCommands,
    removeCommands,
    setCooltime,
} from './routes/index';

export const api = (base: Base) => {
    const settings = base.DM.getSettings();

    base.api.server.listen(settings.api.port, () => {
        if (base.api.server instanceof HTTP) {
            base.logger.system(`API is ready. listening at http://localhost:${settings.api.port}`);
        } else {
            base.logger.system(`API is ready. listening at https://suzuki-dev.com:${settings.api.port}`);
        }
    });
    base.api.app.use(bodyToJson());
    base.api.app.use(urlencoded({ extended: true }));

    base.api.app.get(API_ENDPOINTS.chatters, (req, res) => getChatters(req, res, base));
    base.api.app.get(API_ENDPOINTS.status, (req, res) => getStatus(req, res, base));

    // コマンド関係のエンドポイント
    base.api.app.get(API_ENDPOINTS.commands.get, (req, res) => getCommands(req, res, base));
    base.api.app.post(API_ENDPOINTS.commands.on, (req, res) => onCommands(req, res, base));
    base.api.app.post(API_ENDPOINTS.commands.off, (req, res) => offCommands(req, res, base));
    base.api.app.post(API_ENDPOINTS.commands.add, (req, res) => addCommands(req, res, base));
    base.api.app.post(API_ENDPOINTS.commands.edit, (req, res) => editCommands(req, res, base));
    base.api.app.post(API_ENDPOINTS.commands.remove, (req, res) => removeCommands(req, res, base));

    // クールタイム関係のエンドポイント
    base.api.app.get(API_ENDPOINTS.cooltime.get, (req, res) => getCooltime(req, res, base));
    base.api.app.post(API_ENDPOINTS.cooltime.set, (req, res) => setCooltime(req, res, base));

    // マネージャー関係のエンドポイント
    base.api.app.get(API_ENDPOINTS.managers.get, (req, res) => getManagers(req, res, base));
    base.api.app.post(API_ENDPOINTS.managers.allow, (req, res) => allowManagers(req, res, base));
    base.api.app.post(API_ENDPOINTS.managers.deny, (req, res) => denyManagers(req, res, base));
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
