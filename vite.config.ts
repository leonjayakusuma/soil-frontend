/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const CLIENTPORT = process.env.CLIENTPORT;
const SERVERPORT = process.env.SERVERPORT;

// Only require CLIENTPORT in development mode (when running dev server)
// Not needed for production builds
if (process.env.NODE_ENV !== 'production' && !CLIENTPORT) {
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
        // Only configure server port if CLIENTPORT is set (for local development)
        ...(CLIENTPORT && {
            port: parseInt(CLIENTPORT),
            strictPort: true,
        }),
        // Only set up proxy if SERVERPORT is configured (for local development)
        // If SERVERPORT is not set, the app will use VITE_API_URL (if set) or relative URLs
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
