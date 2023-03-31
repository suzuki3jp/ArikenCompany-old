"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCooltime = exports.getCooltime = void 0;
const apiUtils_1 = require("../apiUtils");
const CoolTime_1 = require("../../class/CoolTime");
const getCooltime = (req, res, base) => {
    (0, apiUtils_1.saveAccessLog)(req, base);
    (0, apiUtils_1.setHeaderAllowOrigin)(res);
    res.status(200);
    res.json({ status: 200, cooltime: base.DM.getSettings().twitch.cooltime });
};
exports.getCooltime = getCooltime;
const setCooltime = (req, res, base) => {
    (0, apiUtils_1.saveAccessLog)(req, base);
    (0, apiUtils_1.setHeaderAllowOrigin)(res);
    const isAuthorized = (0, apiUtils_1.verifyAuth)(req, base);
    const cooltimemanager = new CoolTime_1.CoolTimeManager(base);
    if (isAuthorized.status === 200) {
        const newCooltime = getNewCooltimeFromRequest(req);
        if (newCooltime !== null) {
            const result = cooltimemanager.changeCoolTime(newCooltime);
            res.status(200);
            res.json({ status: 200, message: result });
        }
        else {
            res.status(400);
            res.json({ status: 400, message: 'Bad Request. Invalid request body and query.' });
        }
    }
    else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};
exports.setCooltime = setCooltime;
const getNewCooltimeFromRequest = (req) => {
    const reqBody = req.body;
    const reqQuery = req.query;
    if (typeof reqQuery.cooltime === 'string')
        return reqQuery.cooltime;
    if (typeof reqBody.cooltime === 'string')
        return reqBody.cooltime;
    return null;
};
