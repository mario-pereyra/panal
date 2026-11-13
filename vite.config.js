import { defineConfig } from "vite-plus";

// Configuración común del repositorio: formato, reglas de estilo y caché de tareas.
export default defineConfig({
  // Solo se formatea y se revisa el código del proyecto: apps/ y packages/.
  // Las skills instaladas, la documentación y las ilustraciones no se tocan.
  fmt: {
    ignorePatterns: [
      ".agents/**",
      ".claude/**",
      "docs/**",
      "assets-fuente/**",
      "skills-lock.json",
      "pnpm-lock.yaml",
    ],
  },
  lint: {
    ignorePatterns: [".agents/**", ".claude/**", "docs/**", "assets-fuente/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
  },
  run: {
    cache: true,
  },
});
