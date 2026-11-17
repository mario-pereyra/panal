# Representación visual

Cómo Panal convierte datos en dibujos: gráficas, ilustraciones e iconos. La dirección de arte está en [`../propuestas/A-panal/direccion-visual.md` §7 a §9](../propuestas/A-panal/direccion-visual.md#7-ilustración-y-escenas); el inventario de ilustraciones, en [`../proyecto/06-assets.md`](../proyecto/06-assets.md).

## Tabla de contenidos

1. [Todo se cuenta en celdas](#1-todo-se-cuenta-en-celdas)
2. [Catálogo de gráficas](#2-catálogo-de-gráficas)
3. [Reglas de toda gráfica](#3-reglas-de-toda-gráfica)
4. [Ilustraciones](#4-ilustraciones)
5. [Iconos](#5-iconos)

## 1. Todo se cuenta en celdas

La metáfora manda sobre la gráfica: una actividad es una **celda**, un día es un **panal**, un proyecto es una **colmena**. Por eso casi todas las gráficas están hechas de hexágonos, y el mismo código de color significa lo mismo en todas:

| Aspecto de la celda | Significa |
| :--- | :--- |
| Miel (o el color de una abeja) | Llena |
| Lino con borde de tinta | Tocaba y está vacía |
| Borde punteado, sin relleno | No tocaba ese día |
| Más oscura | Más celdas ese día (constancia) |

Las gráficas son SVG escrito a mano en React: no hay biblioteca de gráficas. Pesan nada, toman los colores de `tokens.css` y se pueden hacer accesibles al detalle ([`04-stack-y-arquitectura.md`, D6](../proyecto/04-stack-y-arquitectura.md#d6-gráficas-en-svg-propio)).

## 2. Catálogo de gráficas

| Gráfica | Pieza | Dónde | Qué cuenta |
| :--- | :--- | :--- | :--- |
| Panal de hoy | `PanalDeHoy` | P04, P03 | Celdas llenas de la meta del día, en filas de 2 y 3 |
| Panal de constancia | `PanalDeConstancia` | P04, P10 | Las últimas cinco semanas: una celda por día, de lunes a domingo |
| Rejilla de colmena | `RejillaDeColmena` | P04, P07 | Una celda por actividad de la colmena, del color de quien la llenó |
| Colmena grande | `ColmenaGrande` | P08 | Lo mismo, en cinco filas rotuladas "Cuadro 1" a "Cuadro 5", con la inicial de cada abeja |
| Columnas | `Columnas` | P10 | Celdas por día: pilas de hexágonos hasta 14 días, barras con más; la meta como línea punteada |
| Tira de celdas | `TiraDeCeldas` | P10 | Siete días de una recurrente: llena, pendiente o no tocaba |
| Tarros | `Tarros` | P10 | Únicas frente a recurrentes, como dos tarros que se llenan en proporción |
| Escalera de oficios | `EscaleraDeOficios` | P11 | Diez celdas que suben: llenas hasta el oficio actual |
| Barra de avance | `BarraDeAvance` | P11, P10 | Lo que falta para la siguiente meta. Decorativa: el texto dice la cifra |
| Avatares | `Avatares` | P07 | El enjambre encimado, con la inicial sobre su color |
| Cuota semanal | En `Celdas.jsx` | P05 | "2 de 3 esta semana" con tres hexágonos pequeños |
| Sello de cera | `SelloDeCera` | P11, P12, P08 | Una insignia: hueco punteado si falta, miel y tinta si se ganó |

## 3. Reglas de toda gráfica

1. **Una frase que dice el dato**, visible arriba de la gráfica y como `aria-label` del SVG (`role="img"`): "Llenaste 18 celdas esta semana: 4 más que la semana pasada."
2. **"Ver como tabla"** (`VerComoTabla`) debajo, con los mismos números en una tabla real.
3. **Un título** (`h2` o `h3`) que nombra la gráfica.
4. **El color nunca es la única pista**: lo vacío tiene borde, lo que no tocaba es punteado, lo vencido lleva la palabra "Vencida".
5. **Los identificadores internos del SVG** (recortes, degradados) salen de `useId()`: dos gráficas iguales en una pantalla no se pisan.
6. **Sin datos inventados.** Con menos de una semana de uso, las gráficas de semana muestran solo los días que existen.
7. **El tamaño lo decide el contenedor**: `viewBox` y ancho al 100 %; si no cabe (la colmena grande), se desliza dentro de su caja.

## 4. Ilustraciones

| Qué | Cómo se hace | Dónde está |
| :--- | :--- | :--- |
| Zum, seis estados | Generada con `agy`, revisada a mano | `assets-fuente/listos/zum/` → `apps/web/src/assets/zum/` (WebP en 128, 360 y 720 px) |
| Panal sin miel (estados vacíos) | SVG en código, en lugar de la escena E01 | `PanalVacio` en `Estados.jsx` |
| Sellos de cera S01 a S17 | SVG en código: un glifo por sello sobre un sello de cera | `SelloDeCera.jsx` |
| Icono de la aplicación I01 y sus tamaños | Compuesto en local con la pose "feliz" sobre miel | `assets-fuente/listos/icono/` → `apps/web/public/iconos/` |
| Escenas E01–E06 y etapas H01–H05 | Pendientes de generar | Ver [`06-assets.md` §9](../proyecto/06-assets.md#9-estado) |

Reglas:

- `assets-fuente/originales/` guarda lo que entregó el generador, sin retoques; la aplicación usa copias de `assets-fuente/listos/`.
- Las imágenes llevan `width` y `height` (sin saltos al cargar) y `srcSet` con los tres tamaños. Solo la imagen principal de la pantalla lleva `fetchPriority="high"`.
- Un dibujo que cuenta algo tiene texto alternativo que lo dice; uno decorativo, `aria-hidden`.
- Mientras falte una escena, se dibuja en SVG con las mismas reglas de estilo (borde de tinta, colores planos) antes que dejar un hueco.

## 5. Iconos

`componentes/iconos.jsx`: SVG de 24 unidades, trazo de tinta de 2,5, extremos y uniones redondos, color `currentColor`. Un icono solo nunca es un botón sin nombre: el botón lleva `aria-label` o texto visible, y el icono va con `aria-hidden`.
