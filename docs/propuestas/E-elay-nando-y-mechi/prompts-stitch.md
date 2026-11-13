# Prompts para Stitch: Elay con Nando y Mechi

Textos listos para copiar en Stitch y generar las doce pantallas de esta dirección. Antes de empezar, lee `../00-base-comun/guia-stitch.md`: explica cómo cargar el `DESIGN.md`, qué imágenes subir y cómo refinar.

## Tabla de contenidos

1. [Cómo usar este archivo](#1-cómo-usar-este-archivo)
2. [Orden de generación](#2-orden-de-generación)
3. [Prompt 0: arranque y pantalla Hoy](#3-prompt-0-arranque-y-pantalla-hoy)
4. [Prompts por pantalla](#4-prompts-por-pantalla)
5. [Hoja de los personajes](#5-hoja-de-los-personajes)
6. [Refinamientos propios de este mundo](#6-refinamientos-propios-de-este-mundo)
7. [Errores previsibles y cómo corregirlos](#7-errores-previsibles-y-cómo-corregirlos)

---

## 1. Cómo usar este archivo

1. Crea un proyecto nuevo en Stitch, en modo web.
2. Carga `DESIGN.md` de esta carpeta (o pégalo como primer mensaje, según la guía).
3. Sube `referencia/pantalla-hoy.png` y `referencia/personajes.png` junto con el Prompt 0.
4. Envía los prompts en el orden de la tabla. Cada bloque es un mensaje. No avances de pantalla hasta que la anterior esté bien.

Si Stitch cambia la ortografía de las palabras cambas, envía este mensaje y repite:

```text
No corrijas ni traduzcas estas palabras, son vocabulario propio de la aplicación: Elay, tapeque, cuñapés, jenecherú, cómper, poquingo, buri, comparsa, pahuichi, tamborita, yapa, tiluchi, velatacú, metele.
```

## 2. Orden de generación

| Paso | Prompt | Pantalla | Depende de |
| :---: | :--- | :--- | :--- |
| 1 | 0 | P04 Hoy (estructura y estilo) | DESIGN.md e imágenes |
| 2 | 0.1 a 0.3 | P04 Hoy (contenido exacto) | Prompt 0 |
| 3 | P05 | Actividades | Hoy |
| 4 | P06 | Nueva actividad | Actividades |
| 5 | P07 | Comparsas | Hoy |
| 6 | P08 | La comparsa | Comparsas |
| 7 | P09 | Sumá gente | La comparsa |
| 8 | P10 | Reportes | Hoy |
| 9 | P11 | Mi mesa | Hoy |
| 10 | P12 | Celebración | Hoy |
| 11 | P01, P02 | Entrá y Sumate | Estilo ya fijado |
| 12 | P03 | Armemos tu tapeque (tres pasos) | Entrá |
| 13 | P04 móvil | Hoy en teléfono | Hoy |

El inicio de sesión se genera al final a propósito: para entonces el estilo ya está asentado y la primera impresión sale coherente con el resto.

## 3. Prompt 0: arranque y pantalla Hoy

**Prompt 0. Concepto, sistema visual y estructura.**

```text
Diseña una aplicación web de escritorio llamada "Elay": una plataforma gamificada para organizar y cumplir actividades, sola o en equipo, con identidad de Santa Cruz de la Sierra, Bolivia. Ambiente cálido, luminoso, cercano y festivo. Estilo plano y geométrico: sin degradados, sin sombras, sin emojis.

Sistema visual: fondo de página #F7FAF6; tarjetas blancas con borde fino #CFE0D5 y esquinas de 24 px; verde #0D7339 para la marca, el botón principal y el progreso; rosado #C2255C solo para logros; amarillo #FFC533 para detalles; texto #10261A y texto secundario #4C6355. Títulos y cifras en Paytone One; todo lo demás en Figtree. Botones en forma de píldora. Iconos lineales simples. Todo el texto en español.

Crea la pantalla principal, "Hoy", con cuatro franjas:
1. Barra de navegación blanca: marca "Elay" a la izquierda; "Hoy" (activo), "Actividades", "Comparsas" y "Reportes" al centro; "Nivel 4 · 4to anillo" y un avatar con la letra A a la derecha.
2. Portada ancha con fondo verde muy claro #DDEFE2 y esquinas de 32 px. Izquierda: saludo grande "¡Elay, Ana!" con dos botones. Centro: dos personajes ilustrados planos, cada uno dentro de un arco de medio punto. Derecha: una tarjeta blanca de diálogo con una barra de progreso de cinco tramos.
3. Fila de cuatro fichas de dato iguales.
4. Tres tarjetas en fila: una lista de actividades (la más ancha), una tarjeta de proyecto en equipo y un calendario de constancia hecho con flores.

Los personajes: un hombre joven con sombrero de paja de ala media, camisa blanca remangada, pañoleta verde al cuello y pantalón blanco, sobre un arco verde #0D7339; y una mujer joven con vestido verde suelto de volados, trenza sobre el hombro y una flor rosada en el cabello, sobre un arco rosado claro #F7A8C4. Cabeza grande, caras simples y amables, formas planas sin contorno. Usa la imagen adjunta como referencia de estilo.
```

**Prompt 0.1. Contenido de la portada.**

```text
En la pantalla Hoy, completa la portada con estos textos exactos.
Izquierda: fecha pequeña "Viernes 13 de noviembre"; título "¡Elay, Ana!"; párrafo "Tu tapeque de hoy trae 5 actividades y ya cumpliste 3. ¿Le metemos a las que faltan?"; botón principal verde "Nueva actividad" y botón secundario blanco "Ver mi semana".
Derecha, en la tarjeta de diálogo: un círculo pequeño con la cara de la mujer, la etiqueta "Mechi dice" y la frase "Te falta poquingo: dos más y cerrás el día.". Debajo, la etiqueta "Tapeque de hoy" con la cifra "3 de 5" a la derecha y una barra de cinco tramos iguales con los tres primeros en verde y los dos últimos en verde muy claro. Al pie, con un círculo crema pequeño delante: "45 cuñapés ganados hoy".
Agrega tres flores rosadas de cinco pétalos redondos, sueltas, cerca de los arcos.
```

**Prompt 0.2. Contenido de las cuatro fichas.**

```text
En la pantalla Hoy, completa la fila de cuatro fichas. Cada ficha tiene un icono relleno arriba, un nombre pequeño, una cifra grande en Paytone One y una línea de ayuda en texto secundario.
Ficha 1: icono de un tizón encendido; nombre "Jenecherú"; cifra "12 días"; ayuda "El tizón que guarda tu fuego hasta mañana".
Ficha 2: icono de una mano en alto; nombre "Cómper"; cifra "2 disponibles"; ayuda "Pedí pausa un día sin perder la racha".
Ficha 3: icono de anillos concéntricos; nombre "Nivel"; cifra "4to anillo"; ayuda "Te faltan 60 cuñapés para el 5to" y una barra fina de progreso al 76 %.
Ficha 4, con fondo rosado muy claro #FDE7EF y texto #8A1740: icono de un libro abierto; nombre "Palabra de hoy"; cifra "Poquingo"; ayuda "Un poco, casi nada · 14 de 40 palabras".
```

**Prompt 0.3. Contenido de las tres tarjetas.**

```text
En la pantalla Hoy, completa las tres tarjetas inferiores.
Tarjeta izquierda, "Actividades de hoy", con "3 de 5" a la derecha del título. Cinco filas, cada una con casilla circular, título en negrita, tipo debajo y un chip crema de puntos a la derecha:
"Repasar apuntes de Redux" · "Recurrente · diaria" · "+10" (hecha)
"Caminar 30 minutos" · "Recurrente · diaria" · "+10" (hecha)
"Entregar informe de avance" · "Única · vence hoy" · "+25" (hecha)
"Diseñar pantalla de reportes" · "Única · Proyecto final" · "+25" (pendiente)
"Practicar inglés 15 minutos" · "Recurrente · lunes, miércoles y viernes" · "+10" (pendiente)
Las hechas llevan casilla verde con marca blanca y fondo verde muy claro, sin tachar el texto. Al pie: "Las únicas valen más cuñapés que las recurrentes."
Tarjeta central, "Comparsa: Proyecto final", con "60 %" grande en rosado. Texto "3 de 5 etapas del buri · 18 de 30 actividades". Una regla horizontal de cinco marcas: tres verdes con marca de verificación, la cuarta con borde naranja y la quinta gris. Cuatro barras horizontales con avatar, nombre y cifra, en orden alfabético: Ana 7, Diego 2, Luis 5, Sofía 4. Al pie: "Hacia la 4ta etapa · faltan 6 actividades" con una barra naranja fina.
Tarjeta derecha, "Florada del tajibo", subtítulo "Últimas 5 semanas: cada día cumplido es una flor". Cuadrícula de 7 columnas con las letras L M X J V S D y 5 filas. En cada celda, una flor de cinco pétalos: gris muy pequeña, rosada clara pequeña, rosada mediana o rosada intensa grande con centro amarillo. La última flor lleva un anillo oscuro alrededor. Leyenda al pie: "Menos", cuatro flores de tamaño creciente, "Más".
```

## 4. Prompts por pantalla

### P05. Actividades

```text
Añade una pantalla nueva: "Actividades", con la misma barra de navegación, colores, tipografías y estilo de tarjetas que la pantalla Hoy. El destino "Actividades" está activo.
Arriba: título "Actividades" en Paytone One y, a la derecha, el botón principal "Nueva actividad". Debajo, pestañas en forma de píldora: "Hoy (5)" activa en verde, "Próximas (4)", "Costumbres (3)" y "Archivadas". A la derecha de las pestañas, un desplegable "Todas las comparsas" y un buscador.
Cuerpo en dos columnas. Columna izquierda, ancha: una lista con dos grupos. Grupo "Para hoy" con las mismas cinco filas de la pantalla Hoy. Grupo "Vencidas" con una fila: "Leer capítulo 4 de programación funcional" · "Única · venció ayer" · "+15". Cada fila tiene al final un menú de tres puntos.
Columna derecha, angosta: tarjeta "Tus costumbres esta semana" con tres barras de progreso: "Repasar apuntes de Redux · 5 de 7", "Caminar 30 minutos · 4 de 7", "Practicar inglés 15 minutos · 1 de 3". Debajo, una tarjeta pequeña con la cara de la mujer en un círculo, "Mechi dice" y "Las vencidas igual suman. Ponete al día sin apuro."
Sin degradados, sin sombras, sin emojis.
```

### P06. Nueva actividad

```text
Añade una ventana modal sobre la pantalla Actividades: "Nueva actividad". Modal blanco de 560 px de ancho con esquinas de 24 px, sobre un velo oscuro semitransparente. Mismo estilo que la pantalla Hoy.
Contenido de arriba hacia abajo:
Título "Nueva actividad" y un botón de cerrar.
Campo "¿Qué querés lograr?" con el ejemplo "Practicar inglés 15 minutos".
Dos opciones grandes lado a lado: "Única" con "Se hace una vez · 25 cuñapés" y "Costumbre" con "Se repite · 10 cuñapés cada vez". "Costumbre" está seleccionada con borde verde de 2 px y una marca.
Etiqueta "¿Cada cuánto?" con cuatro chips: "Todos los días", "Algunos días" (seleccionado), "Veces por semana", "Un día del mes". Debajo, siete círculos con L M X J V S D; L, X y V en verde.
Etiqueta "Prioridad" con dos chips: "Normal" (seleccionado) y "Alta".
Desplegable "Comparsa (opcional)" con el valor "Proyecto final".
Una franja crema #FFF3DC con texto #7A4A00: "Vas a ganar 10 cuñapés cada lunes, miércoles y viernes."
Al pie, a la derecha: botón secundario "Cancelar" y botón principal "Guardar actividad".
```

### P07. Comparsas

```text
Añade una pantalla nueva: "Comparsas" (los proyectos en equipo), con la misma barra de navegación y estilo que la pantalla Hoy. El destino "Comparsas" está activo.
Arriba: título "Comparsas", texto secundario "Tus proyectos en equipo. Cada uno prepara su buri." y, a la derecha, el botón principal "Armar una comparsa".
Debajo, una cuadrícula de tres columnas con tarjetas de proyecto. Cada tarjeta tiene: nombre en Paytone One, porcentaje grande, una regla de cinco marcas, el nombre de la etapa actual, una fila de avatares y la fecha objetivo.
Tarjeta 1: "Proyecto final" · "60 %" · tres marcas verdes de cinco · "Etapa 3: Llegan los horneados" · avatares A, L, S, D · "Para el 28 de noviembre".
Tarjeta 2: "Grupo de estudio de inglés" · "25 %" · una marca verde de cinco · "Etapa 1: Se corre la voz" · avatares A, M, C · "Para el 15 de diciembre".
Tarjeta 3: "Feria de proyectos" · "100 %" · cinco marcas verdes y una etiqueta rosada "¡Buri!" · avatares A, L · "Cerrado el 2 de noviembre".
Tarjeta 4, con borde punteado y un signo más grande: "Armar una comparsa nueva".
Debajo de la cuadrícula, una franja con fondo verde muy claro: "Luis te invitó a la comparsa Tesis de grado" con los botones "Aceptar" (principal) y "Ahora no" (secundario).
```

### P08. La comparsa

```text
Añade una pantalla nueva: detalle del proyecto "Proyecto final", con la misma barra de navegación y estilo que la pantalla Hoy.
Cabecera: enlace "Comparsas" para volver; título "Comparsa: Proyecto final"; texto secundario "Para el 28 de noviembre · 18 de 30 actividades"; a la derecha, cuatro avatares y el botón secundario "Sumar gente".
Cuerpo en dos columnas.
Columna izquierda, ancha: una tarjeta con una ilustración plana y horizontal de un patio donde se prepara una fiesta: un árbol con flores rosadas a la izquierda, banderines de colores colgados, una ramada con techo de palma y, debajo, una mesa con tres canastos de pan. Debajo de la ilustración, una regla de cinco etapas con su nombre: "Se corre la voz" (cumplida), "Se arma el pahuichi" (cumplida), "Llegan los horneados" (cumplida y resaltada), "Afina la tamborita" (siguiente, borde naranja), "¡Buri!" (gris). Debajo: "Hacia la 4ta etapa · faltan 6 actividades" con una barra naranja al 0 %.
Columna derecha: tarjeta "Lo que trajo cada uno" con cuatro barras horizontales en este orden: Ana 7, Diego 2, Luis 5, Sofía 4. Tarjeta "Tiluchi de la semana" con el avatar S, "Sofía" y "Aportó 5 días seguidos". Botón secundario "Mandar un metele".
Abajo, a todo el ancho: tarjeta "Actividades de la comparsa" con pestañas "Pendientes (12)" activa y "Hechas (18)". Tres filas con avatar de la persona asignada: "Diseñar pantalla de reportes · Ana · +25"; "Conectar el store con la API · Luis · +25"; "Redactar el informe final · Diego · +25" con una etiqueta naranja "Pide una mano".
```

### P09. Sumá gente

```text
Añade una ventana modal sobre la pantalla de la comparsa "Proyecto final": invitar personas. Modal blanco de 520 px con esquinas de 24 px y velo oscuro semitransparente. Mismo estilo que la pantalla Hoy.
Contenido:
Título "Sumá gente a la comparsa" y botón de cerrar.
Texto "Entre más manos, más rápido se arma el buri."
Campo "Correo" con el ejemplo "luis@correo.com" y, a su derecha, el botón principal "Invitar".
Separador con la palabra "o".
Etiqueta "Compartí este enlace", un campo de solo lectura con "elay.app/c/proyecto-final-7k2" y un botón secundario "Copiar".
Una caja con fondo verde muy claro y el mensaje ya escrito: "¡Elay! Te invito a mi comparsa Proyecto final. Sumate y preparemos el buri juntos." con un enlace "Copiar mensaje".
Sección "Invitaciones pendientes" con dos filas: "diego@correo.com · Enviada hace 2 días · Reenviar" y "sofia@correo.com · Aceptada", esta con una marca verde.
Al pie, a la derecha: botón secundario "Listo".
```

### P10. Reportes

```text
Añade una pantalla nueva: "Reportes", con la misma barra de navegación y estilo que la pantalla Hoy. El destino "Reportes" está activo.
Arriba: título "Reportes" y, a la derecha, un selector de periodo con "Últimas 5 semanas" y un desplegable "Todas las comparsas".
Primera fila: una franja con la cara de la mujer en un círculo, "Mechi dice" y "Los jueves son tu mejor día; los lunes te cuestan. Vas 21 actividades esta semana."
Segunda fila, dos tarjetas. Izquierda, ancha: "Florada del tajibo", el mismo calendario de flores de la pantalla Hoy pero más grande, con una rama de árbol dibujada arriba, la leyenda "Menos / Más" y un enlace "Ver como tabla". Derecha: "Esta semana" con siete barras verticales para L M X J V S D con los valores 4, 5, 3, 6, 3, 0, 0; la barra del jueves en rosado y las demás en verde.
Tercera fila, tres tarjetas. "Cumplimiento por costumbre" con tres barras horizontales: "Repasar apuntes de Redux · 86 %", "Caminar 30 minutos · 57 %", "Practicar inglés 15 minutos · 33 %". "Únicas y costumbres" con dos cifras grandes: "9 únicas" y "34 costumbres" en las últimas 5 semanas. "Cuñapés por semana" con una línea de cinco puntos que sube y una marca "4to anillo".
Las gráficas son planas, con ejes discretos, sin degradados y sin gráficos de torta.
```

### P11. Mi mesa

```text
Añade una pantalla nueva: perfil y logros, llamada "Mi mesa", con la misma barra de navegación y estilo que la pantalla Hoy.
Cabecera con fondo verde muy claro: avatar grande con la letra A dentro de un arco, nombre "Ana", "4to anillo · 640 cuñapés", una barra de progreso con "Te faltan 60 para el 5to anillo" y el botón secundario "Pinchulear a Nando y Mechi".
Cuerpo en dos columnas.
Columna izquierda, ancha: tarjeta "Horneados" con el subtítulo "Lo que llevás al buri · 6 de 17". Cuadrícula de fichas cuadradas crema, cada una con una ilustración plana de un pan o plato y su nombre: "Velatacú", "Tapeque completo", "Jenecherú de siete", "Comparsa armada", "Se corrió la voz", "A su hora". Después, seis fichas grises bloqueadas con su condición: "Jenecherú de treinta · Racha de 30 días", "Costumbre firme · 4 semanas con la cuota", "Mesa limpia · Cero vencidas", "Casa abierta · 3 invitaciones aceptadas", "Se armó el buri · Cerrar una comparsa", "Buen pariente · 3 rescates".
Columna derecha: tarjeta "Diccionario camba" con "14 de 40 palabras", una lista de cuatro palabras con su significado ("Elay · Hela ahí", "Tapeque · Provisión para el viaje", "Jenecherú · El tizón que guarda el fuego", "Poquingo · Un poco, casi nada") y un enlace "Ver todo". Debajo, tarjeta "Tu ritmo" con tres opciones en píldora: "3 Tranquilo", "5 Constante" (seleccionada), "7 Con todo"; y un interruptor "Siesta: descansar los domingos".
```

### P12. Celebración

```text
Añade una ventana modal de celebración sobre la pantalla Hoy. Modal blanco de 520 px con esquinas de 32 px y velo oscuro semitransparente. Mismo estilo que la pantalla Hoy.
Arriba, dentro de un arco grande con fondo verde muy claro: los dos personajes bailando, cada uno con un pañuelo en alto; el sombrero de él está en el aire. Alrededor, flores rosadas de cinco pétalos que caen.
Debajo, centrado:
Título en Paytone One "¡Tapeque completo!".
Texto "Cumpliste las 5 de hoy. La hiciste buenango."
Tres fichas pequeñas en fila: "+20 cuñapés · Bono del día", "13 días · Jenecherú", "Yapa · Entrada nueva" (esta con una etiqueta amarilla).
Una caja con fondo rosado muy claro: "Tu yapa de hoy: Tajibo · El árbol que florece sin hojas."
Botón principal rosado #C2255C con texto blanco "Seguir" y, debajo, un enlace "Ver mi diccionario".
Sin degradados, sin sombras, sin emojis ni confeti genérico: solo las flores.
```

### P01. Entrá

```text
Añade una pantalla nueva: inicio de sesión de Elay, sin barra de navegación, con los mismos colores, tipografías y estilo que la pantalla Hoy.
Estructura en dos mitades de igual ancho.
Mitad izquierda: fondo verde muy claro #DDEFE2 a toda la altura. Los dos personajes de la pantalla Hoy, grandes, cada uno en su arco (él sobre verde, ella sobre rosado claro), con tres flores rosadas sueltas. Debajo, en Paytone One: "Lo dijiste, lo hiciste. ¡Elay!".
Mitad derecha: fondo blanco con un formulario centrado de 400 px de ancho. Marca "Elay" arriba. Título "¡Elay! Qué bueno verte". Texto "Entrá para seguir con tu tapeque de hoy.". Campo "Correo" con el ejemplo "ana@correo.com". Campo "Contraseña" con un botón para mostrarla. Enlace "Olvidé mi contraseña" alineado a la derecha. Botón principal a todo el ancho "Entrar". Debajo, centrado: "¿Todavía no tenés cuenta?" con el enlace "Sumate".
Muestra el estado de error bajo el campo de contraseña, en rojo #B3261E: "El correo o la contraseña no coinciden. Revisalos y probá de nuevo."
```

### P02. Sumate

```text
Añade una pantalla nueva: registro de Elay, con la misma composición en dos mitades y el mismo estilo que la pantalla de inicio de sesión.
Mitad izquierda, sobre el fondo verde muy claro: título en Paytone One "Tu día, a lo camba" y tres ventajas en lista, cada una con un icono lineal y dos líneas: "Armá tu tapeque · Lo que querés cumplir hoy"; "Guardá el jenecherú · Tu racha, día tras día"; "Sumá a tu comparsa · Preparen el buri juntos". Debajo, los dos personajes en sus arcos, más pequeños.
Mitad derecha, fondo blanco con un formulario centrado de 400 px: título "Sumate a Elay"; campo "Tu nombre"; campo "Correo"; campo "Contraseña" con la ayuda "Mínimo 8 caracteres" y un indicador de fortaleza de tres tramos con dos en verde; casilla "Acepto los términos de uso"; botón principal a todo el ancho "Crear mi cuenta"; debajo "¿Ya tenés cuenta?" con el enlace "Entrá".
Muestra un error de ejemplo bajo el campo de correo, en rojo: "Ese correo ya tiene cuenta. Probá entrar."
```

### P03. Armemos tu tapeque (tres pasos)

**Paso 1.**

```text
Añade una pantalla nueva: recorrido inicial de Elay, paso 1 de 3. Sin barra de navegación; mismo estilo que la pantalla Hoy.
Una tarjeta blanca centrada de 760 px sobre el fondo de página. Arriba, un indicador de tres pasos con el primero activo y "Paso 1 de 3". Dentro, dos zonas: a la izquierda, el personaje del sombrero en su arco verde; a la derecha, el contenido.
Contenido: título en Paytone One "Armemos tu tapeque"; texto "Tu tapeque es lo que te proponés cumplir cada día. ¿Cuánto le metemos?". Tres opciones grandes en fila, cada una con una cifra en Paytone One, un nombre y una línea: "3 · Tranquilo · Para empezar sin apuro"; "5 · Constante · El ritmo de la mayoría" (seleccionada, con borde verde de 2 px y una marca); "7 · Con todo · Para días bien cargados". Debajo, en texto secundario: "Podés cambiarlo cuando querás.". Abajo a la derecha, el botón principal "Seguir".
```

**Paso 2.**

```text
Crea el paso 2 de 3 del recorrido inicial, con la misma tarjeta y el indicador en el segundo paso. A la izquierda, los dos personajes en sus arcos.
Contenido: título "¿Quién te acompaña?"; texto "Los dos están siempre. Elegí quién te habla más.". Tres opciones grandes en fila, cada una con la cara del personaje en un círculo: "Nando · El que anima · Te empuja a arrancar y celebra con vos"; "Mechi · La que ordena · Te ayuda a planificar y cuida tu descanso"; "Los dos · Cada uno en lo suyo" (seleccionada). Abajo: botón secundario "Volver" a la izquierda y botón principal "Seguir" a la derecha.
```

**Paso 3.**

```text
Crea el paso 3 de 3 del recorrido inicial, con la misma tarjeta y el indicador completo. A la izquierda, la mujer del vestido verde en su arco rosado claro.
Contenido: título "Tu primera actividad"; texto "Empezá con algo chico que podás cumplir hoy mismo."; campo "¿Qué querés lograr hoy?" con el texto "Repasar apuntes de Redux"; dos chips "Única" y "Costumbre" (seleccionado); botón principal "Crear y cumplir".
Debajo, muestra el estado de éxito en una caja con fondo rosado muy claro: una ficha crema con un pan pequeño dibujado, "¡Elay! Ganaste tu primer horneado: Velatacú", "+10 cuñapés" y "De regalo: 1 cómper para cuidar tu racha". Botón principal "Ir a mi día".
```

### P04 en teléfono

```text
Crea la versión para teléfono de la pantalla Hoy, de 390 px de ancho, con el mismo estilo.
Una sola columna. Arriba: marca "Elay" a la izquierda y, a la derecha, "4to anillo" y el avatar A.
Portada con fondo verde muy claro: "Viernes 13 de noviembre", título "¡Elay, Ana!" y, a la derecha, solo la mujer del vestido verde de la cintura hacia arriba en su arco rosado claro. Debajo, la tarjeta "Mechi dice: Te falta poquingo: dos más y cerrás el día." con la barra de cinco tramos y "3 de 5".
Después, un carrusel horizontal con las cuatro fichas: "Jenecherú 12 días", "Cómper 2 disponibles", "Nivel 4to anillo", "Palabra de hoy Poquingo".
Después, la lista "Actividades de hoy" con las cinco filas a todo el ancho.
Después, la tarjeta "Comparsa: Proyecto final · 60 %" con la regla de cinco marcas, y la tarjeta "Florada del tajibo".
Abajo, fija: barra de navegación con cuatro destinos con icono y texto ("Hoy" activo, "Actividades", "Comparsas", "Reportes") y, sobre ella, a la derecha, un botón verde circular con el signo más.
```

## 5. Hoja de los personajes

Sirve para explorar los seis estados. El resultado es una referencia: los personajes definitivos se dibujan en SVG a partir de `referencia/personajes.svg`.

```text
Crea una pantalla de guía de estilo titulada "Nando y Mechi: estados", con el mismo sistema de diseño.
Una cuadrícula de tres columnas por dos filas con seis tarjetas blancas. En cada tarjeta, los dos personajes de la pantalla Hoy dentro de sus arcos (él sobre verde, ella sobre rosado claro), con el nombre del estado en Paytone One y una frase debajo. Ilustración plana, sin contornos, sin degradados.
1. "Esperando": él toca el ala del sombrero; ella con una mano en la cintura. Frase: "¿Por cuál arrancamos?"
2. "Animando": él señala al frente con el sombrero en la mano; ella asiente con un pan pequeño en la mano. Frase: "¡Ya arrancaste! Metele."
3. "Feliz": él con los brazos en jarra; ella hace girar el vuelo del vestido. Frase: "Te falta poquingo."
4. "Celebrando": los dos bailan con un pañuelo en alto; el sombrero está en el aire; caen flores rosadas. Frase: "¡Tapeque completo!"
5. "Preocupada": él se rasca la nuca con el sombrero ladeado; ella protege con la mano una brasa encendida. Frase: "Con una actividad lo guardamos hasta mañana."
6. "Descansando": los dos sentados a la sombra, despiertos y conversando; ella sostiene un vaso hecho de calabaza. Frase: "Hoy toca cómper. Mañana seguimos."
```

## 6. Refinamientos propios de este mundo

Uno por mensaje.

| Para lograr | Prompt |
| :--- | :--- |
| Arcos bien resueltos | `Haz que cada personaje quede dentro de un arco de medio punto: un rectángulo vertical con la parte superior semicircular. Los pies tocan la base del arco.` |
| Sombrero correcto | `Cambia el sombrero del hombre por uno de paja clara, de copa redonda baja y ala media, con una cinta más oscura. No es un sombrero mexicano ni de vaquero.` |
| Vestido correcto | `Cambia el vestido de la mujer por uno suelto, de una pieza, verde, con un volado en el escote y otro en el ruedo, ambos con ribete blanco. No es un traje de flamenca.` |
| Flores como dato | `En la tarjeta Florada del tajibo, usa flores de cinco pétalos redondos en lugar de cuadrados. El tamaño de la flor indica cuánto se cumplió ese día.` |
| Menos rosado | `Reduce el uso del rosado: déjalo solo en el porcentaje del proyecto, la ficha Palabra de hoy y las flores. Todo lo demás en verde, blanco y texto oscuro.` |
| Barra en tramos | `Convierte la barra de progreso de la tarjeta de diálogo en cinco tramos iguales separados por un espacio pequeño, con tres tramos llenos en verde.` |
| Regla de etapas legible | `En la tarjeta de la comparsa, escribe el nombre de la etapa actual bajo la regla de cinco marcas: "Llegan los horneados".` |
| Tono de piel y rasgos | `Dibuja a los dos personajes con piel morena cálida, cabello oscuro y rasgos simples y amables, sin exagerar ninguno.` |

## 7. Errores previsibles y cómo corregirlos

| Lo que puede pasar | Por qué | Corrección |
| :--- | :--- | :--- |
| Los personajes salen distintos en cada pantalla | Stitch genera cada imagen por separado | Aceptarlo en esta fase; pedir "los mismos dos personajes de la pantalla Hoy" y reemplazar por los SVG al implementar |
| Personajes realistas o en 3D | El modelo tiende al realismo si no se le fija el estilo | `Redibuja a los personajes en estilo plano y geométrico, con formas llenas, sin contornos, sin volumen y sin sombreado.` |
| Sombrero mexicano o vestido de flamenca | "Traje típico" es ambiguo para el modelo | Usar los refinamientos de sombrero y vestido de la sección 6 |
| Rasgos caricaturescos | Sesgos del modelo al representar culturas | Refinamiento de tono de piel y rasgos; si persiste, pedir siluetas planas |
| "Poquingo" corregido a "poquito" o "jenecherú" mal escrito | Autocorrección | Mensaje de vocabulario de la sección 1 |
| Emojis en lugar de iconos (fuego, pan, flor) | Atajo habitual del modelo | `Quita todos los emojis y reemplázalos por iconos planos del sistema de diseño.` |
| Calendario de cuadrados en lugar de flores | Reconoce el patrón de mapa de calor | Refinamiento "Flores como dato" |
| Barra de proyecto simple en lugar de la escena | La ilustración es lo más difícil de pedir | Generar primero la regla de cinco etapas; pedir la escena del patio en un mensaje aparte |
| Texto en español neutro ("tienes", "quieres") | El modelo normaliza el voseo | `Mantén el voseo en todos los textos: tenés, querés, cerrás, podés, entrá, sumate. No lo cambies a tú.` |
| Confeti de colores en la celebración | Recurso genérico de celebración | `Reemplaza el confeti por flores rosadas de cinco pétalos que caen.` |
