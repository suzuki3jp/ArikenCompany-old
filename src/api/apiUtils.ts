import { Request, Response } from 'express';

import { ApiAuthManager } from '../class/ApiAuth';
import { Base } from '../class/Base';

export const saveAccessLog = (req: Request, base: Base) => {
    base.logger.emitLog('info', `[${req.ip}]からAPI[${req.url}]にアクセス`);
};

export const setHeaderAllowOrigin = (res: Response) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
};

export const verifyAuth = (req: Request, base: Base): { status: 200 | 401; message: string } => {
    const tokenFromQuery = req.query.token;
    const tokenFromHeader = req.headers.authorization;
    const apiAuthManager = new ApiAuthManager(base);
    if (typeof tokenFromQuery === 'string') {
        if (apiAuthManager.compareKey(tokenFromQuery)) return { status: 200, message: 'Valid API key' };
        return { status: 401, message: 'Invalid API key' };
    } else if (typeof tokenFromHeader === 'string') {
        if (apiAuthManager.compareKey(tokenFromHeader)) return { status: 200, message: 'Valid API key' };
        return { status: 401, message: 'Invalid API key' };
    } else return { status: 401, message: 'Invalid API key' };
};
