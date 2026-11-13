# Dirección visual: Cumbre

Este documento describe cómo se ve y cómo se mueve Cumbre: color, tipografía, formas, la mascota Kusi, la ilustración, las gráficas propias del mundo y las reglas de composición. Parte del tablero "C · Cumbre" del lienzo y lo extiende a las doce pantallas. Los valores exactos, listos para una herramienta, están en `DESIGN.md`.

## Tabla de contenidos

1. [Concepto](#1-concepto)
2. [Ambiente](#2-ambiente)
3. [Color](#3-color)
4. [Tipografía](#4-tipografía)
5. [Forma, borde y profundidad](#5-forma-borde-y-profundidad)
6. [La mascota: hoja de personaje de Kusi](#6-la-mascota-hoja-de-personaje-de-kusi)
7. [Ilustración y escenas](#7-ilustración-y-escenas)
8. [Iconografía](#8-iconografía)
9. [Visualización de datos](#9-visualización-de-datos)
10. [Movimiento](#10-movimiento)
11. [Sonido](#11-sonido)
12. [Composición](#12-composición)
13. [Accesibilidad](#13-accesibilidad)
14. [Qué hacer y qué no](#14-qué-hacer-y-qué-no)

---

## 1. Concepto

**Una mañana clara en la montaña: formas planas, aire frío y un solo color cálido que marca hacia dónde ir.**

| Es | No es |
| :--- | :--- |
| **Serena:** mucho aire, pocos elementos, tonos fríos | Un videojuego de aventuras con efectos y brillos |
| **Firme:** tipografía con peso, tinta casi negra, bordes definidos | Una postal turística con fotografías de paisajes |
| **Luminosa:** fondos claros, blanco en las tarjetas, sol ámbar | Alpinismo extremo, riesgo o épica dramática |

La regla que ordena todo: **lo cálido señala**. El terracota aparece solo donde está la persona o hacia donde va (su avatar, la posición de la cordada, el banderín de la cumbre). Todo lo demás es verde, gris azulado o blanco.

## 2. Ambiente

| Aspecto | Dirección |
| :--- | :--- |
| **Luz** | Media mañana en altura: fría, pareja, sin sombras duras |
| **Materiales que evoca** | Lana, piedra, tela de carpa, cuerda, papel de cuaderno de campo |
| **Textura** | Ninguna en la interfaz. Color plano en todo |
| **Profundidad** | Tres planos de paisaje por color, como un recorte de papel |
| **Referencias, dichas con palabras** | Señales de sendero pintadas a mano; mapas topográficos; carteles de parques naturales de formas planas; libretas de campo con cifras grandes |
| **Ritmo** | Lento. Pocas cosas se mueven y lo hacen con suavidad |

## 3. Color

Paleta tomada del tablero. Sin degradados.

| Nombre | Hex | Papel |
| :--- | :--- | :--- |
| Pino profundo | `#17302B` | Texto, botón principal, destino activo |
| Bosque | `#1F5F54` | Antetítulos, metros ganados, avatares, línea de gráfica, manta de Kusi |
| Ladera | `#2F7A6B` | Montaña, casilla completada, relleno de progreso |
| Ladera en sombra | `#256A5C` | Cara en sombra de la montaña, botón presionado |
| Glaciar | `#A9CFC6` | Montañas lejanas, área de altitud, ficha de refugio |
| Cielo | `#D6ECEE` | Fondo del bloque de bienvenida y de escenas |
| Niebla | `#EEF4F3` | Fondo de página |
| Escarcha | `#E4EEEC` | Pistas de barras, pestañas inactivas, estados vacíos |
| Blanco | `#FFFFFF` | Tarjetas, campos, nieve, sendero |
| Borde | `#D3E0DD` | Borde de tarjetas, divisores |
| Borde fuerte | `#6F8B85` | Borde de casillas y campos |
| Piedra | `#4F6661` | Texto secundario |
| Eje | `#B8CCC8` | Ejes de gráficas |
| Terracota | `#C4441F` | Acento con texto encima: avatar propio, botón de celebración |
| Terracota viva | `#D8502F` | Solo gráficos: banderín, posición actual, cuerda |
| Sol | `#F2B441` | Sol, campamentos alcanzados, banderines ganados |
| Lana | `#B8732F` | Cuerpo de Kusi |
| Lana oscura | `#8F5622` | Patas traseras de Kusi |
| Crema | `#FFF1DC` | Copete, hocico y pecho de Kusi |
| Rosa | `#F2A48C` | Mejillas e interior de las orejas de Kusi |
| Error | `#A3271B` | Texto e icono de error |
| Fondo de error | `#FBE9E4` | Fondo del campo con error |

**Proporción.** Claros (Niebla, Blanco, Cielo) 70 %; verdes 22 %; tinta 5 %; cálidos 3 %.

**Contraste calculado** con la fórmula de WCAG. El texto normal necesita 4,5:1.

| Texto | Fondo | Razón | Uso |
| :--- | :--- | :---: | :--- |
| Pino profundo | Blanco | 14,06 | Texto principal en tarjetas |
| Pino profundo | Niebla | 12,63 | Texto sobre la página, navegación |
| Pino profundo | Cielo | 11,44 | Saludo y párrafo de bienvenida |
| Pino profundo | Escarcha | 11,87 | Texto en estados vacíos |
| Pino profundo | Sol | 7,62 | Marca del campamento alcanzado, banderín |
| Pino profundo | Glaciar | 8,32 | Ficha de refugio |
| Piedra | Blanco | 6,17 | Metadatos |
| Piedra | Niebla | 5,54 | Nivel en la barra de navegación |
| Piedra | Escarcha | 5,21 | Pestaña inactiva, banderín bloqueado |
| Piedra | Cielo | 5,02 | Texto secundario en la bienvenida |
| Bosque | Blanco | 7,44 | Metros ganados |
| Bosque | Niebla | 6,68 | Botón terciario |
| Bosque | Cielo | 6,05 | Fecha en mayúsculas |
| Blanco | Pino profundo | 14,06 | Botón principal, destino activo |
| Blanco | Bosque | 7,44 | Inicial del avatar |
| Blanco | Ladera en sombra | 6,37 | Botón presionado |
| Blanco | Ladera | 5,10 | Marca de la casilla completada |
| Blanco | Terracota | 5,01 | Inicial del avatar propio, botón de celebración |
| Error | Fondo de error | 6,24 | Mensaje de error |

**No aptos para texto** (solo gráficos, siempre con otra señal): blanco sobre Terracota viva (4,11); Terracota viva sobre Cielo (3,35); Borde fuerte sobre Blanco (3,68, suficiente para bordes de controles, que piden 3:1). Terracota viva sobre Ladera apenas se distingue (1,24): por eso la posición actual lleva siempre aro blanco de 4 px.

## 4. Tipografía

Dos familias de Google Fonts, las del tablero.

| Familia | Pesos | Para qué | Por qué |
| :--- | :--- | :--- | :--- |
| **Bricolage Grotesque** | 700, 800 | Títulos, cifras, metros, botones | Trazo con carácter y mucho peso: se lee como una señal de sendero |
| **DM Sans** | 400, 500, 700 | Texto, etiquetas, navegación | Neutra y clara; deja el protagonismo a los títulos |

| Nivel | Familia | Tamaño | Peso | Interlineado | Uso |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `display-hero` | Bricolage Grotesque | 48 px | 800 | 1,05 | Saludo: "Hoy toca subir, Ana." |
| `display-figure` | Bricolage Grotesque | 44 px | 800 | 1 | Cifra grande: "640 m" |
| `headline-lg` | Bricolage Grotesque | 32 px | 800 | 1,1 | Título de página |
| `headline-md` | Bricolage Grotesque | 23 px | 700 | 1,2 | Título de tarjeta |
| `headline-sm` | Bricolage Grotesque | 18 px | 700 | 1,2 | Contadores, metros, botones, iniciales |
| `body-lg` | DM Sans | 18 px | 400 | 1,5 | Párrafo de bienvenida |
| `body-md` | DM Sans | 16 px | 400 | 1,5 | Texto general |
| `body-sm` | DM Sans | 14 px | 400 | 1,45 | Subtítulos y ayudas |
| `label-lg` | DM Sans | 16 px | 700 | 1,3 | Título de tramo, nombres |
| `label-md` | DM Sans | 15 px | 700 | 1,2 | Navegación, fichas |
| `label-sm` | DM Sans | 13 px | 500 | 1,3 | Metadatos |
| `label-caps` | DM Sans | 13 px | 700 | 1,2 | Fecha en mayúsculas, interletrado 0,08 em |

Reglas: como máximo dos pesos por pantalla en cada familia; nunca texto por debajo de 13 px; cifras con su unidad separada por un espacio ("640 m"); los títulos no llevan signos de exclamación; el saludo usa interletrado de -0,01 em.

## 5. Forma, borde y profundidad

| Elemento | Regla |
| :--- | :--- |
| Radios | 8 px en casillas; 12 px en botones, fichas, pestañas y campos; 24 px en tarjetas; 28 px en bienvenida y ventanas; círculo en avatares, campamentos y barras |
| Bordes | Tarjetas: 1 px en Borde. Casillas pendientes: 2,5 px en Borde fuerte. Campos: 1,5 px en Borde fuerte; 2 px en Pino profundo al enfocar |
| Sombras | Ninguna |
| Jerarquía | Por tono: Niebla (página), Blanco con borde (tarjeta), Cielo (bienvenida), Pino profundo (lo activo) |
| Forma de marca | El triángulo: logotipo, picos y banderines |
| Ventanas | Velo de Pino profundo al 60 %; ventana blanca de 520 px con radio de 28 px |

## 6. La mascota: hoja de personaje de Kusi

Kusi es una llama. Es un personaje original, de formas geométricas planas y sin contorno. Su nombre viene del quechua, donde se asocia con la alegría (conviene confirmarlo con hablantes). Su papel es el de quien conoce el camino y lleva la carga contigo: acompaña, no ordena.

**Construcción** (sobre un lienzo de 200 por 244):

| Parte | Forma | Color |
| :--- | :--- | :--- |
| Cuerpo | Rectángulo de 116 por 70 con radio de 34 | Lana |
| Cuello | Rectángulo vertical de 40 por 112 con radio de 20 | Lana |
| Cabeza | Óvalo de 62 por 54 | Lana |
| Orejas | Dos óvalos de 14 por 32, inclinados 16 grados hacia afuera; interior en Rosa | Lana y Rosa |
| Copete | Tres círculos solapados sobre la frente | Crema |
| Hocico | Óvalo de 32 por 22; nariz ovalada y boca de una línea en Pino profundo | Crema |
| Ojos | Círculos de 7,6 con un brillo blanco arriba a la derecha | Pino profundo |
| Mejillas | Círculos de 9 al 80 % de opacidad | Rosa |
| Pecho | Óvalo vertical en la base del cuello | Crema |
| Patas | Cuatro rectángulos de 14 de ancho con radio de 7; las traseras más oscuras; pezuñas en Pino profundo | Lana y Lana oscura |
| Cola | Círculo de 26 | Lana |
| Manta | Rectángulo de 50 por 56 con radio de 10 y tres franjas de 7: Sol, Crema y Terracota viva | Bosque |
| Borla | Círculo pequeño junto a la oreja | Terracota viva |
| Suelo | Óvalo ancho bajo las patas | Ladera |

**Proporciones.** La cabeza ocupa un cuarto de la altura. El cuello es largo, casi la mitad del total: es lo que la hace reconocible en tamaño pequeño. Siempre de tres cuartos, mirando hacia la derecha, hacia la ruta.

**Los seis estados.**

| Estado | Postura | Cara | Accesorio |
| :--- | :--- | :--- | :--- |
| Esperando | De pie, cuatro patas en el suelo | Ojos abiertos, boca neutra | Manta |
| Animando | Una pata delantera levantada, cuello inclinado hacia adelante | Orejas hacia adelante, sonrisa corta | Manta |
| Feliz | Cuello erguido, cola levantada | Ojos en arco, mejillas al 100 % | Manta |
| Celebrando | Salto corto, las cuatro patas en el aire, sombra separada en el suelo | Boca abierta, ojos en arco | Banderín terracota al lado; tres triángulos pequeños en Sol alrededor |
| Preocupada | De pie, cuello algo recogido | Orejas hacia los lados, cejas cortas inclinadas, mira hacia arriba | Farol encendido a sus pies |
| Descansando | Echada, patas dobladas bajo el cuerpo | Ojos cerrados en arco hacia abajo | Manta como abrigo, carpa detrás |

**Tamaños.** Cuerpo entero desde 96 px de alto. Entre 48 y 95 px, solo cabeza y cuello. Por debajo de 48 px, solo la cabeza. Nunca menos de 24 px.

**Kusi nunca:** se enoja, llora, señala con reproche, aparece cargada con bultos, viste trajes humanos, habla con un acento imitado ni aparece sin su manta salvo al descansar.

**Sobre la manta.** Son tres franjas genéricas. No reproduce el tejido de ninguna comunidad. Si en el futuro se quisiera usar un diseño textil real, corresponde hacerlo con asesoría y permiso.

## 7. Ilustración y escenas

Estilo: formas planas grandes, sin contorno, tres planos de profundidad, un sol circular en Sol. Máximo seis colores por escena.

| Pantalla | Escena |
| :--- | :--- |
| P01 Volver a la ruta | Amanecer al pie del sendero: Kusi esperando junto a un poste de señal; la montaña al fondo con el banderín |
| P02 Empezar la ascensión | La misma montaña vista de lejos, con el sendero punteado desde abajo |
| P03 Campamento base | Una carpa en Glaciar, Kusi al lado, tres piedras planas que representan los tres pasos |
| P04 Hoy | Kusi a la izquierda; a la derecha, la montaña con la ruta de la expedición principal y el sol |
| P07 Expediciones | Una montaña pequeña por tarjeta, con tres siluetas posibles (pico agudo, doble cima, meseta) para distinguir proyectos |
| P08 Detalle de expedición | La montaña grande con cuatro campamentos, la cumbre y la posición de la cordada |
| P09 Sumar a la cordada | Una cuerda horizontal con los avatares y un lugar vacío punteado |
| P11 Perfil | Franja de paisaje según la zona del nivel: valle, ladera, puna o nieve |
| P12 Celebración | Kusi celebrando. En la cumbre: fondo Pino profundo, estrellas blancas pequeñas, banderín y el libro abierto |

Sin expedición activa, la montaña de "Hoy" muestra la ruta personal: la cumbre es el siguiente nivel.

## 8. Iconografía

Trazo de 2 a 2,5 px, extremos y uniones redondeados, color Pino profundo, retícula de 20 px. Cada icono admite un solo relleno plano de acento.

| Icono | Significado | Acento |
| :--- | :--- | :--- |
| Banderín en asta | Racha de ascenso, banderines | Terracota viva |
| Refugio (techo a dos aguas con puerta) | Protector | Glaciar |
| Carpa | Día de aclimatación, campamento | Glaciar |
| Cuerda con nudo | Cordada, pedir cuerda | Terracota viva |
| Montaña con nieve | Expediciones | Ladera |
| Cuaderno | Bitácora | — |
| Ondas | Eco | — |
| Mojón de piedras | Hallazgo | Sol |
| Huella | Abrir huella, tramo clave | — |
| Mochila | Perfil | — |

Todo icono que transmite información va acompañado de texto.

## 9. Visualización de datos

El principio de Cumbre: **el progreso se dibuja hacia arriba**.

| Gráfica | Qué muestra | Codificación | Alternativa accesible |
| :--- | :--- | :--- | :--- |
| **Peldaños de la jornada** | Progreso de hoy (3 de 5) | Cinco escalones ascendentes. Hechos en Ladera; pendientes en Escarcha con borde. El último lleva un banderín | El contador "3 de 5" siempre visible |
| **Ruta de la expedición** | Avance del proyecto y sus hitos | Montaña con sendero en zigzag: línea blanca continua hasta la cordada, punteada después. Alcanzado: círculo Sol con marca. Actual: círculo Terracota viva con aro blanco y halo. Pendiente: círculo Ladera con aro blanco. Cumbre: banderín | Texto: "Campamento 3 · hito 3 de 5 · 18 de 30 tramos · 60 %" |
| **Cordada** | Aporte por miembro | Avatares en columna unidos por una cuerda de 3 px; barra horizontal por persona, proporcional a quien más aportó, con su número | Lista: "Ana, 7 tramos" |
| **Altitud ganada** | Metros acumulados por semana | Área en Glaciar, línea Bosque de 3 px, puntos blancos con borde; el último punto en Terracota viva con banderín. Eje en Eje | Cifra "640 m", "+120 m esta semana" y tabla de valores |
| **Perfil de la travesía** | Constancia día por día, últimas cinco semanas | Escalones: la altura de cada uno son los metros del día. Aclimatación: rellano con carpa. Refugio usado: rellano con refugio. Día en cero: llano | Resumen: "28 días activos de 35" |
| **Cumplimiento por tramo de rutina** | Ocurrencias cumplidas de cada recurrente | Barra horizontal con etiqueta "5 de 7" | La propia etiqueta |
| **Únicos y de rutina** | Reparto de lo completado | Dos barras con su cifra. No se usan gráficas circulares | Las cifras |

Datos de ejemplo de la altitud por semana: 80, 170, 250, 370, 520 y 640 m. Ninguna gráfica depende solo del color: alcanzado, actual y pendiente se distinguen por marca, aro y relleno.

## 10. Movimiento

| Evento | Duración | Qué se mueve |
| :--- | :---: | :--- |
| Completar un tramo | 200 ms | La casilla se llena desde el centro y aparece la marca |
| Sumar metros | 400 ms | La cifra cuenta hacia arriba |
| Llenar un peldaño | 250 ms | El escalón sube desde su base |
| Jornada completa | 500 ms | Kusi da un salto corto; el banderín se despliega |
| La cordada avanza | 600 ms | El punto recorre el sendero hasta su nueva posición |
| Alcanzar un campamento | 800 ms | El círculo pasa a Sol, aparece la marca y la carpa |
| Abrir una ventana | 250 ms | Aparece con un desplazamiento de 8 px hacia arriba |
| Altitud ganada al entrar | 700 ms | El área se dibuja de izquierda a derecha, una sola vez |

Curva general: salida suave, `cubic-bezier(0.2, 0, 0, 1)`. Nada rebota y nada se repite en bucle. Kusi solo se mueve en respuesta a una acción.

**Movimiento reducido.** Todas las animaciones pasan a cambios de estado con un fundido de 100 ms o menos. La cifra de metros cambia de golpe y la cordada aparece en su nueva posición.

## 11. Sonido

Opcional y apagado por defecto. Tres sonidos cortos, de menos de un segundo:

| Momento | Sonido |
| :--- | :--- |
| Completar un tramo | Un golpe suave de madera |
| Jornada completa | Una campanilla pequeña, dos notas ascendentes |
| Campamento o cumbre | Tres notas ascendentes de cuerda pulsada |

## 12. Composición

**Escritorio (1360 px).**

| Zona | Medida |
| :--- | :--- |
| Contenedor | 1296 px, centrado, margen de 32 px |
| Retícula | 12 columnas, canal de 20 px |
| Barra de navegación | 52 px. Marca a la izquierda, cuatro destinos al centro, nivel y avatar a la derecha |
| Bienvenida | Ancho completo, 340 px de alto mínimo. Kusi a la izquierda (200 px), texto y acciones al centro, montaña a la derecha (600 px) |
| Tarjetas | Tres de 4 columnas, 420 px de alto mínimo, relleno de 24 px, separación de 20 px |
| Pantallas de lista (P05, P07) | Lista en 8 columnas y resumen en 4 |
| Detalle de expedición (P08) | Ruta en 7 columnas, cordada en 5; tramos debajo a todo el ancho |
| Formularios (P01, P02) | Dos mitades: escena a la izquierda, formulario a la derecha con 400 px de ancho máximo |

**Teléfono (desde 360 px).** Una columna. Navegación fija abajo con cuatro destinos e icono con texto. Botón principal fijo sobre la navegación. En "Hoy": Kusi y saludo arriba, la ruta como franja de 120 px, luego las tarjetas apiladas. La gráfica de altitud conserva su cifra grande.

## 13. Accesibilidad

- Contraste de texto de 4,5:1 o más en todos los pares de la sección 3.
- Foco visible: aro de 2 px en Pino profundo con separación de 2 px; sobre fondos oscuros, aro blanco.
- Todo se puede usar con teclado; el orden de tabulación sigue el orden visual.
- Objetivos táctiles de 44 px como mínimo.
- Las casillas anuncian su estado: "Completado: Repasar apuntes de Redux".
- Cada gráfica tiene un título, una cifra en texto y una descripción alternativa.
- El significado nunca depende solo del color.
- El texto se puede ampliar al 200 % sin que se corte.
- Se respeta la preferencia de movimiento reducido.
- Las palabras del mundo llevan su explicación la primera vez.

## 14. Qué hacer y qué no

| Hacer | No hacer |
| :--- | :--- |
| Reservar el terracota para la persona y su destino | Usar terracota en botones comunes o en texto corrido |
| Dibujar el progreso hacia arriba | Mostrar caídas, descensos o barras que retroceden |
| Dejar aire: una idea por tarjeta | Llenar la bienvenida con más de tres fichas |
| Mostrar a la cordada como un solo punto | Repartir a los miembros por la ruta según su aporte |
| Usar colores planos y tres planos de paisaje | Degradados, sombras, texturas, fotografías o emojis |
| Mantener a Kusi serena y de tres cuartos | Expresiones exageradas, ropa humana o símbolos sagrados |
| Acompañar cada icono con texto | Confiar en que un icono se entiende solo |
| Terminar los títulos con punto | Signos de exclamación y mayúsculas sostenidas en títulos |
