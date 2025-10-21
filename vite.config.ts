import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    open: true,
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});