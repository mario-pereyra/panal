---
version: alpha
name: Cumbre
description: "Sistema de diseño de Cumbre: plataforma gamificada de actividades donde cada tramo cumplido suma metros y cada proyecto es una expedición en cordada. Mascota original: Kusi, una llama con manta de franjas."
colors:
  primary: "#17302B"
  on-primary: "#FFFFFF"
  secondary: "#1F5F54"
  tertiary: "#C4441F"
  neutral: "#EEF4F3"
  surface: "#FFFFFF"
  on-surface: "#17302B"
  on-surface-variant: "#4F6661"
  surface-sky: "#D6ECEE"
  surface-frost: "#E4EEEC"
  outline: "#D3E0DD"
  outline-strong: "#6F8B85"
  slope: "#2F7A6B"
  slope-shade: "#256A5C"
  glacier: "#A9CFC6"
  flag: "#D8502F"
  sun: "#F2B441"
  chart-axis: "#B8CCC8"
  wool: "#B8732F"
  wool-shade: "#8F5622"
  fleece: "#FFF1DC"
  blush: "#F2A48C"
  error: "#A3271B"
  error-container: "#FBE9E4"
typography:
  display-hero: { fontFamily: Bricolage Grotesque, fontSize: 48px, fontWeight: 800, lineHeight: 1.05, letterSpacing: -0.01em }
  display-figure: { fontFamily: Bricolage Grotesque, fontSize: 44px, fontWeight: 800, lineHeight: 1 }
  headline-lg: { fontFamily: Bricolage Grotesque, fontSize: 32px, fontWeight: 800, lineHeight: 1.1 }
  headline-md: { fontFamily: Bricolage Grotesque, fontSize: 23px, fontWeight: 700, lineHeight: 1.2 }
  headline-sm: { fontFamily: Bricolage Grotesque, fontSize: 18px, fontWeight: 700, lineHeight: 1.2 }
  body-lg: { fontFamily: DM Sans, fontSize: 18px, fontWeight: 400, lineHeight: 1.5 }
  body-md: { fontFamily: DM Sans, fontSize: 16px, fontWeight: 400, lineHeight: 1.5 }
  body-sm: { fontFamily: DM Sans, fontSize: 14px, fontWeight: 400, lineHeight: 1.45 }
  label-lg: { fontFamily: DM Sans, fontSize: 16px, fontWeight: 700, lineHeight: 1.3 }
  label-md: { fontFamily: DM Sans, fontSize: 15px, fontWeight: 700, lineHeight: 1.2 }
  label-sm: { fontFamily: DM Sans, fontSize: 13px, fontWeight: 500, lineHeight: 1.3 }
  label-caps: { fontFamily: DM Sans, fontSize: 13px, fontWeight: 700, lineHeight: 1.2, letterSpacing: 0.08em }
rounded:
  sm: 8px
  md: 12px
  lg: 24px
  xl: 28px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 24px
  2xl: 32px
  3xl: 48px
  gutter: 20px
  margin: 32px
  container: 1296px
  touch-target: 44px
components:
  button-primary: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", typography: "{typography.headline-sm}", rounded: "{rounded.md}", height: 50px, padding: 24px }
  button-primary-hover: { backgroundColor: "{colors.secondary}", textColor: "{colors.on-primary}" }
  button-primary-pressed: { backgroundColor: "{colors.slope-shade}", textColor: "{colors.on-primary}" }
  button-primary-disabled: { backgroundColor: "{colors.surface-frost}", textColor: "{colors.on-surface-variant}" }
  button-secondary: { backgroundColor: "{colors.surface}", textColor: "{colors.primary}", typography: "{typography.label-md}", rounded: "{rounded.md}", height: 44px, padding: 16px }
  button-secondary-hover: { backgroundColor: "{colors.surface-sky}", textColor: "{colors.primary}" }
  button-tertiary: { backgroundColor: "{colors.neutral}", textColor: "{colors.secondary}", typography: "{typography.label-md}", rounded: "{rounded.md}", height: 44px, padding: 12px }
  button-accent: { backgroundColor: "{colors.tertiary}", textColor: "{colors.on-primary}", typography: "{typography.headline-sm}", rounded: "{rounded.md}", height: 50px, padding: 24px }
  card: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", rounded: "{rounded.lg}", padding: 24px }
  card-hero: { backgroundColor: "{colors.surface-sky}", textColor: "{colors.on-surface}", rounded: "{rounded.xl}", padding: 36px }
  card-empty: { backgroundColor: "{colors.surface-frost}", textColor: "{colors.on-surface-variant}", typography: "{typography.body-md}", rounded: "{rounded.lg}", padding: 24px }
  title-hero: { textColor: "{colors.on-surface}", typography: "{typography.display-hero}" }
  title-page: { textColor: "{colors.on-surface}", typography: "{typography.headline-lg}" }
  title-card: { textColor: "{colors.on-surface}", typography: "{typography.headline-md}" }
  text-lead: { textColor: "{colors.on-surface}", typography: "{typography.body-lg}" }
  kicker: { textColor: "{colors.secondary}", typography: "{typography.label-caps}" }
  figure-altitude: { textColor: "{colors.on-surface}", typography: "{typography.display-figure}" }
  activity-row: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.label-lg}", height: 58px }
  activity-row-done: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.label-lg}", height: 58px }
  activity-row-meta: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface-variant}", typography: "{typography.label-sm}" }
  checkbox: { backgroundColor: "{colors.surface}", size: 28px, rounded: "{rounded.sm}" }
  checkbox-outline: { backgroundColor: "{colors.outline-strong}", width: 2px }
  checkbox-checked: { backgroundColor: "{colors.slope}", textColor: "{colors.on-primary}", size: 30px, rounded: "{rounded.sm}" }
  chip-points: { backgroundColor: "{colors.surface}", textColor: "{colors.secondary}", typography: "{typography.headline-sm}" }
  chip-points-pending: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface-variant}", typography: "{typography.headline-sm}" }
  stat-chip: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.label-md}", rounded: "{rounded.md}", height: 44px, padding: 16px }
  refuge-token: { backgroundColor: "{colors.glacier}", textColor: "{colors.on-surface}", typography: "{typography.label-md}", rounded: "{rounded.md}" }
  input-field: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.body-md}", rounded: "{rounded.md}", height: 48px, padding: 16px }
  input-field-focus: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}" }
  input-field-error: { backgroundColor: "{colors.error-container}", textColor: "{colors.error}", typography: "{typography.body-sm}" }
  input-label: { textColor: "{colors.on-surface}", typography: "{typography.label-md}" }
  input-helper: { textColor: "{colors.on-surface-variant}", typography: "{typography.body-sm}" }
  nav-bar: { backgroundColor: "{colors.neutral}", textColor: "{colors.on-surface}", height: 52px }
  nav-item: { backgroundColor: "{colors.neutral}", textColor: "{colors.on-surface}", typography: "{typography.label-md}", rounded: "{rounded.md}", height: 44px, padding: 18px }
  nav-item-hover: { backgroundColor: "{colors.surface-frost}", textColor: "{colors.on-surface}" }
  nav-item-active: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", typography: "{typography.label-md}", rounded: "{rounded.md}", height: 44px }
  tab: { backgroundColor: "{colors.surface-frost}", textColor: "{colors.on-surface-variant}", typography: "{typography.label-md}", rounded: "{rounded.md}", height: 40px, padding: 16px }
  tab-active: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", typography: "{typography.label-md}", rounded: "{rounded.md}", height: 40px }
  progress-track: { backgroundColor: "{colors.surface-frost}", height: 10px, rounded: "{rounded.full}" }
  progress-fill: { backgroundColor: "{colors.slope}", height: 10px, rounded: "{rounded.full}" }
  avatar: { backgroundColor: "{colors.secondary}", textColor: "{colors.on-primary}", typography: "{typography.headline-sm}", size: 44px, rounded: "{rounded.full}" }
  avatar-self: { backgroundColor: "{colors.tertiary}", textColor: "{colors.on-primary}", typography: "{typography.headline-sm}", size: 44px, rounded: "{rounded.full}" }
  badge-pennant: { backgroundColor: "{colors.sun}", textColor: "{colors.on-surface}", typography: "{typography.label-sm}" }
  badge-pennant-locked: { backgroundColor: "{colors.surface-frost}", textColor: "{colors.on-surface-variant}", typography: "{typography.label-sm}" }
  modal-celebration: { backgroundColor: "{colors.surface}", textColor: "{colors.on-surface}", rounded: "{rounded.xl}", padding: 32px, width: 520px }
  modal-summit: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", rounded: "{rounded.xl}", padding: 32px, width: 520px }
  tooltip: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", typography: "{typography.body-sm}", rounded: "{rounded.sm}", padding: 8px }
  divider: { backgroundColor: "{colors.outline}", height: 1px }
  echo-chip: { backgroundColor: "{colors.surface-sky}", textColor: "{colors.on-surface}", typography: "{typography.label-md}", rounded: "{rounded.full}", height: 36px, padding: 12px }
  day-step-done: { backgroundColor: "{colors.slope}", rounded: "{rounded.sm}" }
  day-step-pending: { backgroundColor: "{colors.surface-frost}", rounded: "{rounded.sm}" }
  route-mountain: { backgroundColor: "{colors.slope}" }
  route-mountain-shade: { backgroundColor: "{colors.slope-shade}" }
  route-mountain-far: { backgroundColor: "{colors.glacier}" }
  route-path: { backgroundColor: "{colors.on-primary}", height: 5px }
  route-camp-reached: { backgroundColor: "{colors.sun}", textColor: "{colors.on-surface}", size: 22px, rounded: "{rounded.full}" }
  route-camp-current: { backgroundColor: "{colors.flag}", size: 26px, rounded: "{rounded.full}" }
  route-camp-pending: { backgroundColor: "{colors.slope}", size: 16px, rounded: "{rounded.full}" }
  route-summit-flag: { backgroundColor: "{colors.flag}" }
  rope: { backgroundColor: "{colors.flag}", width: 3px }
  sun-disc: { backgroundColor: "{colors.sun}", size: 68px, rounded: "{rounded.full}" }
  altitude-area: { backgroundColor: "{colors.glacier}" }
  altitude-line: { backgroundColor: "{colors.secondary}", height: 3px }
  altitude-axis: { backgroundColor: "{colors.chart-axis}", height: 2px }
  altitude-point-latest: { backgroundColor: "{colors.flag}", size: 14px, rounded: "{rounded.full}" }
  mascot-kusi-body: { backgroundColor: "{colors.wool}" }
  mascot-kusi-shade: { backgroundColor: "{colors.wool-shade}" }
  mascot-kusi-fleece: { backgroundColor: "{colors.fleece}" }
  mascot-kusi-blush: { backgroundColor: "{colors.blush}" }
  mascot-kusi-blanket: { backgroundColor: "{colors.secondary}" }
  mascot-ground: { backgroundColor: "{colors.slope}" }
---

# Cumbre

## Overview

Cumbre convierte la organización de actividades en una ascensión. Cada actividad es un **tramo**, cada punto es un **metro** ganado y cada proyecto es una **expedición** que un equipo sube en **cordada**, unido por una cuerda, de campamento en campamento hasta la cumbre. La acompaña **Kusi**, una llama con manta de franjas que carga el ánimo de la ruta.

La interfaz debe sentirse **serena, firme, luminosa y cercana**: aire frío de mañana, formas planas y grandes, mucho espacio y un único acento cálido. Es una guía de montaña, no un videojuego: habla poco, anima sin gritar y nunca culpa. El público son estudiantes y equipos pequeños que quieren ver su avance de un vistazo.

Principios: el progreso siempre se dibuja hacia arriba; descansar forma parte de subir; la cordada avanza junta y nadie aparece como último; el mundo es la gráfica, no un adorno.

## Colors

Paleta fría de verdes azulados con un solo acento cálido. Los colores son planos: no hay degradados.

- **Primary, Pino profundo (#17302B):** tinta de todo el texto, botón principal y destino activo de la navegación.
- **Secondary, Bosque (#1F5F54):** antetítulos, metros ganados, avatares de la cordada, línea de la gráfica.
- **Tertiary, Terracota (#C4441F):** acento con texto encima: avatar propio y botón de celebración. Uso escaso.
- **Neutral, Niebla (#EEF4F3):** fondo de todas las páginas.
- **Surface (#FFFFFF):** tarjetas y campos. **On-surface (#17302B)** y **On-surface-variant, Piedra (#4F6661)** para texto principal y secundario.
- **Surface-sky, Cielo (#D6ECEE):** fondo del bloque de bienvenida y de escenas ilustradas.
- **Surface-frost, Escarcha (#E4EEEC):** pistas de barras, pestañas inactivas, estados vacíos y bloqueados.
- **Outline (#D3E0DD)** y **Outline-strong (#6F8B85):** borde de tarjetas y borde de casillas y campos.
- **Slope, Ladera (#2F7A6B)** y **Slope-shade (#256A5C):** montaña, casilla completada y relleno de progreso.
- **Glacier, Glaciar (#A9CFC6):** montañas lejanas, área de la gráfica de altitud y ficha de refugio.
- **Flag, Terracota viva (#D8502F):** solo gráficos: banderín, posición actual, cuerda de la cordada. Nunca como color de texto.
- **Sun, Sol (#F2B441):** campamentos alcanzados y banderines ganados, siempre con tinta encima.
- **Chart-axis (#B8CCC8):** ejes de las gráficas.
- **Wool (#B8732F), Wool-shade (#8F5622), Fleece (#FFF1DC), Blush (#F2A48C):** reservados para Kusi.
- **Error (#A3271B)** sobre **Error-container (#FBE9E4):** errores de formulario, siempre con icono y mensaje.

Todo par de texto y fondo cumple 4,5:1 o más. El significado nunca depende solo del color: lo alcanzado lleva marca, lo actual lleva aro, lo pendiente va hueco.

## Typography

Dos familias de Google Fonts.

- **Bricolage Grotesque** (700 y 800) para títulos, cifras, metros y botones. Tiene carácter y peso de señal de sendero. Interletrado de -0.01em en el título de bienvenida.
- **DM Sans** (400, 500 y 700) para texto, etiquetas y navegación. Limpia y neutra.

Usos: `display-hero` para el saludo; `display-figure` para la cifra grande de metros; `headline-lg` para el título de página; `headline-md` para títulos de tarjeta; `headline-sm` para contadores, metros y botones; `body-lg` para el párrafo de bienvenida; `body-md` y `body-sm` para texto; `label-lg` para títulos de tramo y nombres; `label-md` para navegación y fichas; `label-sm` para metadatos; `label-caps` para la fecha en mayúsculas con interletrado amplio.

Los saludos terminan en punto, no en signo de exclamación. Los metros se escriben con espacio: "+10 m", "640 m".

## Layout

Escritorio a 1360 px: contenedor de 1296 px centrado, margen lateral de 32 px, retícula de 12 columnas con canal de 20 px. Orden vertical: barra de navegación (52 px), bloque de bienvenida (340 px de alto mínimo) y una fila de tres tarjetas de 4 columnas cada una (420 px de alto mínimo). Separación entre bloques: 20 px. Relleno interno de tarjeta: 24 px.

Escala de espaciado de 4 px: 4, 8, 12, 20, 24, 32 y 48. Todo objetivo táctil mide al menos 44 px.

En teléfono (desde 360 px): una columna, navegación fija abajo con cuatro destinos, botón principal fijo sobre ella, Kusi sobre el saludo y la ruta reducida a una franja.

## Elevation & Depth

Diseño plano. No se usan sombras ni desenfoques. La jerarquía se construye con capas de tono: fondo Niebla, tarjetas blancas con borde de 1 px en Outline y bloque de bienvenida en Cielo. La profundidad del paisaje se logra con tres planos de color (montañas lejanas en Glaciar, montaña en Ladera, cara en sombra en Slope-shade). Las ventanas modales se separan con un velo de Pino profundo al 60 % de opacidad.

## Shapes

Formas amables y firmes: 12 px en botones, fichas, pestañas y campos; 24 px en tarjetas; 28 px en el bloque de bienvenida y las ventanas; círculo completo en avatares, campamentos y barras. La casilla es un cuadrado redondeado de 8 px. El **triángulo** es la forma de la marca: la montaña del logotipo, los picos y los banderines. No se mezclan esquinas rectas con redondeadas en una misma vista.

## Components

- **Botones:** un solo `button-primary` por pantalla (Pino profundo, 50 px de alto). `button-secondary` blanco con borde Outline. `button-tertiary` sin borde para acciones menores. `button-accent` en Terracota solo dentro de la ventana de celebración.
- **Tarjetas:** `card` blanca con borde de 1 px; `card-hero` en Cielo, sin borde; `card-empty` en Escarcha para estados vacíos.
- **Fila de tramo:** casilla de 44 px de área táctil a la izquierda, título en `label-lg` con metadato debajo ("De rutina · diario", "Único · vence hoy") y metros a la derecha. Hecha: casilla en Ladera con marca blanca y metros en Bosque. Pendiente: casilla blanca con borde Outline-strong de 2,5 px y metros en Piedra. No se tacha el texto.
- **Fichas de dato:** `stat-chip` blanca de 44 px con icono y texto: "Racha de 12 días", "2 refugios". El icono de refugio usa relleno Glaciar.
- **Campos:** 48 px de alto, borde Outline-strong de 1,5 px; en foco, borde Pino profundo de 2 px; en error, fondo Error-container, texto Error, icono y mensaje debajo.
- **Navegación:** marca a la izquierda (triángulo con nieve y la palabra Cumbre), cuatro destinos al centro (Hoy, Tramos, Expediciones, Bitácora), nivel y avatar a la derecha. El destino activo va en Pino profundo con texto blanco.
- **Pestañas:** control segmentado sobre Escarcha; la activa es blanca.
- **Barra de progreso:** pista de 10 px en Escarcha y relleno en Ladera, siempre acompañada de su número.
- **Avatar:** círculo de 44 px con inicial; Bosque para la cordada, Terracota para la persona usuaria.
- **Banderín (insignia):** triángulo sobre un asta. Ganado en Sol con tinta; bloqueado en Escarcha con texto Piedra y su criterio visible.
- **Ruta de expedición:** montaña con sendero en zigzag. Recorrido hecho en línea blanca continua, por recorrer en línea punteada. Campamento alcanzado: círculo Sol con marca. Posición actual: círculo Terracota viva con aro blanco y halo. Pendiente: círculo Ladera con aro blanco. Cumbre: banderín.
- **Cordada:** lista vertical de avatares unidos por una cuerda de 3 px en Terracota viva, cada uno con su barra de aporte. Orden de ingreso al equipo, nunca de clasificación.
- **Peldaños de la jornada:** cinco escalones ascendentes; hechos en Ladera, pendientes en Escarcha.
- **Ventanas:** `modal-celebration` blanca; `modal-summit` en Pino profundo, reservada al cierre de una expedición.

## Do's and Don'ts

- Usa Pino profundo para el único botón principal de cada pantalla.
- Acompaña cada palabra del mundo con la común la primera vez: "Refugio: protege tu racha".
- Dibuja el progreso hacia arriba; un día sin avance es un llano, nunca una caída.
- Muestra a la cordada en una sola posición de la ruta.
- Mantén a Kusi sobre fondos Cielo o Niebla, con su manta siempre visible.
- No uses degradados, sombras, emojis ni fotografías.
- No uses Terracota viva ni Sol como color de texto.
- No pongas cuentas regresivas ni mensajes de urgencia.
- No ordenes a los miembros de mejor a peor ni señales a nadie como último.
- No uses símbolos sagrados ni tejidos de una comunidad concreta como adorno o premio.

## Iconography

Iconos lineales de 2 a 2,5 px, extremos redondeados, en Pino profundo, sobre retícula de 20 px. Admiten un único relleno plano de acento. Repertorio: banderín (racha), refugio (protector), carpa (aclimatación), cuerda con nudo (cordada), montaña (expediciones), cuaderno (bitácora), ondas (eco), mojón de piedras (hallazgo), sol (jornada completa), mochila (perfil).

## Illustration & Mascot

Ilustración plana y geométrica, sin contorno, con formas grandes y pocos colores. Kusi se construye con rectángulos redondeados y óvalos: cuerpo en Wool, patas traseras en Wool-shade, copete y hocico en Fleece, mejillas en Blush, manta en Bosque con tres franjas (Sol, Fleece y Terracota viva). Seis estados: esperando, animando, feliz, celebrando, preocupada y descansando. Tamaño mínimo de 48 px; por debajo se usa solo la cabeza. Kusi nunca se enoja, nunca señala y nunca aparece cargada en exceso.

## Data Visualization

- **Altitud ganada:** área acumulada en Glaciar con línea Bosque de 3 px, puntos blancos y el último en Terracota viva con banderín. Siempre asciende.
- **Perfil de la travesía:** escalones día por día; aclimatación como rellano con carpa.
- **Aporte de la cordada:** barras horizontales con su número.
- **Cumplimiento por tramo de rutina:** barra con "5 de 7".
- Cada gráfica lleva título, cifra principal en texto y descripción alternativa.

## Motion

Movimientos cortos y con propósito: 200 ms al completar un tramo, 400 ms para sumar metros, 600 ms para que la cordada avance por la ruta. Curva de salida suave. Con movimiento reducido, todo pasa a cambios de estado sin desplazamiento.

## Voice & Copy

Voz de guía de montaña: frases cortas, tuteo, punto final. Anima con hechos ("Dos tramos más y la cordada sigue subiendo"). Tras una racha rota no reprocha: "El sendero sigue ahí. Tu mejor racha: 12 días."
