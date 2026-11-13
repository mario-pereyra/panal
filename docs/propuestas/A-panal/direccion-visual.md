# Dirección visual: Panal

Este documento fija cómo se ve y cómo se mueve Panal: ambiente, color, tipografía, forma, mascota, ilustración, iconos, gráficas, movimiento y composición. Parte del tablero "A · Panal" del lienzo y lo extiende a toda la aplicación. Los valores exactos, en formato legible por herramientas, están en `DESIGN.md`; aquí está el porqué de cada decisión.

## Tabla de contenidos

1. [Concepto](#1-concepto)
2. [Ambiente](#2-ambiente)
3. [Color](#3-color)
4. [Tipografía](#4-tipografía)
5. [Forma, borde y profundidad](#5-forma-borde-y-profundidad)
6. [La mascota: hoja de personaje de Zum](#6-la-mascota-hoja-de-personaje-de-zum)
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

**Un cuaderno de pegatinas de miel: cada cosa que cumples es una pegatina hexagonal que se queda pegada.**

- **Cálido:** amarillo miel sobre papel crema; tinta marrón en lugar de negro.
- **Táctil:** contornos gruesos y sombra dura; todo parece una pieza que se puede despegar y pegar.
- **Optimista:** formas redondas, una mascota sonriente y mucho aire entre bloques.

**Lo que no es.** No es infantil (sin arcoíris ni una abeja en cada esquina). No es corporativo (sin grises fríos ni sombras difusas). No es tridimensional (sin brillos, volúmenes ni degradados). Y no es un juego: es una herramienta de trabajo con espíritu de juego, donde los datos mandan.

## 2. Ambiente

| Aspecto | Dirección |
| :--- | :--- |
| **Materiales** | Papel grueso color crema, pegatinas troqueladas, cera de abeja, tarros de vidrio dibujados en plano |
| **Luz** | De media mañana, pareja y sin dramatismo. No hay reflejos: el relieve lo da la sombra dura |
| **Textura** | Ninguna fotográfica. La única "textura" es la repetición del hexágono cuando representa datos |
| **Línea** | Trazo uniforme de tinta, extremos y uniones redondeados, como dibujado con un marcador grueso |
| **Temperatura** | Cálida. El único color frío es el azul de las alas y del acento, que da descanso al ojo |
| **Referencias descritas** | Un álbum de cromos a medio llenar; la etiqueta de un tarro de miel artesanal; un tablero de juego de mesa moderno; un sello de lacre sobre un sobre |

## 3. Color

| Nombre | Hex | Rol |
| :--- | :--- | :--- |
| Miel | `#FFC421` | Color de marca: tarjeta principal, celda hecha, relleno de barras, pestaña activa |
| Miel de Zum | `#FFD23F` | Cuerpo de la mascota |
| Miel oscura | `#E69A00` | Celdas llenas del panal de hoy, sellos de cera |
| Ámbar | `#D98200` | Nivel máximo del panal de constancia |
| Miel clara | `#FFE08A` | Nivel bajo del panal de constancia, ficha de puntos |
| Cera | `#FFF3C9` | Celdas vacías sobre miel, estados al pasar el cursor |
| Cera clara | `#FFF7D6` | Círculo detrás de Zum |
| Tinta | `#2A1B0A` | Todo el texto principal, todos los contornos, botón principal |
| Tinta suave | `#4A3620` | Botón principal al pasar el cursor |
| Corteza | `#6B5A45` | Texto secundario y metadatos |
| Rótulo | `#5A3D00` | Texto pequeño sobre miel (fecha en mayúsculas) |
| Ámbar oscuro | `#8A5A00` | Enlaces y botón de solo texto |
| Papel | `#FBFAF6` | Fondo de página |
| Blanco | `#FFFFFF` | Tarjetas y campos |
| Lino | `#F1EADB` | Celdas vacías de la colmena, pista de las barras |
| Lino claro | `#EFE7D6` | Día sin actividad en el panal de constancia |
| Borde suave | `#B9AA8C` | Contorno de celdas vacías y de días futuros |
| Cielo | `#2F6FB7` | Acento frío: avatar, foco, color de un miembro |
| Ala | `#DDF0FA` | Alas de Zum, zumbidos, día sin flores |
| Néctar | `#E8751A` | Color de un miembro |
| Castaño | `#6B3F12` | Color de un miembro |
| Coral | `#FF8A5B` | Mejillas de Zum, llamada al enjambre |
| Error | `#B3261E` | Errores de formulario |
| Fondo de error | `#FDE7E3` | Campo con error |

**Proporción.** En una pantalla típica: 60 % papel y blanco, 25 % miel y su familia, 10 % tinta y 5 % acentos. La tarjeta principal de "Hoy" es la única superficie grande en miel.

**Contraste calculado** (fórmula WCAG 2; el mínimo para texto normal es 4,5:1).

| Texto | Fondo | Razón | Uso |
| :--- | :--- | :---: | :--- |
| Tinta | Blanco | 16,67:1 | Texto en tarjetas |
| Tinta | Papel | 15,96:1 | Texto sobre la página |
| Tinta | Cera | 15,02:1 | Celdas vacías y estados suaves |
| Tinta | Miel clara | 12,93:1 | Ficha de puntos |
| Tinta | Miel | 10,46:1 | Título y texto de la tarjeta principal |
| Tinta | Coral | 7,18:1 | Llamada al enjambre |
| Tinta | Miel oscura | 7,13:1 | Marca en celdas llenas, sellos |
| Tinta | Ámbar | 5,67:1 | Punto sobre el nivel máximo del mapa |
| Tinta | Néctar | 5,55:1 | Inicial en celdas de ese miembro |
| Blanco | Tinta | 16,67:1 | Botón principal |
| Miel | Tinta | 10,46:1 | Destino activo de la navegación |
| Blanco | Castaño | 8,96:1 | Inicial en celdas de ese miembro |
| Blanco | Cielo | 5,15:1 | Avatar, inicial en celdas de ese miembro |
| Corteza | Blanco | 6,62:1 | Texto secundario |
| Corteza | Lino | 5,52:1 | Sello no ganado, botón desactivado |
| Rótulo | Miel | 6,26:1 | Fecha en la tarjeta principal |
| Ámbar oscuro | Papel | 5,67:1 | Enlaces y botón de solo texto |
| Error | Blanco | 6,54:1 | Mensaje de error |
| Error | Fondo de error | 5,51:1 | Texto dentro del campo con error |

**Combinaciones prohibidas:** miel como texto sobre blanco (1,59:1), blanco sobre Néctar (3,00:1) y tinta sobre Cielo (3,24:1). Sobre Néctar se escribe en tinta; sobre Cielo, en blanco.

**Colores de miembro.** Se asignan en este orden al unirse al proyecto: Miel, Néctar, Cielo y Castaño. Si un enjambre supera cuatro personas se añaden Hoja `#2E7D4F` y Ciruela `#8E4A9E`, las dos con inicial en blanco (5,05:1 y 5,80:1).

## 4. Tipografía

Dos familias de Google Fonts, las dos de terminaciones redondeadas: **Fredoka** (500, 600 y 700) para la marca, los títulos, las cifras y los botones, y **Nunito** (600, 700 y 800) para el texto corrido, las etiquetas y la navegación.

| Nivel | Familia | Tamaño | Peso | Interlínea | Uso |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `headline-display` | Fredoka | 48 px | 700 | 1,05 | Saludo de "Hoy". Uno por pantalla |
| `headline-lg` | Fredoka | 32 px | 700 | 1,1 | Título de página y de celebración |
| `headline-md` | Fredoka | 24 px | 600 | 1,2 | Título de tarjeta |
| `headline-sm` | Fredoka | 20 px | 600 | 1,25 | Contadores ("3 de 5", "60 %"), inicial del avatar |
| `label-action` | Fredoka | 18 px | 600 | 1 | Botones y puntos ("+10") |
| `body-lg` | Nunito | 19 px | 700 | 1,4 | Frase de progreso de la tarjeta principal |
| `body-md` | Nunito | 16 px | 600 | 1,5 | Texto general y campos |
| `body-sm` | Nunito | 14 px | 700 | 1,4 | Descripciones de tarjeta, ayudas |
| `label-lg` | Nunito | 16 px | 800 | 1,2 | Navegación, título de cada actividad |
| `label-md` | Nunito | 15 px | 800 | 1,2 | Fichas de dato, pestañas, nivel |
| `label-sm` | Nunito | 13 px | 700 | 1,3 | Tipo de actividad, leyendas |
| `label-caps` | Nunito | 14 px | 800 | 1,2 | Fecha y rótulos en mayúsculas, espaciado de 0,06 em |

**Reglas.**

- El peso mínimo es 600: un contorno de 2,5 px junto a un texto fino se ve desequilibrado.
- Las cifras importantes siempre van en Fredoka, porque son parte del dibujo.
- Las mayúsculas se reservan para `label-caps`; los títulos van en tipo oración.
- Tamaño mínimo de 13 px y largo de línea máximo de 60 caracteres.

## 5. Forma, borde y profundidad

**El hexágono** es la unidad del sistema y solo se usa cuando representa una actividad o un día. Se dibuja con una punta hacia arriba en las casillas, el panal de hoy y la colmena. En el panal de constancia se acuesta (lado plano arriba) para que cada columna sea un día de la semana y las columnas alternas bajen media celda.

| Hexágono | Radio | Contorno |
| :--- | :---: | :--- |
| Celda del panal de hoy | 38 px | 5 px de tinta |
| Casilla de una fila | 18 px, dentro de un área pulsable de 44 px | 3 px de tinta |
| Celda de la colmena | 16 px | 2 px de tinta; vacía, 2 px en borde suave |
| Día del panal de constancia | 13 px | Sin contorno; hoy, 2,5 px de tinta |

**Lo demás es redondo.** Botones, fichas, pestañas y destinos de navegación son píldoras. La tarjeta principal tiene radio de 32 px; las tarjetas, 28 px; los campos de texto, 16 px; los globos de ayuda, 12 px; y las muestras de color de las leyendas, 5 px.

**Borde.** 2,5 px en tinta para toda pieza que "se puede despegar": tarjetas, botones, fichas y avatar. Dentro de una tarjeta no hay líneas divisorias; la separación se hace con espacio.

**Profundidad.** Una sola receta: sombra dura de 6 px hacia abajo, en tinta, sin difuminar (`box-shadow: 0 6px 0 #2A1B0A`). La llevan la tarjeta principal y las tarjetas. Los botones no llevan sombra: al pulsarlos bajan 2 px. La ventana de celebración flota sobre un velo de tinta al 40 %.

## 6. La mascota: hoja de personaje de Zum

**Quién es.** Zum es una abeja joven, curiosa y de buen humor. Acompaña, señala y celebra. No manda ni evalúa.

**Construcción geométrica** (sobre un lienzo de 220 unidades).

| Parte | Forma | Color |
| :--- | :--- | :--- |
| Fondo | Círculo de radio 106 | Cera clara `#FFF7D6` |
| Cuerpo | Óvalo de 144 de ancho por 132 de alto, apenas más ancho que alto | Miel de Zum `#FFD23F` |
| Franjas | Dos trazos curvos gruesos (15 y 13 unidades) en la mitad inferior, con extremos redondos | Tinta |
| Alas | Dos óvalos de 52 por 80, inclinados 35 grados hacia afuera, detrás del cuerpo | Ala `#DDF0FA` |
| Antenas | Dos curvas hacia afuera rematadas en una bolita de radio 7 | Tinta |
| Ojos | Dos óvalos verticales de 14 por 18, separados 44 unidades, con un brillo blanco | Tinta y blanco |
| Boca | Arco pequeño de 18 unidades de ancho | Tinta |
| Mejillas | Dos óvalos de 18 por 12 al 60 % de opacidad | Coral `#FF8A5B` |
| Aguijón | Triángulo mínimo en la base | Tinta |
| Contorno | 5 unidades en todas las formas (2,3 % del lienzo) | Tinta |

**Proporciones clave.** El cuerpo ocupa dos tercios del ancho. Los ojos quedan en el tercio superior del cuerpo y las franjas en el inferior: la cara siempre está despejada. Zum es casi toda cabeza, y por eso se lee incluso en tamaños pequeños.

**Los seis estados.**

| Estado | Cuerpo y alas | Cara | Elemento extra |
| :--- | :--- | :--- | :--- |
| **Esperando** | Posada, alas a media altura, antenas quietas | Ojos abiertos de frente, sonrisa pequeña | Borde de un panal bajo sus patas |
| **Animando** | Inclinada 10 grados hacia la lista; una antena estirada como si señalara | Ojos hacia la celda sugerida, sonrisa abierta | Línea punteada desde la antena |
| **Feliz** | En vuelo, alas altas y abiertas, inclinada 6 grados | Sonrisa amplia, mejillas más marcadas | Dos trazos cortos de movimiento junto a las alas |
| **Celebrando** | Alas arriba del todo, cuerpo un poco estirado | Ojos cerrados en arco, boca abierta | Tres gotas de miel y dos hexágonos pequeños |
| **Preocupada** | Alas bajas, cuerpo apenas encogido | Cejas levantadas hacia el centro, boca en línea corta | Un tarro de reserva pequeño al que mira de reojo |
| **Descansando** | Acurrucada dentro de una celda, alas plegadas | Ojos cerrados en arco hacia abajo | La celda en cera; nada más |

**Tamaños.**

| Tamaño | Uso | Simplificación |
| :---: | :--- | :--- |
| 240 px | Tarjeta principal de escritorio, ventana de celebración | Completa |
| 120 px | Teléfono, estados vacíos, inicio de sesión | Completa, contorno de 3 px |
| 64 px | Ficha "Zum sugiere", avisos | Sin círculo de fondo ni aguijón |
| 32 px | Icono de aplicación | Solo la cara: óvalo, ojos, antenas y una franja |

**Lo que Zum nunca hace.**

- No se enoja, no llora y no pone cara de decepción.
- No usa el aguijón como gesto, ni lleva corona, casco o herramientas: no es reina ni obrera de fábrica.
- No aparece más de una vez por pantalla, no tapa un dato y no habla más de dos líneas.
- No se dibuja con degradados, brillo de volumen ni perspectiva.

## 7. Ilustración y escenas

Todas las ilustraciones usan el mismo lenguaje que Zum: formas planas, contorno de tinta, paleta de la tabla y ningún fondo de paisaje.

| Pantalla | Escena |
| :--- | :--- |
| P01 y P02, acceso | Mitad izquierda en miel: Zum saluda desde la entrada de una colmena (P01) o sostiene una celda vacía (P02) |
| P03 Primer vuelo | Tres panales lado a lado, de 3, 5 y 7 celdas; en el último paso, una celda grande para llenar |
| P04 Hoy | Zum en su círculo a la izquierda; panal de hoy a la derecha |
| P07 Colmenas | Cada tarjeta lleva su colmena en miniatura; abajo, el colmenar como un estante de tarros |
| P08 Colmena | La colmena grande con sus cinco cuadros y lo que cada hito añade: flores, abejas, gotas |
| P11 Mi vuelo | La alacena: un estante con doce tarros, llenos o en silueta |
| P12 Celebración | Zum celebrando sobre el motivo del logro: panal sellado, sello de cera, tarro o enjambre en vuelo |
| Estados vacíos | Un panal sin miel y una flor pequeña a su lado; nunca una Zum triste |

**Objetos recurrentes.** Tarro (cilindro bajo con tapa y etiqueta), flor (cinco pétalos redondos y un centro), gota (lágrima con contorno) y sello de cera (círculo de borde ondulado con un icono).

## 8. Iconografía

Trazo de 2 px en tinta, con extremos y uniones redondeados y relleno plano opcional en un solo color de la paleta. Lienzo de 20 px con 2 px de margen; en botones, 18 px. Siempre van acompañados de texto, salvo la casilla hexagonal, que lleva etiqueta accesible.

Conjunto del mundo: gota (gotas de miel y racha de vuelo), tarro (reserva de miel y alacena), hexágono (celda), colmena (proyecto), flor (día sin flores y flor rara), ala (zumbido), antenas (llamar al enjambre), sello (sellos de cera), barras con contorno (reportes) y luna (invernada). No se usan emojis en ningún lugar de la interfaz.

## 9. Visualización de datos

Principio: **las gráficas se dibujan con celdas**. Cada celda es una unidad contable, así que la gráfica se puede leer contando.

| Gráfica | Qué responde | Codificación | Alternativa accesible |
| :--- | :--- | :--- | :--- |
| **Panal de hoy** | ¿Cuánto llevo de mi meta? | Una celda por actividad de la meta. Llena: miel oscura con marca. Vacía: cera. Sellada: llena con una tapa de trazo | Texto "3 de 5 celdas llenas" |
| **Colmena** | ¿Cuánto falta y quién aportó? | Una celda por actividad del proyecto, en cinco filas. Color e inicial de quien la completó. Vacías en lino. Rótulo "Cuadro 3 de 5" | Leyenda con celdas por miembro; tabla de aportes |
| **Panal de constancia** | ¿Qué tan constante fui? | Siete columnas por cinco semanas. Cuatro tonos por proporción de la meta | Leyenda; tabla por semana |
| **Tira de celdas** | ¿Cómo voy con esta actividad? | Siete celdas pequeñas, una por día, con el porcentaje al lado | El texto "6 de 7 · 86 %" |
| **Celdas por día** | ¿Cómo fue mi semana? | Columnas con contorno de tinta y extremo redondo; la cifra encima | "21 celdas esta semana. Tu mejor día fue el jueves." |
| **Tarros** | ¿Cuántas únicas y cuántas de ronda? | Dos tarros que se llenan en proporción, con la cifra en la etiqueta | Las dos cifras en texto |
| **Escalera de oficios** | ¿En qué nivel estoy? | Diez celdas en fila, llenas hasta el nivel actual; debajo, una barra con las gotas que faltan | "Nivel 4 de 10 · faltan 60 gotas" |

**Escala del panal de constancia.**

| Estado del día | Color | Señal adicional |
| :--- | :--- | :--- |
| Sin actividad | Lino claro `#EFE7D6` | Ninguna |
| Día de vuelo, menos de la mitad de la meta | Miel clara `#FFE08A` | Ninguna |
| La mitad o más de la meta | Miel `#FFC421` | Ninguna |
| Panal cerrado | Ámbar `#D98200` | Punto de tinta en el centro |
| Día sin flores | Ala `#DDF0FA` | Ninguna |
| Reserva de miel usada | Ala `#DDF0FA` | Gota pequeña de tinta |
| Hoy | Su color | Contorno de tinta de 2,5 px |
| Días futuros | Sin relleno | Contorno punteado en borde suave |

**Reglas comunes.** Cada gráfica tiene título, una frase que la resume, leyenda visible y texto alternativo. No hay ejes decorativos, rejillas ni efectos de volumen. Al pasar el cursor por una celda aparece un globo de tinta con la fecha y el dato.

## 10. Movimiento

El movimiento imita el gesto de pegar una pegatina: rápido, con un pequeño rebote al final.

| Momento | Qué ocurre | Duración | Curva |
| :--- | :--- | :---: | :--- |
| Pulsar un botón | Baja 2 px y vuelve | 120 ms | `ease-out` |
| Llenar una celda | La miel sube desde la base con un recorte; la marca se dibuja al final | 280 ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| Celda del panal de hoy | La celda correspondiente crece al 108 % y vuelve | 320 ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Gotas ganadas | "+10" sube 12 px y se desvanece | 600 ms | `ease-out` |
| Danza de Zum | Un ocho de unos 80 px; luego se inclina hacia la fila | 900 ms | `ease-in-out` |
| Panal cerrado | Las tapas de cera caen una a una, de izquierda a derecha | 1,2 s en total | Rebote suave |

**Reglas.**

- Ninguna animación bloquea: la interfaz responde mientras se reproduce.
- Como máximo una animación llamativa a la vez.
- **Movimiento reducido** (`prefers-reduced-motion` o el ajuste propio): sin desplazamientos, rebotes ni ocho. Solo cambios de estado con una transición de opacidad de 150 ms. Zum aparece directamente en su postura final.

## 11. Sonido

Opcional y apagado por defecto; se activa en "Mi vuelo". Llenar una celda suena como un "pop" corto y grave; cerrar el panal, como tres notas ascendentes de marimba; recibir un zumbido, como un zumbido breve de 200 ms; y un nuevo oficio o un cuadro cerrado, como un acorde cálido de un segundo. Ningún sonido se repite más de una vez por segundo ni suena en errores.

## 12. Composición

**Escritorio (tablero de 1360 px).**

| Franja | Alto | Contenido |
| :--- | :---: | :--- |
| Navegación | 52 px | Marca a la izquierda, cuatro destinos al centro, nivel y avatar a la derecha |
| Tarjeta principal | 340 px mínimo | Zum (240 px), bloque de saludo flexible, panal de hoy (276 px) |
| Fila de tarjetas | 420 px mínimo | Tres columnas iguales: celdas de hoy, colmena, constancia |

Ancho máximo de 1296 px, márgenes de 32 px, separación de 20 px y relleno de tarjeta de 24 px (40 px en la tarjeta principal). Las otras pantallas reutilizan dos plantillas: lista con columna de resumen (P05, P07, P08) y tablero de tarjetas (P10, P11). Las ventanas (P06, P09, P12) miden entre 480 y 560 px de ancho.

**Puntos de corte.**

| Ancho | Comportamiento |
| :--- | :--- |
| 1100 px o más | Tres columnas |
| 720 a 1099 px | Dos columnas; la tarjeta de constancia baja a la segunda fila |
| Menos de 720 px | Una columna; navegación inferior con cuatro destinos; Zum a 120 px sobre el saludo; el panal de hoy bajo la frase; botón principal fijo sobre la barra inferior |

## 13. Accesibilidad

- **Contraste de texto:** todos los pares de la sección 3 superan 4,5:1.
- **Color nunca solo:** marca en las celdas hechas, inicial en las celdas de la colmena, punto en los días de panal cerrado y leyenda en todas las gráficas.
- **Contorno de celdas vacías:** el borde suave `#B9AA8C` da 2,28:1 sobre blanco. El dato equivalente siempre está en texto ("18 de 30"). Si se exige 3:1 también para ese contorno, se sustituye por `#9A8A68` (3,38:1).
- **Teclado y tacto:** todo se alcanza con tabulador; el foco es un anillo de 3 px en Cielo, separado 2 px del elemento; las áreas pulsables miden 44 px como mínimo, incluida la casilla hexagonal.
- **Lectores de pantalla:** cada casilla anuncia "Marcar como completada" o "Completada" más el título; cada gráfica tiene `role="img"` con una descripción y una tabla equivalente; el saludo de Zum es texto real.
- **Movimiento e idioma:** el movimiento reducido está en la sección 10; las palabras propias llevan su explicación la primera vez que aparecen.

## 14. Qué hacer y qué no

| Sí | No |
| :--- | :--- |
| Tinta para todo el texto y todos los contornos | Negro puro o grises fríos |
| Sombra dura de 6 px, sin difuminar | Sombras suaves, brillos o vidrio |
| Colores planos | Degradados de cualquier tipo |
| Hexágonos solo para actividades y días | Hexágonos como patrón de fondo o adorno |
| Zum una vez por pantalla, con una función | Zum repetida, de relleno o tapando datos |
| Un botón principal por pantalla | Varias acciones compitiendo |
| Cifras en Fredoka, texto en Nunito | Una tercera familia tipográfica |
| Miel para fondos y rellenos | Miel como color de texto sobre blanco |
| Inicial y leyenda junto a cada color de miembro | Distinguir personas solo por color |
| Iconos lineales con texto | Emojis |
| Mensajes que acompañan | Mensajes que culpan o apuran |
