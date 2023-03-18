import { RequestClient } from '@suzuki3jp/utils';
import { Agent } from 'https';

export const load = async () => {
	const chatters: Record<string, string> = (
		await new RequestClient().get({
			url: 'https://suzuki-dev.com:3150/chatters',
			config: { httpsAgent: new Agent({ rejectUnauthorized: false }) }
		})
	).data;
	return { chatters };
};
