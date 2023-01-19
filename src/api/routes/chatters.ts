// nodeモジュールをインポート
import type { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const messageCounterPath = resolve(__dirname, '../../data/MessageCounter.json');

export const chatters = (req: Request, res: Response) => {
    const chatters = JSON.parse(readFileSync(messageCounterPath, 'utf-8'));
    res.status(200);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.json(chatters);
};
