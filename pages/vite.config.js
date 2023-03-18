import { sveltekit } from '@sveltejs/kit/vite';
import { nodeResolve } from '@rollup/plugin-node-resolve';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), nodeResolve()],
	build: {
		rollupOptions: {
			external: ['@suzuki3jp/utils', /node_modules\/@suzuki3jp/]
		}
	}
};

export default config;
