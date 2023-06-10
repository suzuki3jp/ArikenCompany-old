import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

import { BaseDateController } from './BaseDateController';

// load dayjs plugins
dayjs.extend(utc);
dayjs.extend(tz);

export class JSTController extends BaseDateController {
    constructor(date?: string | number) {
        super(date);
        this.date = dayjs.tz(date, 'Asia/Tokyo');
    }
}
