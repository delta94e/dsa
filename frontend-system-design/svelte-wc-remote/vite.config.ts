import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

export default defineConfig({
    plugins: [
        svelte({
            preprocess: sveltePreprocess(),
            compilerOptions: {
                customElement: true,
            },
        }),
    ],
    build: {
        lib: {
            entry: 'src/main.ts',
            name: 'SvelteComponents',
            formats: ['es'],
            fileName: 'svelte-components',
        },
        outDir: 'dist',
        sourcemap: true,
    },
    server: {
        port: 3005,
        cors: true,
    },
});
