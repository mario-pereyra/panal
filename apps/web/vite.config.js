import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";
import { serviceWorkerDePanal } from "./pwa/complemento.js";

export default defineConfig({
  plugins: [react(), serviceWorkerDePanal()],
  server: {
    port: 5173,
    // En desarrollo, /api va al servidor Hono (apps/api): mismo origen, la cookie de sesión funciona igual que en producción.
    proxy: {
      "/api": "http://127.0.0.1:8787",
    },
  },
});
