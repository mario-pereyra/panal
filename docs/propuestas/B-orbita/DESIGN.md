---
version: alpha
name: Órbita
description: "Sistema de diseño de Órbita, una plataforma gamificada para organizar y cumplir actividades. Tema oscuro de planetario: Nova, una estrella, brilla según el progreso del día; las actividades recurrentes son órbitas y los proyectos de equipo, constelaciones."
colors:
  primary: "#FFD25E"
  on-primary: "#1A1440"
  primary-hover: "#FFDE85"
  primary-pressed: "#F2C140"
  secondary: "#5FD4E6"
  tertiary: "#FF8E72"
  quaternary: "#B9A8FF"
  neutral: "#0B1026"
  surface: "#141A3A"
  surface-raised: "#1C2450"
  outline: "#2C3566"
  outline-strong: "#7C88C4"
  on-surface: "#F3F5FF"
  on-surface-variant: "#D5DAF5"
  on-surface-muted: "#AEB6DC"
  error: "#FF7A90"
typography:
  display: { fontFamily: Space Grotesk, fontSize: 48px, fontWeight: 700, lineHeight: 1.05, letterSpacing: -0.01em }
  headline-lg: { fontFamily: Space Grotesk, fontSize: 28px, fontWeight: 700, lineHeight: 1.1 }
  headline-md: { fontFamily: Space Grotesk, fontSize: 22px, fontWeight: 600, lineHeight: 1.25 }
  number-lg: { fontFamily: Space Grotesk, fontSize: 18px, fontWeight: 600, lineHeight: 1.2 }
  number-md: { fontFamily: Space Grotesk, fontSize: 16px, fontWeight: 600, lineHeight: 1.2 }
  label-lg: { fontFamily: Space Grotesk, fontSize: 17px, fontWeight: 700, lineHeight: 1 }
  label-md: { fontFamily: Inter, fontSize: 15px, fontWeight: 600, lineHeight: 1.2 }
  label-caps: { fontFamily: Inter, fontSize: 13px, fontWeight: 600, lineHeight: 1.2, letterSpacing: 0.08em }
  body-lg: { fontFamily: Inter, fontSize: 18px, fontWeight: 400, lineHeight: 1.5 }
  body-md: { fontFamily: Inter, fontSize: 16px, fontWeight: 400, lineHeight: 1.5 }
  body-strong: { fontFamily: Inter, fontSize: 16px, fontWeight: 600, lineHeight: 1.35 }
  body-sm: { fontFamily: Inter, fontSize: 14px, fontWeight: 400, lineHeight: 1.5 }
rounded:
  none: 0px
  xs: 4px
  sm: 10px
  md: 12px
  lg: 14px
  xl: 24px
  xxl: 28px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 24px
  xxxl: 32px
  hero: 40px
  gutter: 20px
  margin: 32px
  touch-target: 44px
  page-max-width: 1296px
components:
  page: { backgroundColor: "{colors.neutral}", textColor: "{colors.on-surface}", typography: "{typography.body-md}", padding: "{spacing.margin}" }
  button-primary: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", typography: "{typography.label-lg}", rounded: "{rounded.lg}", height: 50px, padding: 24px }
  button-primary-hover: { backgroundColor: "{colors.primary-hover}", textColor: "{colors.on-primary}" }
  button-primary-pressed: { backgroundColor: "{colors.primary-pressed}", textColor: "{colors.on-primary}" }
  button-secondary: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.on-surface}", typography: "{typography.label-md}", rounded: "{rounded.lg}", height: 44px, padding: 16px }
  button-secondary-hover: { backgroundColor: "{colors.outline}", textColor: "{colors.on-surface}" }
  button-tertiary: { backgroundColor: "{colors.surface}", textColor: "{colors.secondary}", typography: "{typography.label-md}", rounded: "{rounded.lg}", height: 44px, padding: 12px }
  card: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.body-md}", rounded: "{rounded.xl}", padding: 24px }
  card-hero: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.display}", rounded: "{rounded.xxl}", padding: 40px }
  card-title: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.headline-md}" }
  card-counter: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface-muted}", typography: "{typography.number-lg}" }
  section-label: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface-muted}", typography: "{typography.label-caps}" }
  date-label: { backgroundColor: "{colors.surface}", textColor: "{colors.secondary}", typography: "{typography.label-caps}" }
  hero-copy: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface-variant}", typography: "{typography.body-lg}" }
  mission-row-pending: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.body-strong}", height: 58px }
  mission-row-done: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface-variant}", typography: "{typography.body-strong}", height: 58px }
  mission-row-meta: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface-muted}", typography: "{typography.body-sm}" }
  mission-check-pending: { backgroundColor: "{colors.surface}", textColor: "{colors.outline-strong}", rounded: "{rounded.full}", size: 30px }
  mission-check-done: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", rounded: "{rounded.full}", size: 30px }
  points-chip-earned: { backgroundColor: "{colors.surface}", textColor: "{colors.primary}", typography: "{typography.number-md}" }
  points-chip-pending: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface-muted}", typography: "{typography.number-md}" }
  chip-due-today: { backgroundColor: "{colors.tertiary}", textColor: "{colors.on-primary}", typography: "{typography.label-md}", rounded: "{rounded.full}", height: 28px, padding: 12px }
  chip-filter: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.on-surface-variant}", typography: "{typography.label-md}", rounded: "{rounded.full}", height: 36px, padding: 16px }
  chip-filter-selected: { backgroundColor: "{colors.secondary}", textColor: "{colors.neutral}" }
  stat-tile: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.on-surface}", typography: "{typography.label-md}", rounded: "{rounded.lg}", height: 44px, padding: 16px }
  input-field: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.on-surface}", typography: "{typography.body-md}", rounded: "{rounded.md}", height: 48px, padding: 16px }
  input-field-placeholder: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.on-surface-muted}" }
  input-field-error: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.error}", typography: "{typography.body-sm}" }
  error-banner: { backgroundColor: "{colors.error}", textColor: "{colors.on-primary}", typography: "{typography.body-strong}", rounded: "{rounded.md}", padding: 16px }
  nav-bar: { backgroundColor: "{colors.neutral}", textColor: "{colors.on-surface}", typography: "{typography.headline-lg}", height: 52px }
  nav-item: { backgroundColor: "{colors.neutral}", textColor: "{colors.on-surface-variant}", typography: "{typography.label-md}", rounded: "{rounded.md}", height: 44px, padding: 18px }
  nav-item-hover: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.on-surface}" }
  nav-item-active: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}" }
  tab: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface-muted}", typography: "{typography.label-md}", rounded: "{rounded.md}", height: 44px, padding: 16px }
  tab-active: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.on-surface}" }
  progress-track: { backgroundColor: "{colors.outline}", rounded: "{rounded.full}", height: 8px }
  progress-fill: { backgroundColor: "{colors.primary}", rounded: "{rounded.full}", height: 8px }
  avatar: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.on-surface}", typography: "{typography.number-lg}", rounded: "{rounded.full}", size: 44px }
  avatar-small: { backgroundColor: "{colors.outline}", textColor: "{colors.on-surface}", typography: "{typography.label-md}", rounded: "{rounded.full}", size: 28px }
  crew-pill: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.on-surface}", typography: "{typography.body-sm}", rounded: "{rounded.full}", height: 38px, padding: 14px }
  mission-patch: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.label-caps}", rounded: "{rounded.full}", size: 88px }
  mission-patch-locked: { backgroundColor: "{colors.surface}", textColor: "{colors.outline-strong}", rounded: "{rounded.full}", size: 88px }
  celebration-modal: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.on-surface}", typography: "{typography.headline-lg}", rounded: "{rounded.xxl}", padding: 40px, width: 480px }
  tooltip: { backgroundColor: "{colors.on-surface}", textColor: "{colors.neutral}", typography: "{typography.body-sm}", rounded: "{rounded.sm}", padding: 8px }
  mascot-nova: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", size: 160px }
  orbit-track: { backgroundColor: "{colors.outline}", height: 4px }
  orbit-arc-first: { backgroundColor: "{colors.secondary}", height: 5px }
  orbit-arc-second: { backgroundColor: "{colors.tertiary}", height: 5px }
  orbit-arc-third: { backgroundColor: "{colors.on-surface}", height: 5px }
  orbit-arc-fourth: { backgroundColor: "{colors.quaternary}", height: 5px }
  constellation-star-lit: { backgroundColor: "{colors.primary}", size: 20px }
  constellation-star-unlit: { backgroundColor: "{colors.surface}", textColor: "{colors.outline-strong}", rounded: "{rounded.full}", size: 10px }
  chart-bar: { backgroundColor: "{colors.secondary}", rounded: "{rounded.sm}", width: 40px }
  chart-bar-today: { backgroundColor: "{colors.primary}", rounded: "{rounded.sm}", width: 40px }
  chart-bar-empty: { backgroundColor: "{colors.outline}", rounded: "{rounded.xs}", height: 8px }
---

# Órbita

## Overview

Órbita es un planetario de bolsillo para organizar el día. La interfaz es **serena, precisa y luminosa**: un cielo nocturno plano, de azul muy profundo, sobre el que solo brilla lo que la persona ya cumplió. Nada parpadea para llamar la atención; la luz se gana.

Quien la usa es estudiante o trabaja en equipo, abre la aplicación varias veces al día y necesita saber en dos segundos qué le toca y cuánto lleva. Por eso cada pantalla tiene una sola fuente de luz principal (amarillo Nova) y todo lo demás se ordena en capas tonales de azul.

Tres ideas gobiernan cualquier decisión que este archivo no cubra:

- **La luz es el progreso.** Amarillo significa "hecho" o "la acción principal". Si algo no está cumplido, no es amarillo.
- **El ritmo se ve como un círculo.** Lo que se repite se dibuja como órbita: una pista circular y un arco que avanza.
- **El mundo es pequeño y cercano.** No es ciencia ficción ni épica espacial. No hay naves de guerra, neón ni fotografías de galaxias: hay una estrella con cara amable, puntos y líneas finas, como una carta celeste dibujada a mano con instrumentos.

## Colors

La paleta tiene una base de azules nocturnos en tres capas y cuatro luces. Todos los colores son planos: no se usan degradados, desenfoques ni transparencias de vidrio.

- **Primary, amarillo Nova (#FFD25E):** la luz de la mascota. Único color para la acción principal de cada pantalla, las misiones cumplidas, los destellos ganados y las estrellas encendidas. Su texto siempre es tinta índigo.
- **On-primary, tinta índigo (#1A1440):** texto e iconos sobre amarillo, aguamarina claro, coral o rosa de error. También dibuja la cara de Nova.
- **Primary-hover (#FFDE85) y primary-pressed (#F2C140):** estados del botón principal.
- **Secondary, aguamarina (#5FD4E6):** información y ritmo. Primera órbita, barras de la bitácora, enlaces, fecha del día, foco de teclado y borde del avatar.
- **Tertiary, coral (#FF8E72):** segunda órbita y avisos amables ("vence hoy"). Nunca se usa para errores.
- **Quaternary, lila (#B9A8FF):** cuarta órbita y series adicionales en gráficas. No aparece en botones.
- **Neutral, espacio profundo (#0B1026):** fondo de la página y de la barra de navegación.
- **Surface, noche (#141A3A):** tarjetas y paneles.
- **Surface-raised, noche alta (#1C2450):** elementos sobre una tarjeta: fichas de dato, campos, píldoras de la tripulación, ventanas.
- **Outline (#2C3566):** bordes de un píxel, pistas de órbitas y de barras de progreso.
- **Outline-strong (#7C88C4):** contorno de casillas pendientes y de estrellas apagadas. Es el tono más tenue permitido para algo que debe distinguirse.
- **On-surface (#F3F5FF):** texto principal y tercera órbita (blanco estelar).
- **On-surface-variant (#D5DAF5):** texto de apoyo y destinos de navegación inactivos.
- **On-surface-muted (#AEB6DC):** metadatos, contadores y rótulos en mayúsculas.
- **Error, rosa señal (#FF7A90):** mensajes de error, siempre con icono y texto.

Contraste comprobado: el texto principal alcanza 15,6:1 sobre las tarjetas y el texto más tenue (#AEB6DC) 8,5:1. El contorno #7C88C4 llega a 5,0:1 sobre las tarjetas, pero solo a 4,4:1 sobre la noche alta: sobre #1C2450 no se usa para texto.

Blanco puro (#FFFFFF) queda reservado al brillo de los ojos de Nova.

## Typography

Dos familias de Google Fonts con papeles separados.

- **Space Grotesk** lleva la voz del instrumento: títulos, botones y toda cifra (contadores, porcentajes, destellos). Su construcción geométrica recuerda a un panel de medición sin volverse fría. Pesos 600 y 700.
- **Inter** lleva la lectura: párrafos, títulos de misión, metadatos y navegación. Pesos 400 y 600.

Uso de los niveles:

- **display (48 px, 700):** solo el saludo de la pantalla Hoy y el título de una celebración. Uno por pantalla.
- **headline-lg (28 px, 700):** nombre de la marca y título de cada pantalla interior.
- **headline-md (22 px, 600):** título de tarjeta.
- **number-lg (18 px, 600):** contadores junto al título ("3 de 5", "60 %") e inicial del avatar.
- **number-md (16 px, 600):** destellos de cada misión ("+10") y valores sobre las barras.
- **label-lg (17 px, 700):** texto de botones principales.
- **label-md (15 px, 600):** navegación, fichas de dato, pestañas y botones secundarios.
- **label-caps (13 px, 600, mayúsculas, espaciado 0,08 em):** rótulos de sección y fecha.
- **body-lg (18 px):** frase de Nova en la pantalla Hoy.
- **body-md (16 px):** texto corrido y campos.
- **body-strong (16 px, 600):** título de cada misión.
- **body-sm (14 px):** metadatos, ayudas y pies de gráfica. Es el tamaño mínimo del texto corrido.

Las cifras nunca van en Inter. Los títulos nunca van en mayúsculas; las mayúsculas son exclusivas de `label-caps`.

## Layout

Escritorio primero, con una columna central de **1296 px** como máximo, márgenes laterales de 32 px y separación de 20 px entre bloques. El espaciado sigue una escala de 4 px (4, 8, 12, 16, 20, 24, 32, 40).

La pantalla Hoy tiene tres franjas: barra de navegación de 52 px, tarjeta principal de 360 px de alto mínimo y una fila de tres tarjetas iguales de 420 px de alto mínimo. La tarjeta principal se divide en tres zonas: sistema de órbitas a la izquierda (320 px), saludo y acciones al centro, y leyenda de órbitas a la derecha (290 px).

Las pantallas interiores usan dos columnas: contenido principal a la izquierda (dos tercios) y resumen a la derecha (un tercio). Los formularios ocupan una columna de 560 px como máximo.

En teléfono todo pasa a una columna con márgenes de 16 px; la navegación baja al borde inferior con cuatro destinos y el botón principal queda fijo sobre ella. Toda zona pulsable mide al menos 44 px.

## Elevation & Depth

No hay sombras. La profundidad se construye con **capas tonales**: espacio profundo (#0B1026), noche (#141A3A) y noche alta (#1C2450), cada una un paso más clara que la anterior. Las tarjetas llevan además un borde de 1 px en #2C3566.

Las ventanas modales usan noche alta y se apoyan sobre el fondo oscurecido con espacio profundo al 70 % de opacidad.

El único efecto de luz permitido es el **halo plano**: uno o dos círculos concéntricos del mismo color que el objeto, con opacidad entre 10 y 16 %, sin desenfoque. Lo llevan Nova y las estrellas encendidas.

## Shapes

El lenguaje de formas es **circular y de esquinas amplias**, como lentes e instrumentos.

- Tarjeta principal: radio de 28 px. Tarjetas: 24 px.
- Botones y fichas de dato: 14 px. Destinos de navegación, pestañas y campos: 12 px. Barras de gráfica: 10 px.
- Avatares, casillas, píldoras, parches y planetas: círculo completo.
- Las líneas son finas y de extremos redondeados: 1 px en bordes, 2 px en constelaciones e iconos, 4 a 5 px en órbitas.

Las estrellas encendidas son de cuatro puntas con lados cóncavos. Nova es la única estrella de cinco puntas, con las puntas muy redondeadas.

## Components

- **Botones.** El principal es amarillo con texto índigo, 50 px de alto y radio de 14 px; uno solo por pantalla. El secundario es noche alta con borde de 1 px. El terciario es solo texto aguamarina. El foco de teclado se marca con un anillo aguamarina de 2 px separado 2 px del elemento.
- **Barra de navegación.** Marca a la izquierda (planeta con anillo aguamarina y palabra "Órbita"), cuatro destinos al centro (Hoy, Misiones, Constelaciones, Bitácora) y nivel con avatar a la derecha. El destino activo es una píldora amarilla.
- **Tarjeta.** Noche con borde de 1 px y 24 px de relleno. Título en `headline-md` a la izquierda y contador en `number-lg` atenuado a la derecha.
- **Fila de misión.** Casilla circular de 30 px dentro de una zona pulsable de 44 px, título en `body-strong`, metadato debajo en `body-sm` y destellos a la derecha. Pendiente: casilla hueca con contorno #7C88C4 y destellos atenuados. Hecha: casilla amarilla con marca índigo, título un tono más suave y destellos en amarillo. El título no se tacha.
- **Ficha de dato.** Píldora de 44 px con icono de 18 px y texto: racha en órbita (destello amarillo de cuatro puntas), escudos (contorno aguamarina) y nivel.
- **Campo de texto.** Noche alta, 48 px de alto, etiqueta encima en `label-md`. Con foco, borde aguamarina de 2 px. Con error, borde rosa señal, icono de aviso y mensaje debajo.
- **Pestañas.** Fila de píldoras de 44 px; la activa en noche alta con texto claro y una línea amarilla de 2 px debajo.
- **Barra de progreso.** Pista de 8 px en #2C3566 con relleno amarillo. Siempre lleva la cifra al lado.
- **Sistema de órbitas.** Pistas circulares concéntricas de 4 px en #2C3566; sobre cada una, un arco de 5 px con extremos redondeados que empieza arriba y avanza en sentido horario. Un planeta de 18 a 22 px marca el final del arco. Orden de colores de dentro hacia fuera: aguamarina, coral, blanco estelar y lila. Nova ocupa el centro.
- **Constelación.** Diez estrellas. Encendidas: amarillas, de cuatro puntas, con halo plano y unidas por línea continua de 2 px. Apagadas: círculos huecos de 10 px unidos por línea punteada. Las cinco estrellas guía son un tercio más grandes.
- **Píldora de tripulación.** Avatar de 28 px, nombre en negrita y número de misiones aportadas.
- **Parche de misión.** Insignia circular de 88 px con borde doble que imita un bordado y un símbolo central de trazo. Bloqueado: contorno punteado y símbolo en #7C88C4.
- **Ventana de celebración.** 480 px de ancho, Nova arriba con rayos, título, recompensa en una ficha y un solo botón principal.

## Do's and Don'ts

- Usa el amarillo solo para lo cumplido y para la acción principal de la pantalla.
- Acompaña cada color de órbita con su nombre y su cifra; el color nunca es la única pista.
- Mantén una sola frase de Nova por pantalla, corta y en segunda persona.
- Deja al menos 20 px entre tarjetas: el espacio oscuro es parte del diseño.
- Escribe siempre la palabra común junto a la palabra del mundo la primera vez ("destellos: tus puntos").
- No uses degradados, brillos difusos, vidrio esmerilado ni sombras.
- No uses fotografías del espacio, naves, astronautas realistas ni estética de neón.
- No uses coral para errores ni rosa señal para órbitas.
- No pongas texto en #7C88C4 sobre noche alta ni texto corrido por debajo de 14 px (el rótulo en mayúsculas de 13 px es la única excepción).
- No animes las órbitas de forma continua: los planetas solo se mueven cuando algo se cumple.
- No uses emojis; los iconos son de trazo.

## Iconography

Iconos de trazo de 2 px, extremos y uniones redondeados, sobre una retícula de 20 px, sin relleno salvo cuando indican "hecho". El repertorio sale del mundo: destello de cuatro puntas (destellos y racha), escudo (protector), planeta con anillo (órbita), tres puntos unidos (constelación), cuaderno con espiral (bitácora), cometa (colección), antena (señal) y dos flechas en círculo (relevo). Color por defecto #D5DAF5; aguamarina cuando son interactivos.

## Illustration & Mascot

Nova es una estrella amarilla de cinco puntas muy redondeadas, con ojos ovalados índigo, un punto blanco de brillo en cada ojo, mejillas coral y una sonrisa de trazo. No tiene brazos ni piernas: expresa con los ojos, la boca, la inclinación y el tamaño de su halo. Tiene seis estados: esperando, animando, feliz, celebrando, preocupada y descansando. Su brillo (el tamaño del halo) crece con el progreso del día.

La ilustración es plana y geométrica: círculos, elipses y líneas. El cielo de fondo son puntos blancos de 1 a 2 px con opacidad del 70 %, pocos y dispersos. Los cometas son un núcleo redondo con una cola de dos o tres trazos.

## Data Visualization

- **Progreso del día:** el halo de Nova y el contador "3 de 5".
- **Ritmo de cada órbita:** arco sobre pista circular con leyenda en texto ("5 de 7 vueltas").
- **Avance de un proyecto:** constelación de diez estrellas con el porcentaje y el conteo escritos.
- **Bitácora semanal:** siete barras aguamarina con el valor encima; el día de hoy en amarillo; los días futuros como una marca de 8 px.
- **Cielo del mes:** un punto por día cuya forma y tamaño cambian según el día (hueco, estrella pequeña, estrella grande con halo, anillo de escudo, media luna de crucero).

Toda gráfica tiene texto alternativo con los valores y una frase de resumen debajo.

## Motion

Movimiento breve y con sentido. Al completar una misión: la casilla se llena en 200 ms, el planeta avanza por su órbita en 600 ms y el halo de Nova crece en 400 ms. Curva de entrada `cubic-bezier(0.2, 0.8, 0.2, 1)`. Las celebraciones duran menos de dos segundos. Con movimiento reducido, todo cambia de estado sin desplazamiento.

## Voice & Copy

Nova habla en segunda persona, con frases cortas y tranquilas, y cierra con punto, no con exclamaciones en cadena. Informa primero y anima después: "Nova brilla al 60 %. Dos misiones más y enciendes todo el cielo de hoy." Nunca reprocha. Vocabulario del mundo: misión, órbita, vuelta, destellos, escudo, cielo encendido, constelación, tripulación, estrella guía, bitácora, parche, cometa, señal y relevo.
