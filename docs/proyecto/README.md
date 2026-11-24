# Proyecto: Panal

Documentación del proyecto que se va a construir. Parte de la dirección elegida, **A · Panal**, y del tablero "Hoy" del diseño 1.

Estado al 17 de noviembre de 2026: **las 14 pantallas, el servidor con su base de datos y la PWA funcionando de punta a punta, publicado en <https://panal-drab.vercel.app>**; falta la versión 1.1. Cómo correrlo y desplegarlo: [`../../README.md`](../../README.md).

## Documentos

| N.º | Documento | Qué responde |
| :---: | :--- | :--- |
| 1 | [`01-prd.md`](01-prd.md) | Qué se construye, para quién, con qué alcance y cuándo está terminado |
| 2 | [`02-historias-de-usuario.md`](02-historias-de-usuario.md) | Las 42 historias con sus criterios de aceptación y su trazabilidad con el enunciado |
| 3 | [`03-pantallas.md`](03-pantallas.md) | Las 14 pantallas: rutas, contenido, estados y adaptación al teléfono |
| 4 | [`04-stack-y-arquitectura.md`](04-stack-y-arquitectura.md) | Con qué se construye y por qué, decisión por decisión |
| 5 | [`05-datos-y-api.md`](05-datos-y-api.md) | Qué se guarda, qué se calcula, el store de Redux, la API y las pruebas |
| 6 | [`06-assets.md`](06-assets.md) | Qué ilustraciones hacen falta, dónde va cada una y cómo se generan con `agy` |
| 7 | [`07-decisiones.md`](07-decisiones.md) | Lo que se decidió al construir y cambia o completa los documentos anteriores |

Cómo se trabaja en cada área del código está en las guías: [`../guias/`](../README.md#guías-de-trabajo).

## De dónde sale cada cosa

Estos documentos no repiten lo que ya está escrito; lo enlazan.

| Tema | Fuente |
| :--- | :--- |
| Enunciado del docente | [`../materia/enunciado.md`](../materia/enunciado.md) |
| Reglas del juego, con sus números | [`../propuestas/00-base-comun/motor-de-gamificacion.md`](../propuestas/00-base-comun/motor-de-gamificacion.md) |
| El mundo de Panal: mecánicas con nombre, sellos, mieles, estados de Zum | [`../propuestas/A-panal/estrategia-gamificacion.md`](../propuestas/A-panal/estrategia-gamificacion.md) |
| Voz y textos de la interfaz | [`../propuestas/A-panal/propuesta.md`](../propuestas/A-panal/propuesta.md) |
| Color, tipografía, forma, movimiento y gráficas | [`../propuestas/A-panal/direccion-visual.md`](../propuestas/A-panal/direccion-visual.md) y [`../propuestas/A-panal/DESIGN.md`](../propuestas/A-panal/DESIGN.md) |
| Referencia visual aprobada | [`../propuestas/A-panal/referencia/pantalla-hoy.png`](../propuestas/A-panal/referencia/pantalla-hoy.png) |

Donde este proyecto se aparta de la propuesta base, manda este proyecto. Las diferencias:

- **Stack.** La propuesta base decía Express, JWT y Recharts. Aquí se usa Hono, sesión con cookie y gráficas en SVG propio, con sus razones.
- **Datos.** Desaparecen las tablas `eventos` e `insignias_usuario`: los hechos están en `celdas_llenas` y lo demás se calcula.
- **Pantallas.** Se suman P13 "Unirme a una colmena" y P14 "No encontrada y sin conexión".
- **Invitación.** Por enlace en la versión 1; por correo en la 1.1.

## Orden de trabajo propuesto

| Fase | Qué se hace | Resultado |
| :---: | :--- | :--- |
| 0 | Confirmar el stack (hecho) y aprobar a Zum | Decisiones cerradas |
| 1 | Montar el repositorio y escribir el motor con sus pruebas | `packages/motor` en verde, sin interfaz |
| 2 | Sistema de diseño en código: variables, piezas compartidas y las gráficas, con datos de ejemplo | Una galería donde se ven todas las piezas y las pantallas maquetadas |
| 3 | Servidor: cuenta, actividades y celdas, sobre el contenedor de PostgreSQL | Los dos primeros casos de uso funcionando de punta a punta |
| 4 | Colmenas, invitación y reportes | Los cuatro casos de uso del enunciado |
| 5 | PWA, accesibilidad, estados vacíos y de error, despliegue | Versión 1 lista para la defensa |
| 6 | Versión 1.1, solo si la 1 está terminada | Sugerencia de Zum, alacena, zumbidos |

La fase 2 es donde se diseñan las pantallas: se maquetan directamente con las piezas reales y datos de ejemplo, de modo que el diseño aprobado ya es código de la aplicación y no una maqueta que haya que rehacer.

### Avance al 17 de noviembre de 2026

| Fase | Hecho | Falta |
| :---: | :--- | :--- |
| 1 | Repositorio con Vite+, publicado en GitHub como privado, con integración continua (formato, pruebas y compilación). Motor completo: día lógico, gotas, qué toca hoy, vuelo y reservas, oficios, sellos, celebraciones, constancia, cuotas, avance de colmena y estado de Zum, con pruebas de propiedades | Nada |
| 2 | Variables de diseño y piezas compartidas: ventana, formularios, avisos, estados vacíos y de error, gráficas de celdas, sellos de cera. Las 14 pantallas, de P01 a P14 | La galería de piezas, que se reemplazó por las pantallas reales |
| 3 | API en Hono con sesión por cookie, PostgreSQL o PGlite, migraciones y semilla de demostración. Cuenta, actividades, celdas y progreso | Nada |
| 4 | Colmenas, invitación por enlace, unirse, reportes con sus periodos | Nada |
| 5 | PWA: manifiesto, iconos, service worker que abre sin conexión y aviso de versión nueva, todo en `apps/web/pwa/` y con pruebas. Pantallas que se descargan al visitarlas: la carga inicial bajó de 578 a unos 415 kB. Desplegado en Vercel y Neon, con la demostración cargada. Revisión en el navegador a 1366, 900, 768 y 390 px, también en producción | Nada |
| 6 | Nada | Sugerencia de Zum, alacena, zumbidos |

Pruebas: 202 en verde (motor 62, contratos 5, API 96, interfaz 39).

**Defectos conocidos.**

- **Ilustraciones pendientes.** Las escenas E01 a E06 y los sellos S01 a S17 se dibujan en SVG mientras no se generen; el icono de la aplicación se compuso con la pose "feliz" (ver `07-decisiones.md`).

**Corregido el 17 de noviembre.** Los ajustes ya no valen hacia atrás: cada día se cuenta con la meta y el día sin flores de entonces (tabla `tramos_de_ajustes`). La tarjeta principal en tableta lleva el panal de hoy a la derecha. Una auditoría del código encontró dos defectos más, también corregidos: el formulario contaba mal el cupo de prioridad alta, y en una colmena un doble toque mandaba dos peticiones. Al desplegar apareció otro: en Entrar, volver a la pestaña borraba lo escrito. Los detalles están en [`07-decisiones.md`](07-decisiones.md).

**Reestructuración del frontend (24 de noviembre).** `apps/web/src` quedó en `store/` (Redux), `nucleo/` (lo que comparten varias pantallas), `feature/` (una carpeta por pantalla), `componentes/ui` y `componentes/panal`, y `lib/`. Se fue el *listener middleware*: cada efecto vive con su causa. De paso se corrigieron la leyenda del panal de constancia en Reportes (no coincidía con los colores de la gráfica), un aviso que podía durar 12 s en vez de 6, el error de un campo que no aparecía al salir de él en la ventana de actividad, Reportes, que se rompía al cambiar de periodo, las gotas de bono de hoy, que no se movían al llenar o vaciar una celda, una actividad que se creaba dos veces si el envío se repetía tras un fallo, las gotas de una colmena vencida, dos logros iguales que chocaban en la celebración, el color de una celda llenada por alguien que ya salió de la colmena, y Celdas, que no avisaba si fallaba el panal de hoy. Queda una duda: en Reportes, "Celdas por día" marca un día como cerrado con la meta de hoy, porque el servidor no manda si cada día se cerró. Ver [`07-decisiones.md`](07-decisiones.md) y [`../guias/frontend.md`](../guias/frontend.md).

**Gestión de celdas y colmenas (24 de noviembre).** El título de una celda la abre para editarla desde Hoy, Celdas y Colmena. Los permisos viven en una sola función que usan el servidor y la interfaz: una celda de colmena la cambian quien la creó, su persona asignada y la fundadora. Celdas tiene la pestaña "Hechas" con lo llenado los últimos siete días, para deshacerlo. La fundadora quita abejas, pasa la fundación y recupera una colmena archivada, que ahora aparece en Colmenas. Ver [`07-decisiones.md`](07-decisiones.md).

**Refactorizaciones propuestas, sin hacer.** Salieron de la auditoría del 17 de noviembre. Ninguna corrige un defecto; cada una deja el código más fácil de cambiar:

| Propuesta | Dónde | Esfuerzo |
| :--- | :--- | :--- |
| Mover el cálculo de reportes (90 líneas) y los permisos de celdas de las rutas a `servicios/` | `rutas/reportes.js`, `rutas/celdas.js` | Medio |
| Un solo ayudante para validar el identificador de la ruta, con un código de respuesta claro (hoy hay 400, 404 y 204) | `rutas/actividades.js`, `rutas/celdas.js`, `servicios/colmenas.js` | Bajo |
| Un `MarcoDeCampo` para la etiqueta, la ayuda y el error de los tres controles de formulario | `componentes/ui/Formulario.jsx` | Bajo |
