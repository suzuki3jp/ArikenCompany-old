// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { saveAccessLog, setHeaderAllowOrigin } from '../apiUtils';
import { Base } from '../../class/Base';
import { DataManager } from '../../class/DataManager';

export const getManagers = (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    setHeaderAllowOrigin(res);
    const managers = new DataManager().getManagers();
    res.status(200);
    res.json(managers);
};
