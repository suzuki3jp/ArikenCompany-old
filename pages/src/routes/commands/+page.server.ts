export const load = async () => {
	const commands = await (await fetch('https://suzuki-dev.com:3150/commands')).json();
	return { commands };
};
