# Personajes

Panal tiene un personaje, **Zum**, y un elenco anónimo: **las abejas del enjambre**, que son las personas de cada colmena. Esta guía reúne dónde está la verdad de cada uno y cómo se usa en la aplicación.

## Tabla de contenidos

1. [Zum en breve](#1-zum-en-breve)
2. [Dónde está cada cosa](#2-dónde-está-cada-cosa)
3. [Los seis estados](#3-los-seis-estados)
4. [Dónde aparece Zum](#4-dónde-aparece-zum)
5. [La voz de Zum](#5-la-voz-de-zum)
6. [Las abejas del enjambre](#6-las-abejas-del-enjambre)
7. [Agregar una pose o un uso nuevo](#7-agregar-una-pose-o-un-uso-nuevo)

## 1. Zum en breve

Una abeja joven, curiosa y de buen humor. **Acompaña, señala y celebra; no manda ni evalúa.** Se preocupa por la racha, nunca reprocha a la persona: no existe una Zum triste ni enojada. Aparece una sola vez por pantalla, no tapa datos y no habla más de dos líneas.

## 2. Dónde está cada cosa

| Qué | Fuente de verdad |
| :--- | :--- |
| Hoja de personaje: geometría, colores, tamaños y lo que nunca hace | [`direccion-visual.md` §6](../propuestas/A-panal/direccion-visual.md#6-la-mascota-hoja-de-personaje-de-zum) |
| Los estados como mecánica: condición, aspecto y frase | [`estrategia-gamificacion.md` §10](../propuestas/A-panal/estrategia-gamificacion.md#10-estados-de-la-mascota) |
| La regla que elige el estado | `estadoDeZum()` en [`packages/motor/src/zum.js`](../../packages/motor/src/zum.js) |
| Las frases de "Hoy" | `fraseDeZum()` en `apps/web/src/feature/hoy/textos.js` |
| Las ilustraciones y cómo se generan | [`06-assets.md` §5](../proyecto/06-assets.md#5-inventario), `assets-fuente/listos/zum/` |
| La pieza de React | `apps/web/src/componentes/Zum.jsx` |

## 3. Los seis estados

`estadoDeZum(resumen, racha, ahora)` los evalúa en este orden y gana el primero que se cumple:

| Estado | Cuándo | Lo que transmite |
| :--- | :--- | :--- |
| `descansando` | Día sin flores o invernada | Descansar también es parte del vuelo |
| `celebrando` | Panal de hoy cerrado | Lo lograste |
| `feliz` | La mitad de la meta o más | Vas muy bien |
| `animando` | Al menos una celda llena | Sigue, está cerca |
| `preocupada` | Desde las 18:00 (y de madrugada), sin celdas, con racha en juego | Todavía hay tiempo, sin culpa |
| `esperando` | Cualquier otro caso | Aquí estoy cuando quieras |

`HORA_DE_PREOCUPARSE` (18) vive en el motor. El motor no lee el reloj: la hora llega del slice `reloj`.

## 4. Dónde aparece Zum

| Pantalla | Estado | Tamaño | Por qué |
| :--- | :--- | :---: | :--- |
| P01 Entrar | `esperando` | 120–240 px | Te recibe |
| P02 Crear mi panal | `animando` | 120–240 px | Te invita a empezar |
| P03 Primer vuelo | `animando`, luego `celebrando` | 120 px | Acompaña la primera celda y la festeja |
| P04 Hoy | El que diga `estadoDeZum` | 120–240 px | Es el corazón de la pantalla, con su frase |
| P09 Invitar | `feliz` | 96 px | Sumar abejas es una buena noticia |
| P10 Reportes | `animando` | 72 px | Al pie: mirar atrás también es avanzar |
| P11 Mi vuelo | `feliz`, con fondo | 120–160 px | Tu retrato de vuelo |
| P12 Celebración | `celebrando` | 160 px | El logro |
| P13 Unirme | `feliz` | 160 px | Te esperan en la colmena |
| P14 No encontrada | `esperando` | 160 px | Un tropiezo, no una avería |
| P14 Sin conexión | `descansando` | 160 px | Zum espera a que vuelva la señal |

En P05, P07 y P08 Zum no aparece: son pantallas de trabajo, y los estados vacíos usan el panal sin miel.

El tamaño se fija con la variable `--tamano-zum` en la clase que recibe la pieza (`--tamano-zum: 96px`), no con `inline-size`: así no depende del orden en que se carga el CSS.

Detalles de la pieza `Zum`: `estado`, `conFondo` (el círculo de cera), `principal` (la imagen más importante de la pantalla se carga primero) y `tamanos` (el atributo `sizes`). Cada estado tiene su texto alternativo, que describe la pose.

## 5. La voz de Zum

- **Cercana, breve y sin culpa.** "Todavía hay luz. Con una celda basta para seguir el vuelo." nunca "No hiciste nada hoy".
- **Celebra con el dato.** "Cinco de cinco. Zum ya selló el panal de hoy."
- **Habla de la racha, no de la persona.** La racha "descansó"; no "la perdiste".
- **Ofrece el siguiente paso** como pregunta o invitación: "¿Qué celda llenamos primero?"
- **Sin género gramatical hacia la persona** y sin emojis.
- Cuando habla en tercera persona ("Zum descansa"), lo hace en frases de estado; cuando habla en primera ("Aquí estoy"), en invitaciones.

La estrategia completa de mensajes está en [`estrategia-gamificacion.md`](../propuestas/A-panal/estrategia-gamificacion.md).

## 6. Las abejas del enjambre

Cada persona de una colmena es una abeja con **color y su inicial**. El color sale de su orden de llegada a la colmena (`color` de 0 a 5 en la API → `--abeja-1` a `--abeja-6`, con `colorDeAbeja()` de `componentes/textos.js`). Se ve en:

- La rejilla y la colmena grande: cada celda llena lleva el color de quien la llenó.
- Los avatares y la lista del enjambre de P08 y P09.
- Los aportes por integrante de P10.

Las abejas no tienen ilustración ni personalidad: son las personas, y su protagonismo es su aporte. Quien fundó la colmena lleva la etiqueta "Fundadora".

## 7. Agregar una pose o un uso nuevo

1. **¿Hace falta?** Una pantalla nueva usa uno de los seis estados antes que inventar otro.
2. **Pose nueva:** escribir el encargo siguiendo [`06-assets.md` §2 y §6](../proyecto/06-assets.md#2-cómo-trabaja-agy), guardar lo generado en `assets-fuente/originales/`, preparar los WebP en `assets-fuente/listos/zum/` y copiarlos a `apps/web/src/assets/zum/`. Agregar su texto alternativo en `Zum.jsx`.
3. **Estado nuevo:** es una regla del juego, así que va primero al motor (`zum.js`, con su prueba) y a la estrategia, y después a la interfaz.
4. **Revisar** contra "Lo que Zum nunca hace" de la hoja de personaje.
