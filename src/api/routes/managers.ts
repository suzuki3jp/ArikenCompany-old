// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { saveAccessLog, setHeaderAllowOrigin, verifyAuth } from '../apiUtils';
import { ManagersManager } from '../../class/Managers';
import { ArikenCompany } from '../../ArikenCompany';

export const getManagers = (req: Request, res: Response, app: ArikenCompany) => {
    saveAccessLog(req, app);
    setHeaderAllowOrigin(res);
    const managers = app.DM.getManagers();
    res.status(200);
    res.json(managers);
};

export const allowManagers = (req: Request, res: Response, app: ArikenCompany) => {
    saveAccessLog(req, app);
    setHeaderAllowOrigin(res);
    const isAuthorized = verifyAuth(req, app);
    const managersManager = new ManagersManager(app);

    if (isAuthorized.status === 200) {
        const userName = getNewManagersFromRequest(req);

        if (userName) {
            const result = managersManager.allow(userName);
            res.status(200);
            res.json({ status: 200, message: result });
        } else {
            res.status(400);
            res.json({ status: 400, message: 'Bad Request. Invalid Request body.' });
        }
    } else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};

export const denyManagers = (req: Request, res: Response, app: ArikenCompany) => {
    saveAccessLog(req, app);
    setHeaderAllowOrigin(res);
    const isAuthorized = verifyAuth(req, app);
    const managersManager = new ManagersManager(app);

    if (isAuthorized.status === 200) {
        const userName = getNewManagersFromRequest(req);

        if (userName) {
            const result = managersManager.deny(userName);
            res.status(200);
            res.json({ status: 200, message: result });
        } else {
            res.status(400);
            res.json({ status: 400, message: 'Bad Request. Invalid Request body.' });
        }
    } else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};

export const getNewManagersFromRequest = (req: Request): string | null => {
    const reqBody = req.body;
    if (typeof reqBody.user_name === 'string') return reqBody.user_name;
    return null;
};
