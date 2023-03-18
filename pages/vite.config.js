import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			external: ['@suzuki3jp/utils']
		}
	}
};

export default config;
