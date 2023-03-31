"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewManagersFromRequest = exports.denyManagers = exports.allowManagers = exports.getManagers = void 0;
// モジュールをインポート
const apiUtils_1 = require("../apiUtils");
const Managers_1 = require("../../class/Managers");
const getManagers = (req, res, base) => {
    (0, apiUtils_1.saveAccessLog)(req, base);
    (0, apiUtils_1.setHeaderAllowOrigin)(res);
    const managers = base.DM.getManagers();
    res.status(200);
    res.json(managers);
};
exports.getManagers = getManagers;
const allowManagers = (req, res, base) => {
    (0, apiUtils_1.saveAccessLog)(req, base);
    (0, apiUtils_1.setHeaderAllowOrigin)(res);
    const isAuthorized = (0, apiUtils_1.verifyAuth)(req, base);
    const managersManager = new Managers_1.ManagersManager(base);
    if (isAuthorized.status === 200) {
        const userName = (0, exports.getNewManagersFromRequest)(req);
        if (userName) {
            const result = managersManager.allow(userName);
            res.status(200);
            res.json({ status: 200, message: result });
        }
        else {
            res.status(400);
            res.json({ status: 400, message: 'Bad Request. Invalid Request body.' });
        }
    }
    else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};
exports.allowManagers = allowManagers;
const denyManagers = (req, res, base) => {
    (0, apiUtils_1.saveAccessLog)(req, base);
    (0, apiUtils_1.setHeaderAllowOrigin)(res);
    const isAuthorized = (0, apiUtils_1.verifyAuth)(req, base);
    const managersManager = new Managers_1.ManagersManager(base);
    if (isAuthorized.status === 200) {
        const userName = (0, exports.getNewManagersFromRequest)(req);
        if (userName) {
            const result = managersManager.deny(userName);
            res.status(200);
            res.json({ status: 200, message: result });
        }
        else {
            res.status(400);
            res.json({ status: 400, message: 'Bad Request. Invalid Request body.' });
        }
    }
    else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};
exports.denyManagers = denyManagers;
const getNewManagersFromRequest = (req) => {
    const reqBody = req.body;
    if (typeof reqBody.user_name === 'string')
        return reqBody.user_name;
    return null;
};
exports.getNewManagersFromRequest = getNewManagersFromRequest;
