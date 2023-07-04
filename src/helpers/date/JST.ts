import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

import { BaseDate } from '@/helpers/Date/BaseDate';

// load dayjs plugins
dayjs.extend(utc);
dayjs.extend(tz);

export class JST extends BaseDate {
    constructor(date?: string | number) {
        super(date);
        this.date = dayjs.tz(date, 'Asia/Tokyo');
    }
}
