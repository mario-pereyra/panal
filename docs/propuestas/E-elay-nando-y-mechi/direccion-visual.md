# Dirección visual: Elay con Nando y Mechi

Cómo se ve y se mueve este mundo: color, tipografía, forma, personajes, gráficas y movimiento. Sale del tablero "E · Elay con Nando y Mechi" del lienzo y lo extiende a todas las pantallas. Los valores exactos para herramientas están en `DESIGN.md`; aquí está el criterio.

## Tabla de contenidos

1. [Concepto](#1-concepto)
2. [Ambiente](#2-ambiente)
3. [Color](#3-color)
4. [Tipografía](#4-tipografía)
5. [Forma, borde y profundidad](#5-forma-borde-y-profundidad)
6. [Los personajes: hoja de Nando y Mechi](#6-los-personajes-hoja-de-nando-y-mechi)
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

**Una galería de arcos a la sombra, con el tajibo en flor al fondo y dos amigos que te reciben.**

| | |
| :--- | :--- |
| **Tres adjetivos** | Cálida, luminosa, cercana |
| **Lo que es** | Plana, geométrica, de colores llenos; verde y blanco con acentos de rosado tajibo |
| **Lo que no es** | Postal turística, disfraz folclórico, ilustración infantil, caricatura |

La bandera cruceña es verde, blanca y verde. De ahí sale la base: verde para lo que estructura, blanco para lo que contiene. El rosado del tajibo es el acento, y aparece donde hay logro.

## 2. Ambiente

| Aspecto | Decisión |
| :--- | :--- |
| **Luz** | Media mañana con sombra fresca. Fondos claros, nunca blancos de pantalla: un blanco con una gota de verde |
| **Materiales** | Paja tejida del sombrero, algodón blanco de la camisa, cal de las paredes, barro del horno. Se traducen en colores planos, sin textura fotográfica |
| **Arquitectura** | El arco de medio punto de las galerías del centro. Es el marco de cada personaje y la forma de las tarjetas destacadas |
| **Vegetación** | Flor de tajibo de cinco pétalos redondos. Es el signo de logro y la unidad del mapa de constancia |
| **Ritmo** | Espacioso. Una idea por tarjeta, mucho aire entre bloques |
| **Humor** | Sonrisa, no carcajada. Los personajes son simpáticos sin hacer muecas |

Referencias descritas, no copiadas: carteles de fiesta patronal impresos a dos tintas, ilustración editorial plana de formas recortadas, señalética de mercado pintada a mano. No se toma ningún personaje, logotipo ni composición de otra marca.

## 3. Color

### Paleta

| Nombre | Hex | Rol |
| :--- | :--- | :--- |
| **Verde Elay** | `#0D7339` | Marca, botón principal, progreso, arco de Nando |
| Verde monte | `#0A4D27` | Estado presionado, texto sobre tintes verdes |
| Verde hoja | `#1FA24A` | Solo ilustración: vestido de Mechi, pañoleta de Nando |
| Verde brote | `#3DBE6B` | Solo ilustración: volados del vestido |
| Tinte de sombra | `#DDEFE2` | Fondo de la portada |
| Tinte suave | `#E3F1E7` | Fichas, filas hechas, pista de las barras |
| Línea | `#CFE0D5` | Bordes de tarjetas y separadores |
| **Rosado tajibo** | `#C2255C` | Acento de logro, enlaces destacados, palabra del día |
| Flor | `#E8457C` | Solo ilustración: flores y cinta |
| Rosado claro | `#F7A8C4` | Arco de Mechi, flores pequeñas de la florada |
| Tinte rosado | `#FDE7EF` | Fondo de la ficha "Palabra de hoy" |
| Vino | `#8A1740` | Texto sobre tinte rosado |
| **Sol** | `#FFC533` | Centro de las flores, día redondo, yapa |
| Naranja | `#F58A1F` | Avance hacia la siguiente etapa del buri |
| Crema | `#FFF3DC` | Fondo del chip de cuñapés |
| Tostado | `#7A4A00` | Texto del chip de cuñapés |
| Paja | `#F5DE9F` | Solo ilustración: sombrero de saó |
| Piel | `#C8875A` | Solo ilustración |
| **Tinta** | `#10261A` | Texto principal |
| Tinta suave | `#4C6355` | Texto secundario |
| Fondo | `#F7FAF6` | Fondo de página |
| Superficie | `#FFFFFF` | Tarjetas |
| Error | `#B3261E` | Mensajes de error |

Proporción en pantalla: 60 % fondo y superficie, 25 % verdes, 10 % tinta, 5 % rosado y sol. El rosado se gana: si está en todas partes deja de significar logro.

### Contraste

Razones calculadas con la fórmula de WCAG. El mínimo para texto normal es 4,5:1.

| Texto | Fondo | Razón | Uso |
| :--- | :--- | :---: | :--- |
| Tinta `#10261A` | Superficie `#FFFFFF` | 15,98 | Texto de tarjetas |
| Tinta `#10261A` | Fondo `#F7FAF6` | 15,19 | Texto de página |
| Tinta `#10261A` | Tinte de sombra `#DDEFE2` | 13,33 | Título de la portada |
| Tinta suave `#4C6355` | Superficie `#FFFFFF` | 6,52 | Texto secundario |
| Tinta suave `#4C6355` | Tinte de sombra `#DDEFE2` | 5,44 | Texto secundario en la portada |
| Tinta suave `#4C6355` | Tinte suave `#E3F1E7` | 5,59 | Ayuda dentro de las fichas |
| Blanco `#FFFFFF` | Verde Elay `#0D7339` | 5,95 | Botón principal |
| Blanco `#FFFFFF` | Verde monte `#0A4D27` | 9,98 | Botón presionado |
| Verde Elay `#0D7339` | Superficie `#FFFFFF` | 5,95 | Enlaces y botón secundario |
| Verde monte `#0A4D27` | Tinte suave `#E3F1E7` | 8,56 | Destino activo de la navegación |
| Rosado tajibo `#C2255C` | Superficie `#FFFFFF` | 5,66 | Cifra destacada |
| Blanco `#FFFFFF` | Rosado tajibo `#C2255C` | 5,66 | Botón de celebración |
| Vino `#8A1740` | Tinte rosado `#FDE7EF` | 7,84 | Palabra del día |
| Tinta `#10261A` | Sol `#FFC533` | 10,11 | Etiqueta de yapa |
| Tinta `#10261A` | Naranja `#F58A1F` | 6,50 | Etiqueta de etapa |
| Tostado `#7A4A00` | Crema `#FFF3DC` | 6,81 | Chip de cuñapés |
| Error `#B3261E` | Superficie `#FFFFFF` | 6,54 | Mensaje de error |

Dos colores **no se usan para texto**: Sol y Rosado claro sobre blanco no alcanzan el mínimo. Sirven de fondo con tinta encima o de relleno en ilustraciones.

## 4. Tipografía

Dos familias de Google Fonts.

| Familia | Papel | Por qué |
| :--- | :--- | :--- |
| **Paytone One** | Títulos y cifras grandes | Redonda, gruesa y festiva: recuerda la rotulación de cartel. Tiene un solo peso, lo que obliga a usarla poco |
| **Figtree** | Todo lo demás | Geométrica y muy legible en tamaños pequeños; sus formas redondas conversan con Paytone |

| Nivel | Familia | Tamaño | Peso | Interlínea | Uso |
| :--- | :--- | :---: | :---: | :---: | :--- |
| Portada | Paytone One | 58 px | 400 | 1,05 | "¡Elay, Ana!" |
| Título grande | Paytone One | 31 px | 400 | 1,15 | Título de pantalla |
| Título medio | Paytone One | 22 px | 400 | 1,2 | Título de tarjeta |
| Cifra | Paytone One | 28 px | 400 | 1 | "12 días", "60 %" |
| Subtítulo | Figtree | 18 px | 700 | 1,35 | Encabezado de sección |
| Texto grande | Figtree | 16 px | 400 | 1,5 | Párrafos de la portada |
| Texto | Figtree | 15 px | 400 | 1,5 | Texto general |
| Texto destacado | Figtree | 15 px | 700 | 1,4 | Título de una actividad |
| Etiqueta | Figtree | 13 px | 600 | 1,3 | Tipo de actividad, ayuda de ficha |
| Etiqueta menor | Figtree | 12 px | 700 | 1,2 | Días de la semana, leyendas |
| Botón | Figtree | 16 px | 700 | 1 | Botones |

Reglas:

- Paytone One solo en títulos y cifras; nunca en párrafos ni en botones.
- Una sola línea en Paytone por tarjeta.
- Las palabras cambas van en el mismo estilo que el resto. No se ponen en cursiva ni entre comillas: son parte del idioma de la aplicación.
- Los signos de apertura (¡ ¿) se escriben siempre.

## 5. Forma, borde y profundidad

| Elemento | Radio | Borde | Nota |
| :--- | :---: | :--- | :--- |
| Portada | 32 px | Ninguno | Bloque de color pleno |
| Tarjeta | 24 px | 1,5 px `#CFE0D5` | Superficie blanca |
| Ficha de dato | 20 px | 1,5 px `#CFE0D5` | Cuatro en fila |
| Fila de actividad | 16 px | Ninguno | Fondo tinte suave al completarse |
| Botón | 9999 px | Ninguno en el principal | Forma de píldora |
| Tramo de barra | 7 px | Ninguno | Barra del tapeque en cinco tramos |
| Arco de personaje | Medio punto | Ninguno | Rectángulo con la parte superior semicircular |

**Sin sombras.** La profundidad se logra por capas de tono: fondo, tinte, superficie blanca y borde fino. Es un diseño plano; la jerarquía la dan el color y el tamaño.

**El arco** es la forma propia de la marca. Se usa para los personajes, para la imagen de la ventana de celebración y como máscara de los avatares grandes. No se usa en botones ni en tarjetas comunes.

## 6. Los personajes: hoja de Nando y Mechi

Personajes originales. Estilo plano y geométrico: formas llenas, sin contorno, sin degradados, sin sombreado realista.

### Construcción

| Rasgo | Regla |
| :--- | :--- |
| Proporción | Tres cabezas y media de alto. Cabeza grande, cuerpo corto, pies redondos |
| Cabeza | Elipse casi circular. Orejas como dos círculos pequeños |
| Ojos | Dos elipses verticales de tinta con un brillo blanco arriba a la derecha |
| Cejas | Arcos finos; son las que más expresan |
| Nariz | Un trazo curvo corto, en el tono oscuro de la piel |
| Mejillas | Dos elipses coral al 45 % de opacidad |
| Manos y pies | Formas redondas, sin dedos |
| Piso | Una elipse de sombra plana bajo los pies |

### Nando

| Parte | Descripción | Color |
| :--- | :--- | :--- |
| Sombrero de saó | Copa redondeada, ala ancha, cinta | Paja `#F5DE9F`, ala `#EBCB7C`, cinta `#C9A24E` |
| Cabello | Mechón corto bajo el sombrero | `#231C1A` |
| Camisa | Blanca, manga remangada, dos botones | `#FFFFFF`, pliegue `#D5E0D9` |
| Pañoleta | Al cuello, con nudo y dos puntas | `#1FA24A`, nudo `#17803A` |
| Cinturón | Ancho, con hebilla | `#231C1A`, hebilla `#E3B341` |
| Pantalón | Blanco, remangado a media pierna | `#FFFFFF` |
| Pies | Descalzo | Piel `#C8875A` |
| Boca | Sonrisa abierta | `#7A2F2F` con dientes blancos |
| Gesto base | Una mano toca el ala del sombrero | |

### Mechi

| Parte | Descripción | Color |
| :--- | :--- | :--- |
| Cabello | Recogido, con una trenza gruesa sobre el hombro | `#231C1A` |
| Flor | Tajibo de cinco pétalos en el cabello | `#E8457C`, centro `#FFC533` |
| Cinta | Al final de la trenza | `#E8457C` |
| Arete | Un círculo pequeño | `#E3B341` |
| Vestido | Largo, suelto, con volado en el escote y en el ruedo | `#1FA24A`, volados `#3DBE6B` con ribete blanco |
| Pies | Descalza | Piel `#C8875A` |
| Boca | Sonrisa cerrada | `#C2255C` |
| Gesto base | Una mano en la cintura | |

### Marco

- Nando va sobre un arco verde Elay, para que resalte el blanco de su ropa.
- Mechi va sobre un arco rosado claro, para que resalte el verde de su vestido.
- Tres flores de tajibo sueltas acompañan la escena en la portada.

### Los seis estados

| Estado | Nando | Mechi | Qué cambia en la cara |
| :--- | :--- | :--- | :--- |
| Esperando | Toca el ala del sombrero | Mano en la cintura | Cejas relajadas, sonrisa media |
| Animando | Sombrero en la mano, señala al frente | Asiente con un cuñapé en la mano | Cejas arriba |
| Feliz | Brazos en jarra | Hace girar el vuelo del vestido | Sonrisa amplia, ojos en arco |
| Celebrando | Lanza el sombrero, pañuelo en alto, un pie levantado | Pañuelo en alto, vestido en giro | Ojos cerrados en arco, boca abierta |
| Preocupada | Sombrero ladeado, mano en la nuca | Protege un tizón encendido con la mano | Cejas inclinadas hacia el centro, boca pequeña |
| Descansando | Sentado, sombrero sobre la rodilla | Sentada, tutuma de somó en las manos | Ojos abiertos, sonrisa tranquila |

### Tamaños y límites

| Uso | Alto mínimo | Qué se muestra |
| :--- | :---: | :--- |
| Portada de escritorio | 320 px | Los dos, de cuerpo entero, en sus arcos |
| Tarjeta de diálogo | 56 px | Solo la cabeza de quien habla, en círculo |
| Teléfono | 180 px | Solo quien habla, de la cintura hacia arriba |
| Icono de la aplicación | 48 px | El sombrero de saó sobre fondo verde |

Lo que nunca hacen: señalar con reproche, cruzarse de brazos mirando a la persona, llorar, dormir, sostener bebidas alcohólicas, aparecer con rasgos exagerados.

## 7. Ilustración y escenas

| Pantalla | Qué se ilustra |
| :--- | :--- |
| P01 y P02 | Los dos en sus arcos, a la izquierda, a toda la altura. Formulario a la derecha |
| P03 | Un personaje por paso: Nando en la meta diaria, los dos en la elección de acompañante, Mechi en la primera actividad |
| P04 | Portada con los dos arcos y tres flores |
| P06 | Cabeza de Mechi junto a su consejo |
| P08 | La escena del patio donde se arma el buri (sección 9) |
| P10 | Rama de tajibo sobre la florada |
| P11 | La mesa de horneados vista de frente |
| P12 | Los dos bailando dentro de un arco grande, flores en el aire |
| Estados vacíos | Un solo personaje, pequeño, con un gesto que invita |

Reglas de ilustración: formas planas, máximo seis colores por escena, nada de texturas, perspectiva frontal. Los objetos (horno, mesa, tutuma, canasto) se dibujan con la misma geometría redonda que los personajes.

## 8. Iconografía

- Trazo de 2 px, extremos redondos, sin relleno; tamaño base 24 px.
- Color: tinta suave en reposo, verde Elay cuando el destino está activo.
- Cuatro iconos propios, rellenos y más grandes, para las fichas: **tizón** (jenecherú), **mano en alto** (cómper), **anillos concéntricos** (nivel) y **libro abierto** (palabra del día).
- El cuñapé es un círculo crema con un borde tostado: sirve de moneda junto a las cifras.
- La flor de tajibo de cinco pétalos marca todo lo que es logro.

## 9. Visualización de datos

Cada gráfica usa forma y tamaño además de color, y tiene una tabla equivalente accesible.

### Tapeque de hoy

| | |
| :--- | :--- |
| Forma | Barra de cinco tramos iguales con 6 px de separación |
| Codificación | Tramo lleno en verde Elay por actividad hecha; tramo vacío en tinte suave |
| Etiqueta | "3 de 5" a la derecha, en cifra |
| Día redondo | Los cinco tramos llenos y una flor de tajibo al final |

### Escena del buri (avance del proyecto)

Un patio visto de frente, de 16:9, que suma una capa por hito.

| Capa | Hito | Elementos |
| :---: | :---: | :--- |
| 0 | Inicio | Suelo, un tajibo a la izquierda, un poste a la derecha. Todo en tinte suave, sin color |
| 1 | 20 % | Banderines de colores entre el árbol y el poste |
| 2 | 40 % | Pahuichi: ramada de cuatro postes con techo de palma |
| 3 | 60 % | Mesa con mantel y tres canastos de horneados |
| 4 | 80 % | Dos músicos: tambor y flauta |
| 5 | 100 % | Faroles encendidos, Nando y Mechi bailando, avatares de la comparsa alrededor |

Debajo de la escena va una **regla de cinco marcas** con el nombre de cada etapa: las cumplidas en verde con una marca de verificación, la actual con borde naranja y las futuras en gris. Una barra naranja muestra el avance hacia la siguiente etapa ("faltan 6 actividades"). En las tarjetas pequeñas (P04 y P07) se muestra solo la regla.

### Lo que trajo cada uno (aporte por miembro)

Barras horizontales, una por comparsero, con avatar, nombre y cifra. Orden alfabético o por orden de ingreso; nunca de mayor a menor. Cada barra lleva el color del comparsero y su inicial.

### Florada del tajibo (constancia)

| | |
| :--- | :--- |
| Forma | Cuadrícula de 7 columnas (lunes a domingo) por 5 filas (semanas) |
| Unidad | Una flor por día |
| Tamaño | Cuatro niveles: punto gris (sin actividad), flor pequeña rosado claro, flor mediana flor, flor grande rosado tajibo |
| Día redondo | Flor grande con centro sol |
| Hoy | Anillo de tinta alrededor |
| Descanso | Hoja verde pequeña en lugar de flor |
| Leyenda | "Menos" a "Más" con las cuatro flores |

### Reportes

| Gráfica | Forma | Detalle |
| :--- | :--- | :--- |
| Cumplimiento por costumbre | Barras horizontales con porcentaje | Una por costumbre; la pista en tinte suave |
| Tendencia semanal | Siete barras verticales | El mejor día en rosado tajibo, el resto en verde Elay |
| Únicas y costumbres | Dos bloques con cifra grande | Sin gráfico de torta |
| Cuñapés por semana | Línea con puntos | Una marca en cada cambio de anillo |

## 10. Movimiento

| Tipo | Duración | Curva | Ejemplo |
| :--- | :---: | :--- | :--- |
| Respuesta | 150 ms | Salida suave | La casilla se llena |
| Transición | 250 ms | Entrada y salida suave | Cambio de pestaña, aparición de tarjeta |
| Énfasis | 400 ms | Rebote leve | El tramo del tapeque crece; los cuñapés suben |
| Celebración | 1200 ms | Caída con balanceo | Flores de tajibo que bajan |

- **Completar una actividad:** casilla, luego tramo del tapeque, luego cifra de cuñapés. En ese orden, encadenado, 600 ms en total.
- **Tapeque completo:** los dos personajes pasan a "celebrando" y caen cinco flores.
- **Nueva etapa del buri:** la capa nueva entra desde abajo con un rebote.
- **Los personajes parpadean** cada cinco a ocho segundos. Es su único movimiento en reposo.
- **Movimiento reducido:** sin caída de flores ni rebotes; los cambios se resuelven con un fundido de 150 ms.

## 11. Sonido

Opcional y apagado por defecto. Si se activa: un golpe corto de tambor al completar, dos golpes al cerrar el tapeque y una frase breve de flauta al subir de anillo. Ningún sonido dura más de un segundo y ninguno se repite en bucle.

## 12. Composición

**Escritorio (1360 px).** Contenido centrado con ancho máximo de 1280 px, 12 columnas, 24 px entre columnas, 40 px de margen.

| Zona | Columnas | Contenido |
| :--- | :---: | :--- |
| Barra superior | 12 | Marca a la izquierda; Hoy, Actividades, Comparsas, Reportes al centro; nivel y avatar a la derecha |
| Portada | 12 | Texto y botones (5), personajes en arcos (4), tarjeta "Mechi dice" con el tapeque (3) |
| Fichas | 3 + 3 + 3 + 3 | Jenecherú, Cómper, Nivel, Palabra de hoy |
| Cuerpo | 5 + 4 + 3 | Actividades de hoy, Comparsa, Florada del tajibo |

**Teléfono (desde 360 px).** Una columna. Barra de navegación abajo con cuatro destinos. La portada se reduce: saludo, un personaje (quien habla) y el tapeque. Las fichas pasan a un carrusel horizontal. El botón "Nueva actividad" queda fijo sobre la barra de navegación.

## 13. Accesibilidad

- Todo texto cumple 4,5:1; las cifras grandes, 3:1 como mínimo.
- El progreso nunca depende solo del color: tramos, tamaños de flor, marcas de verificación y cifras.
- Cada gráfica tiene texto alternativo y una tabla equivalente ("Ver como tabla").
- Las palabras cambas tienen su equivalente accesible para lectores de pantalla ("Jenecherú, tu racha: 12 días").
- Foco visible: anillo de 3 px en verde monte con 2 px de separación.
- Área táctil mínima de 44 px.
- Los personajes son decorativos para el lector de pantalla; lo que dicen se anuncia como texto.

## 14. Qué hacer y qué no

| Hacer | No hacer |
| :--- | :--- |
| Usar el verde para estructurar y el rosado para premiar | Pintar todo de rosado |
| Dejar un solo botón principal por pantalla | Poner dos botones verdes llenos juntos |
| Mostrar a los personajes en acciones cotidianas | Ponerlos en pose de postal o de espectáculo |
| Explicar cada palabra propia la primera vez | Dar por sabido el vocabulario |
| Mantener formas planas y colores llenos | Añadir degradados, brillos o sombras difusas |
| Usar el arco solo para personajes y celebraciones | Convertir cada tarjeta en un arco |
| Mostrar el descanso como pausa compartida | Dibujar a alguien dormido o sugerir pereza |
| Ordenar los aportes sin jerarquía | Ordenar a los comparseros de mayor a menor |
