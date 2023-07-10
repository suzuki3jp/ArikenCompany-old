import 'module-alias/register';

import { ArikenCompany } from '@/ArikenCompany';

const boot = async () => {
    const client = new ArikenCompany();
    await client.setup();
    client.start();
};

boot();
