# Prompts para Stitch: Panal

Textos listos para copiar y pegar en Stitch y generar las doce pantallas de la dirección A · Panal. Cada bloque genera una sola pantalla. Los datos de ejemplo son los comunes a las cinco direcciones (Ana, viernes 13 de noviembre, 3 de 5, 640 gotas, Proyecto final al 60 %).

## Tabla de contenidos

1. [Cómo usar este archivo](#1-cómo-usar-este-archivo)
2. [Orden de generación](#2-orden-de-generación)
3. [Prompt 0: arranque del proyecto y pantalla Hoy](#3-prompt-0-arranque-del-proyecto-y-pantalla-hoy)
4. [Un prompt por pantalla](#4-un-prompt-por-pantalla)
5. [Prompt para la hoja de la mascota](#5-prompt-para-la-hoja-de-la-mascota)
6. [Refinamientos propios del mundo](#6-refinamientos-propios-del-mundo)
7. [Errores previsibles en este mundo](#7-errores-previsibles-en-este-mundo)

---

## 1. Cómo usar este archivo

1. Crea un proyecto nuevo en Stitch en modo web y carga el `DESIGN.md` de esta carpeta. Los pasos y la alternativa de pegarlo están en [`../00-base-comun/guia-stitch.md`](../00-base-comun/guia-stitch.md).
2. Sube las imágenes de `referencia/` (la captura de "Hoy" y la mascota) junto con el Prompt 0.
3. Envía el Prompt 0 y no sigas hasta que la pantalla "Hoy" te convenza: es el ancla visual de todas las demás.
4. Genera el resto en el orden de la tabla, un bloque por mensaje. Para corregir, usa la sección 6 de este archivo y los prompts de corrección de la guía, de a uno o dos cambios por mensaje.

## 2. Orden de generación

| Orden | Bloque | Pantalla | Caso de uso |
| :---: | :--- | :--- | :--- |
| 1 | Prompt 0 | P04 Hoy | CU-02, CU-04 |
| 2 | P01 | Entrar al panal | CU-01 |
| 3 | P02 | Crear mi panal | CU-01 |
| 4 | P03 | Primer vuelo | CU-01 |
| 5 | P04 móvil | Hoy en teléfono | CU-02 |
| 6 | P05 | Celdas | CU-02 |
| 7 | P06 | Nueva actividad | CU-02 |
| 8 | P07 | Colmenas | CU-03 |
| 9 | P08 | Colmena: Proyecto final | CU-03, CU-04 |
| 10 | P09 | Invitar al enjambre | CU-03 |
| 11 | P10 | Reportes | CU-04 |
| 12 | P11 | Mi vuelo | Transversal |
| 13 | P12 | Celebración | Transversal |
| 14 | Mascota | Hoja de los seis estados de Zum | Transversal |

Si el tiempo es corto, las cinco pantallas que cubren los cuatro casos de uso son P04, P01, P06, P08 y P10.

## 3. Prompt 0: arranque del proyecto y pantalla Hoy

Es más largo que los demás porque fija el estilo de todo el proyecto. Si Stitch lo corta, envía primero los dos primeros párrafos y después el resto.

```text
Diseña una aplicación web de escritorio llamada "Panal": una plataforma gamificada para organizar y cumplir actividades, sola o en equipo. Ambiente cálido, táctil, optimista y lúdico sin ser infantil, como un cuaderno de pegatinas. Cada actividad es una celda hexagonal de un panal y la mascota es Zum, una abeja redonda y sonriente.

Estilo: formas planas con contorno de 2,5 px en marrón tinta #2A1B0A y sombra dura de 6 px hacia abajo, del mismo color, sin difuminar. Fondo de página papel crema #FBFAF6, tarjetas blancas con radio de 28 px, color protagonista amarillo miel #FFC421, texto secundario #6B5A45 y acento azul #2F6FB7. Títulos, cifras y botones en Fredoka; el resto en Nunito con peso alto. Botones y fichas en forma de píldora. Sin degradados, sin sombras difusas y sin emojis; iconos lineales de trazo redondeado. Todas las imágenes e iconos deben seguir esta paleta.

Pantalla "Hoy".
Arriba, barra de navegación: a la izquierda un hexágono miel y la marca "Panal"; al centro los destinos "Hoy" (activo: píldora marrón con texto miel), "Celdas", "Colmenas" y "Reportes"; a la derecha "Nivel 4 · Exploradora" y un avatar circular azul con la letra A.

Debajo, una tarjeta principal a todo el ancho con fondo miel. A la izquierda, Zum dentro de un círculo crema. Al centro: la fecha en mayúsculas "VIERNES 13 DE NOVIEMBRE", el título grande "¡Buen vuelo, Ana!", la frase "Llevas 3 de 5 celdas llenas. Dos más y cerramos el panal de hoy.", el botón principal "Nueva actividad" y dos fichas blancas: "Racha de vuelo: 12 días" y "2 reservas de miel". A la derecha, un panal de 5 hexágonos grandes encajados: 3 llenos en ámbar #E69A00 con una marca de verificación y 2 vacíos en crema #FFF3C9.

Abajo, tres tarjetas blancas iguales en fila.
Tarjeta 1, "Celdas de hoy", con el contador "3 de 5" y cinco filas. Cada fila tiene un hexágono como casilla (miel con marca si está hecha, blanco si está pendiente), el título, el tipo debajo en texto pequeño y los puntos a la derecha: "Repasar apuntes de Redux", "Recurrente · diaria", "+10", hecha. "Caminar 30 minutos", "Recurrente · diaria", "+10", hecha. "Entregar informe de avance", "Única · vence hoy", "+25", hecha. "Diseñar pantalla de reportes", "Única · Proyecto final", "+25", pendiente. "Practicar inglés 15 minutos", "Recurrente · lunes, miércoles y viernes", "+10", pendiente. Al pie: "45 gotas de miel hoy".
Tarjeta 2, "Colmena: Proyecto final", con "60 %" y el texto "Cuadro 3 de 5 · 18 de 30 celdas llenas". Una rejilla de 30 hexágonos pequeños en 5 filas: 18 llenos en cuatro colores (miel, naranja #E8751A, azul #2F6FB7 y castaño #6B3F12) y 12 vacíos en beige #F1EADB. Leyenda: "Ana 7 celdas", "Diego 2 celdas", "Luis 5 celdas", "Sofía 4 celdas".
Tarjeta 3, "Constancia", con el texto "Últimas 5 semanas, un día por celda": un mapa de hexágonos de 7 columnas (L M X J V S D) por 5 filas en cuatro tonos, del beige al ámbar, con el día de hoy contorneado en marrón y la leyenda "Menos" y "Más".
```

## 4. Un prompt por pantalla

Todos terminan con la misma línea de restricciones para que Stitch mantenga el estilo de "Hoy".

### P01. Entrar al panal (inicio de sesión)

```text
Crea la pantalla de inicio de sesión de Panal, "Entrar al panal". Sirve para entrar a la cuenta.

Estructura en dos mitades, sin barra de navegación. Mitad izquierda con fondo miel #FFC421: una ilustración plana de Zum, la abeja, saludando desde la entrada de una colmena; debajo, el título "Tu panal te espera" y la frase "Cada actividad que cumples llena una celda." Mitad derecha con fondo papel crema #FBFAF6: una tarjeta blanca centrada de unos 420 px de ancho.

Contenido de la tarjeta, de arriba abajo: el logotipo (un hexágono miel y la palabra "Panal"), el título "Entrar al panal", el campo "Correo" con el ejemplo "ana@ejemplo.com", el campo "Contraseña" con un icono para mostrarla, el enlace "¿Olvidaste tu contraseña?", el botón principal "Entrar" a todo el ancho y, al pie, el texto "¿Primera vez aquí?" con el enlace "Crear mi panal".

Muestra el campo "Contraseña" en estado de error: fondo rosado suave, contorno rojo #B3261E y el mensaje "El correo o la contraseña no coinciden. Prueba otra vez."

Restricciones: mismo estilo que la pantalla Hoy (contornos marrón tinta, sombra dura sin difuminar, Fredoka y Nunito), un solo botón principal, sin degradados y sin emojis.
```

### P02. Crear mi panal (registro)

```text
Crea la pantalla de registro de Panal, "Crear mi panal". Sirve para abrir una cuenta nueva en menos de un minuto.

Estructura en dos mitades, sin barra de navegación. Mitad izquierda con fondo miel #FFC421: Zum, la abeja, sosteniendo una celda hexagonal vacía y, debajo, tres promesas en lista, cada una con un hexágono pequeño como viñeta: "Tu día, en un panal", "Tu equipo, en una colmena" y "Tu constancia, en un mapa". Mitad derecha con fondo papel crema #FBFAF6: una tarjeta blanca centrada de unos 420 px.

Contenido de la tarjeta, de arriba abajo: el título "Crear mi panal", el campo "Nombre" con el texto "Ana", el campo "Correo" con "ana@ejemplo.com" y el campo "Contraseña". Debajo de la contraseña, tres hexágonos pequeños en fila que indican su fuerza: dos llenos en miel y uno vacío, con el texto "Bien. Añade un número para hacerla fuerte." Después, el botón principal "Crear mi panal" a todo el ancho y, al pie, el texto "¿Ya tienes un panal?" con el enlace "Entrar".

Restricciones: mismo estilo que la pantalla Hoy (contornos marrón tinta, sombra dura sin difuminar, Fredoka y Nunito), un solo botón principal, sin degradados y sin emojis.
```

### P03. Primer vuelo (recorrido inicial)

```text
Crea la pantalla del recorrido inicial de Panal, "Primer vuelo". La ve una persona recién registrada y la lleva a ganar algo en su primer minuto.

Estructura: sin barra de navegación. Arriba al centro, el logotipo y un indicador de tres pasos hecho con tres hexágonos pequeños, con el texto "Tres pasos y ya estás volando". Debajo, tres tarjetas blancas en fila, numeradas, que muestran los tres pasos.

Tarjeta 1, "Elige tu panal": la pregunta "¿Cuántas celdas quieres llenar por día?" y tres opciones, cada una con un panal dibujado de 3, 5 y 7 hexágonos: "3 · Tranquila", "5 · Constante" (seleccionada, con fondo crema y contorno grueso) y "7 · Intensa". Nota pequeña: "Puedes cambiarlo cuando quieras."
Tarjeta 2, "Crea tu primera celda": el campo "¿Qué quieres cumplir hoy?" con el texto "Caminar 30 minutos", un selector de dos opciones "Única" y "Recurrente", y el botón secundario "Crear celda".
Tarjeta 3, "Llénala": un hexágono grande lleno de miel con una marca de verificación, Zum celebrando al lado, el título "¡Primera celda!", un sello redondo de borde ondulado con el texto "Primera celda" y la frase "Zum te regala 1 reserva de miel: protege tu racha un día." Botón principal "Ir a mi panal".

Restricciones: mismo estilo que la pantalla Hoy (contornos marrón tinta, sombra dura sin difuminar, Fredoka y Nunito), un solo botón principal, sin degradados y sin emojis.
```

### P04. Hoy, versión para teléfono

La versión de escritorio es el Prompt 0.

```text
Crea la versión para teléfono de la pantalla "Hoy" de Panal, de 390 px de ancho, en una sola columna.

Estructura, de arriba abajo. Cabecera: a la izquierda el hexágono miel y la marca "Panal"; a la derecha "Nivel 4" y el avatar azul con la letra A. Tarjeta principal en miel #FFC421: Zum a 120 px dentro de su círculo crema, centrada; debajo la fecha "VIERNES 13 DE NOVIEMBRE", el título "¡Buen vuelo, Ana!", la frase "Llevas 3 de 5 celdas llenas. Dos más y cerramos el panal de hoy." y el panal de 5 hexágonos (3 llenos, 2 vacíos); al final, dos fichas blancas en fila: "Racha: 12 días" y "2 reservas".

Después, la tarjeta "Celdas de hoy" con el contador "3 de 5", sus cinco filas (hexágono como casilla, título, tipo y puntos) y el pie "45 gotas de miel hoy". Después, la tarjeta "Colmena: Proyecto final" con "60 %" y la rejilla de 30 hexágonos, y la tarjeta "Constancia" con el mapa de 5 semanas.

Abajo, fija: una barra de navegación blanca con cuatro destinos con icono y texto: "Hoy" (activo), "Celdas", "Colmenas" y "Reportes". Sobre ella, a la derecha, un botón redondo marrón con el signo más para crear una actividad.

Restricciones: áreas pulsables de 44 px como mínimo, mismo estilo que la versión de escritorio, sin degradados y sin emojis.
```

### P05. Celdas (actividades)

```text
Crea la pantalla "Celdas" de Panal: la lista completa de actividades de la persona.

Estructura: arriba, la misma barra de navegación que la pantalla Hoy, con "Celdas" como destino activo. Debajo, a la izquierda el título de página "Celdas" y a la derecha el botón principal "Nueva actividad". Luego una fila de pestañas en píldora: "Hoy" (activa, en miel), "Próximas", "De ronda" y "Archivadas"; y una fila de filtros pequeños: "Todas", "Únicas", "Recurrentes" y "Proyecto final". El contenido va en dos columnas: a la izquierda, dos tercios, la lista en una tarjeta blanca; a la derecha, un tercio, una tarjeta de resumen.

Lista. Rótulo "HOY · VIERNES 13" y las cinco filas de la pantalla Hoy, con hexágono como casilla, título, tipo y puntos. Rótulo "PRÓXIMAS" y tres filas pendientes: "Subir avance al repositorio", "Única · vence el lunes 16", "+25". "Ensayar la presentación", "Única · Proyecto final · prioridad alta", "+35". "Ejercicio", "Recurrente · 3 veces por semana", "+10", con tres hexágonos diminutos (dos llenos) y el texto "2 de 3 esta semana".

Tarjeta de resumen, "Esta semana": "21 celdas llenas", "Racha de vuelo: 12 días", "2 reservas de miel" y un panal pequeño de 5 hexágonos con 3 llenos.

Restricciones: mismo estilo que la pantalla Hoy (contornos marrón tinta, sombra dura sin difuminar, Fredoka y Nunito), un solo botón principal, sin degradados y sin emojis.
```

### P06. Nueva actividad (crear o editar)

```text
Crea la ventana modal "Nueva actividad" de Panal, abierta sobre la pantalla Hoy oscurecida con un velo marrón. Sirve para crear o editar una actividad.

Estructura: tarjeta blanca centrada de unos 560 px de ancho, con contorno marrón y sombra dura. Arriba, el título "Nueva actividad", el subtítulo "Cada actividad es una celda de tu panal." y un botón de cerrar a la derecha.

Contenido, de arriba abajo. El campo "¿Qué vas a cumplir?" con el texto "Practicar inglés 15 minutos". Un selector de dos opciones en píldora: "Única" y "Recurrente" (seleccionada). El bloque "Se repite" con cuatro opciones: "Todos los días", "Días de la semana" (seleccionada), "Veces por semana" y "Día del mes"; debajo, siete hexágonos pequeños con las letras L M X J V S D, con L, X y V llenos en miel. El selector "Prioridad": "Normal" (seleccionada) y "Alta". El desplegable "Colmena (opcional)" con el valor "Proyecto final" y, al lado, "Asignar a" con cuatro avatares circulares y el de Ana marcado.

Al pie, una franja en crema #FFF3C9 con un hexágono miel y el texto "Esta celda vale +10 gotas de miel cada vez." A su derecha, el botón secundario "Cancelar" y el botón principal "Crear celda".

Restricciones: mismo estilo que la pantalla Hoy (contornos marrón tinta, sombra dura sin difuminar, Fredoka y Nunito), un solo botón principal, sin degradados y sin emojis.
```

### P07. Colmenas (proyectos)

```text
Crea la pantalla "Colmenas" de Panal: los proyectos en equipo de la persona.

Estructura: la misma barra de navegación que la pantalla Hoy, con "Colmenas" activo. Debajo, a la izquierda el título "Colmenas" con el texto "Cada proyecto es una colmena que tu enjambre llena celda a celda." y a la derecha el botón principal "Nueva colmena". Luego una cuadrícula de tres tarjetas iguales y, al final, la sección "Colmenar".

Tarjeta 1: "Proyecto final", "60 %", "Cuadro 3 de 5 · 18 de 30 celdas", una rejilla pequeña de 30 hexágonos en 5 filas (3 filas llenas en miel, naranja, azul y castaño; 2 filas vacías en beige), cuatro avatares circulares, el texto "Faltan 6 celdas para el cuarto cuadro" y "Entrega: 4 de diciembre".
Tarjeta 2: "Grupo de estudio de Redux", "25 %", "Cuadro 1 de 5 · 5 de 20 celdas", una rejilla de 20 hexágonos con 5 llenos, tres avatares y "Faltan 3 celdas para el segundo cuadro".
Tarjeta 3, con contorno punteado y sin sombra: un hexágono vacío grande, el título "Funda una colmena nueva" y el texto "Invita a tu enjambre con un enlace."

Sección "Colmenar", con el texto "Colmenas que ya dieron su miel": un estante con dos tarros de miel dibujados en plano, con las etiquetas "Taller de base de datos · cerrada en octubre" y "Feria de ciencias · cerrada en agosto".

Restricciones: mismo estilo que la pantalla Hoy (contornos marrón tinta, sombra dura sin difuminar, Fredoka y Nunito), un solo botón principal, sin degradados y sin emojis.
```

### P08. Colmena: Proyecto final (detalle de proyecto)

```text
Crea la pantalla "Colmena: Proyecto final" de Panal: el detalle de un proyecto en equipo.

Estructura: la misma barra de navegación que la pantalla Hoy, con "Colmenas" activo. Debajo, una cabecera con el enlace "Volver a colmenas", el título "Colmena: Proyecto final", las fichas "60 %", "Cuadro 3 de 5" y "Entrega: 4 de diciembre", y a la derecha el botón principal "Invitar al enjambre". El contenido va en dos columnas.

Columna izquierda, dos tercios, tarjeta "La colmena": una rejilla grande de 30 hexágonos en 5 filas rotuladas "Cuadro 1" a "Cuadro 5". Las tres primeras filas están llenas; cada celda tiene el color de quien la completó (miel, naranja, azul o castaño) y su inicial dentro (A, L, S o D). Las dos últimas filas están vacías en beige. Debajo, una barra de progreso con el texto "Faltan 6 celdas para el cuarto cuadro" y la lista "Celdas de la colmena" con tres filas; una lleva una etiqueta coral "Llama al enjambre" y el botón "Tomar celda".

Columna derecha, un tercio. Tarjeta "Enjambre" con cuatro filas, cada una con muestra de color, nombre, aporte y un botón pequeño "Zumbido": "Ana · 7 celdas · 5 días", "Diego · 2 celdas · 2 días", "Luis · 5 celdas · 4 días" y "Sofía · 4 celdas · 3 días". Tarjeta "Esta semana": "Abeja constante: Ana", "Última gota: Luis" y "Ala amiga: Sofía".

Restricciones: mismo estilo que la pantalla Hoy (contornos marrón tinta, sombra dura sin difuminar, Fredoka y Nunito), un solo botón principal, sin degradados y sin emojis.
```

### P09. Invitar al enjambre (vincular usuarios)

```text
Crea la ventana modal "Invitar al enjambre" de Panal, abierta sobre la pantalla de la colmena oscurecida con un velo marrón. Sirve para vincular personas a un proyecto.

Estructura: tarjeta blanca centrada de unos 520 px de ancho, con contorno marrón y sombra dura. Arriba, una ilustración pequeña de Zum, la abeja, llevando un sobre; el título "Invitar al enjambre" y el subtítulo "Quien se una verá solo la colmena Proyecto final." Botón de cerrar arriba a la derecha.

Contenido en tres bloques separados por espacio.
Bloque 1, "Invitar por correo": un campo con el ejemplo "nombre@ejemplo.com" y, a su derecha, el botón principal "Enviar invitación".
Bloque 2, "O comparte el enlace": un campo de solo lectura con el texto "panal.ejemplo/unirse/PF-7K2Q" y un botón secundario "Copiar" con icono. Debajo, en texto pequeño: "El enlace vence en 7 días."
Bloque 3, "Invitaciones pendientes": dos filas, cada una con un avatar vacío de contorno punteado, el correo, el estado y un enlace: "diego@ejemplo.com · enviada hace 2 días · Reenviar" y "carla@ejemplo.com · enviada hoy · Cancelar".

Al pie, a la izquierda, cuatro avatares circulares con el texto "4 abejas en el enjambre" y, a la derecha, el botón secundario "Listo".

Restricciones: mismo estilo que la pantalla Hoy (contornos marrón tinta, sombra dura sin difuminar, Fredoka y Nunito), un solo botón principal, sin degradados y sin emojis.
```

### P10. Reportes

```text
Crea la pantalla "Reportes" de Panal: el progreso de la persona en gráficas hechas con hexágonos.

Estructura: la misma barra de navegación que la pantalla Hoy, con "Reportes" activo. Debajo, a la izquierda el título "Reportes" y a la derecha un selector en píldora con "Semana", "5 semanas" (activo) y "Todo". Luego tres fichas grandes en fila y cuatro tarjetas blancas en dos columnas.

Fichas: "640 gotas de miel", "Racha de vuelo: 12 días" y "8 panales cerrados".

Tarjeta 1, "Panal de constancia", con la frase "28 de 33 días con celdas llenas": un mapa grande de hexágonos, 7 columnas (L M X J V S D) por 5 filas, en cuatro tonos del beige al ámbar #D98200, con la leyenda "Sin actividad", "Día de vuelo", "Más de la mitad", "Panal cerrado" y, en azul claro, "Día sin flores".
Tarjeta 2, "Cumplimiento por celda": tres filas con nombre, una tira de 7 hexágonos pequeños y el porcentaje: "Repasar apuntes de Redux · 6 de 7 · 86 %", "Caminar 30 minutos · 4 de 7 · 57 %" y "Practicar inglés 15 minutos · 2 de 3 · 67 %".
Tarjeta 3, "Celdas por día": cinco columnas en miel con contorno marrón, con sus cifras: L 4, M 5, X 3, J 6, V 3. Frase: "21 celdas esta semana. Tu mejor día fue el jueves."
Tarjeta 4, "Únicas y de ronda": dos tarros de miel planos, llenos en proporción, con las etiquetas "Únicas 22" y "De ronda 58".

Restricciones: mismo estilo que la pantalla Hoy (contornos marrón tinta, sombra dura sin difuminar, Fredoka y Nunito), sin ejes decorativos, sin degradados y sin emojis.
```

### P11. Mi vuelo (perfil y logros)

```text
Crea la pantalla "Mi vuelo" de Panal: el perfil con nivel, insignias, colección y ajustes.

Estructura: la misma barra de navegación que la pantalla Hoy, sin destino activo. El contenido va en tres columnas de tarjetas blancas y una franja de ajustes al pie.

Columna 1, tarjeta "Ana": un avatar circular azul grande con la letra A, el texto "Nivel 4 · Exploradora", una barra de progreso en miel con "640 de 700 gotas de miel" y "Faltan 60 para Recolectora". Debajo, el rótulo "Oficios de la abeja" y una fila de diez hexágonos pequeños, cuatro llenos.
Columna 2, tarjeta "Sellos de cera" con el contador "5 de 14": una cuadrícula de sellos redondos de borde ondulado. Cinco ganados en ámbar #E69A00: "Primera celda", "Panal cerrado", "Semana de vuelo", "Colmena fundada" y "Primer cuadro". Tres sin ganar en beige, con su progreso: "Luna de miel · 12 de 30 días", "Néctar fresco · 7 de 10" y "Enjambrazón".
Columna 3, tarjeta "Alacena de mieles" con el contador "3 de 12": un estante con doce tarros planos; tres llenos con etiqueta ("Azahar", "Romero" y "Girasol") y nueve en silueta beige.

Franja "Ajustes de vuelo": "Tamaño del panal" con selector 3, 5 (activo), 7; "Día sin flores: domingo"; "Sugerencias de Zum" con un interruptor activado; el botón secundario "Pausar mi vuelo" y el enlace "Cómo se ganan las gotas de miel".

Restricciones: mismo estilo que la pantalla Hoy (contornos marrón tinta, sombra dura sin difuminar, Fredoka y Nunito), sin degradados y sin emojis.
```

### P12. Celebración (panal cerrado)

```text
Crea la ventana de celebración "Panal cerrado" de Panal, abierta sobre la pantalla Hoy oscurecida con un velo marrón. Aparece cuando la persona cumple su meta del día.

Estructura: tarjeta blanca centrada de unos 520 px de ancho, con contorno marrón, radio de 32 px y sombra dura. Todo el contenido centrado.

Contenido, de arriba abajo. Zum, la abeja, celebrando con las alas en alto y los ojos cerrados en arco, rodeada de tres gotas de miel y dos hexágonos pequeños, todo en formas planas. Debajo, un panal de 5 hexágonos en ámbar #E69A00, todos con marca de verificación. El título grande "¡Panal cerrado!" y la frase "Cinco de cinco. Hoy la colmena tiene más miel gracias a ti."

Luego tres fichas en fila: "+20 gotas de miel", "Racha de vuelo: 12 días" y "695 gotas en total". Debajo, una franja en crema #FFF3C9 con un tarro de miel pequeño y el texto "Zum encontró una flor rara: miel de azahar. Ya está en tu alacena."

Al pie, una barra de progreso casi llena con el texto "Te faltan 5 gotas para ser Recolectora", el botón principal "Seguir" y el enlace "Ver mi alacena".

Restricciones: mismo estilo que la pantalla Hoy (contornos marrón tinta, sombra dura sin difuminar, Fredoka y Nunito), un solo botón principal, sin confeti fotográfico, sin degradados y sin emojis.
```

## 5. Prompt para la hoja de la mascota

Sirve para explorar las seis posturas de Zum. El personaje definitivo se dibuja en SVG al implementar (ver la sección 5 de la guía).

```text
Crea una lámina de personaje para Zum, la abeja mascota de Panal, sobre fondo papel crema #FBFAF6. Es una hoja de referencia, no una pantalla de la aplicación.

Estilo: ilustración plana de pegatina, contorno uniforme en marrón tinta #2A1B0A, sin degradados, sin brillos y sin volumen. Zum es casi toda cabeza: cuerpo ovalado amarillo #FFD23F apenas más ancho que alto, dos franjas marrones curvas en la mitad inferior, dos alas ovaladas azul muy claro #DDF0FA inclinadas hacia afuera, dos antenas terminadas en bolita, ojos ovalados verticales con un brillo blanco, sonrisa pequeña y mejillas coral #FF8A5B.

Muestra seis versiones en una cuadrícula de tres por dos, cada una dentro de un círculo crema #FFF7D6 y con su nombre debajo en Fredoka.
"Esperando": posada, de frente, alas a media altura.
"Animando": inclinada, señalando con una antena hacia la derecha.
"Feliz": en vuelo, alas altas, sonrisa amplia.
"Celebrando": alas arriba, ojos cerrados en arco, tres gotas de miel alrededor.
"Preocupada": alas bajas, cejas levantadas, mirando un tarro pequeño de miel.
"Descansando": dormida y acurrucada dentro de un hexágono, ojos cerrados.

El personaje debe ser idéntico en las seis: mismas proporciones, mismos colores y mismo grosor de línea. Nunca enojada, nunca triste, sin corona y sin herramientas. Sin emojis.
```

## 6. Refinamientos propios del mundo

Uno por mensaje, sobre la pantalla que corresponda.

| N.º | Para qué | Prompt |
| :---: | :--- | :--- |
| 1 | El panal de hoy no parece un panal | `En la tarjeta principal, haz que los cinco hexágonos del panal de hoy sean más grandes y encajen entre sí en dos filas desplazadas, dos arriba y tres abajo.` |
| 2 | Añadir la danza de Zum | `Añade debajo de la frase del saludo una ficha blanca con contorno marrón: "Zum sugiere: Diseñar pantalla de reportes. Es de tu colmena. Faltan 6 celdas para el cuarto cuadro.", con un botón pequeño "Voy" y el enlace "Otra flor".` |
| 3 | La colmena solo usa color | `En la tarjeta de la colmena, escribe dentro de cada hexágono lleno la inicial de la persona que lo completó (A, L, S o D) en un color que contraste con el relleno.` |
| 4 | Casillas genéricas | `Cambia las casillas de verificación cuadradas o redondas por hexágonos con una punta hacia arriba: blancos con contorno marrón si la actividad está pendiente y en miel con una marca marrón si está hecha.` |
| 5 | Sombras suaves | `Sustituye todas las sombras difusas por una sombra dura de 6 px hacia abajo en marrón #2A1B0A, sin difuminar, solo en las tarjetas.` |
| 6 | Botones sin carácter | `Haz que todos los botones y las fichas sean píldoras con contorno marrón de 2,5 px y deja un solo botón de fondo marrón por pantalla.` |
| 7 | El mapa de constancia parece una tabla | `En el mapa de constancia, desplaza media celda hacia abajo las columnas alternas para que los hexágonos encajen como un panal, y contornea en marrón el día de hoy.` |
| 8 | Demasiada mascota | `Deja a Zum solo en la tarjeta principal y quita cualquier otra abeja o hexágono decorativo de la pantalla.` |

## 7. Errores previsibles en este mundo

| Lo que puede salir | Por qué pasa | Corrección |
| :--- | :--- | :--- |
| Hexágonos convertidos en círculos o cuadrados redondeados | Los componentes habituales de casilla no son hexagonales | Refinamiento 4 |
| Un patrón de panal como fondo de la página | El tema "abeja" invita a decorar | `Quita el patrón de hexágonos del fondo. El fondo es papel crema liso #FBFAF6.` |
| Degradado de amarillo a naranja en la tarjeta principal | Es el recurso por defecto para fondos cálidos | `Reemplaza todos los degradados por colores planos del sistema de diseño.` |
| Texto amarillo sobre blanco | El color de marca se usa como color de texto | `Cambia todo texto amarillo sobre fondo blanco a marrón #2A1B0A.` |
| Una abeja realista, con patas y aguijón marcados | La imagen se genera sin seguir el estilo plano | `Reemplaza la ilustración de la mascota por una abeja plana y redonda, casi toda cabeza, con contorno marrón grueso y sin detalles realistas.` |
| Zum distinta en cada pantalla | Stitch no conserva un personaje entre pantallas | Subir la imagen de `referencia/` en cada prompt; el personaje final se reemplaza al implementar |
| La colmena se vuelve una barra de progreso | Es el componente esperado para un porcentaje | `Reemplaza la barra de progreso de la colmena por una rejilla de 30 hexágonos en 5 filas: 18 llenos en cuatro colores y 12 vacíos en beige.` |
| Tipografías sustituidas por una genérica | No se cargó el `DESIGN.md` | `Usa Fredoka para títulos, cifras y botones, y Nunito para el resto del texto.` |
| Varios botones oscuros en la misma pantalla | Cada tarjeta recibe su propia acción principal | Refinamiento 6 |
| Las palabras del mundo sin explicación | El prompt las da por sabidas | `Añade bajo el título de la tarjeta una línea de ayuda: "Una reserva de miel protege tu racha un día."` |
