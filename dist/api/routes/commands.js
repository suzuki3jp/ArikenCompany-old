"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCommands = exports.editCommands = exports.addCommands = exports.offCommands = exports.onCommands = exports.getCommands = void 0;
// モジュールをインポート
const apiUtils_1 = require("../apiUtils");
const Command_1 = require("../../class/Command");
const ValueParser_1 = require("../../class/ValueParser");
const getCommands = (req, res, base) => {
    (0, apiUtils_1.saveAccessLog)(req, base);
    (0, apiUtils_1.setHeaderAllowOrigin)(res);
    const commands = base.DM.getPublicCommands();
    res.status(200);
    res.json(commands);
};
exports.getCommands = getCommands;
const onCommands = (req, res, base) => {
    (0, apiUtils_1.saveAccessLog)(req, base);
    (0, apiUtils_1.setHeaderAllowOrigin)(res);
    const isAuthorized = (0, apiUtils_1.verifyAuth)(req, base);
    const commandManager = new Command_1.CommandManager(base);
    if (isAuthorized.status === 200) {
        const result = commandManager.on();
        res.status(200);
        res.json({ status: 200, message: result });
        base.emitDebug(result);
    }
    else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
        base.emitDebug(isAuthorized.message);
    }
};
exports.onCommands = onCommands;
const offCommands = (req, res, base) => {
    (0, apiUtils_1.saveAccessLog)(req, base);
    (0, apiUtils_1.setHeaderAllowOrigin)(res);
    const isAuthorized = (0, apiUtils_1.verifyAuth)(req, base);
    const commandManager = new Command_1.CommandManager(base);
    if (isAuthorized.status === 200) {
        const result = commandManager.off();
        res.status(200);
        res.json({ status: 200, message: result });
        base.emitDebug(result);
    }
    else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
        base.emitDebug(isAuthorized.message);
    }
};
exports.offCommands = offCommands;
const addCommands = async (req, res, base) => {
    (0, apiUtils_1.saveAccessLog)(req, base);
    (0, apiUtils_1.setHeaderAllowOrigin)(res);
    const isAuthorized = (0, apiUtils_1.verifyAuth)(req, base);
    const commandManager = new Command_1.CommandManager(base);
    const commandName = req.body.name;
    const commandValue = req.body.value;
    if (isAuthorized.status === 200) {
        if (isValidBodyForManageCommands(req, false) &&
            typeof commandName === 'string' &&
            typeof commandValue === 'string') {
            const dummyMessage = new ValueParser_1.DummyMessage();
            const result = await commandManager.addCom(commandName, commandValue, dummyMessage);
            res.status(200);
            res.json({
                status: 200,
                message: result,
            });
        }
        else {
            res.status(400);
            res.json({
                status: 400,
                message: 'Bad Request. Invalid request body.',
            });
        }
    }
    else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};
exports.addCommands = addCommands;
const editCommands = async (req, res, base) => {
    (0, apiUtils_1.saveAccessLog)(req, base);
    (0, apiUtils_1.setHeaderAllowOrigin)(res);
    const isAuthorized = (0, apiUtils_1.verifyAuth)(req, base);
    const commandManager = new Command_1.CommandManager(base);
    const commandName = req.body.name;
    const commandValue = req.body.value;
    if (isAuthorized.status === 200) {
        if (isValidBodyForManageCommands(req, false) &&
            typeof commandName === 'string' &&
            typeof commandValue === 'string') {
            const dummyMessage = new ValueParser_1.DummyMessage();
            const result = await commandManager.editCom(commandName, commandValue, dummyMessage);
            res.status(200);
            res.json({
                status: 200,
                message: result,
            });
        }
        else {
            res.status(400);
            res.json({
                status: 400,
                message: 'Bad Request. Invalid request body.',
            });
        }
    }
    else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};
exports.editCommands = editCommands;
const removeCommands = async (req, res, base) => {
    (0, apiUtils_1.saveAccessLog)(req, base);
    (0, apiUtils_1.setHeaderAllowOrigin)(res);
    const isAuthorized = (0, apiUtils_1.verifyAuth)(req, base);
    const commandManager = new Command_1.CommandManager(base);
    const commandName = req.body.name;
    if (isAuthorized.status === 200) {
        if (isValidBodyForManageCommands(req, true) && typeof commandName === 'string') {
            const result = await commandManager.removeCom(commandName);
            res.status(200);
            res.json({
                status: 200,
                message: result,
            });
        }
        else {
            res.status(400);
            res.json({
                status: 400,
                message: 'Bad Request. Invalid request body.',
            });
        }
    }
    else {
        res.status(isAuthorized.status);
        res.json(isAuthorized);
    }
};
exports.removeCommands = removeCommands;
const isValidBodyForManageCommands = (req, isRemove) => {
    const reqBody = req.body;
    if (typeof reqBody === 'object') {
        if (typeof reqBody.name !== 'string')
            return false;
        if (typeof reqBody.value !== 'string' && !isRemove)
            return false;
        return true;
    }
    else
        return false;
};
