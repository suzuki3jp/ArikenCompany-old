// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { saveAccessLog } from '../apiUtils';
import { Base } from '../../class/Base';
import { DataManager } from '../../class/DataManager';

export const getCommands = (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    const commands = new DataManager().getPublicCommands();
    res.status(200);
    res.json(commands);
};
