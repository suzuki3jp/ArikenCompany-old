"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = exports.setHeaderAllowOrigin = exports.saveAccessLog = void 0;
const ApiAuth_1 = require("../class/ApiAuth");
const saveAccessLog = (req, base) => {
    base.logger.info(`api request to ${req.url} from ${req.ip}`);
};
exports.saveAccessLog = saveAccessLog;
const setHeaderAllowOrigin = (res) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
};
exports.setHeaderAllowOrigin = setHeaderAllowOrigin;
const verifyAuth = (req, base) => {
    const tokenFromQuery = req.query.token;
    const tokenFromHeader = req.headers.authorization;
    const apiAuthManager = new ApiAuth_1.ApiAuthManager(base);
    if (typeof tokenFromQuery === 'string') {
        if (apiAuthManager.compareKey(tokenFromQuery))
            return { status: 200, message: 'Valid API key' };
        return { status: 401, message: 'Invalid API key' };
    }
    else if (typeof tokenFromHeader === 'string') {
        if (apiAuthManager.compareKey(tokenFromHeader))
            return { status: 200, message: 'Valid API key' };
        return { status: 401, message: 'Invalid API key' };
    }
    else
        return { status: 401, message: 'Invalid API key' };
};
exports.verifyAuth = verifyAuth;
