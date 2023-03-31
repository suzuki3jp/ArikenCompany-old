// nodeモジュールをインポート
import type { Request, Response } from 'express';

// モジュールをインポート
import { saveAccessLog, setHeaderAllowOrigin, verifyAuth } from '../apiUtils';
import { Base } from '../../class/Base';
import { CommandManager } from '../../class/Command';
import { DummyMessage } from '../../class/ValueParser';

export const getCommands = (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    setHeaderAllowOrigin(res);
    const commands = base.DM.getPublicCommands();
    res.status(200);
    res.json(commands);
};

export const onCommands = (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    setHeaderAllowOrigin(res);
    const isAuthorized = verifyAuth(req, base);
    const commandManager = new CommandManager(base);

    if (isAuthorized.status === 200) {
        const result = commandManager.on();
        res.status(200);
        res.json({ status: 200, message: result });
    } else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};

export const offCommands = (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    setHeaderAllowOrigin(res);
    const isAuthorized = verifyAuth(req, base);
    const commandManager = new CommandManager(base);

    if (isAuthorized.status === 200) {
        const result = commandManager.off();
        res.status(200);
        res.json({ status: 200, message: result });
    } else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};

export const addCommands = async (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    setHeaderAllowOrigin(res);
    const isAuthorized = verifyAuth(req, base);
    const commandManager = new CommandManager(base);
    const commandName = req.body.name;
    const commandValue = req.body.value;

    if (isAuthorized.status === 200) {
        if (
            isValidBodyForManageCommands(req, false) &&
            typeof commandName === 'string' &&
            typeof commandValue === 'string'
        ) {
            const dummyMessage = new DummyMessage();
            const result = await commandManager.addCom(commandName, commandValue, dummyMessage);
            res.status(200);
            res.json({
                status: 200,
                message: result,
            });
        } else {
            res.status(400);
            res.json({
                status: 400,
                message: 'Bad Request. Invalid request body.',
            });
        }
    } else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};

export const editCommands = async (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    setHeaderAllowOrigin(res);
    const isAuthorized = verifyAuth(req, base);
    const commandManager = new CommandManager(base);
    const commandName = req.body.name;
    const commandValue = req.body.value;

    if (isAuthorized.status === 200) {
        if (
            isValidBodyForManageCommands(req, false) &&
            typeof commandName === 'string' &&
            typeof commandValue === 'string'
        ) {
            const dummyMessage = new DummyMessage();
            const result = await commandManager.editCom(commandName, commandValue, dummyMessage);
            res.status(200);
            res.json({
                status: 200,
                message: result,
            });
        } else {
            res.status(400);
            res.json({
                status: 400,
                message: 'Bad Request. Invalid request body.',
            });
        }
    } else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};

export const removeCommands = async (req: Request, res: Response, base: Base) => {
    saveAccessLog(req, base);
    setHeaderAllowOrigin(res);
    const isAuthorized = verifyAuth(req, base);
    const commandManager = new CommandManager(base);
    const commandName = req.body.name;

    if (isAuthorized.status === 200) {
        if (isValidBodyForManageCommands(req, true) && typeof commandName === 'string') {
            const result = await commandManager.removeCom(commandName);
            res.status(200);
            res.json({
                status: 200,
                message: result,
            });
        } else {
            res.status(400);
            res.json({
                status: 400,
                message: 'Bad Request. Invalid request body.',
            });
        }
    } else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};

const isValidBodyForManageCommands = (req: Request, isRemove: boolean): boolean => {
    const reqBody = req.body;
    if (typeof reqBody === 'object') {
        if (typeof reqBody.name !== 'string') return false;
        if (typeof reqBody.value !== 'string' && !isRemove) return false;
        return true;
    } else return false;
};
