// nodeモジュールをインポート
import { json as bodyToJson, urlencoded } from 'body-parser';
import { Server as HTTP } from 'http';

// モジュールをインポート
import { Base } from '../class/Base';
import { chatters, commands, managers, status } from './routes/index';

export const api = (base: Base) => {
    const settings = base.DM.getSettings();

    base.api.server.listen(settings.api.port, () => {
        if (base.api.server instanceof HTTP) {
            base.logger.emitLog('system', `API起動完了。at: http://localhost:${settings.api.port}/`);
        } else {
            base.logger.emitLog('system', `API起動完了。at: https://suzuki-dev.com:${settings.api.port}`);
        }
    });
    base.api.app.use(bodyToJson());
    base.api.app.use(urlencoded({ extended: true }));

    base.api.app.get('/commands', (req, res) => commands(req, res, base));
    base.api.app.get('/chatters', (req, res) => chatters(req, res, base));
    base.api.app.get('/managers', (req, res) => managers(req, res, base));
    base.api.app.get('/status', (req, res) => status(req, res, base));
};
