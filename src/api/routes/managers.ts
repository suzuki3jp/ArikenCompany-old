// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { DataManager } from '../../class/DataManager';

export const managers = (req: Request, res: Response) => {
    const managers = new DataManager().getManagers();
    res.status(200);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.json(managers);
};
