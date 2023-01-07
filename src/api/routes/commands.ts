import type { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const publicCommandsPath = resolve(__dirname, '../../data/PublicCommands.json');

export const commands = (req: Request, res: Response) => {
    const commands = JSON.parse(readFileSync(publicCommandsPath, 'utf-8'));
    res.status(200);
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.json(commands);
};
