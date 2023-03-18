import { RequestClient } from '@suzuki3jp/utils';
import { Agent } from 'https';

export const load = async () => {
	const commands: Record<string, string> = (
		await new RequestClient().get({
			url: 'https://suzuki-dev.com:3150/commands',
			config: { httpsAgent: new Agent({ rejectUnauthorized: false }) }
		})
	).data;
	return { commands };
};
