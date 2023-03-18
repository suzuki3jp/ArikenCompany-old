export const load = async () => {
	const chatters = await (await fetch('https://suzuki-dev.com:3150/chatters')).json();
	return { chatters };
};
