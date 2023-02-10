// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { Base } from '../../class/Base';
import { DataManager } from '../../class/DataManager';

export const managers = (req: Request, res: Response, base: Base) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    const managers = new DataManager().getManagers();
    res.status(200);
    res.json(managers);
};
