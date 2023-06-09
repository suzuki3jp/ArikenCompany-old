// nodeモジュールをインポート
import cron from 'node-cron';

// モジュールをインポート
import { ArikenCompany } from './ArikenCompany';
import { api } from './api/index';
import { events } from './events/index';
import { restartPm2Process } from './utils/Pm2';

(async () => {
    const main = new ArikenCompany();

    events(main);
    api(main);

    cron.schedule('59 59 11,23 * * *', () => {
        main.logger.system(`Periodic process restart in progress...`);
        restartPm2Process(main);
    });
})();
