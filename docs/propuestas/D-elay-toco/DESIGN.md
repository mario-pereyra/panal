---
version: alpha
name: Elay con Toco
description: Plataforma gamificada de actividades con identidad cruceña. Un tucán con sombrero de saó, posado en una rama de tajibo, muestra el progreso del día en los tramos pintados de su pico.
colors:
  primary: "#0D7339"
  on-primary: "#FFFFFF"
  primary-dark: "#0A4D27"
  primary-tint: "#E3F1E7"
  secondary: "#C2255C"
  secondary-medium: "#EC6A9A"
  secondary-light: "#F7A8C4"
  secondary-pale: "#F9B8CF"
  tertiary: "#F58A1F"
  amber: "#FFA928"
  honey: "#FFB72E"
  coral: "#F0795C"
  yellow: "#FFC533"
  cream: "#FFF3DC"
  neutral: "#F7FAF6"
  surface: "#FFFFFF"
  on-surface: "#10261A"
  on-surface-muted: "#4C6355"
  outline: "#CFE0D5"
  outline-strong: "#6F8A7A"
  track: "#DCE7DF"
  empty-day: "#D9CDD2"
  future-day: "#A89BA1"
  feather: "#15191C"
  wing: "#2B3338"
  claw: "#5F7C99"
  branch: "#6B4423"
  river: "#7DBFE0"
  straw: "#F3DA9A"
  straw-brim: "#E8C877"
  straw-dark: "#9C7426"
  cunape: "#F0C36A"
  cunape-edge: "#A8721A"
  error: "#A6321B"
  error-container: "#FDECE6"
typography:
  headline-display: { fontFamily: "Paytone One", fontSize: 58px, fontWeight: 400, lineHeight: 1.02 }
  headline-lg: { fontFamily: "Paytone One", fontSize: 36px, fontWeight: 400, lineHeight: 1.1 }
  headline-md: { fontFamily: "Paytone One", fontSize: 22px, fontWeight: 400, lineHeight: 1.2 }
  headline-sm: { fontFamily: "Paytone One", fontSize: 18px, fontWeight: 400, lineHeight: 1.2 }
  number-md: { fontFamily: "Paytone One", fontSize: 16px, fontWeight: 400, lineHeight: 1 }
  body-lg: { fontFamily: "Figtree", fontSize: 19px, fontWeight: 600, lineHeight: 1.45 }
  body-md: { fontFamily: "Figtree", fontSize: 16px, fontWeight: 400, lineHeight: 1.5 }
  body-sm: { fontFamily: "Figtree", fontSize: 14px, fontWeight: 600, lineHeight: 1.4 }
  label-lg: { fontFamily: "Figtree", fontSize: 16px, fontWeight: 700, lineHeight: 1.3 }
  label-md: { fontFamily: "Figtree", fontSize: 15px, fontWeight: 700, lineHeight: 1.2 }
  label-sm: { fontFamily: "Figtree", fontSize: 13px, fontWeight: 600, lineHeight: 1.35 }
  label-caps: { fontFamily: "Figtree", fontSize: 13px, fontWeight: 700, lineHeight: 1.2, letterSpacing: 0.08em }
rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 24px
  xxl: 28px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 24px
  xxl: 32px
  hero: 40px
  gutter: 20px
  margin: 32px
  page-max: 1296px
components:
  page: { backgroundColor: "{colors.neutral}", textColor: "{colors.on-surface}", typography: "{typography.body-md}", padding: "{spacing.margin}", width: "{spacing.page-max}" }
  page-title: { backgroundColor: "{colors.neutral}", textColor: "{colors.on-surface}", typography: "{typography.headline-lg}" }
  hero: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", typography: "{typography.body-lg}", rounded: "{rounded.xxl}", padding: "{spacing.hero}" }
  hero-title: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", typography: "{typography.headline-display}" }
  hero-eyebrow: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", typography: "{typography.label-caps}" }
  button-primary: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", typography: "{typography.headline-sm}", rounded: "{rounded.full}", height: 52px, padding: 28px }
  button-primary-hover: { backgroundColor: "{colors.primary-dark}", textColor: "{colors.on-primary}" }
  button-primary-on-hero: { backgroundColor: "{colors.surface}", textColor: "{colors.primary-dark}", typography: "{typography.headline-sm}", rounded: "{rounded.full}", height: 52px, padding: 28px }
  button-secondary: { backgroundColor: "{colors.primary-tint}", textColor: "{colors.primary-dark}", typography: "{typography.label-md}", rounded: "{rounded.full}", height: 44px, padding: "{spacing.lg}" }
  button-tertiary: { backgroundColor: "{colors.surface}", textColor: "{colors.primary}", typography: "{typography.label-md}", rounded: "{rounded.full}", height: 44px, padding: "{spacing.md}" }
  button-destructive: { backgroundColor: "{colors.error}", textColor: "{colors.on-primary}", typography: "{typography.label-md}", rounded: "{rounded.full}", height: 44px, padding: "{spacing.lg}" }
  card: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.body-md}", rounded: "{rounded.xl}", padding: "{spacing.xl}" }
  card-title: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.headline-md}" }
  card-caption: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface-muted}", typography: "{typography.body-sm}" }
  card-border: { backgroundColor: "{colors.outline}", height: 1.5px }
  activity-row: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.label-lg}", height: 54px, padding: "{spacing.md}" }
  activity-row-meta: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface-muted}", typography: "{typography.label-sm}" }
  activity-check-done: { backgroundColor: "{colors.secondary}", textColor: "{colors.on-primary}", rounded: "{rounded.full}", size: 30px }
  activity-check-pending: { backgroundColor: "{colors.outline-strong}", rounded: "{rounded.full}", size: 28px }
  points-chip-earned: { backgroundColor: "{colors.surface}", textColor: "{colors.primary}", typography: "{typography.number-md}" }
  points-chip-pending: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface-muted}", typography: "{typography.number-md}" }
  cunape-coin: { backgroundColor: "{colors.cunape}", textColor: "{colors.on-surface}", rounded: "{rounded.full}", size: 18px }
  cunape-coin-edge: { backgroundColor: "{colors.cunape-edge}", rounded: "{rounded.full}", size: 18px }
  stat-tile: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.label-lg}", rounded: "{rounded.lg}", height: 76px, padding: "{spacing.md}" }
  input: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.body-md}", rounded: "{rounded.md}", height: 52px, padding: "{spacing.md}" }
  input-error: { backgroundColor: "{colors.error-container}", textColor: "{colors.error}", typography: "{typography.label-sm}", rounded: "{rounded.md}", padding: "{spacing.sm}" }
  nav-bar: { backgroundColor: "{colors.neutral}", textColor: "{colors.on-surface}", height: 52px }
  nav-item: { backgroundColor: "{colors.neutral}", textColor: "{colors.on-surface}", typography: "{typography.label-md}", rounded: "{rounded.full}", height: 44px, padding: "{spacing.lg}" }
  nav-item-active: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", typography: "{typography.label-md}", rounded: "{rounded.full}", height: 44px }
  tab: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface-muted}", typography: "{typography.label-md}", rounded: "{rounded.full}", height: 44px }
  tab-active: { backgroundColor: "{colors.primary-tint}", textColor: "{colors.primary-dark}", typography: "{typography.label-md}", rounded: "{rounded.full}", height: 44px }
  chip-filter: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.label-sm}", rounded: "{rounded.full}", height: 36px, padding: "{spacing.md}" }
  chip-filter-selected: { backgroundColor: "{colors.primary-dark}", textColor: "{colors.on-primary}", typography: "{typography.label-sm}", rounded: "{rounded.full}", height: 36px }
  chip-help: { backgroundColor: "{colors.amber}", textColor: "{colors.on-surface}", typography: "{typography.label-sm}", rounded: "{rounded.full}", padding: "{spacing.sm}" }
  progress-track: { backgroundColor: "{colors.track}", rounded: "{rounded.full}", height: 12px }
  progress-fill: { backgroundColor: "{colors.primary}", rounded: "{rounded.full}", height: 12px }
  avatar: { backgroundColor: "{colors.primary-tint}", textColor: "{colors.primary-dark}", typography: "{typography.label-sm}", rounded: "{rounded.full}", size: 32px }
  avatar-user: { backgroundColor: "{colors.secondary}", textColor: "{colors.on-primary}", typography: "{typography.headline-sm}", rounded: "{rounded.full}", size: 44px }
  album-sticker: { backgroundColor: "{colors.cream}", textColor: "{colors.on-surface}", typography: "{typography.label-sm}", rounded: "{rounded.lg}", padding: "{spacing.md}", size: 132px }
  album-sticker-locked: { backgroundColor: "{colors.track}", textColor: "{colors.on-surface}", typography: "{typography.label-sm}", rounded: "{rounded.lg}", size: 132px }
  celebration-modal: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.body-lg}", rounded: "{rounded.xxl}", padding: "{spacing.xxl}", width: 520px }
  celebration-card: { backgroundColor: "{colors.cream}", textColor: "{colors.on-surface}", typography: "{typography.body-sm}", rounded: "{rounded.lg}", padding: "{spacing.md}" }
  tooltip: { backgroundColor: "{colors.feather}", textColor: "{colors.on-primary}", typography: "{typography.label-sm}", rounded: "{rounded.sm}", padding: "{spacing.sm}" }
  beak-segment-empty: { backgroundColor: "{colors.cream}" }
  beak-segment-1: { backgroundColor: "{colors.yellow}" }
  beak-segment-2: { backgroundColor: "{colors.amber}" }
  beak-segment-3: { backgroundColor: "{colors.tertiary}" }
  beak-segment-4: { backgroundColor: "{colors.secondary-medium}" }
  beak-segment-5: { backgroundColor: "{colors.secondary}" }
  beak-segment-honey: { backgroundColor: "{colors.honey}" }
  beak-segment-coral: { backgroundColor: "{colors.coral}" }
  toco-body: { backgroundColor: "{colors.feather}" }
  toco-wing: { backgroundColor: "{colors.wing}" }
  toco-feet: { backgroundColor: "{colors.claw}" }
  toco-hat: { backgroundColor: "{colors.straw}" }
  toco-hat-brim: { backgroundColor: "{colors.straw-brim}" }
  toco-hat-edge: { backgroundColor: "{colors.straw-dark}" }
  toco-backdrop: { backgroundColor: "{colors.secondary-pale}", rounded: "{rounded.full}", size: 300px }
  tajibo-branch: { backgroundColor: "{colors.branch}", rounded: "{rounded.full}", height: 12px }
  ring-done: { backgroundColor: "{colors.primary}" }
  ring-pending: { backgroundColor: "{colors.track}" }
  ring-map-plaza: { backgroundColor: "{colors.secondary}", rounded: "{rounded.sm}", size: 14px }
  ring-map-river: { backgroundColor: "{colors.river}" }
  ring-map-marker: { backgroundColor: "{colors.tertiary}", rounded: "{rounded.full}", size: 18px }
  flower-day-none: { backgroundColor: "{colors.empty-day}", rounded: "{rounded.full}", size: 6px }
  flower-day-low: { backgroundColor: "{colors.secondary-light}", rounded: "{rounded.full}", size: 12px }
  flower-day-mid: { backgroundColor: "{colors.secondary-medium}", rounded: "{rounded.full}", size: 18px }
  flower-day-full: { backgroundColor: "{colors.secondary}", rounded: "{rounded.full}", size: 24px }
  flower-day-center: { backgroundColor: "{colors.yellow}", rounded: "{rounded.full}", size: 8px }
  flower-day-future: { backgroundColor: "{colors.future-day}", rounded: "{rounded.full}", size: 8px }
---

# Elay con Toco

## Overview

Elay es una plataforma para organizar y cumplir actividades, sola o en equipo, con identidad de Santa Cruz de la Sierra. "Elay" es lo que se dice al mostrar algo: aquí está. El sistema debe sentirse **cálido, frondoso, festivo y claro**: un patio con sombra y un tajibo en flor, no un tablero de oficina.

La mascota es Toco, un tucán con sombrero de saó posado en una rama de tajibo. Toco no adorna: es la gráfica principal. Su pico se divide en tantos tramos como actividades tiene el objetivo del día y cada actividad cumplida pinta un tramo, del amarillo al rosado tajibo. La rama donde se posa es el nivel de la persona y florece a medida que se acerca a la siguiente.

Público: estudiantes y equipos pequeños. La interfaz habla en voseo camba, con pocas palabras propias y siempre explicadas ("Jenecherú: tu racha"). Todo es plano: sin degradados, sin sombras difusas, sin fotografías y sin emojis.

## Colors

La paleta sale del paisaje: el verde del monte, el rosado del tajibo en agosto y el naranja del pico del tucán.

- **Primary, verde monte (#0D7339):** portada, destino activo de la navegación, botón principal, anillos recorridos y puntos ganados. Su variante oscura (#0A4D27) es el estado al pasar el cursor y el texto sobre tintes verdes. El tinte (#E3F1E7) da fondo a avatares, pestañas activas y botones secundarios.
- **Secondary, rosado tajibo (#C2255C):** lo cumplido. Marca de actividad hecha, día redondo en la florada, la plaza en el mapa y el avatar de la persona. Tiene tres pasos más claros (#EC6A9A, #F7A8C4, #F9B8CF) que solo se usan como relleno de flores y como fondo de Toco, nunca como texto.
- **Tertiary, naranja pico (#F58A1F):** lo que se mueve. El punto de la comparsa en el mapa, la llama del jenecherú y el tercer tramo del pico. Con el amarillo (#FFC533) y el ámbar (#FFA928) forma la rampa del pico; cuando el pico tiene siete tramos se suman dos tonos intermedios, miel (#FFB72E) y coral (#F0795C). Nunca lleva texto blanco encima.
- **Neutral (#F7FAF6) y surface (#FFFFFF):** fondo de página con un punto de verde y tarjetas blancas.
- **On-surface (#10261A):** tinta verde casi negra para todo el texto principal. El texto secundario usa #4C6355.
- **Crema (#FFF3DC):** el pico sin pintar, las láminas del álbum y las tarjetas de celebración.
- **Colores de ilustración:** plumaje (#15191C, #2B3338), patas (#5F7C99), rama (#6B4423), río (#7DBFE0), paja del sombrero (#F3DA9A, #E8C877, #9C7426) y cuñapé (#F0C36A, #A8721A). Solo se usan dentro de dibujos.
- **Error, rojo urucú (#A6321B):** más pardo que el rosado tajibo para que un error nunca se confunda con algo cumplido. Su fondo es #FDECE6.

El rosado significa "cumplido" y el verde significa "estructura y acción". No se intercambian.

## Typography

Dos familias de Google Fonts.

- **Paytone One** para títulos, botones principales y cifras (porcentajes, puntos, "3 de 5"). Es redonda y pesada, con aire de cartel de fiesta. Solo existe en un peso; no se simula negrita ni cursiva y nunca se usa en párrafos.
- **Figtree** para todo lo demás, en pesos 400, 600, 700 y 800. El texto secundario va en 600 para que no se pierda sobre blanco.

El saludo de la portada usa `headline-display` (58 px). Los títulos de tarjeta usan `headline-md` (22 px). Las etiquetas en mayúsculas (`label-caps`) se reservan para la fecha de la portada y los encabezados de columna.

## Layout

Retícula fluida con ancho máximo de 1296 px y margen de página de 32 px. La pantalla "Hoy" se arma en tres franjas: barra de navegación (52 px), portada verde a todo el ancho (mínimo 350 px) y una fila de tres tarjetas iguales con 20 px de separación. Las tarjetas se apilan en una columna por debajo de 720 px.

Dentro de la portada el orden es fijo: texto y botón a la izquierda, Toco al centro y tres fichas de dato a la derecha. La escala de espaciado es 4, 8, 12, 20, 24, 32 y 40 px. Las tarjetas llevan 24 px de relleno interior y las filas de actividad miden al menos 54 px de alto para que el área de toque sea de 44 px.

## Elevation & Depth

No hay sombras. La jerarquía se construye con tres planos de color: fondo (#F7FAF6), tarjeta blanca con borde de 1,5 px (#CFE0D5) y portada verde. Sobre la portada, las fichas blancas se separan solo por contraste. Las ventanas modales se apoyan en un velo de tinta (#10261A al 55 % de opacidad) y tampoco llevan sombra.

## Shapes

Todo es redondeado y generoso: 28 px en la portada y las ventanas, 24 px en las tarjetas, 20 px en las fichas, 12 px en los campos y forma de píldora en botones, pestañas y destinos de navegación. Las marcas de actividad, los avatares y las flores son círculos. El único elemento con ángulos es el pico de Toco, y por eso llama la atención.

## Components

- **Botones:** el principal es una píldora verde de 52 px con texto blanco en Paytone One. Sobre la portada verde se invierte: píldora blanca con texto verde oscuro. El secundario usa el tinte verde y el terciario es solo texto verde. Un único botón principal por pantalla.
- **Fila de actividad:** marca circular a la izquierda, título en 700 con la línea de tipo debajo ("Recurrente · diaria") y los puntos a la derecha en Paytone One. Hecha: círculo rosado tajibo con visto blanco y puntos en verde. Pendiente: círculo blanco con borde #6F8A7A de 2,5 px y puntos en gris verdoso. El título no se tacha.
- **Ficha de dato:** icono de 34 px, título en 800 y una línea de explicación. Es donde se presentan las palabras propias: "Jenecherú de 12 días · Tu racha: el fuego que no se apaga".
- **Campos:** blancos, con borde #6F8A7A de 1,5 px y etiqueta siempre visible encima. El error se muestra debajo, en rojo urucú sobre su fondo claro, con icono y texto.
- **Navegación:** marca a la izquierda (flor de tajibo y "Elay"), cuatro destinos al centro (Hoy, Actividades, Comparsas, Reportes) y nivel con avatar a la derecha. El destino activo es una píldora verde.
- **Barra de progreso:** pista #DCE7DF y relleno verde, 12 px de alto, extremos redondos. Siempre con su cifra al lado.
- **Lámina del álbum:** cuadro crema de 132 px con la ilustración y el nombre. Sin ganar: fondo #DCE7DF, silueta y el criterio escrito.
- **Pico de Toco:** tramos separados por líneas de tinta de 2,5 px. Tiene tantos tramos como el objetivo del día (3, 5 o 7). Sin pintar en crema; pintados en amarillo, ámbar, naranja, rosado medio y rosado tajibo, en ese orden desde la base.
- **Mapa de anillos:** cinco anillos concéntricos de 11 px; recorridos en verde, pendientes en #DCE7DF. La plaza es un cuadrado rosado al centro, el río una línea celeste a la izquierda y la comparsa un punto naranja con borde blanco.
- **Florada del tajibo:** una flor por día en siete columnas. Tamaño y tono crecen con lo cumplido; el día redondo lleva centro amarillo.

## Do's and Don'ts

- Usar el rosado tajibo solo para lo cumplido y el verde para la estructura y la acción.
- Acompañar cada palabra propia con su explicación la primera vez que aparece en una pantalla.
- Mostrar a Toco de perfil, mirando a la derecha, con el pico como elemento más grande del dibujo.
- Mantener un solo botón principal por pantalla.
- Escribir en voseo camba: "Completá", "Tenés", "Te faltan".
- No usar degradados, sombras difusas, fotografías ni emojis.
- No poner texto blanco sobre naranja, amarillo ni rosados claros.
- No dibujar a Toco realista ni con textura de plumas; es plano y geométrico.
- No usar la hamaca ni la siesta como chiste sobre la flojera: son descanso ganado.
- No usar "anillo" para el nivel personal; los anillos son los hitos de la comparsa y el nivel son las ramas.

## Iconography

Iconos planos de dos colores como máximo, en caja de 24 px, con trazo de 2,2 px y extremos redondos. Los iconos del mundo son: llama (jenecherú), hamaca entre dos postes, anillos concéntricos, flor de cinco pétalos, cuñapé (círculo dorado con borde), rama con botón y tutuma. Los iconos de sistema (cerrar, editar, calendario) son lineales en tinta.

## Illustration & Mascot

Toco se construye con formas simples: cuerpo en elipse negra, cabeza en círculo, pecho blanco, ojo con aro naranja y un pico poligonal que ocupa un tercio del ancho del dibujo. Lleva un sombrero de saó con cinta verde, inclinado hacia atrás. Se apoya en una rama parda con cuatro botones de tajibo, sobre un círculo rosado pálido. Tiene seis estados (esperando, animando, feliz, celebrando, preocupada y descansando) que cambian postura, ojos y sombrero, nunca el estilo. La flora y la fauna del álbum siguen la misma construcción: siluetas planas, tres o cuatro colores y sin contorno salvo en el pico.

## Data Visualization

Cada gráfica es parte del mundo y siempre lleva su cifra escrita. El pico muestra el día; la rama, el avance de nivel; el mapa de anillos, el avance de la comparsa; la florada, la constancia. En reportes, cada actividad recurrente es una rama horizontal con una flor por cada vez programada (abierta si se cumplió, botón si no). Las barras de cuñapés por semana son verdes con la semana en curso en naranja. Ningún dato depende solo del color: cambian también el tamaño, la forma o la posición, y toda gráfica tiene texto alternativo.

## Motion

Movimientos cortos y con rebote suave. Completar una actividad: el tramo del pico se pinta de la base hacia la punta en 300 ms. Día redondo: Toco abre las alas y lanza el sombrero durante 1,2 s. Subir de rama: Toco salta a la rama de arriba en 600 ms. Con movimiento reducido, todo se resuelve con cambios de color sin desplazamiento.

## Voice & Copy

Cercana, alegre y breve. Voseo camba sin exagerar el acento. Saludo: "¡Elay, Ana!". Ánimo: "Ya van 3 de 5. Dos más y queda entero.". Racha rota: "Se apagó el jenecherú, pero la brasa quedó: tu mejor racha es de 12 días. ¿Lo prendemos de nuevo?". Nunca se reprocha, nunca se apura.
