// nodeモジュールをインポート
import { Router } from 'express';

// モジュールをインポート
import { chatters, commands, managers } from './routes/index';

export const router = Router().get('/commands', commands).get('/chatters', chatters).get('/managers', managers);
