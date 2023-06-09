// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { saveAccessLog, setHeaderAllowOrigin } from '../apiUtils';
import { convertPublicChatters } from '../../utils/Chatters';
import { ArikenCompany } from '../../ArikenCompany';

export const getChatters = (req: Request, res: Response, app: ArikenCompany) => {
    saveAccessLog(req, app);
    setHeaderAllowOrigin(res);
    const chatters = app.DM.getChatters();
    res.status(200);
    res.json(convertPublicChatters(chatters));
};
