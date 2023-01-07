import { Router } from 'express';
import { chatters, commands, managers } from './routes/index';

export const router = Router().get('/commands', commands).get('/managers', managers).get('/chatters', chatters);
