// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { saveAccessLog, setHeaderAllowOrigin, verifyAuth } from '../apiUtils';
import { Base } from '../../class/Base';
import { ManagersManager } from '../../class/Managers';

export const getManagers = (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    setHeaderAllowOrigin(res);
    const managers = base.DM.getManagers();
    res.status(200);
    res.json(managers);
};

export const allowManagers = (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    setHeaderAllowOrigin(res);
    const isAuthorized = verifyAuth(req, base);
    const managersManager = new ManagersManager(base);

    if (isAuthorized.status === 200) {
        const userName = getNewManagersFromRequest(req);

        if (userName) {
            const result = managersManager.allow(userName);
            res.status(200);
            res.json({ status: 200, message: result });
            base.emitDebug(result);
        } else {
            res.status(400);
            res.json({ status: 400, message: 'Bad Request. Invalid Request body.' });
            base.emitDebug('Bad Request: 無効なRequest body');
        }
    } else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
        base.emitDebug(isAuthorized.message);
    }
};

export const denyManagers = (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    setHeaderAllowOrigin(res);
    const isAuthorized = verifyAuth(req, base);
    const managersManager = new ManagersManager(base);

    if (isAuthorized.status === 200) {
        const userName = getNewManagersFromRequest(req);

        if (userName) {
            const result = managersManager.deny(userName);
            res.status(200);
            res.json({ status: 200, message: result });
            base.emitDebug(result);
        } else {
            res.status(400);
            res.json({ status: 400, message: 'Bad Request. Invalid Request body.' });
            base.emitDebug('Bad Request: 無効なRequest body');
        }
    } else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
        base.emitDebug(isAuthorized.message);
    }
};

export const getNewManagersFromRequest = (req: Request): string | null => {
    const reqBody = req.body;
    if (typeof reqBody.user_name === 'string') return reqBody.user_name;
    return null;
};
