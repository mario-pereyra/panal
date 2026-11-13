---
version: alpha
name: Elay con Nando y Mechi
description: Plataforma gamificada de actividades con identidad de Santa Cruz de la Sierra. Plana, luminosa y cercana; verde y blanco con acentos de rosado tajibo; dos personajes con traje típico dentro de arcos.
colors:
  primary: "#0D7339"
  primary-dark: "#0A4D27"
  on-primary: "#FFFFFF"
  secondary: "#C2255C"
  secondary-dark: "#8A1740"
  secondary-light: "#F7A8C4"
  secondary-container: "#FDE7EF"
  tertiary: "#FFC533"
  accent-orange: "#F58A1F"
  neutral: "#F7FAF6"
  surface: "#FFFFFF"
  surface-tint: "#E3F1E7"
  hero-tint: "#DDEFE2"
  outline: "#CFE0D5"
  on-surface: "#10261A"
  on-surface-variant: "#4C6355"
  points-container: "#FFF3DC"
  on-points: "#7A4A00"
  error: "#B3261E"
  illustration-leaf: "#1FA24A"
  illustration-flower: "#E8457C"
  illustration-straw: "#F5DE9F"
  illustration-skin: "#C8875A"
  illustration-hair: "#231C1A"
typography:
  display:
    fontFamily: Paytone One
    fontSize: 58px
    fontWeight: 400
    lineHeight: 1.05
  headline-lg:
    fontFamily: Paytone One
    fontSize: 31px
    fontWeight: 400
    lineHeight: 1.15
  headline-md:
    fontFamily: Paytone One
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.2
  numeral:
    fontFamily: Paytone One
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: Figtree
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.35
  body-lg:
    fontFamily: Figtree
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: Figtree
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  body-strong:
    fontFamily: Figtree
    fontSize: 15px
    fontWeight: 700
    lineHeight: 1.4
  label-md:
    fontFamily: Figtree
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
  label-sm:
    fontFamily: Figtree
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.02em
  button:
    fontFamily: Figtree
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1
rounded:
  sm: 7px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 24px
  margin: 40px
  container: 1280px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 14px
    height: 48px
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 14px
    height: 48px
  button-tertiary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 8px
  button-celebration:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 14px
    height: 48px
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    padding: "{spacing.margin}"
    width: "{spacing.container}"
  hero:
    backgroundColor: "{colors.hero-tint}"
    textColor: "{colors.on-surface}"
    typography: "{typography.display}"
    rounded: "{rounded.xxl}"
    padding: "{spacing.xxl}"
  hero-copy:
    backgroundColor: "{colors.hero-tint}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body-lg}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  card-title:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-md}"
  screen-title:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-lg}"
  section-title:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.title}"
  divider:
    backgroundColor: "{colors.outline}"
    height: 1.5px
  speech-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  stat-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.numeral}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  stat-tile-help:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-md}"
  stat-tile-word:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.secondary-dark}"
    typography: "{typography.numeral}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  activity-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: 64px
  activity-row-done:
    backgroundColor: "{colors.surface-tint}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
  points-chip:
    backgroundColor: "{colors.points-container}"
    textColor: "{colors.on-points}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: 52px
  input-field-error:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.error}"
    typography: "{typography.label-md}"
  nav-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body-strong}"
    height: 72px
    padding: "{spacing.gutter}"
  nav-item-active:
    backgroundColor: "{colors.surface-tint}"
    textColor: "{colors.primary-dark}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  tab:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
  progress-track:
    backgroundColor: "{colors.surface-tint}"
    rounded: "{rounded.sm}"
    height: 14px
  progress-fill:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    height: 14px
  stage-next:
    backgroundColor: "{colors.accent-orange}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  avatar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    size: 36px
  badge:
    backgroundColor: "{colors.points-container}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    size: 96px
  badge-locked:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    size: 96px
  yapa-tag:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  celebration-modal:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-lg}"
    rounded: "{rounded.xxl}"
    padding: "{spacing.xl}"
    width: 520px
  arch-nando:
    backgroundColor: "{colors.primary}"
    width: 210px
    height: 320px
  arch-mechi:
    backgroundColor: "{colors.secondary-light}"
    width: 210px
    height: 320px
  flower-small:
    backgroundColor: "{colors.secondary-light}"
    size: 12px
  flower-medium:
    backgroundColor: "{colors.illustration-flower}"
    size: 18px
  flower-large:
    backgroundColor: "{colors.secondary}"
    size: 24px
  flower-center:
    backgroundColor: "{colors.tertiary}"
    size: 8px
  character-skin:
    backgroundColor: "{colors.illustration-skin}"
  character-hair:
    backgroundColor: "{colors.illustration-hair}"
  character-hat:
    backgroundColor: "{colors.illustration-straw}"
  character-dress:
    backgroundColor: "{colors.illustration-leaf}"
---

# Elay con Nando y Mechi

## Overview

Elay es una plataforma para organizar y cumplir actividades, sola o en equipo, contada desde Santa Cruz de la Sierra. "Elay" es lo que se dice al mostrar algo que salió bien. La interfaz debe sentirse **cálida, luminosa y cercana**: una galería de arcos a la sombra, con el tajibo en flor y dos amigos que reciben a la persona.

Dos personajes originales acompañan toda la experiencia: **Nando**, con sombrero de saó, camisa blanca y pañoleta verde, y **Mechi**, con vestido verde de volados y una flor de tajibo en la trenza. Están dibujados en estilo plano y geométrico, cada uno dentro de un arco de medio punto.

El público son estudiantes y equipos pequeños. El tono es de compañía, nunca de vigilancia. La densidad es baja: una idea por tarjeta y mucho aire. Todo el texto de la interfaz va en español con voseo cruceño (tenés, querés, cerrás, metele).

No es una postal turística, ni un disfraz folclórico, ni una aplicación infantil.

## Colors

La paleta parte de la bandera cruceña: verde, blanco, verde. El verde estructura, el blanco contiene y el rosado del tajibo premia.

- **Primary (#0D7339), verde Elay:** marca, botón principal, relleno de progreso y arco de Nando. Con texto blanco encima.
- **Primary dark (#0A4D27), verde monte:** estado presionado y texto sobre tintes verdes.
- **Secondary (#C2255C), rosado tajibo:** el color del logro. Cifras destacadas, botón de las celebraciones y flores grandes del mapa de constancia. Se usa poco para que signifique algo.
- **Secondary dark (#8A1740), vino:** texto sobre el tinte rosado.
- **Secondary light (#F7A8C4):** arco de Mechi y flores pequeñas. Nunca para texto.
- **Secondary container (#FDE7EF):** fondo de la ficha "Palabra de hoy".
- **Tertiary (#FFC533), sol:** centro de las flores, días redondos y etiqueta de yapa. Solo como fondo con tinta encima.
- **Accent orange (#F58A1F):** avance hacia la siguiente etapa del proyecto.
- **Neutral (#F7FAF6):** fondo de página, un blanco con una gota de verde.
- **Surface (#FFFFFF):** tarjetas.
- **Surface tint (#E3F1E7) y Hero tint (#DDEFE2):** fichas, filas completadas, pista de las barras y fondo de la portada.
- **Outline (#CFE0D5):** bordes de 1,5 px y separadores.
- **On surface (#10261A) y On surface variant (#4C6355):** texto principal y secundario.
- **Points container (#FFF3DC) con On points (#7A4A00):** chip de cuñapés (los puntos).
- **Error (#B3261E):** mensajes de error.
- **Illustration (#1FA24A, #E8457C, #F5DE9F, #C8875A, #231C1A):** solo para los personajes y las ilustraciones.

Proporción: 60 % fondo y superficie, 25 % verdes, 10 % tinta, 5 % rosado y sol. Sin degradados: todos los colores son planos.

## Typography

Dos familias de Google Fonts.

- **Paytone One** para títulos y cifras. Redonda, gruesa y festiva, como rotulación de cartel. Tiene un solo peso; se usa en una sola línea por tarjeta y nunca en párrafos ni botones.
- **Figtree** para todo lo demás: texto, etiquetas y botones. Pesos 400, 600 y 700.

Jerarquía: `display` para el saludo de la portada ("¡Elay, Ana!"), `headline-lg` para el título de cada pantalla, `headline-md` para el título de cada tarjeta, `numeral` para cifras ("12 días", "60 %"), `title` para subtítulos, `body-lg` y `body-md` para texto, `body-strong` para el nombre de una actividad, `label-md` y `label-sm` para etiquetas y leyendas.

Las palabras propias (jenecherú, cómper, tapeque, cuñapés, buri) se escriben en el mismo estilo que el resto, sin cursiva ni comillas. Los signos de apertura de exclamación e interrogación se escriben siempre.

## Layout

Escritorio: contenido centrado con ancho máximo de 1280 px, retícula de 12 columnas, 24 px entre columnas y 40 px de margen. Escala de espaciado de 4, 8, 16, 24, 32 y 48 px.

La pantalla principal se ordena en cuatro franjas: barra de navegación; portada a todo el ancho (texto y botones a la izquierda, personajes al centro, tarjeta de diálogo a la derecha); fila de cuatro fichas de dato; y cuerpo en tres columnas (lista de actividades más ancha a la izquierda, proyecto al centro, mapa de constancia a la derecha).

Teléfono: una columna, barra de navegación abajo con cuatro destinos, fichas en carrusel horizontal y el botón principal fijo sobre la barra. En teléfono se muestra un solo personaje: el que habla.

Una idea por tarjeta. Un solo botón principal por pantalla.

## Elevation & Depth

Diseño plano, **sin sombras**. La profundidad se construye con capas de tono: fondo de página, tintes verdes, superficie blanca y un borde fino de 1,5 px en `outline`. La jerarquía la dan el color y el tamaño, no la elevación. Las ventanas modales se separan del fondo con un velo de tinta al 40 % de opacidad.

## Shapes

Formas redondas y generosas. Tarjetas con radio de 24 px, fichas de 20 px, filas y campos de 16 px, portada de 32 px. Botones, chips y pestañas en forma de píldora. Las barras de progreso se dividen en tramos con radio de 7 px.

La forma propia de la marca es el **arco de medio punto**: un rectángulo con la parte superior semicircular. Enmarca a los personajes y la imagen de las celebraciones. No se usa en botones ni en tarjetas comunes.

## Components

- **Botones:** el principal es una píldora verde con texto blanco de 48 px de alto; el secundario es blanco con borde `outline` y texto verde; el terciario es solo texto verde. El botón de las celebraciones es rosado tajibo. Uno solo principal por pantalla.
- **Barra de navegación:** blanca, de 72 px. Marca "Elay" a la izquierda en Paytone One verde; destinos Hoy, Actividades, Comparsas y Reportes al centro; nivel ("4to anillo") y avatar a la derecha. El destino activo es una píldora en tinte verde con texto verde monte.
- **Portada:** bloque en `hero-tint` con el saludo en `display`, una frase en `body-lg`, dos botones y los dos personajes en sus arcos (Nando sobre verde, Mechi sobre rosado claro).
- **Tarjeta de diálogo:** tarjeta blanca con la cabeza de quien habla en un círculo, su nombre ("Mechi dice") en `label-md` y la frase en `body-lg`.
- **Ficha de dato:** icono relleno arriba, cifra en `numeral`, nombre en `title` y una línea de ayuda en `label-md`. Cuatro en fila: Jenecherú (racha), Cómper (protector), Nivel y Palabra de hoy. La de la palabra usa el tinte rosado.
- **Fila de actividad:** casilla circular a la izquierda, título en `body-strong`, tipo debajo en `label-md` ("Recurrente · diaria", "Única · vence hoy") y chip de cuñapés a la derecha ("+10", "+25"). Al completarse: casilla verde con marca blanca, fondo en tinte verde y título en texto secundario, sin tachar.
- **Chip de cuñapés:** píldora crema con texto tostado y un círculo pequeño que representa el cuñapé.
- **Barra del tapeque:** cinco tramos iguales separados por 6 px; llenos en verde, vacíos en tinte. La cifra "3 de 5" va a la derecha.
- **Regla de etapas:** cinco marcas con su nombre para el avance del proyecto. Cumplidas en verde con marca de verificación, la actual con borde naranja, las futuras en gris.
- **Campo de texto:** blanco, borde `outline` de 1,5 px, etiqueta encima, 52 px de alto. En foco, borde verde de 2 px. El error se escribe debajo en rojo y explica cómo corregirlo.
- **Pestañas:** píldoras; la activa en verde con texto blanco.
- **Avatar:** círculo con la inicial. Cada miembro tiene un color y siempre su inicial.
- **Insignia (horneado):** ficha cuadrada crema con una ilustración plana de un horneado y su nombre debajo. Bloqueada: en gris, con el criterio visible.
- **Etiqueta de yapa:** píldora amarilla con texto de tinta.
- **Ventana de celebración:** modal blanco de 520 px con un arco grande arriba donde bailan los personajes, título en `headline-lg`, recompensa, siguiente meta y un botón rosado.

## Do's and Don'ts

- Usa el verde para estructurar y reserva el rosado tajibo para el logro.
- No uses degradados, sombras difusas, brillos ni efectos de vidrio.
- No uses emojis; los iconos son lineales de 2 px con extremos redondos.
- Mantén un solo botón principal por pantalla.
- No uses Paytone One en párrafos ni en botones.
- Explica cada palabra propia la primera vez que aparece ("Jenecherú: tu racha").
- No uses el amarillo sol ni el rosado claro como color de texto.
- Muestra el progreso con forma y tamaño además de color.
- No ordenes a los miembros de un equipo de mayor a menor aporte.
- Dibuja a los personajes con dignidad y en acciones cotidianas; nunca como caricatura ni dormidos.
- Escribe siempre en español con voseo cruceño y sin reproches.

## Iconography

Iconos lineales de 24 px, trazo de 2 px, extremos redondos, en `on-surface-variant`; en verde cuando están activos. Cuatro iconos rellenos propios para las fichas: tizón (jenecherú), mano en alto (cómper), anillos concéntricos (nivel) y libro abierto (palabra del día). La flor de tajibo de cinco pétalos redondos marca todo lo que es logro.

## Illustration & Mascot

Ilustración plana y geométrica, sin contornos ni texturas, con un máximo de seis colores por escena y vista frontal.

- **Nando:** tres cabezas y media de alto, cabeza grande y redonda, sombrero de saó color paja con cinta, camisa blanca remangada, pañoleta verde al cuello, cinturón oscuro con hebilla dorada, pantalón blanco remangado, descalzo. Gesto base: toca el ala del sombrero. Va sobre un arco verde.
- **Mechi:** mismas proporciones, cabello oscuro con una trenza gruesa sobre el hombro, flor de tajibo rosada en el cabello, vestido verde largo con volados de ribete blanco, descalza. Gesto base: una mano en la cintura. Va sobre un arco rosado claro.
- Caras simples: ojos elípticos oscuros con un brillo, cejas finas, mejillas coral suaves, sonrisa.
- Seis estados: esperando, animando, feliz, celebrando, preocupada y descansando. En el descanso están sentados a la sombra, despiertos y conversando.

## Data Visualization

- **Tapeque de hoy:** barra de cinco tramos.
- **Etapas del buri (avance del proyecto):** una escena de patio que suma una capa por hito (banderines, ramada, mesa de horneados, músicos, fiesta) y una regla de cinco marcas debajo.
- **Aporte por miembro:** barras horizontales con avatar, nombre y cifra, sin ordenar por cantidad.
- **Florada del tajibo (constancia):** cuadrícula de siete columnas por cinco filas con una flor por día; cuatro tamaños de menos a más, centro amarillo en los días redondos y un anillo de tinta en el día de hoy.
- **Reportes:** barras horizontales por actividad, siete barras verticales para la semana y cifras grandes para comparar únicas y recurrentes. Sin gráficos de torta.

Toda gráfica lleva leyenda y una tabla equivalente.

## Motion

Respuesta en 150 ms, transiciones en 250 ms, énfasis con rebote leve en 400 ms. Al completar una actividad se encadenan casilla, tramo de la barra y cifra de puntos. En las celebraciones caen flores de tajibo durante 1,2 s. Con movimiento reducido, todo se resuelve con un fundido de 150 ms.

## Voice & Copy

Voseo cruceño, frases cortas, una sola palabra propia por frase y ningún reproche. Nando exclama y anima ("¡Ya arrancaste! Metele."); Mechi afirma y precisa ("Te falta poquingo: dos más y cerrás el día."). Vocabulario: tapeque (las actividades del día), cuñapés (puntos), jenecherú (racha), cómper (protector de racha), anillo (nivel), comparsa (equipo de un proyecto), buri (la fiesta al cerrar un proyecto), yapa (sorpresa), horneados (insignias).
