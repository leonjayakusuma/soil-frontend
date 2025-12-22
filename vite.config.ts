/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const CLIENTPORT = process.env.CLIENTPORT;
const SERVERPORT = process.env.SERVERPORT;

if (!CLIENTPORT) {
    console.error("No CLIENTPORT found in .env file");
    process.exit(1);
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        reporters: ['default']
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
            "@shared": resolve(__dirname, "src/shared"),
        },
    },
    server: {
        port: parseInt(CLIENTPORT),
        strictPort: true,
        // Only set up proxy if SERVERPORT is configured (for local development)
        // If SERVERPORT is not set, the app will use VITE_API_URL for production API
        ...(SERVERPORT && {
            proxy: {
                "/api": {
                    target: `http://localhost:${SERVERPORT}`,
                    changeOrigin: true,
                    // rewrite: (path) => path.replace(/^\/api/, ""),
                    secure: false,
                },
            },
        }),
    },
});
