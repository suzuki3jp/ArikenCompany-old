export const load = async () => {
	const commands = await (await fetch('https://api.suzuki3jp.xyz:3150/commands')).json();
	return { commands };
};
