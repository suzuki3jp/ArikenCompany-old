import { Request } from 'express';

import { Base } from '../class/Base';

export const saveAccessLog = (req: Request, base: Base) => {
    base.logger.emitLog('info', `[${req.ip}]からAPI[${req.url}]にアクセス`);
};
