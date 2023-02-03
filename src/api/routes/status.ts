import { JST } from '@suzuki3jp/utils';
import { Request, Response } from 'express';
import os from 'node:os';

export const status = (req: Request, res: Response) => {
    const jstNow = JST.getDate();
    const status = {
        system: {
            mem: {
                total: byteToGB(os.totalmem()) + 'GB',
                free: byteToGB(os.freemem()) + 'GB',
                use: byteToGB(os.totalmem() - os.freemem()) + 'GB',
            },
            uptime: {
                os: secToDate(os.uptime()),
                process: secToDate(process.uptime()),
            },
            date: {
                hours: jstNow.getHours(),
                minutes: jstNow.getMinutes(),
                seconds: jstNow.getSeconds(),
            },
        },
    };
    res.status(200).json(status);
};

/**
 * バイト表記からギガバイトに変換する
 * 小数点第二位以下は四捨五入
 */
const byteToGB = (byte: number): number => {
    return Math.ceil((byte / 1024 / 1024 / 1024) * 100) / 100;
};

/**
 * 秒数表記を時分秒に変換する
 */
const secToDate = (sec: number): string => {
    const DAY_SEC = 86400;
    const HOUR_SEC = 3600;
    const MIN_SEC = 60;
    const day = dayToString(Math.floor(sec / DAY_SEC));
    const hour = hourToString(Math.floor((sec % DAY_SEC) / HOUR_SEC));
    const min = minuteToString(Math.floor((sec % HOUR_SEC) / MIN_SEC));

    const dates = [day, hour, min];
    let result: string = '0 minute';
    dates.forEach((value) => {
        if (value === null) return;
        if (result === '0 minute') {
            result = `${value}`;
        } else {
            result = `${result}, ${value}`;
        }
    });
    return result;
};

const dayToString = (day: number): string | null => {
    if (day === 0) return null;
    if (day === 1) return `${day} day`;
    return `${day} days`;
};

const hourToString = (hour: number): string | null => {
    if (hour === 0) return null;
    if (hour === 1) return `${hour} hour`;
    return `${hour} hours`;
};

const minuteToString = (minute: number): string | null => {
    if (minute === 0) return null;
    if (minute === 1) return `${minute} minute`;
    return `${minute} minutes`;
};
