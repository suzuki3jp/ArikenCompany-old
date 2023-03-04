"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = void 0;
const utils_1 = require("@suzuki3jp/utils");
const node_os_1 = __importDefault(require("node:os"));
const apiUtils_1 = require("../apiUtils");
const getStatus = (req, res, base) => {
    (0, apiUtils_1.saveAccessLog)(req, base);
    (0, apiUtils_1.setHeaderAllowOrigin)(res);
    const jstNow = utils_1.JST.getDate();
    const status = {
        system: {
            mem: {
                total: byteToGB(node_os_1.default.totalmem()) + 'GB',
                free: byteToGB(node_os_1.default.freemem()) + 'GB',
                use: byteToGB(node_os_1.default.totalmem() - node_os_1.default.freemem()) + 'GB',
            },
            uptime: {
                os: secToDate(node_os_1.default.uptime()),
                process: secToDate(process.uptime()),
            },
            date: {
                hours: jstNow.getHours(),
                minutes: jstNow.getMinutes(),
                seconds: jstNow.getSeconds(),
            },
        },
    };
    res.status(200);
    res.json(status);
};
exports.getStatus = getStatus;
/**
 * バイト表記からギガバイトに変換する
 * 小数点第二位以下は四捨五入
 */
const byteToGB = (byte) => {
    return Math.ceil((byte / 1024 / 1024 / 1024) * 100) / 100;
};
/**
 * 秒数表記を時分秒に変換する
 */
const secToDate = (sec) => {
    const DAY_SEC = 86400;
    const HOUR_SEC = 3600;
    const MIN_SEC = 60;
    const day = dayToString(Math.floor(sec / DAY_SEC));
    const hour = hourToString(Math.floor((sec % DAY_SEC) / HOUR_SEC));
    const min = minuteToString(Math.floor((sec % HOUR_SEC) / MIN_SEC));
    const dates = [day, hour, min];
    let result = '0 minute';
    dates.forEach((value) => {
        if (value === null)
            return;
        if (result === '0 minute') {
            result = `${value}`;
        }
        else {
            result = `${result}, ${value}`;
        }
    });
    return result;
};
const dayToString = (day) => {
    if (day === 0)
        return null;
    if (day === 1)
        return `${day} day`;
    return `${day} days`;
};
const hourToString = (hour) => {
    if (hour === 0)
        return null;
    if (hour === 1)
        return `${hour} hour`;
    return `${hour} hours`;
};
const minuteToString = (minute) => {
    if (minute === 0)
        return null;
    if (minute === 1)
        return `${minute} minute`;
    return `${minute} minutes`;
};
