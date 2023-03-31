// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { saveAccessLog, setHeaderAllowOrigin } from '../apiUtils';
import { convertPublicChatters } from '../../utils/Chatters';
import { Base } from '../../class/Base';

export const getChatters = (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    setHeaderAllowOrigin(res);
    const chatters = base.DM.getChatters();
    res.status(200);
    res.json(convertPublicChatters(chatters));
};
