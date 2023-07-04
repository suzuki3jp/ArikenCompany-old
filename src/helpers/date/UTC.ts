import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { BaseDate } from '@/helpers/Date/BaseDate';

// load dayjs plugins
dayjs.extend(tz);
dayjs.extend(utc);

export class UTC extends BaseDate {
    constructor(date?: string | number) {
        super(date);
        this.date = dayjs.utc(date);
    }
}
