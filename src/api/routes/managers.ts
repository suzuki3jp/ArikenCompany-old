import type { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const managersPath = resolve(__dirname, '../../data/Managers.json');

export const managers = (req: Request, res: Response) => {
    const managers = JSON.parse(readFileSync(managersPath, 'utf-8'));
    res.status(200);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.json(managers);
};
