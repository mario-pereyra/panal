# Panal

Plataforma gamificada para organizar y cumplir actividades, por tu cuenta o en colmena. Proyecto final de Gamificación y Programación Funcional.

Cada actividad es una celda. Llenarla da gotas de miel, llenar las del día cierra el panal y Zum, la abeja, acompaña el avance sin reprochar nunca.

## Estado

Al 17 de noviembre de 2026 están las **14 pantallas**, el **servidor con su base de datos** y la **PWA**: se instala y abre sin conexión. Avance y defectos conocidos: [`docs/proyecto/README.md`](docs/proyecto/README.md).

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

3. **Arranca el servidor y la aplicación.**

   ```bash
   vp run dev
   ```

   Abre <http://localhost:5173> y entra con `ana@panal.test` y la contraseña `panal1234`. No hace falta base de datos ni archivo `.env`: sin `DATABASE_URL`, el servidor usa PGlite (PostgreSQL dentro de Node) en `apps/api/.datos/` y la primera vez carga una colmena de demostración con cuatro abejas (`ana`, `luis`, `sofia` y `diego`, todas `@panal.test`).

## Comandos

Todos se ejecutan desde la raíz.

| Comando                            | Qué hace                                                               |
| :--------------------------------- | :--------------------------------------------------------------------- |
| `vp run dev`                       | Servidor (8787) y aplicación (5173) juntos, con recarga en cada cambio |
| `vp run dev:api`, `vp run dev:web` | Solo uno de los dos                                                    |
| `vp run test`                      | Pruebas del motor, los contratos, la API y la interfaz                 |
| `vp run check`                     | Formato y reglas de estilo; `vp fmt` corrige el formato                |
| `vp run build`                     | Versión para publicar, con su service worker                           |
| `vp run preview`                   | Esa versión en <http://localhost:4173> con la API: para probar la PWA  |
| `vp run migrar`                    | Aplica las migraciones pendientes a la base de `DATABASE_URL`          |
| `vp run db`                        | Inicia el contenedor de PostgreSQL local (`wslc`, Windows)             |

Para usar PostgreSQL en lugar de PGlite, inicia el contenedor y copia [`.env.example`](.env.example) como `.env`, con `DATABASE_URL` descomentada. Cómo se creó el contenedor: [`docs/proyecto/04-stack-y-arquitectura.md`](docs/proyecto/04-stack-y-arquitectura.md).

## Qué hay en cada carpeta

```
apps/
  web/                 la aplicación: React, Redux Toolkit y RTK Query
    src/app/           store, rutas, estructura común y efectos
    src/api/           RTK Query: los endpoints de la API
    src/feature/       una carpeta por funcionalidad: slice, selectores, hook, pantalla y textos
    src/componentes/   piezas compartidas: Zum, casilla hexagonal, ventana, formularios y gráficas
    src/estilos/       variables de diseño y estilos de base
    pwa/               service worker, su complemento de Vite, el registro en la página y sus pruebas
  api/                 el servidor: Hono sobre Node, con PostgreSQL o PGlite
    src/rutas/         una por recurso: cuenta, yo, panal, actividades, celdas, colmenas, reportes
    src/servicios/     permisos y reglas que cruzan tablas
    src/datos/         SQL con parámetros, migraciones y semilla
    migraciones/       el esquema, en SQL numerado
packages/
  motor/               las reglas del juego como funciones puras, con sus pruebas
  contratos/           esquemas Zod y errores que comparten servidor y navegador
api/index.js           la API como función de Vercel; vercel.json, su configuración
assets-fuente/         ilustraciones de Zum e iconos: originales, preparados y encargos
docs/                  proyecto, guías por área, propuestas de diseño y materia
.github/               integración continua y plantillas de issues y pull requests
```

## Desplegar

Publicado en **<https://panal-drab.vercel.app>**: la web y la API en [Vercel](https://vercel.com) (plan Hobby) y la base en [Neon](https://neon.com) (plan Free, desde el Marketplace de Vercel), las dos en São Paulo (`gru1`). Gratis y sin tarjeta; las razones están en [`04-stack-y-arquitectura.md` D13](docs/proyecto/04-stack-y-arquitectura.md#d13-despliegue-gratuito).

La CLI corre con `npx`, pero **desde fuera del repositorio**: dentro, `npx` se niega porque `devEngines` pide pnpm. Por eso cada orden lleva `--cwd` con la ruta del proyecto (aquí, `$PANAL`):

```bash
npx vercel login                                  # una vez: abre el navegador
npx vercel deploy --prod --cwd "$PANAL"           # publica lo que hay en la carpeta, con o sin commit
npx vercel env pull neon.env --environment production --cwd "$PANAL"   # la DATABASE_URL de Neon, a un archivo fuera del repositorio
```

`vercel.json` dice cómo compilar, qué publicar, en qué región y cómo llegar a la API; `.vercelignore` deja fuera `docs/`, `assets-fuente/` y la base local. Las migraciones se aplican solas al compilar.

**Montarlo desde cero**, en otra cuenta:

1. `npx vercel project create panal` y `npx vercel link --yes --project panal --cwd "$PANAL"`.
2. `npx vercel integration add neon --billing-plan free_v3 --meta region=gru1 --meta auth=false --cwd "$PANAL"`: crea la base y carga `DATABASE_URL` en Production y Preview. La primera vez pide aceptar los términos de Neon en el navegador.
3. `npx vercel deploy --prod --cwd "$PANAL"`.
4. La demostración, una vez: con la `DATABASE_URL` de `vercel env pull`, `node apps/api/src/datos/semilla.js`.

El proyecto no está conectado a GitHub: se publica con `vercel deploy`. Para que cada envío a `main` se publique solo, `npx vercel git connect --cwd "$PANAL"`.

## Cómo está hecho

- **Las reglas viven en `packages/motor`.** Gotas, racha, oficios, sellos, estado de Zum: funciones puras que no leen el reloj ni guardan nada. El servidor las usa como autoridad y el navegador, para responder al instante.
- **Se guardan hechos y se calcula el resto.** La base guarda celdas llenas; las gotas, la racha y los sellos se calculan al leer. Deshacer una celda deshace todo lo que había dado.
- **El store de Redux guarda poco.** Lo que es verdad en el servidor está en el caché de RTK Query; lo demás se calcula con selectores memorizados. Las pantallas no hacen cuentas.
- **Sin librería de interfaz.** CSS propio con variables y módulos; las gráficas son SVG dibujado a mano con hexágonos.

## Documentación

| Documento                                        | Contenido                                                                         |
| :----------------------------------------------- | :-------------------------------------------------------------------------------- |
| [`docs/README.md`](docs/README.md)               | El mapa de toda la documentación                                                  |
| [`docs/proyecto/`](docs/proyecto/README.md)      | PRD, historias de usuario, pantallas, stack, datos y API, assets, decisiones      |
| [`docs/guias/`](docs/README.md#guías-de-trabajo) | Frontend, backend, UX y UI, sistema de diseño, representación visual y personajes |
| [`AGENTS.md`](AGENTS.md)                         | Mapa de piezas clave y convenciones, para personas y para agentes                 |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)             | Ramas, commits y pull requests                                                    |

## Licencia

[MIT](LICENSE).
