// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { DataManager } from '../../class/DataManager';

export const commands = (req: Request, res: Response) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    const commands = new DataManager().getPublicCommands();
    res.status(200);
    res.json(commands);
};
