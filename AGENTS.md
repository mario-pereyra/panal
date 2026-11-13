# Panal

Plataforma gamificada de actividades, proyecto de la materia Gamificación y Programación Funcional. Monorepo de pnpm con Vite+: `packages/motor` (las reglas, como funciones puras) y `apps/web` (React, Redux Toolkit y RTK Query). Todavía no hay servidor: las peticiones las responde `apps/web/src/api/baseDeEjemplo.js`, con las rutas que tendrá la API.

## Terminado significa

`vp run check`, `vp run test` y `vp run build` en verde. Un cambio que se ve se comprueba además en el navegador (`vp run dev`), a 1366 px y a 390 px de ancho, sin errores en la consola. Si el cambio altera lo que describe un documento de `docs/proyecto/`, el documento se actualiza en el mismo cambio.

## Dónde va cada cosa

| Lo que agregas                                            | Su lugar                                                                                                           |
| :-------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| Una regla del juego: gotas, racha, oficios, estado de Zum | Función pura en `packages/motor`, con su prueba. Recibe "hoy" y la hora como datos                                 |
| Un dato que es verdad en el servidor                      | El caché de RTK Query, en `apps/web/src/api/panalApi.js`                                                           |
| Un estado que solo existe en la pantalla                  | Un slice propio dentro de su funcionalidad                                                                         |
| Un valor calculado a partir de otros                      | Un selector memorizado. Los componentes muestran lo que reciben                                                    |
| Una funcionalidad                                         | `apps/web/src/feature/<nombre>/` con `<nombre>Slice.js`, `<nombre>Selector.js`, `use<Nombre>.js` y sus componentes |
| Una pieza que usan varias pantallas                       | `apps/web/src/componentes/`                                                                                        |
| Un color, radio, sombra o fuente                          | Una variable en `apps/web/src/estilos/tokens.css`                                                                  |
| Un texto de la interfaz                                   | El `textos.js` de su funcionalidad                                                                                 |

La estructura de `feature/` con slice, selector y hook es la del ejemplo del docente: es un requisito de la materia y se conserva.

## Convenciones

- **Idioma.** Todo en español. Los identificadores van sin tildes ni eñes (`tamano`, `diaLogico`); los textos y los comentarios, con ortografía completa. Sin emojis en ningún archivo.
- **JavaScript con JSDoc.** Los tipos se escriben en comentarios JSDoc; el proyecto no usa TypeScript.
- **Interfaz propia.** CSS Modules con las variables de `tokens.css` y gráficas en SVG escrito a mano. Las piezas se adaptan al ancho de su contenedor (`@container`); solo la estructura de la página mira el ancho de la ventana.
- **Controles nativos.** Cada control es un `button`, un `a` o un `input` con nombre accesible, foco visible y zona de toque de 44 px. El dibujo es solo su aspecto.
- **La voz de Zum.** Cercana, breve y sin culpa: Zum se preocupa por la racha y celebra el avance.

## Cuidado con

- **El formateador.** Se ejecuta como `vp fmt` desde la raíz, donde `vite.config.js` limita su alcance al código del proyecto. `docs/`, `assets-fuente/` y las skills instaladas quedan como están.
- **Las ilustraciones.** `assets-fuente/originales/` guarda lo que entregó el generador, sin retoques. La aplicación usa copias de `assets-fuente/listos/` dentro de `apps/web/src/assets/`.
- **Las dependencias.** Cada elección del stack tiene su razón y lo que se descartó. Una dependencia nueva se justifica contra ese documento antes de instalarla.

## Qué leer antes de cada tarea

| Vas a…                                            | Lee                                                                                          |
| :------------------------------------------------ | :------------------------------------------------------------------------------------------- |
| Construir o cambiar una pantalla                  | `docs/proyecto/03-pantallas.md`                                                              |
| Tocar reglas, datos, el store o la API            | `docs/proyecto/05-datos-y-api.md` y `docs/propuestas/00-base-comun/motor-de-gamificacion.md` |
| Agregar una dependencia o cambiar la arquitectura | `docs/proyecto/04-stack-y-arquitectura.md`                                                   |
| Escribir textos o decidir cómo reacciona Zum      | `docs/propuestas/A-panal/estrategia-gamificacion.md`                                         |
| Decidir color, tipografía, forma o movimiento     | `docs/propuestas/A-panal/DESIGN.md` y `docs/propuestas/A-panal/referencia/pantalla-hoy.png`  |
| Generar o preparar ilustraciones                  | `docs/proyecto/06-assets.md`                                                                 |
| Saber qué está hecho y qué falta                  | `docs/proyecto/README.md` y `docs/proyecto/02-historias-de-usuario.md`                       |
