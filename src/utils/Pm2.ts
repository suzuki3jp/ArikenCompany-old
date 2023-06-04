import pm2 from 'pm2';

import { Base } from '../class/Base';

export const restartPm2Process = (base: Base) => {
    pm2.connect((e) => {
        if (e) {
            base.logger.err(`Failed to connect to pm2.`);
        } else {
            const processName = 'ArikenCompany';
            pm2.list((e, list) => {
                if (e) {
                    base.logger.err('Failed to get list of pm2 processes.');
                } else {
                    pm2.restart(processName, (e, proc) => {
                        if (e) {
                            base.logger.err('Failed to restart pm2 process.');
                            pm2.disconnect();
                        } else {
                            base.logger.system('Sucess to restart pm2 process.');
                            pm2.disconnect();
                        }
                    });
                }
            });
        }
    });
};
