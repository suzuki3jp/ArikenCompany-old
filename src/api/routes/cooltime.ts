import { Request, Response } from 'express';

import { saveAccessLog, setHeaderAllowOrigin, verifyAuth } from '../apiUtils';
import { Base } from '../../class/Base';
import { CoolTimeManager } from '../../class/CoolTime';

export const getCooltime = (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    setHeaderAllowOrigin(res);
    res.status(200);
    res.json({ status: 200, cooltime: base.DM.getSettings().twitch.cooltime });
};

export const setCooltime = (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    setHeaderAllowOrigin(res);
    const isAuthorized = verifyAuth(req, base);
    const cooltimemanager = new CoolTimeManager(base);

    if (isAuthorized.status === 200) {
        const newCooltime = getNewCooltimeFromRequest(req);
        if (newCooltime !== null) {
            const result = cooltimemanager.changeCoolTime(newCooltime);
            res.status(200);
            res.json({ status: 200, message: result });
            base.emitDebug(result);
        } else {
            res.status(400);
            res.json({ status: 400, message: 'Bad Request. Invalid request body and query.' });
            base.emitDebug('Bad Request: リクエストのボディかクエリにクールタイムが含まれていなかった');
        }
    } else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
        base.emitDebug(isAuthorized.message);
    }
};

const getNewCooltimeFromRequest = (req: Request): string | null => {
    const reqBody = req.body;
    const reqQuery = req.query;
    if (typeof reqQuery.cooltime === 'string') return reqQuery.cooltime;
    if (typeof reqBody.cooltime === 'string') return reqBody.cooltime;
    return null;
};
