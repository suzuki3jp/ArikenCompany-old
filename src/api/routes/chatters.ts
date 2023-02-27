// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { saveAccessLog } from '../apiUtils';
import { Base } from '../../class/Base';
import { DataManager } from '../../class/DataManager';

export const getChatters = (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    const chatters = new DataManager().getMessageCounter();
    res.status(200);
    res.json(chatters);
};
