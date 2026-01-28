import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    root: resolve(__dirname, 'admin'),
    envDir: resolve(__dirname), // Load .env from root directory
    server: {
        port: 5176,
    },
    build: {
        outDir: resolve(__dirname, 'dist/admin'),
        rollupOptions: {
            input: {
                admin: resolve(__dirname, 'admin/index.html'),
            },
        },
    },
})
