// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { DataManager } from '../../class/DataManager';

export const chatters = (req: Request, res: Response) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    const chatters = new DataManager().getMessageCounter();
    res.status(200);
    res.json(chatters);
};
