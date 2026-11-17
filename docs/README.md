# Documentación de Panal

Cuatro carpetas, cada una con una pregunta distinta. Si un tema aparece en dos, manda la más específica y la otra enlaza.

| Carpeta | Responde | Se lee cuando |
| :--- | :--- | :--- |
| [`proyecto/`](proyecto/README.md) | **Qué** se construye: producto, historias, pantallas, stack, datos y API, assets, decisiones | Se planifica o se cambia lo que hace la aplicación |
| [`guias/`](#guías-de-trabajo) | **Cómo** se trabaja en cada área del código | Se escribe código, textos o diseño |
| [`propuestas/`](propuestas/README.md) | **De dónde viene**: las cinco direcciones de diseño y la elegida, A · Panal, con su mundo, voz y dirección visual | Hace falta el porqué de un color, una mecánica o una frase |
| [`materia/`](#materia) | **Para quién**: el enunciado del docente y la base teórica del curso | Se comprueba que el proyecto cumple el enunciado |

## Guías de trabajo

| Guía | Contenido |
| :--- | :--- |
| [`frontend.md`](guias/frontend.md) | Carpetas de `apps/web`, recorrido de un dato, store, rutas y ventanas, formularios, efectos y cómo agregar una pantalla |
| [`backend.md`](guias/backend.md) | Carpetas de `apps/api`, capas, base de datos, sesión, errores, pruebas y cómo agregar una ruta |
| [`ux-ui.md`](guias/ux-ui.md) | Principios, estados de cada pantalla, patrones de interacción, textos, accesibilidad y revisión final |
| [`sistema-de-diseno.md`](guias/sistema-de-diseno.md) | Variables, tipografía, forma, catálogo de piezas y movimiento |
| [`representacion-visual.md`](guias/representacion-visual.md) | Gráficas hechas de celdas, sus reglas de accesibilidad, ilustraciones e iconos |
| [`personajes.md`](guias/personajes.md) | Zum: estados, dónde aparece, su voz y cómo agregar una pose; las abejas del enjambre |

## Proyecto

| N.º | Documento |
| :---: | :--- |
| — | [`README.md`](proyecto/README.md): estado y avance |
| 1 | [`01-prd.md`](proyecto/01-prd.md): qué, para quién, alcance |
| 2 | [`02-historias-de-usuario.md`](proyecto/02-historias-de-usuario.md): 42 historias con criterios de aceptación |
| 3 | [`03-pantallas.md`](proyecto/03-pantallas.md): las 14 pantallas, rutas y estados |
| 4 | [`04-stack-y-arquitectura.md`](proyecto/04-stack-y-arquitectura.md): stack, decisión por decisión |
| 5 | [`05-datos-y-api.md`](proyecto/05-datos-y-api.md): tablas, motor, store y API |
| 6 | [`06-assets.md`](proyecto/06-assets.md): ilustraciones y cómo se generan |
| 7 | [`07-decisiones.md`](proyecto/07-decisiones.md): lo decidido al construir |

## Materia

- [`enunciado.md`](materia/enunciado.md): casos de uso obligatorios y requisitos técnicos.
- [`fundamentos-gamificacion.md`](materia/fundamentos-gamificacion.md): conceptos, mecánicas, motivación, Bartle, Octalysis, antipatrones y el puente con Redux.
- [`casos-de-exito-y-patrones.md`](materia/casos-de-exito-y-patrones.md): SDT, MDA, Fogg, Hook y casos como Duolingo, Habitica y Strava.

## Convenciones de esta carpeta

- Español con ortografía completa, sin emojis. Encabezados numerados y tabla de contenidos en los documentos largos.
- Cada dato tiene un solo lugar; los demás enlazan. Un cambio de código que contradice un documento lo actualiza en el mismo cambio.
- Los diagramas van en Mermaid dentro del Markdown; las imágenes de referencia, junto al documento que las usa.
- `propuestas/` es histórico: se consulta, no se reescribe. Lo que cambia se registra en `proyecto/07-decisiones.md`.
