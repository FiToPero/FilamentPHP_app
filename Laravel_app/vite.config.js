import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
        origin: 'https://lonely-spell-p4w4w7qv9943r9jj-5173.app.github.dev:5173',
        hmr: {
            host: 'lonely-spell-p4w4w7qv9943r9jj-5173.app.github.dev',
            protocol: 'wss',
            port: 5173,
        },
        watch: {
            usePolling: true,  // Usa polling para vigilar los cambios en archivos dentro del contenedor
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
