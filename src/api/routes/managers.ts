// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { DataManager } from '../../class/DataManager';

export const managers = (req: Request, res: Response) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    const managers = new DataManager().getManagers();
    res.status(200);
    res.json(managers);
};
