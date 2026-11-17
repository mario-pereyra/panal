# Panal

Plataforma gamificada de actividades, proyecto de la materia Gamificación y Programación Funcional. Cada actividad es una celda; llenarla da gotas de miel y Zum, la abeja, acompaña. Monorepo de pnpm con Vite+ (`vp`): el motor de reglas, los contratos compartidos, la API en Hono y la aplicación en React.

## Terminado significa

- `vp run check`, `vp run test` y `vp run build` en verde, desde la raíz.
- Un cambio que se ve se prueba en el navegador con `vp run dev` (API en 8787 y web en 5173), a 1366 y a 390 px, sin errores en la consola. Cuenta de demostración: `ana@panal.test` / `panal1234`.
- Si el cambio contradice un documento de `docs/`, el documento se corrige en el mismo cambio. Una decisión nueva va a `docs/proyecto/07-decisiones.md`.

## Mapa de piezas clave

| Pieza                   | Dónde                                                   | Qué hace                                                                                                                                                                                                                        |
| :---------------------- | :------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Motor**               | `packages/motor/src/`                                   | Las reglas como funciones puras: `dia.js` (día lógico, cambia a las 03:00), `gotas.js`, `vuelo.js` y `progreso.js` (racha y reservas), `actividades.js` (qué toca hoy), `oficios.js`, `sellos.js`, `celebraciones.js`, `zum.js` |
| **Contratos**           | `packages/contratos/src/`                               | `index.js`: esquemas Zod de cada cuerpo, usados por servidor y formularios. `errores.js`: códigos con estado y mensaje. `respuestas.js`: forma de cada respuesta, en JSDoc                                                      |
| **API**                 | `apps/api/src/app.js`                                   | `crearApp({ base, reloj })`: sesión, rutas y manejador de errores. Se prueba con `app.request()`                                                                                                                                |
| Rutas, servicios, datos | `apps/api/src/{rutas,servicios,datos,seguridad}/`       | Ruta valida y responde; servicio decide permisos y llama al motor; datos solo hace SQL con parámetros                                                                                                                           |
| Base de datos           | `apps/api/src/datos/base.js`, `migraciones/`            | PostgreSQL con `DATABASE_URL`; sin ella, PGlite en `apps/api/.datos/` con la semilla de demostración                                                                                                                            |
| **Store**               | `apps/web/src/app/store.js`                             | Caché de RTK Query, un slice por funcionalidad y el `reloj`                                                                                                                                                                     |
| Efectos                 | `apps/web/src/app/escuchas.js`                          | Todo lo que pasa "después de": logros, avisos, `localStorage`, cambio de día                                                                                                                                                    |
| API del navegador       | `apps/web/src/api/panalApi.js`                          | Endpoints de RTK Query y las etiquetas que invalidan                                                                                                                                                                            |
| Rutas y ventanas        | `apps/web/src/app/App.jsx`                              | Dos `Routes`: las páginas y, encima, las ventanas con ruta (`state.fondo`). Cada pantalla menos Hoy se carga con `perezosa()`                                                                                                   |
| Estructura              | `apps/web/src/app/Estructura.jsx`                       | Cabecera, navegación, franjas de estado, avisos y celebración                                                                                                                                                                   |
| Piezas compartidas      | `apps/web/src/componentes/`                             | `Ventana`, `Formulario` y `useFormulario`, `Graficas`, `Zum`, `CasillaHexagonal`, `Estados`, `Pagina`                                                                                                                           |
| Variables de diseño     | `apps/web/src/estilos/tokens.css`                       | Color, radio, sombra, fuente, ancho máximo                                                                                                                                                                                      |
| **PWA**                 | `apps/web/pwa/`, `apps/web/public/manifest.webmanifest` | `sw.js` (el trabajador), `complemento.js` (lo publica al compilar), `registro.js` (registrar, actualizar e instalar desde la página) y `sw.test.js`                                                                             |
| Despliegue              | `api/index.js`, `vercel.json`                           | La API como función de Vercel sobre Neon, en `gru1`; las migraciones corren al compilar. Publicado en https://panal-drab.vercel.app                                                                                             |
| Ilustraciones           | `assets-fuente/`                                        | `originales/` sin retoques, `listos/` preparados; la aplicación usa copias en `apps/web/src/assets/`                                                                                                                            |

### Pantallas

| Pantalla                        | Ruta                           | Carpeta en `apps/web/src/feature/` |
| :------------------------------ | :----------------------------- | :--------------------------------- |
| P01 Entrar, P02 Crear mi panal  | `/entrar`, `/crear`            | `sesion/`                          |
| P03 Primer vuelo                | `/primer-vuelo`                | `primerVuelo/`                     |
| P04 Hoy                         | `/`                            | `hoy/`                             |
| P05 Celdas                      | `/celdas`                      | `celdas/`                          |
| P06 Actividad (ventana)         | `/celdas/nueva`, `/celdas/:id` | `actividad/`                       |
| P07 Colmenas, P08 Colmena       | `/colmenas`, `/colmenas/:id`   | `colmenas/`                        |
| P09 Invitar (ventana)           | `/colmenas/:id/invitar`        | `colmenas/`                        |
| P10 Reportes                    | `/reportes`                    | `reportes/`                        |
| P11 Mi vuelo                    | `/mi-vuelo`                    | `miVuelo/`                         |
| P12 Celebración (ventana)       | sin ruta                       | `celebraciones/`                   |
| P13 Unirme                      | `/unirme/:codigo`              | `colmenas/`                        |
| P14 No encontrada, sin conexión | `*`                            | `errores/`, `conexion/`            |

## Dónde va cada cosa

| Lo que agregas                           | Su lugar                                                                                                       |
| :--------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| Una regla del juego                      | Función pura en `packages/motor`, con su prueba. Recibe "hoy" y la hora como datos                             |
| La forma de un dato que viaja            | Esquema en `packages/contratos`; la respuesta, en `respuestas.js`                                              |
| Una ruta de la API                       | `apps/api/src/rutas/`, con pruebas en `apps/api/tests/` (receta en `docs/guias/backend.md` §9)                 |
| Un cambio de esquema                     | Una migración nueva en `apps/api/migraciones/`; las aplicadas no se editan                                     |
| Un dato que es verdad en el servidor     | El caché de RTK Query, en `panalApi.js`                                                                        |
| Un estado que solo existe en la pantalla | El slice de su funcionalidad                                                                                   |
| Un valor calculado                       | Un selector memorizado; los componentes muestran lo que reciben                                                |
| Una funcionalidad                        | `feature/<nombre>/` con `<nombre>Slice.js`, `<nombre>Selector.js`, `use<Nombre>.js`, componentes y `textos.js` |
| Una pieza que usan varias pantallas      | `apps/web/src/componentes/`                                                                                    |
| Un color, radio, sombra o fuente         | Una variable en `tokens.css`                                                                                   |
| Un texto de la interfaz                  | El `textos.js` de su funcionalidad; si lo usan varias, `componentes/textos.js`                                 |
| Algo que se recuerda en el navegador     | Una escucha en `app/escuchas.js` que use `app/almacen.js`; el slice lo lee al iniciar                          |

La estructura de `feature/` con slice, selector y hook es la del ejemplo del docente: es requisito de la materia.

## Convenciones

- **Idioma.** Todo en español. Identificadores sin tildes ni eñes (`tamano`, `diaLogico`); textos y comentarios con ortografía completa. Sin emojis en ningún archivo.
- **Sin género hacia la persona.** "Qué bueno verte", no "bienvenida"; "por tu cuenta", no "sola".
- **JavaScript con JSDoc.** Los tipos van en comentarios; el proyecto no usa TypeScript.
- **Interfaz propia.** CSS Modules con las variables de `tokens.css` y gráficas en SVG escrito a mano. Las piezas se adaptan a su contenedor (`@container`); solo la estructura de la página mira la ventana.
- **Controles nativos.** Cada control es un `button`, un `a` o un `input` con nombre accesible, foco visible y zona de toque de 44 px.
- **Se guardan hechos, se calcula el resto.** El servidor guarda celdas llenas; gotas, racha y sellos se calculan con el motor.
- **La voz de Zum.** Cercana, breve y sin culpa: se preocupa por la racha y celebra el avance.

## Cuidado con

- **El formateador.** `vp fmt` desde la raíz; `vite.config.js` deja fuera `docs/`, `assets-fuente/` y las skills instaladas.
- **El reloj.** Ni el motor ni los selectores leen la hora: llega del slice `reloj` en el navegador y de `reloj()` en el servidor. "Hoy" lo decide el servidor.
- **El tamaño de Zum.** Se fija con `--tamano-zum` en la clase que recibe la pieza, no con `inline-size`.
- **El service worker.** Solo existe en la compilación; para verlo, `vp run preview` (en 4173, con `vp run dev` apagado). Un cambio de estrategia se prueba primero en `sw.test.js`. Guarda las respuestas `GET /api/*` en `panal-datos`, que se borra al cerrar sesión.
- **Publicar.** Cada push a `main` sale a producción: Vercel está conectado al repositorio. `npx vercel …` se niega dentro del repositorio (`devEngines` pide pnpm): se corre desde otra carpeta con `--cwd`.
- **Las variables de entorno.** `vp run` no guarda los scripts en caché para que reciban todo el entorno (`DATABASE_URL`). No se activa `run.cache.scripts`.
- **La cookie de sesión no distingue puertos.** Entrar en 5173 también deja la sesión abierta en 4173.
- **Las dependencias.** Cada elección del stack tiene su razón en `04-stack-y-arquitectura.md`. Una dependencia nueva se justifica ahí antes de instalarla.
- **Los datos de demostración.** No se borran el contenedor `panal-db` ni su volumen. Para rehacer la demostración: `node src/datos/semilla.js --reiniciar` en `apps/api`, con el servidor apagado (PGlite no admite dos procesos).

## Qué leer antes de cada tarea

| Vas a…                                            | Lee                                                                                                                   |
| :------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------- |
| Construir o cambiar una pantalla                  | `docs/proyecto/03-pantallas.md` y `docs/guias/frontend.md`                                                            |
| Tocar reglas, datos, el store o la API            | `docs/proyecto/05-datos-y-api.md`, `docs/guias/backend.md` y `docs/propuestas/00-base-comun/motor-de-gamificacion.md` |
| Agregar una dependencia o cambiar la arquitectura | `docs/proyecto/04-stack-y-arquitectura.md`                                                                            |
| Diseñar estados, interacción o accesibilidad      | `docs/guias/ux-ui.md`                                                                                                 |
| Decidir color, tipografía, forma o movimiento     | `docs/guias/sistema-de-diseno.md` y `docs/propuestas/A-panal/DESIGN.md`                                               |
| Dibujar una gráfica o un icono                    | `docs/guias/representacion-visual.md`                                                                                 |
| Escribir textos o decidir cómo reacciona Zum      | `docs/guias/personajes.md` y `docs/propuestas/A-panal/estrategia-gamificacion.md`                                     |
| Generar o preparar ilustraciones                  | `docs/proyecto/06-assets.md`                                                                                          |
| Saber qué está hecho, qué falta y por qué         | `docs/proyecto/README.md` y `docs/proyecto/07-decisiones.md`                                                          |
