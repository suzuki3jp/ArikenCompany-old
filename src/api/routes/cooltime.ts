import { Request, Response } from 'express';

import { saveAccessLog, setHeaderAllowOrigin, verifyAuth } from '../apiUtils';
import { CoolTimeManager } from '../../class/CoolTime';
import { ArikenCompany } from '../../ArikenCompany';

export const getCooltime = (req: Request, res: Response, app: ArikenCompany) => {
    saveAccessLog(req, app);
    setHeaderAllowOrigin(res);
    res.status(200);
    res.json({ status: 200, cooltime: app.DM.getSettings().twitch.cooltime });
};

export const setCooltime = (req: Request, res: Response, app: ArikenCompany) => {
    saveAccessLog(req, app);
    setHeaderAllowOrigin(res);
    const isAuthorized = verifyAuth(req, app);
    const cooltimemanager = new CoolTimeManager(app);

    if (isAuthorized.status === 200) {
        const newCooltime = getNewCooltimeFromRequest(req);
        if (newCooltime !== null) {
            const result = cooltimemanager.changeCoolTime(newCooltime);
            res.status(200);
            res.json({ status: 200, message: result });
        } else {
            res.status(400);
            res.json({ status: 400, message: 'Bad Request. Invalid request body and query.' });
        }
    } else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};

const getNewCooltimeFromRequest = (req: Request): string | null => {
    const reqBody = req.body;
    const reqQuery = req.query;
    if (typeof reqQuery.cooltime === 'string') return reqQuery.cooltime;
    if (typeof reqBody.cooltime === 'string') return reqBody.cooltime;
    return null;
};
