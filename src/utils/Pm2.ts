import pm2 from 'pm2';

import { ArikenCompany } from '../ArikenCompany';

export const restartPm2Process = (app: ArikenCompany) => {
    pm2.connect((e) => {
        if (e) {
            app.logger.err(`Failed to connect to pm2.`);
        } else {
            const processName = 'ArikenCompany';
            pm2.list((e, list) => {
                if (e) {
                    app.logger.err('Failed to get list of pm2 processes.');
                } else {
                    pm2.restart(processName, (e, proc) => {
                        if (e) {
                            app.logger.err('Failed to restart pm2 process.');
                            pm2.disconnect();
                        } else {
                            app.logger.system('Sucess to restart pm2 process.');
                            pm2.disconnect();
                        }
                    });
                }
            });
        }
    });
};
