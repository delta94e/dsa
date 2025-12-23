import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 3003,
		cors: true,
	},
	preview: {
		port: 3003,
	},
});
