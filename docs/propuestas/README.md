# Propuestas de diseño: cinco mundos para una misma plataforma

Esta carpeta contiene la propuesta completa del proyecto final en sus cinco direcciones. Las cinco comparten el mismo motor (casos de uso, reglas de gamificación, arquitectura y Redux) y se diferencian en el mundo, la mascota, el vocabulario, el énfasis estratégico y el diseño visual.

Lienzo con los cinco tableros: https://claude.ai/artifact/9Vr3AotmPiUpXUmgG4bVnq

## Estructura

```
propuestas/
├── README.md                        este índice
├── 00-base-comun/                   lo que no cambia entre mundos
│   ├── propuesta-base.md            problema, objetivos, casos de uso, pantallas P01 a P12, arquitectura, Redux, datos
│   ├── motor-de-gamificacion.md     reglas exactas: puntos, niveles, rachas, equipos, insignias, ética, métricas
│   └── guia-stitch.md               cómo usar DESIGN.md, las referencias y los prompts en Stitch
├── A-panal/
├── B-orbita/
├── C-cumbre/
├── D-elay-toco/
└── E-elay-nando-y-mechi/
```

Cada carpeta de dirección tiene lo mismo:

| Archivo | Contenido |
| :--- | :--- |
| `propuesta.md` | La aplicación en ese mundo: metáfora, pantallas, casos de uso, voz, Redux y riesgos |
| `estrategia-gamificacion.md` | Los cinco pasos del curso aplicados al mundo: narrativa, jugadores, Octalysis, mecánicas con nombre propio, mecánica insignia, equipo, insignias, colección, métricas y trazabilidad |
| `direccion-visual.md` | Color con contrastes calculados, tipografía, forma, hoja de la mascota, gráficas, movimiento y accesibilidad |
| `DESIGN.md` | Sistema de diseño en el formato abierto de Google Labs, listo para Stitch |
| `prompts-stitch.md` | Prompt de arranque, un prompt por pantalla, hoja de la mascota, refinamientos y errores previsibles |
| `referencia/` | Captura de la pantalla "Hoy" del lienzo y la mascota en SVG y PNG |

## Orden de lectura

1. `00-base-comun/propuesta-base.md`: qué se construye.
2. `00-base-comun/motor-de-gamificacion.md`: con qué reglas.
3. La tabla comparativa de abajo y las carpetas de las dos direcciones que más te atraigan.
4. `00-base-comun/guia-stitch.md` y el `prompts-stitch.md` de la dirección elegida.

## Las cinco direcciones

| | A · Panal | B · Órbita | C · Cumbre | D · Elay con Toco | E · Elay con Nando y Mechi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mascota** | Zum, abeja | Nova, estrella | Kusi, llama | Toco, tucán | Nando y Mechi |
| **Metáfora** | Cada actividad llena una celda | Cada costumbre es una órbita | Cada tramo sube metros | Cada actividad pinta el pico de Toco | Cada actividad acerca la fiesta |
| **Ambiente** | Claro, cálido, tipo pegatina | Oscuro, sereno, espacial | Aire de montaña, ilustrado | Verde tropical, naturaleza cruceña | Verde y blanco, gente y costumbres cruceñas |
| **Tipografías** | Fredoka + Nunito | Space Grotesk + Inter | Bricolage Grotesque + DM Sans | Paytone One + Figtree | Paytone One + Figtree |
| **Color principal** | Miel `#FFC421` | Noche `#0B1026` | Verde azulado `#1F5F54` | Verde `#0D7339` | Verde `#0D7339` |
| **Impulsos que acentúa** | CD2 y CD5 | CD3 y CD7 | CD1 y CD2 | CD4 y CD7 | CD5 y CD1 |
| **Perfil al que más le habla** | Triunfador y socializador | Explorador | Triunfador | Explorador y socializador | Socializador |
| **Mecánica insignia** | La danza de Zum sugiere la siguiente celda; el panal del día se sella con cera | Cada costumbre es una órbita con su ritmo: semanas estables dan lunas y anillos | La cordada: una sola posición del equipo, "abrir huella" rotativo y libro de cumbre | El pico de Toco como medidor del día y el Álbum del monte | Dos voces (Nando anima, Mechi ordena) y la palabra del día |
| **Puntos** | Gotas de miel | Destellos | Metros | Cuñapés | Cuñapés |
| **Proyecto en equipo** | Colmena | Constelación | Expedición en cordada | Comparsa en mapa de anillos | Comparsa que arma el buri |
| **Constancia** | Panal hexagonal | Cielo del mes | Altitud ganada | Florada del tajibo | Florada del tajibo |
| **Mayor fuerza** | La gráfica más limpia: todo es una celda | Calma y ritmo propio | Épica del esfuerzo | Identidad local con un personaje fácil de animar | Identidad local, calidez humana y equipo |
| **Mayor riesgo** | Tema muy usado | El tema oscuro cansa a algunos | Puede sentirse solitaria | Vocabulario nuevo | Más vocabulario aún y personajes humanos que exigen cuidado |

## Dirección elegida

**Se eligió A · Panal** (13 de noviembre de 2026), a partir del tablero "Hoy" del diseño 1. La documentación del proyecto que se va a construir está en [`../proyecto/`](../proyecto/README.md). Las otras cuatro direcciones quedan como alternativas documentadas.

Lo que sigue es la recomendación original, anterior a esa decisión.

**Dirección principal: E · Elay con Nando y Mechi.** Es la que mejor responde a lo que pediste (personajes con traje típico, palabras cambas, calidad de personaje tipo aplicación de idiomas) y la única cuya mecánica central es la pertenencia. También es la más defendible ante el docente: el vocabulario no es decoración, cada palabra nombra una mecánica.

**Condición.** Que alguien de Santa Cruz revise el glosario y los personajes. Lo conozco por estudio, no por haberlo vivido.

**Plan alternativo: A · Panal.** Si el vocabulario resulta demasiado o falta tiempo, Panal es la más simple de dibujar e implementar: todo es un hexágono.

**Lo que no cambia según la elección:** backend, base de datos, reducers, selectores y reglas. Solo cambian el diccionario de textos, los componentes de ilustración y el `DESIGN.md`.

## Qué hacer ahora

1. Confirmar el stack: [`../proyecto/04-stack-y-arquitectura.md`](../proyecto/04-stack-y-arquitectura.md).
2. Aprobar la hoja de personaje de Zum y generar los assets: [`../proyecto/06-assets.md`](../proyecto/06-assets.md).
3. Diseñar las pantallas a mano, sin Stitch, sobre el lenguaje del diseño 1: [`../proyecto/03-pantallas.md`](../proyecto/03-pantallas.md).

## Estado de verificación

| Comprobación | Resultado |
| :--- | :--- |
| Validador oficial de `DESIGN.md` (`designmd lint`) en las cinco carpetas | 0 errores y 0 advertencias en cada una |
| Tablas de contenidos, enlaces entre archivos y archivos de `referencia/` | Sin enlaces ni anclas rotas |
| Emojis en archivos generados | Ninguno |
| Contraste de texto | Razones calculadas con la fórmula WCAG en cada `direccion-visual.md`; las excepciones (contornos y flores decorativas en A y D) están anotadas ahí con su alternativa |
| Prompts ejecutados en Stitch | Sí, en tres proyectos (13 de noviembre de 2026): seis pantallas de E en `E-elay-nando-y-mechi/disenos-stitch/`, las trece de A fieles al diseño 1 en `A-panal/disenos-stitch/` y una versión libre de A en `A-panal/disenos-stitch-libre/`. El resultado se descartó: las pantallas se diseñan a mano. Esas tres carpetas se conservan solo en la máquina de trabajo; `.gitignore` las deja fuera del repositorio |

## Pendiente de tu confirmación

- Vocabulario cruceño marcado como "sin confirmar" en los glosarios de D y E, incluidos los nombres locales de animales y plantas del Álbum del monte.
- Datos escritos de memoria, sin fuente consultada: términos apícolas y nombres de mieles (A), fichas de flora y fauna andina de los hallazgos y el sentido de "Kusi" en quechua (C).
- Nombres de los personajes (Nando, Mechi, Toco, Zum, Nova, Kusi): son propuestas.
- Cifras de ejemplo de los reportes y proyectos secundarios de los prompts: son inventadas para llenar las pantallas.
- Las metas numéricas de los objetivos OE1 a OE5: son hipótesis hasta medir la línea base.
- Lectura de "tecnología libre" en el enunciado: la propuesta usa Node.js y PostgreSQL, que cumplen tanto "de libre elección" como "de código abierto".
