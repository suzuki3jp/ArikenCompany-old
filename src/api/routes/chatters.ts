// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { Base } from '../../class/Base';
import { DataManager } from '../../class/DataManager';

export const chatters = (req: Request, res: Response, base: Base) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    const chatters = new DataManager().getMessageCounter();
    res.status(200);
    res.json(chatters);
};
