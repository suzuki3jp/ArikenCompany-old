// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { DataManager } from '../../class/DataManager';

export const chatters = (req: Request, res: Response) => {
    const chatters = new DataManager().getMessageCounter();
    res.status(200);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.json(chatters);
};
