---
version: alpha
name: Panal
description: Sistema de diseño de Panal, una plataforma gamificada para organizar y cumplir actividades. Estilo de pegatina, cálido y táctil. Cada actividad es una celda hexagonal y la mascota es Zum, una abeja.
colors:
  primary: "#FFC421"
  on-primary: "#2A1B0A"
  primary-label: "#5A3D00"
  primary-deep: "#E69A00"
  primary-strong: "#D98200"
  primary-soft: "#FFE08A"
  primary-container: "#FFF3C9"
  halo: "#FFF7D6"
  mascot-body: "#FFD23F"
  secondary: "#2A1B0A"
  on-secondary: "#FFFFFF"
  secondary-hover: "#4A3620"
  tertiary: "#2F6FB7"
  on-tertiary: "#FFFFFF"
  tertiary-container: "#DDF0FA"
  neutral: "#FBFAF6"
  surface: "#FFFFFF"
  on-surface: "#2A1B0A"
  on-surface-variant: "#6B5A45"
  surface-dim: "#F1EADB"
  heat-empty: "#EFE7D6"
  outline-soft: "#B9AA8C"
  link: "#8A5A00"
  member-nectar: "#E8751A"
  member-bark: "#6B3F12"
  coral: "#FF8A5B"
  error: "#B3261E"
  error-container: "#FDE7E3"
typography:
  headline-display:
    fontFamily: Fredoka
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.05
  headline-lg:
    fontFamily: Fredoka
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.1
  headline-md:
    fontFamily: Fredoka
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
  headline-sm:
    fontFamily: Fredoka
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.25
  body-lg:
    fontFamily: Nunito
    fontSize: 19px
    fontWeight: 700
    lineHeight: 1.4
  body-md:
    fontFamily: Nunito
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
  body-sm:
    fontFamily: Nunito
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.4
  label-lg:
    fontFamily: Nunito
    fontSize: 16px
    fontWeight: 800
    lineHeight: 1.2
  label-md:
    fontFamily: Nunito
    fontSize: 15px
    fontWeight: 800
    lineHeight: 1.2
  label-sm:
    fontFamily: Nunito
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1.3
  label-caps:
    fontFamily: Nunito
    fontSize: 14px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: 0.06em
  label-action:
    fontFamily: Fredoka
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1
rounded:
  xs: 5px
  sm: 12px
  md: 16px
  lg: 28px
  xl: 32px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 24px
  xxl: 40px
  gutter: 20px
  margin: 32px
  container: 1296px
  touch: 44px
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label-action}"
    rounded: "{rounded.full}"
    height: 50px
    padding: 26px
  button-primary-hover:
    backgroundColor: "{colors.secondary-hover}"
    textColor: "{colors.on-secondary}"
  button-primary-disabled:
    backgroundColor: "{colors.surface-dim}"
    textColor: "{colors.on-surface-variant}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-action}"
    rounded: "{rounded.full}"
    height: 50px
    padding: 26px
  button-secondary-hover:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-surface}"
  button-tertiary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.link}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 16px
  button-tertiary-hover:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.primary-label}"
  button-accent:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-action}"
    rounded: "{rounded.full}"
    height: 50px
    padding: 26px
  button-accent-hover:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.on-primary}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-hero:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.xl}"
    padding: 40px
  hero-title:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.headline-display}"
  hero-eyebrow:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-label}"
    typography: "{typography.label-caps}"
  page-title:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-lg}"
  card-title:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-md}"
  card-counter:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.headline-sm}"
  activity-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    height: 58px
  activity-row-done:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    height: 58px
  activity-meta:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-sm}"
  hex-check:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    size: 44px
  hex-check-done:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    size: 44px
  day-cell-empty:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary}"
    size: 76px
  day-cell-filled:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
    size: 76px
  points-chip:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-action}"
    rounded: "{rounded.full}"
    height: 32px
    padding: 12px
  points-chip-pending:
    backgroundColor: "{colors.surface-dim}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-action}"
    rounded: "{rounded.full}"
    height: 32px
    padding: 12px
  stat-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 16px
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 52px
    padding: 16px
  input-field-error:
    backgroundColor: "{colors.error-container}"
    textColor: "{colors.error}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 52px
    padding: 16px
  input-helper:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body-sm}"
  input-error-text:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.error}"
    typography: "{typography.body-sm}"
  nav-bar:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    height: 52px
  nav-item:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 20px
  nav-item-hover:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-surface}"
  nav-item-active:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 20px
  tab:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 16px
  tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 16px
  progress-track:
    backgroundColor: "{colors.surface-dim}"
    rounded: "{rounded.full}"
    height: 14px
  progress-fill:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.full}"
    height: 14px
  avatar:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.headline-sm}"
    rounded: "{rounded.full}"
    size: 44px
  member-cell-honey:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    size: 32px
  member-cell-nectar:
    backgroundColor: "{colors.member-nectar}"
    textColor: "{colors.on-surface}"
    size: 32px
  member-cell-sky:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    size: 32px
  member-cell-bark:
    backgroundColor: "{colors.member-bark}"
    textColor: "{colors.on-secondary}"
    size: 32px
  member-swatch:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.xs}"
    size: 16px
  hive-cell-empty:
    backgroundColor: "{colors.surface-dim}"
    textColor: "{colors.on-surface-variant}"
    size: 32px
  divider:
    backgroundColor: "{colors.outline-soft}"
    height: 2px
  heat-cell-none:
    backgroundColor: "{colors.heat-empty}"
    size: 26px
  heat-cell-low:
    backgroundColor: "{colors.primary-soft}"
    size: 26px
  heat-cell-mid:
    backgroundColor: "{colors.primary}"
    size: 26px
  heat-cell-full:
    backgroundColor: "{colors.primary-strong}"
    size: 26px
  heat-cell-rest:
    backgroundColor: "{colors.tertiary-container}"
    size: 26px
  badge-seal:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: 72px
  badge-seal-locked:
    backgroundColor: "{colors.surface-dim}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: 72px
  cheer-chip:
    backgroundColor: "{colors.tertiary-container}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 12px
  help-chip:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 12px
  celebration-modal:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.xl}"
    padding: 40px
    width: 520px
  celebration-banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.headline-lg}"
    rounded: "{rounded.lg}"
    padding: 24px
  tooltip:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 12px
  mascot-frame:
    backgroundColor: "{colors.halo}"
    rounded: "{rounded.full}"
    size: 240px
  mascot-zum:
    backgroundColor: "{colors.mascot-body}"
    textColor: "{colors.on-primary}"
    size: 144px
---

# Panal

## Overview

Panal es una plataforma web para organizar y cumplir actividades, sola o en equipo. Su idea central: **cada actividad es una celda hexagonal y cada celda llena construye algo que se ve**. El día es un panal pequeño, el proyecto es una colmena pintada con el color de quien llenó cada celda y la constancia es un mapa de celdas.

El estilo es de **cuaderno de pegatinas**: formas planas con contorno grueso de tinta marrón, sombra dura hacia abajo sin difuminar, fondo de papel crema y un solo color protagonista, el amarillo miel. Debe sentirse cálido, táctil y optimista. Está pensado para estudiantes universitarios: es lúdico, pero no infantil.

La mascota es Zum, una abeja redonda y sonriente. Zum no decora: su postura cambia según el progreso del día.

No hay degradados, brillos, vidrio esmerilado ni sombras difusas. No se usan emojis.

## Colors

La paleta gira alrededor de un amarillo miel sobre papel crema, con tinta marrón oscura para todo el texto y todos los contornos. El negro puro no existe en el sistema.

- **Primary, Miel (#FFC421):** color de marca. Fondo de la tarjeta principal, celdas completadas, relleno de barras y pestaña activa. Nunca se usa como color de texto sobre blanco.
- **Secondary, Tinta (#2A1B0A):** todo el texto principal, todos los contornos y el botón principal. Sobre Tinta, el texto va en blanco o en Miel.
- **Tertiary, Cielo (#2F6FB7):** acento frío. Avatar, anillo de foco, color de un miembro del equipo. Su versión clara, Ala (#DDF0FA), se usa en las alas de Zum, en los zumbidos y en los días de descanso.
- **Neutral, Papel (#FBFAF6):** fondo de todas las páginas. Las tarjetas van en blanco (#FFFFFF) encima.
- **Familia de la miel:** Miel clara (#FFE08A), Cera (#FFF3C9), Miel oscura (#E69A00) y Ámbar (#D98200). Juntas forman la escala de intensidad del mapa de constancia y distinguen las celdas del panal del día.
- **Corteza (#6B5A45):** texto secundario y metadatos. Es el tono más claro permitido para texto.
- **Lino (#F1EADB) y Lino claro (#EFE7D6):** celdas vacías de la colmena, pista de las barras y días sin actividad. El contorno de las celdas vacías usa Borde suave (#B9AA8C), que nunca se usa para texto.
- **Colores de miembro:** Miel (#FFC421), Néctar (#E8751A), Cielo (#2F6FB7) y Castaño (#6B3F12). Pintan las celdas de la colmena según quién las completó y siempre van acompañados de la inicial de la persona.
- **Coral (#FF8A5B):** mejillas de Zum y pedidos de ayuda. Avisa sin alarmar.
- **Error (#B3261E):** solo para errores de formulario, sobre blanco o sobre su fondo suave (#FDE7E3).

Todo par de texto y fondo cumple un contraste mínimo de 4,5:1. El color nunca es el único medio para distinguir un dato: las celdas completas llevan una marca, las de la colmena llevan la inicial y el mapa de constancia tiene leyenda.

## Typography

Dos familias de Google Fonts, ambas redondeadas, para que el texto tenga la misma suavidad que las formas.

- **Fredoka** (500, 600 y 700) para títulos, cifras, botones y el nombre de la marca. Da el carácter de pegatina.
- **Nunito** (600, 700 y 800) para todo lo demás. Se usa con pesos altos: el peso mínimo es 600, porque el contorno grueso de la interfaz pide un texto con cuerpo.

Reglas:

- El saludo de la pantalla Hoy usa `headline-display` (48 px). Solo hay un texto de ese tamaño por pantalla.
- Los títulos de tarjeta usan `headline-md` (24 px) y su contador, `headline-sm` (20 px) en Corteza.
- Los puntos ("+10", "+25") y los botones usan `label-action`, en Fredoka.
- La fecha y los rótulos pequeños sobre Miel usan `label-caps`: mayúsculas con espaciado amplio.
- Nada de cursivas ni de texto por debajo de 13 px.

## Layout

Retícula fluida con ancho máximo de 1296 px y márgenes laterales de 32 px. La separación entre bloques es de 20 px y el relleno interior de las tarjetas, de 24 px. La escala de espaciado es 4, 8, 12, 20, 24 y 40 px.

La pantalla Hoy se organiza en tres franjas: barra de navegación (52 px), tarjeta principal a todo el ancho (mínimo 340 px de alto) y una fila de tres tarjetas iguales. La fila pasa a dos columnas por debajo de 1100 px y a una sola por debajo de 720 px.

En teléfono la navegación baja al pie con cuatro destinos (Hoy, Celdas, Colmenas, Reportes), la tarjeta principal apila mascota, saludo y panal del día, y el botón principal queda fijo sobre la barra inferior. Toda zona pulsable mide al menos 44 px.

## Elevation & Depth

La profundidad se expresa como en una pegatina troquelada: **contorno de 2,5 px en Tinta y sombra dura de 6 px hacia abajo, del mismo color, sin difuminar**. No hay sombras suaves ni capas translúcidas.

Hay tres niveles:

1. **Plano:** elementos dentro de una tarjeta (filas, etiquetas). Sin contorno ni sombra.
2. **Pegatina:** tarjetas y tarjeta principal. Contorno de 2,5 px y sombra dura de 6 px.
3. **Pieza:** botones, fichas de dato y avatares. Contorno de 2,5 px sin sombra; al pulsarlos bajan 2 px.

La ventana de celebración usa el nivel de pegatina sobre un velo de Tinta al 40 % de opacidad.

## Shapes

El hexágono con una punta hacia arriba es la unidad del sistema: casilla de verificación, celda del panal, celda de la colmena, día del mapa y logotipo. Sus vértices están ligeramente redondeados por la unión del trazo.

Todo lo que no es hexágono es redondo y amable: los botones, las pestañas y las fichas son píldoras (radio completo), las tarjetas tienen radio de 28 px, la tarjeta principal de 32 px y los campos de texto de 16 px. No hay esquinas vivas en ningún lugar.

## Components

- **Botones.** El principal es una píldora de Tinta con texto blanco en Fredoka; hay uno solo por pantalla. El secundario es blanco con contorno de Tinta. El terciario es solo texto en Ámbar oscuro. El botón de acento, en Miel con texto de Tinta, se reserva para acciones dentro de tarjetas blancas.
- **Tarjeta.** Fondo blanco, contorno de Tinta, radio de 28 px, sombra dura. Título a la izquierda y contador a la derecha en la misma línea.
- **Tarjeta principal.** Fondo Miel. A la izquierda Zum dentro de un círculo de Cera clara; al centro la fecha, el saludo, una frase de progreso y las acciones; a la derecha el panal del día.
- **Fila de actividad.** A la izquierda un hexágono de 44 px que funciona como casilla: blanco si está pendiente, Miel con una marca de Tinta si está hecha. Al centro el título y debajo el tipo en Corteza ("Recurrente · diaria", "Única · vence hoy"). A la derecha los puntos en Fredoka.
- **Panal del día.** Tantas celdas grandes como la meta diaria (3, 5 o 7), encajadas en panal. Llenas en Miel oscura con una marca; vacías en Cera.
- **Fichas de dato.** Píldoras blancas con contorno, icono a la izquierda y texto: "Racha de vuelo: 12 días", "2 reservas de miel".
- **Colmena.** Rejilla de celdas en cinco filas (cada fila es un cuadro, un hito). Cada celda llena toma el color de quien la completó y lleva su inicial. Las vacías van en Lino con contorno suave. Debajo, la leyenda con el nombre y el número de celdas de cada miembro.
- **Panal de constancia.** Siete columnas (L a D) por cinco semanas, con las columnas alternas desplazadas media celda. Cuatro intensidades, de Lino a Ámbar. El día de hoy lleva contorno de Tinta; los días futuros, contorno punteado.
- **Campos de texto.** Blancos, contorno de Tinta, radio de 16 px, etiqueta arriba en `label-md`. Al enfocar, anillo exterior de 3 px en Cielo. En error, fondo rosado suave, texto y mensaje en rojo.
- **Navegación.** Logotipo a la izquierda, cuatro destinos en píldora al centro y, a la derecha, el nivel ("Nivel 4 · Exploradora") junto al avatar. El destino activo es una píldora de Tinta con texto Miel.
- **Pestañas.** Píldoras sobre Papel; la activa en Miel con contorno.
- **Sellos de cera (insignias).** Círculos de borde ondulado en Miel oscura con un icono de Tinta. Los no ganados, en Lino con el criterio escrito debajo.
- **Ventana de celebración.** Tarjeta centrada de 520 px con Zum arriba, título en Fredoka, la recompensa y un único botón principal.

## Do's and Don'ts

- Sí: usa Tinta (#2A1B0A) para todo el texto y todos los contornos.
- Sí: deja un solo botón principal por pantalla.
- Sí: acompaña cada color con una marca, una inicial o una etiqueta.
- Sí: usa el hexágono solo cuando representa una actividad o un día.
- Sí: mantén la misma barra de navegación en todas las pantallas.
- No: no uses degradados, sombras difusas, brillos ni efecto de vidrio.
- No: no uses negro puro ni grises fríos.
- No: no escribas texto en Miel sobre fondo blanco.
- No: no uses emojis; los iconos son lineales, de trazo redondeado.
- No: no llenes la pantalla de abejas: Zum aparece una vez por pantalla como máximo.
- No: no uses hexágonos como adorno de fondo.

## Iconography

Iconos lineales con trazo de 2 px en Tinta, extremos y uniones redondeados, con relleno plano opcional en un solo color de la paleta. Tamaño base de 20 px. Conjunto propio del mundo: gota de miel (puntos y racha), tarro (reserva de miel), hexágono (celda), flor (día sin flores y colección), colmena (proyecto), ala (zumbido), antenas (llamar al enjambre) y sello (insignia).

## Illustration & Mascot

Zum es una abeja construida con formas simples: cuerpo ovalado en amarillo (#FFD23F), dos franjas de Tinta como trazos gruesos curvos, dos alas ovaladas en Ala (#DDF0FA), antenas terminadas en bolita, ojos ovalados con un brillo blanco, sonrisa pequeña y mejillas en Coral. Contorno de Tinta proporcional al de la interfaz. Se presenta dentro de un círculo de Cera clara (#FFF7D6).

Tiene seis estados: esperando, animando, feliz, celebrando, preocupada y descansando. Nunca se enoja, nunca amenaza con el aguijón y nunca reprocha.

Las ilustraciones de apoyo (flores, tarros, colmena) siguen el mismo estilo: planas, con contorno, sin perspectiva ni textura.

## Data Visualization

Las gráficas se dibujan con celdas, no con formas genéricas. El progreso del día es un panal de tantas celdas como la meta; el avance del proyecto, una colmena coloreada por miembro; la constancia, un mapa hexagonal de cinco semanas. En reportes, las barras llevan contorno de Tinta y extremo redondeado, y las proporciones se muestran como tarros que se llenan.

Toda gráfica tiene título, una frase que la resume en texto, leyenda visible y una tabla equivalente accesible.

## Motion

Movimiento breve y elástico, como despegar y pegar una pegatina. Pulsar un botón dura 120 ms; llenar una celda, 280 ms; un salto de Zum, 400 ms. La celebración de panal cerrado dura 1,2 segundos como máximo. Con movimiento reducido no hay desplazamientos: solo cambios de estado con una transición de opacidad de 150 ms.

## Voice & Copy

Zum habla en segunda persona, con frases cortas y en positivo, y se incluye en el esfuerzo: "Dos más y cerramos el panal de hoy". Usa pocas palabras propias y siempre con su traducción cerca: celda (actividad), panal (tu día), colmena (proyecto), gotas de miel (puntos), reserva de miel (protector de racha). Nunca culpa: tras una racha rota dice "Tu mejor vuelo fue de 12 días. ¿Empezamos otro?".
