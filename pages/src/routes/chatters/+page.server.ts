export const load = async () => {
	const chatters = await (await fetch('https://api.suzuki3jp.xyz:3150/chatters')).json();
	return { chatters };
};
