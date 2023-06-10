import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { BaseDateController } from './BaseDateController';

// load dayjs plugins
dayjs.extend(tz);
dayjs.extend(utc);

export class UTCController extends BaseDateController {
    constructor(date?: string | number) {
        super(date);
        this.date = dayjs.utc(date);
    }
}
