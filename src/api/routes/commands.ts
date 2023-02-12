// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { Base } from '../../class/Base';
import { DataManager } from '../../class/DataManager';

export const commands = (req: Request, res: Response, base: Base) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    const commands = new DataManager().getPublicCommands();
    res.status(200);
    base.logger.emitLog('info', `[${req.ip}]からAPI[${req.url}]にアクセス`);
    res.json(commands);
};
