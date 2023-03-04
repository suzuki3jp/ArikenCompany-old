"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatters = void 0;
// モジュールをインポート
const apiUtils_1 = require("../apiUtils");
const getChatters = (req, res, base) => {
    (0, apiUtils_1.saveAccessLog)(req, base);
    (0, apiUtils_1.setHeaderAllowOrigin)(res);
    const chatters = base.DM.getMessageCounter();
    res.status(200);
    res.json(chatters);
};
exports.getChatters = getChatters;
