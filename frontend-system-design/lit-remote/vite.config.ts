import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: 'lit-components',
        },
        rollupOptions: {
            external: [],
        },
        outDir: 'dist',
        sourcemap: true,
    },
    server: {
        port: 3003,
        cors: true,
    },
});
