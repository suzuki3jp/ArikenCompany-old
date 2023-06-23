import dayjs, { Dayjs } from 'dayjs';

import { DateJSON } from '../../typings';

export class BaseDateController {
    protected date: Dayjs;

    constructor(date?: string | number) {
        this.date = dayjs(date);
    }

    getYear(): number {
        return this.date.year();
    }

    getMonth(): number {
        return this.date.month() + 1;
    }

    getDay(): number {
        return this.date.date();
    }

    getHours(): number {
        return this.date.hour();
    }

    getMinutes(): number {
        return this.date.minute();
    }

    getSeconds(): number {
        return this.date.second();
    }

    getMilliSeconds(): number {
        return this.date.millisecond();
    }

    format(template?: string): string {
        return this.date.format(template);
    }

    toISOString(): string {
        return this.date.toISOString();
    }

    toString(): string {
        return this.format('YYYY/MM/DD HH:mm:ss');
    }

    toJSON(): DateJSON {
        return {
            year: this.getYear(),
            month: this.getMonth(),
            day: this.getDay(),
            hours: this.getHours(),
            minutes: this.getMinutes(),
            seconds: this.getSeconds(),
            milliSeconds: this.getMilliSeconds(),
        };
    }
}
