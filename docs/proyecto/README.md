# Proyecto: Panal

Documentación del proyecto que se va a construir. Parte de la dirección elegida, **A · Panal**, y del tablero "Hoy" del diseño 1.

Estado al 13 de noviembre de 2026: **stack confirmado, base de datos local probada y la pantalla "Hoy" funcionando con datos de ejemplo**. Cómo correrla: [`../../README.md`](../../README.md).

## Documentos

| N.º | Documento | Qué responde |
| :---: | :--- | :--- |
| 1 | [`01-prd.md`](01-prd.md) | Qué se construye, para quién, con qué alcance y cuándo está terminado |
| 2 | [`02-historias-de-usuario.md`](02-historias-de-usuario.md) | Las 42 historias con sus criterios de aceptación y su trazabilidad con el enunciado |
| 3 | [`03-pantallas.md`](03-pantallas.md) | Las 14 pantallas: rutas, contenido, estados y adaptación al teléfono |
| 4 | [`04-stack-y-arquitectura.md`](04-stack-y-arquitectura.md) | Con qué se construye y por qué, decisión por decisión |
| 5 | [`05-datos-y-api.md`](05-datos-y-api.md) | Qué se guarda, qué se calcula, el store de Redux, la API y las pruebas |
| 6 | [`06-assets.md`](06-assets.md) | Qué ilustraciones hacen falta, dónde va cada una y cómo se generan con `agy` |

## De dónde sale cada cosa

Estos documentos no repiten lo que ya está escrito; lo enlazan.

| Tema | Fuente |
| :--- | :--- |
| Enunciado del docente | [`../Enuncido-original-proyecto-gamificacion.md`](../Enuncido-original-proyecto-gamificacion.md) |
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

### Avance al 13 de noviembre de 2026

Se adelantó una pantalla completa para ver el diseño en código antes de seguir.

| Fase | Hecho | Falta |
| :---: | :--- | :--- |
| 1 | Repositorio montado con Vite+. Motor: día lógico, gotas, qué toca hoy, resumen del día, racha, oficios, estado de Zum, constancia y avance de colmena, con 31 pruebas | `ocurrencias`, `sellosDe`, `celebracionesEntre`, el gasto automático de reservas en `rachaDe` y las pruebas con propiedades |
| 2 | Variables de diseño, estructura común con sus dos navegaciones, y P04 "Hoy" completa: Zum, casilla hexagonal, panal de hoy, rejilla de colmena y panal de constancia. Llenar una celda ya pasa por Redux y RTK Query | Las otras trece pantallas, la galería de piezas, la ventana de celebración y los avisos |
| 3 a 6 | Nada | Todo |

Zum usa las ilustraciones de [`06-assets.md`](06-assets.md); los estados "feliz" y "descansando" siguen siendo recortes provisionales.
