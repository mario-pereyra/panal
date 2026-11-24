import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";
import { panalServiceWorkerPlugin } from "./pwa/plugin.js";

export default defineConfig({
  plugins: [react(), panalServiceWorkerPlugin()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:8787",
    },
  },
});
