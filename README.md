# Panal

Plataforma gamificada para organizar y cumplir actividades, sola o en colmena. Proyecto final de Gamificación y Programación Funcional.

Cada actividad es una celda. Llenarla da gotas de miel, llenar las del día cierra el panal y Zum, la abeja, acompaña el avance sin reprochar nunca.

## Estado

Al 13 de noviembre de 2026 funciona la pantalla **Hoy**, con datos de ejemplo: todavía no hay servidor ni base de datos conectados. El plan completo está en [`docs/proyecto/`](docs/proyecto/README.md).

## Cómo iniciar el proyecto

Solo hace falta [Vite+](https://viteplus.dev) (`vp`): instala y administra Node y pnpm por su cuenta.

1. **Instala Vite+**, una vez por máquina, y abre una terminal nueva.

   ```powershell
   irm https://vite.plus/ps1 | iex
   ```

   En macOS y Linux:

   ```bash
   curl -fsSL https://vite.plus | bash
   ```

2. **Descarga el proyecto e instala sus dependencias.**

   ```bash
   git clone https://github.com/mario-pereyra/panal.git panal
   cd panal
   vp install
   ```

3. **Arranca la aplicación.**

   ```bash
   vp run dev
   ```

   Abre <http://localhost:5173>. Aparece la pantalla Hoy con datos de ejemplo, sin base de datos ni archivo `.env`.

## Comandos

Todos se ejecutan desde la raíz.

| Comando        | Qué hace                                        |
| :------------- | :---------------------------------------------- |
| `vp run dev`   | Abre la aplicación y la recarga con cada cambio |
| `vp run test`  | Corre las pruebas del motor y de la interfaz    |
| `vp run check` | Revisa el formato y las reglas de estilo        |
| `vp fmt`       | Corrige el formato                              |
| `vp run build` | Genera la versión para publicar                 |
| `vp run db`    | Inicia la base de datos local                   |

La base de datos local es un contenedor de PostgreSQL en `wslc` (Windows). Todavía no la usa ninguna pantalla; cómo crearla está en [`docs/proyecto/04-stack-y-arquitectura.md`](docs/proyecto/04-stack-y-arquitectura.md).

## Qué hay en cada carpeta

```
apps/web/            la aplicación: React, Redux Toolkit y RTK Query
  src/app/           el store, las rutas y la estructura común
  src/api/           RTK Query y el servidor de ejemplo
  src/feature/       una carpeta por funcionalidad: slice, selectores, hook y pantalla
  src/componentes/   piezas compartidas: Zum, casilla hexagonal, tarjetas y gráficas
  src/estilos/       variables de diseño y estilos de base
packages/motor/      las reglas del juego como funciones puras, con sus pruebas
assets-fuente/       ilustraciones de Zum: originales, encargos y herramientas
docs/                enunciado, propuestas de diseño y documentación del proyecto
.github/             integración continua y plantillas de issues y pull requests
```

## Cómo está hecho

- **Las reglas viven en `packages/motor`.** Gotas, racha, oficios, estado de Zum: funciones puras que no leen el reloj ni guardan nada. Las usará el servidor como autoridad y ya las usa el navegador para responder al instante.
- **El store de Redux guarda poco.** Lo que es verdad en el servidor está en el caché de RTK Query; lo demás se calcula con selectores memorizados. Las pantallas no hacen cuentas.
- **Sin librería de interfaz.** CSS propio con variables y módulos; las gráficas son SVG dibujado a mano.

Mientras no exista el servidor, las peticiones las responde `apps/web/src/api/baseDeEjemplo.js`, con las mismas rutas que tendrá la API. Los cambios se pierden al recargar.

## Documentación

| Documento                                       | Contenido                                                        |
| :---------------------------------------------- | :--------------------------------------------------------------- |
| [`docs/proyecto/`](docs/proyecto/README.md)     | PRD, historias de usuario, pantallas, stack, datos y API, assets |
| [`docs/propuestas/`](docs/propuestas/README.md) | Las cinco direcciones de diseño que se evaluaron y la base común |
| [`docs/`](docs/README.md)                       | Enunciado del proyecto y fundamentos de gamificación             |
| [`AGENTS.md`](AGENTS.md)                        | Convenciones del código, para personas y para agentes            |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)            | Ramas, commits y pull requests                                   |

## Licencia

[MIT](LICENSE).
