import { defineConfig } from "vite-plus";

// Configuración común del repositorio: formato, reglas de estilo y tareas.
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
    // Los scripts de package.json no van a la caché: con caché, Vite+ solo les
    // pasa las variables de entorno declaradas, y `migrar` corría sin
    // DATABASE_URL (sobre PGlite) o se daba por hecha sin ejecutarse.
    cache: { scripts: false, tasks: true },
  },
});
