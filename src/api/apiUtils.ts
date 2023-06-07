import { Request, Response } from 'express';

import { ApiAuthManager } from '../class/ApiAuth';
import { ArikenCompany } from '../ArikenCompany';

export const saveAccessLog = (req: Request, app: ArikenCompany) => {
    app.logger.info(`api request to ${req.url} from ${req.ip}`);
};

export const setHeaderAllowOrigin = (res: Response) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
};

export const verifyAuth = (req: Request, app: ArikenCompany): { status: 200 | 401; message: string } => {
    const tokenFromQuery = req.query.token;
    const tokenFromHeader = req.headers.authorization;
    const apiAuthManager = new ApiAuthManager(app);
    if (typeof tokenFromQuery === 'string') {
        if (apiAuthManager.compareKey(tokenFromQuery)) return { status: 200, message: 'Valid API key' };
        return { status: 401, message: 'Invalid API key' };
    } else if (typeof tokenFromHeader === 'string') {
        if (apiAuthManager.compareKey(tokenFromHeader)) return { status: 200, message: 'Valid API key' };
        return { status: 401, message: 'Invalid API key' };
    } else return { status: 401, message: 'Invalid API key' };
};
