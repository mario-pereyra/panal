# Prompts para Stitch: Elay con Toco

Textos listos para copiar en Stitch y generar las doce pantallas de la dirección D. Cada bloque es un mensaje completo.

## Tabla de contenidos

1. [Cómo usar este archivo](#1-cómo-usar-este-archivo)
2. [Orden de generación](#2-orden-de-generación)
3. [Prompt 0: arranque y pantalla Hoy](#3-prompt-0-arranque-y-pantalla-hoy)
4. [Un prompt por pantalla](#4-un-prompt-por-pantalla)
5. [Hoja de la mascota](#5-hoja-de-la-mascota)
6. [Refinamientos propios de este mundo](#6-refinamientos-propios-de-este-mundo)
7. [Errores previsibles y cómo corregirlos](#7-errores-previsibles-y-cómo-corregirlos)

---

## 1. Cómo usar este archivo

1. Lee primero `../00-base-comun/guia-stitch.md`: explica el flujo completo, cómo cargar el `DESIGN.md` y los prompts de corrección generales.
2. Crea un proyecto web en Stitch, carga el `DESIGN.md` de esta carpeta y sube las imágenes de `referencia/` (la pantalla "Hoy" y Toco).
3. Envía el Prompt 0 en sus dos partes. No sigas hasta que "Hoy" te convenza: todas las demás pantallas piden parecerse a ella.
4. Genera el resto en el orden de la tabla, un bloque por mensaje. Si algo sale mal, usa las secciones 6 y 7 antes de reescribir el prompt.

Los textos de interfaz están en voseo camba y con las palabras del mundo. Cópialos tal cual, con tildes y eñes.

## 2. Orden de generación

| Paso | Pantalla | Por qué en este orden |
| :---: | :--- | :--- |
| 1 | Prompt 0-A y 0-B · P04 Hoy | Ancla visual: fija navegación, portada, tarjetas y a Toco |
| 2 | P05 Actividades | Reutiliza las filas de actividad |
| 3 | P06 Nueva actividad | Fija el estilo de los formularios |
| 4 | P08 Comparsa | Fija el mapa de anillos grande |
| 5 | P07 Comparsas | Reutiliza el mapa en miniatura |
| 6 | P10 Reportes | Reutiliza la florada y añade las otras gráficas |
| 7 | P11 Mi tajibo | Introduce el álbum |
| 8 | P12 Celebración y P09 Invitar | Ventanas modales sobre pantallas ya hechas |
| 9 | P01, P02 y P03 | Entrada: más simples, heredan todo lo anterior |
| 10 | P04 en teléfono y hoja de la mascota | Cierre |

## 3. Prompt 0: arranque y pantalla Hoy

Es el único prompt largo y por eso va en dos mensajes seguidos. El primero crea el proyecto, el estilo, la navegación y la portada; el segundo llena las tres tarjetas.

**Prompt 0-A**

```text
Diseña una aplicación web de escritorio llamada "Elay": una plataforma gamificada para organizar y cumplir actividades, sola o en equipo, con identidad de Santa Cruz de la Sierra, Bolivia. Ambiente cálido, frondoso, festivo y claro, como un patio con sombra y un árbol en flor. Ilustración plana y geométrica. Sin degradados, sin sombras, sin fotografías y sin emojis.

Sistema visual: fondo de página #F7FAF6; tarjetas blancas con borde fino #CFE0D5 y esquinas de 24 px; verde principal #0D7339; rosado #C2255C solo para lo cumplido; naranja #F58A1F y amarillo #FFC533 como acentos; texto #10261A y texto secundario #4C6355. Títulos, botones y cifras en Paytone One; todo lo demás en Figtree. Botones con forma de píldora. Todas las imágenes y los iconos siguen esta paleta.

Crea la pantalla "Hoy". Arriba, una barra de navegación: a la izquierda la marca "Elay" en verde junto a una flor rosada de cinco pétalos; al centro los destinos "Hoy" (activo, píldora verde con texto blanco), "Actividades", "Comparsas" y "Reportes"; a la derecha el texto "Nivel 4 · Rama 4" y un avatar circular rosado con la letra "A".

Debajo, una portada verde #0D7339 a todo el ancho con esquinas de 28 px, en tres zonas. Izquierda: "VIERNES 13 DE NOVIEMBRE" en mayúsculas pequeñas, el título muy grande "¡Elay, Ana!", el texto "Ya van 3 de 5. Cada actividad pinta un tramo del pico de Toco: dos más y queda entero." y un botón blanco con texto verde oscuro "Nueva actividad". Centro: sobre un círculo rosado pálido #F9B8CF, un tucán negro de perfil que mira a la derecha, con pecho blanco y sombrero de paja con cinta verde, posado en una rama parda con flores rosadas; su pico grande está dividido en 5 tramos por líneas oscuras: los 3 primeros pintados de amarillo, ámbar y naranja, y los 2 de la punta en crema. Derecha: tres fichas blancas apiladas con icono, título y explicación: "Jenecherú de 12 días" con "Tu racha: el fuego que no se apaga" (icono de llama); "2 hamacas" con "Días de descanso que cuidan tu racha" (icono de hamaca); "Rama 4" con "Te faltan 60 cuñapés para la rama 5" (icono de rama con flor).

Debajo de la portada deja tres tarjetas blancas iguales en fila con los títulos "Actividades de hoy", "Comparsa: Proyecto final" y "Florada del tajibo". Su contenido va en el siguiente mensaje.
```

**Prompt 0-B**

```text
Completa las tres tarjetas de la pantalla Hoy sin cambiar la barra de navegación ni la portada.

Tarjeta izquierda, "Actividades de hoy", con "3 de 5" a la derecha del título. Cinco filas, cada una con una marca circular a la izquierda, el título en negrita, el tipo debajo en texto secundario y los puntos a la derecha:
"Repasar apuntes de Redux" · "Recurrente · diaria" · "+10" (hecha)
"Caminar 30 minutos" · "Recurrente · diaria" · "+10" (hecha)
"Entregar informe de avance" · "Única · vence hoy" · "+25" (hecha)
"Diseñar pantalla de reportes" · "Única · Proyecto final" · "+25" (pendiente)
"Practicar inglés 15 minutos" · "Recurrente · lunes, miércoles y viernes" · "+10" (pendiente)
Las hechas llevan un círculo rosado #C2255C con visto blanco y los puntos en verde; las pendientes, un círculo vacío con borde gris verdoso. No taches los títulos. Al pie, una moneda dorada pequeña y "45 cuñapés ganados hoy".

Tarjeta central, "Comparsa: Proyecto final", con "60 %" a la derecha y debajo "Van por el 3er anillo de 5 · 18 de 30 actividades". A la izquierda, un mapa de cinco anillos concéntricos gruesos: los tres interiores en verde y los dos exteriores en gris claro, un cuadrado rosado pequeño en el centro, un punto naranja con borde blanco sobre el tercer anillo y una línea celeste curva a la izquierda que representa un río. A la derecha, la lista de integrantes con avatar de inicial y cantidad: "Ana 7", "Luis 5", "Sofía 4", "Diego 2". Al pie: "La plaza es el punto de partida; el punto naranja es la comparsa."

Tarjeta derecha, "Florada del tajibo", con el subtítulo "Últimas 5 semanas: cada día cumplido es una flor". Una cuadrícula de 7 columnas con encabezados "L M X J V S D" y 5 filas de círculos rosados en cuatro tamaños: cuanto más grande y oscuro, más actividades ese día; los más grandes llevan un centro amarillo. El de hoy tiene borde oscuro y los dos últimos son aros grises vacíos. Leyenda al pie: "Menos", cuatro círculos crecientes, "Más" y, a la derecha, "Hoy con borde".
```

## 4. Un prompt por pantalla

### P01 · Entrar

```text
Crea la pantalla "Entrar" de Elay (inicio de sesión) con el mismo estilo que la pantalla Hoy. Sin barra de navegación.

Dos mitades. A la izquierda, un panel verde #0D7339 de alto completo con esquinas de 28 px: arriba la marca "Elay" en blanco con su flor rosada; al centro, sobre un círculo rosado pálido #F9B8CF, el tucán con sombrero de paja posado en su rama, con el pico de 5 tramos sin pintar, en crema; debajo, en Paytone One blanco, "Lo que cumplís, florece." y una línea más pequeña: "Cada actividad pinta un tramo del pico de Toco."

A la derecha, sobre el fondo #F7FAF6, una tarjeta blanca centrada de 440 px de ancho con: el título "¡Elay! Entrá a tu cuenta"; el campo "Correo" con el ejemplo "ana@ejemplo.com"; el campo "Contraseña" con un icono para mostrarla; el enlace pequeño "¿Olvidaste tu contraseña?" alineado a la derecha; el botón principal verde de ancho completo "Entrar"; una línea divisoria y el texto "¿Primera vez por aquí?" con el enlace "Creá tu cuenta".

Las etiquetas van siempre visibles encima de cada campo. Un solo botón principal. Sin degradados, sin sombras y sin emojis.
```

### P02 · Crear cuenta

```text
Crea la pantalla "Crear cuenta" de Elay con el mismo estilo que la pantalla Hoy. Sin barra de navegación.

Dos mitades. A la izquierda, un panel verde #0D7339 de alto completo con esquinas de 28 px: arriba la marca "Elay" en blanco con su flor rosada; al centro el tucán con sombrero de paja sobre un círculo rosado pálido, con el pico de 5 tramos todos en crema; debajo el título blanco "Empezamos con el pico en blanco." y tres líneas con icono: "Anotá lo que querés cumplir" (icono de lista), "Pintá un tramo del pico con cada actividad" (icono de flor) y "Sumate a una comparsa y crucen la ciudad" (icono de anillos concéntricos).

A la derecha, sobre el fondo #F7FAF6, una tarjeta blanca centrada de 460 px con: el título "Creá tu cuenta"; el campo "Nombre" con el ejemplo "Ana"; el campo "Correo" con "ana@ejemplo.com"; el campo "Contraseña" con la ayuda "Mínimo 8 caracteres" y un icono para mostrarla; el botón principal verde de ancho completo "Crear cuenta"; y el texto "¿Ya tenés cuenta?" con el enlace "Entrá".

Muestra el campo "Correo" en estado de error: borde rojo pardo #A6321B y debajo, sobre fondo #FDECE6, el mensaje "Ese correo ya tiene cuenta. ¿Querés entrar?". Etiquetas siempre visibles encima de cada campo. Sin degradados, sin sombras y sin emojis.
```

### P03 · Primeros pasos

```text
Crea la pantalla "Primeros pasos" de Elay, que aparece justo después de crear la cuenta. Mismo estilo que la pantalla Hoy, sin barra de navegación; solo la marca "Elay" con su flor arriba a la izquierda.

Arriba al centro, un indicador de tres pasos unidos por una línea: "1 · Tu meta" (activo, círculo verde), "2 · Tu primera actividad" y "3 · Primer tramo" (los dos en gris).

Al centro, una tarjeta blanca ancha en dos zonas. A la izquierda, sobre un círculo rosado pálido #F9B8CF, el tucán con sombrero de paja y el pico en crema, con un globo de texto blanco: "¡Elay! Soy Toco. Decime cuántas actividades querés cumplir por día y divido mi pico en esos tramos."
A la derecha, el título "¿Cuántas por día?" y tres opciones grandes en fila, cada una con un pico pequeño dividido en ese número de tramos, una cifra grande, un nombre y una línea: "3 · Tranquila · Para empezar sin apuro"; "5 · Constante · La más elegida" (seleccionada: borde verde de 3 px y visto verde en la esquina); "7 · Intensa · Para días con mucho por hacer". Debajo, en texto secundario: "La podés cambiar cuando quieras desde Mi tajibo."

Abajo a la derecha de la tarjeta, el botón principal verde "Seguir"; abajo a la izquierda, el enlace "Saltar por ahora". Sin degradados, sin sombras y sin emojis.
```

Variantes para los pasos 2 y 3 (envíalas después, una por mensaje):

```text
Crea una variante de la pantalla Primeros pasos para el paso 2, con el indicador activo en "2 · Tu primera actividad". El globo de Toco dice: "Empezá por algo chico. Lo importante es pintar el primero." A la derecha: el título "Tu primera actividad", el campo "¿Qué querés cumplir hoy?" con el ejemplo "Repasar apuntes de Redux", tres sugerencias en píldora ("Caminar 30 minutos", "Leer 10 páginas", "Ordenar el escritorio") y el botón principal verde "Anotarla". Mantén todo lo demás igual.
```

```text
Crea una variante de la pantalla Primeros pasos para el paso 3, con el indicador activo en "3 · Primer tramo". El tucán aparece con un ala levantada y el primer tramo del pico pintado de amarillo. A la derecha: el título "¡Primer tramo pintado!", una fila de actividad "Repasar apuntes de Redux · +25" con círculo rosado y visto blanco, y dos fichas sobre fondo crema #FFF3DC: "Ganaste la lámina El curucusí · La primera lucecita de tu álbum" y "Te regalamos 1 hamaca · Cuida tu racha si un día no podés". Botón principal verde "Ir a Hoy". Mantén todo lo demás igual.
```

### P04 · Hoy en teléfono

La versión de escritorio es el Prompt 0.

```text
Crea la versión para teléfono de la pantalla Hoy de Elay, de 390 px de ancho, con los mismos colores, tipografías y componentes.

Una sola columna. Arriba, una barra con la marca "Elay" y su flor a la izquierda y, a la derecha, "Rama 4" y el avatar rosado con la letra "A".
Portada verde #0D7339 con esquinas de 28 px: "VIERNES 13 DE NOVIEMBRE", el título "¡Elay, Ana!", el texto "Ya van 3 de 5. Dos más y el pico queda entero." y, centrado debajo, el tucán con sombrero sobre un círculo rosado pálido, con el pico de 5 tramos y 3 pintados.
Debajo, una fila deslizable de tres fichas blancas: "Jenecherú de 12 días", "2 hamacas" y "Rama 4 · faltan 60".
Después, la tarjeta "Actividades de hoy" con "3 de 5" y cinco filas: "Repasar apuntes de Redux +10" (hecha), "Caminar 30 minutos +10" (hecha), "Entregar informe de avance +25" (hecha), "Diseñar pantalla de reportes +25" (pendiente) y "Practicar inglés 15 minutos +10" (pendiente); al pie, "45 cuñapés ganados hoy".
Después, la tarjeta "Comparsa: Proyecto final · 60 %" con el mapa de cinco anillos y "3er anillo de 5", y la tarjeta "Florada del tajibo" con la cuadrícula de 7 columnas.
Abajo, fija, una barra de navegación blanca con cuatro destinos con icono y texto: "Hoy" (activo en verde), "Actividades", "Comparsas" y "Reportes". Sobre ella, a la derecha, un botón redondo verde flotante con el signo más. Sin degradados, sin sombras y sin emojis.
```

### P05 · Actividades

```text
Crea la pantalla "Actividades" de Elay con la misma barra de navegación, colores, tipografías y tarjetas que la pantalla Hoy. El destino activo es "Actividades".

Arriba, el título grande "Actividades" a la izquierda y el botón principal verde "Nueva actividad" a la derecha. Debajo, cuatro pestañas en píldora con su cantidad: "Hoy 5" (activa), "Próximas 8", "Recurrentes 6" y "Archivadas 3". Debajo, filtros pequeños: "Todas" (seleccionado), "Únicas", "Recurrentes" y "De comparsa".

Dos columnas. A la izquierda, en dos tercios, una tarjeta blanca con las mismas filas que en Hoy (marca circular, título, tipo y puntos): "Repasar apuntes de Redux · Recurrente · diaria · +10" (hecha), "Caminar 30 minutos · Recurrente · diaria · +10" (hecha), "Entregar informe de avance · Única · vence hoy · +25" (hecha), "Diseñar pantalla de reportes · Única · Proyecto final · +25" (pendiente) y "Practicar inglés 15 minutos · Recurrente · lunes, miércoles y viernes · +10" (pendiente). Las pendientes muestran al final tres iconos lineales: editar, posponer y archivar.

A la derecha, en un tercio, dos tarjetas. "Tu día": la cabeza del tucán con sombrero y su pico de 5 tramos con 3 pintados, la cifra "3 de 5" y "45 cuñapés ganados hoy". Y, sobre fondo crema #FFF3DC, "Consejo de Toco": "Las únicas valen 25 cuñapés y las recurrentes 10. Las dos pintan un tramo.", con el enlace "Cómo se ganan los cuñapés".

Sin degradados, sin sombras y sin emojis.
```

### P06 · Nueva actividad

```text
Crea la pantalla "Nueva actividad" de Elay con la misma barra de navegación y estilo que la pantalla Hoy. El destino activo es "Actividades".

Arriba, el enlace "Volver a Actividades" con flecha y el título "Nueva actividad". Dos columnas.

A la izquierda, una tarjeta blanca con el formulario, con las etiquetas siempre visibles encima de cada campo:
"¿Qué querés cumplir?" con el texto "Practicar inglés 15 minutos".
"Tipo": control de dos opciones, "Única" y "Recurrente" (seleccionada, en verde).
"Se repite": cuatro opciones en píldora, "Todos los días", "Días de la semana" (seleccionada), "Veces por semana" y "Día del mes"; debajo, siete círculos "L M X J V S D" con L, X y V seleccionados en verde.
"Prioridad": "Normal" (seleccionada) y "Alta".
"Comparsa (opcional)": lista desplegable con "Sin comparsa".
Al pie de la tarjeta, el botón principal verde "Guardar actividad" y el botón de texto "Cancelar".

A la derecha, una tarjeta crema #FFF3DC titulada "Así se va a ver": una fila de actividad con círculo vacío, "Practicar inglés 15 minutos", "Recurrente · lunes, miércoles y viernes" y "+10"; debajo, la cabeza del tucán con un tramo del pico resaltado y el texto "Cada vez que la cumplís pinta un tramo y suma 10 cuñapés."; y en texto secundario: "Las únicas valen 25."

Un solo botón principal. Sin degradados, sin sombras y sin emojis.
```

### P07 · Comparsas

```text
Crea la pantalla "Comparsas" de Elay (los proyectos en equipo) con la misma barra de navegación y estilo que la pantalla Hoy. El destino activo es "Comparsas".

Arriba, el título grande "Comparsas", el subtítulo "Tus proyectos en equipo. Cada 20 % la comparsa cruza un anillo." y, a la derecha, el botón principal verde "Nueva comparsa".

Debajo, tres tarjetas blancas iguales en fila.
Primera: "Proyecto final" con "60 %"; un mapa pequeño de cinco anillos concéntricos con los tres interiores en verde, los dos exteriores en gris claro, un cuadrado rosado al centro y un punto naranja sobre el tercer anillo; "3er anillo de 5 · 18 de 30 actividades"; cuatro avatares circulares con las iniciales A, L, S y D; al pie, "Buri previsto: 5 de diciembre" y el enlace "Abrir comparsa".
Segunda: "Grupo de inglés" con "25 %"; el mismo mapa con solo el primer anillo en verde; "1er anillo de 5 · 5 de 20 actividades"; tres avatares con A, M y C; "Buri previsto: 20 de diciembre" y "Abrir comparsa".
Tercera, con borde punteado verde y fondo #F7FAF6: un icono de anillos, el título "Armá una comparsa nueva", el texto "Poné un nombre, una fecha y sumá gente." y el botón secundario "Empezar".

Debajo, una franja crema #FFF3DC con un icono de vasija redonda y el texto "Sofía te invitó un somó por tu aporte de ayer.", con el enlace "Devolver el gesto".

Sin degradados, sin sombras y sin emojis.
```

### P08 · Comparsa

```text
Crea la pantalla "Comparsa: Proyecto final" de Elay con la misma barra de navegación y estilo que la pantalla Hoy. El destino activo es "Comparsas".

Encabezado: enlace "Volver a Comparsas", título "Comparsa: Proyecto final", la cifra "60 %" y "3er anillo de 5 · 18 de 30 actividades · Faltan 6 para el 4to". A la derecha, el botón principal verde "Invitar comparseros".

Tres columnas.
Izquierda, tarjeta "El recorrido": un mapa grande de cinco anillos concéntricos gruesos, los tres interiores verdes y los dos exteriores gris claro; un cuadrado rosado al centro con la etiqueta "Plaza"; una línea celeste curva a la izquierda con la etiqueta "Río"; un punto naranja sobre el tercer anillo. Debajo, cinco pasos en fila: "1er", "2do" y "3er" con visto verde; "4to" y "5to · Buri" en gris.
Centro, tarjeta "Comparseros": filas con avatar, nombre, barra verde y cantidad: "Ana 7", "Luis 5", "Sofía 4", "Diego 2", cada una con el botón pequeño "Invitar un somó". Debajo, sobre crema: "Tiluchi de la semana: Sofía · aportó 4 días" y "Abrió el 3er anillo: Luis".
Derecha, tarjeta "Actividades de la comparsa": "Diseñar pantalla de reportes · Ana" (pendiente), "Conectar la base de datos · Luis" (hecha), "Redactar conclusiones · Diego" (pendiente, con etiqueta ámbar "Pidió una mano" y botón secundario "Dar una mano") y "Preparar la presentación · Sofía" (pendiente).

Al pie: "Al cerrar el 5to anillo se arma el buri." Sin degradados, sin sombras y sin emojis.
```

### P09 · Invitar comparseros

```text
Crea una ventana modal "Invitar comparseros" de Elay sobre la pantalla "Comparsa: Proyecto final", oscurecida con un velo verde muy oscuro semitransparente. Mismo estilo que la pantalla Hoy.

La ventana es una tarjeta blanca centrada de 560 px de ancho con esquinas de 28 px y un botón de cerrar arriba a la derecha.
Arriba: el título "Invitar comparseros" y el texto "Sumá gente a la comparsa Proyecto final. Quien acepte ve el mapa y las actividades."
Primer bloque, "Por correo": un campo con la etiqueta "Correo" y el ejemplo "nombre@ejemplo.com" y, a su derecha, el botón principal verde "Enviar invitación".
Una línea divisoria con la palabra "o".
Segundo bloque, "Con un enlace": un campo de solo lectura con "ejemplo.com/sumate/7KQ2-M9" y, a su derecha, el botón secundario "Copiar enlace". Debajo, en texto secundario: "El enlace vence en 7 días."
Tercer bloque, "Invitaciones pendientes": dos filas con icono de sobre, correo, estado y acción: "marcos@ejemplo.com · enviada hace 2 días · Reenviar" y "carla@ejemplo.com · enviada hoy · Cancelar".
Al pie, una franja crema #FFF3DC con la cabeza pequeña del tucán con sombrero y el texto "Con tres invitaciones aceptadas ganás la lámina La tutuma."

Un solo botón principal. Sin degradados, sin sombras y sin emojis.
```

### P10 · Reportes

```text
Crea la pantalla "Reportes" de Elay con la misma barra de navegación y estilo que la pantalla Hoy. El destino activo es "Reportes".

Arriba, el título "Reportes" y, a la derecha, un selector de periodo en píldoras: "5 semanas", "3 meses" (seleccionado) y "Todo". Debajo, cuatro fichas blancas con cifra grande: "640 cuñapés en total", "Jenecherú de 12 días", "71 % de días con el pico pintado" y "Rama 4 · faltan 60".

Cuadrícula de dos columnas con cuatro tarjetas.
"Florada del tajibo": cuadrícula de 7 columnas "L M X J V S D" y 12 filas de círculos rosados en cuatro tamaños, los más grandes con centro amarillo; leyenda "Menos" a "Más".
"Una rama por actividad": tres filas, cada una con el nombre, una rama parda horizontal con flores rosadas (cumplida) o botones verdes cerrados (sin cumplir) y su cifra: "Repasar apuntes de Redux · 6 de 7 · 86 %", "Caminar 30 minutos · 4 de 7 · 57 %", "Practicar inglés 15 minutos · 2 de 3 · 67 %".
"Cuñapés por semana": seis barras verticales verdes de punta redonda con su valor encima: "S1 70", "S2 95", "S3 110", "S4 120", "S5 150" y "S6 95"; la última en naranja con la etiqueta "en curso".
"Únicas y recurrentes": una barra horizontal partida en verde "38 recurrentes" y rosado "12 únicas"; debajo, "Comparsa: Proyecto final · 60 %" con barras de aporte "Ana 7", "Luis 5", "Sofía 4", "Diego 2".

Cada gráfica lleva sus cifras escritas. Sin degradados, sin sombras y sin emojis.
```

### P11 · Mi tajibo

```text
Crea la pantalla "Mi tajibo" de Elay (perfil y logros) con la misma barra de navegación y estilo que la pantalla Hoy. Ningún destino activo; el avatar de la derecha aparece resaltado.

Tres columnas.
Izquierda, una tarjeta alta de fondo verde #0D7339: la ilustración plana de un árbol de tronco pardo con diez ramas numeradas de abajo hacia arriba; las ramas 1 a 3 llenas de flores rosadas, la rama 4 con tres flores y el tucán con sombrero posado en ella, y las ramas 5 a 10 sin flores. Debajo, en blanco: "Rama 4 · El mirador", una barra de progreso con "190 de 250 cuñapés" y "Te faltan 60 para la rama 5".
Centro, tarjeta "Álbum del monte" con "4 de 17 láminas": cuadrícula de láminas cuadradas. Cuatro ganadas sobre fondo crema con ilustración plana y nombre: "El curucusí", "El tucán", "El tajibo" y "El jochi". Tres sin ganar sobre gris claro, en silueta, con su criterio: "El toborochi · Jenecherú de 30 días · vas 12", "El piyo · 10 únicas a tiempo · vas 6" y "El pahuichi · Armá una comparsa". Debajo, "Visitas en la rama · 4 de 15": cuatro círculos con picaflor, mariposa azul, cardenal y rana de árbol.
Derecha, tarjeta "Ajustes": "Meta diaria" con "3", "5" (seleccionada) y "7"; "Día de siesta" con la lista "Domingo"; "Salir de viaje" con "Pausá hasta 14 días con todo guardado" y el botón secundario "Armar el tapeque"; y "Pinchulear a Toco" con cuatro círculos de color para la cinta del sombrero.

Sin degradados, sin sombras y sin emojis.
```

### P12 · Celebración

```text
Crea una ventana modal de celebración de Elay sobre la pantalla Hoy, oscurecida con un velo verde muy oscuro semitransparente. Mismo estilo que la pantalla Hoy.

La ventana es una tarjeta blanca centrada de 520 px de ancho con esquinas de 28 px.
Arriba, una ilustración plana sobre un círculo rosado pálido #F9B8CF: el tucán negro con las alas abiertas, su sombrero de paja en el aire sobre la cabeza y el pico grande con los 5 tramos pintados de amarillo, ámbar, naranja, rosado y rosado intenso; a su lado, posado en la misma rama, un picaflor verde pequeño; alrededor, cinco flores rosadas de cinco pétalos cayendo.
Debajo, centrado: el título grande "¡Pico pintado!", el texto "Cumpliste tus 5 actividades de hoy. Quedó de punta a punta." y tres fichas pequeñas sobre fondo crema #FFF3DC: "+20 cuñapés · por el día redondo", "Jenecherú de 12 días · sigue encendido" y "Rama 4 · te faltan 5 para la rama 5".
Debajo, una franja con borde fino verde: un icono de picaflor, el título "Hoy vino visita" y el texto "Un picaflor se posó en la rama. Ya está en tu álbum.", con el enlace "Ver el álbum".
Al pie, el botón principal verde de ancho completo "Seguir" y, debajo, el enlace de texto "Ver mi florada".

Un solo botón principal. Sin degradados, sin sombras y sin emojis.
```

## 5. Hoja de la mascota

Sirve para decidir la postura de cada estado. El dibujo definitivo se hace en SVG al implementar (ver `direccion-visual.md`, sección 6).

```text
Crea una lámina de personaje titulada "Toco: seis estados" con el mismo estilo plano de Elay, sobre fondo #F7FAF6.

Seis recuadros blancos iguales en dos filas de tres, con esquinas de 24 px. En cada uno, el mismo personaje: un tucán de formas geométricas simples, cuerpo y cabeza negros, pecho blanco, ojo con aro naranja, pico grande dividido en 5 tramos por líneas oscuras y sombrero de paja con cinta verde, de perfil y mirando a la derecha, sobre una rama parda y un círculo rosado pálido #F9B8CF. Debajo de cada dibujo, el nombre del estado en Paytone One y una frase en Figtree.
1. "Esperando": recto, cabeza apenas ladeada, pico entero en crema. "¿Por cuál empezamos?"
2. "Animando": un ala levantada, primer tramo amarillo. "¡Primer tramo pintado!"
3. "Feliz": pecho inflado, ojo en arco, sombrero hacia atrás, tres tramos pintados. "Ya van 3 de 5."
4. "Celebrando": alas abiertas, sombrero en el aire, cinco tramos pintados de amarillo a rosado, flores cayendo. "¡Pico pintado!"
5. "Preocupada": encogido, abriga con un ala un tizón con una llama pequeña, sombrero bajo. "El jenecherú sigue encendido."
6. "Descansando": echado en una hamaca verde colgada de la rama, sombrero sobre los ojos. "Hoy toca siesta."

Mismo tamaño, mismos colores y mismo grosor de línea en los seis. Colores planos, sin degradados, sin sombras, sin textura de plumas y sin emojis.
```

## 6. Refinamientos propios de este mundo

Uno por mensaje, sobre la pantalla que lo necesite.

| Para | Prompt |
| :--- | :--- |
| El pico | `En el tucán, divide el pico en exactamente 5 tramos verticales separados por líneas oscuras. Pinta los 3 más cercanos a la cabeza de amarillo #FFC533, ámbar #FFA928 y naranja #F58A1F, y deja los 2 de la punta en crema #FFF3DC.` |
| El estilo de Toco | `Redibuja el tucán con formas geométricas planas: elipse negra para el cuerpo, círculo para la cabeza, pecho blanco y pico poligonal grande. Sin textura de plumas, sin sombras y sin contorno salvo en el pico.` |
| El sombrero | `Cambia el sombrero del tucán por uno de paja de ala corta y copa redonda, color #F3DA9A con una cinta verde #0D7339, inclinado hacia atrás.` |
| El mapa de anillos | `En la tarjeta de la comparsa, reemplaza el gráfico por un mapa de cinco anillos concéntricos del mismo grosor, con los tres interiores en verde #0D7339 y los dos exteriores en #DCE7DF, y un punto naranja con borde blanco sobre el tercero.` |
| La florada | `En la tarjeta Florada del tajibo usa solo círculos rosados de cuatro tamaños alineados en 7 columnas. Quita los cuadrados y cualquier color verde de esa gráfica.` |
| El rosado | `Usa el rosado #C2255C solo en las marcas de actividad hecha, las flores y el avatar. Todos los botones y enlaces van en verde #0D7339.` |
| El voseo | `Reescribe los textos de botones y ayudas en voseo: "Creá", "Entrá", "Completá", "Tenés", "Querés". No uses "tú" ni "usted".` |
| Las palabras propias | `Debajo de "Jenecherú de 12 días", "2 hamacas" y "Rama 4" deja siempre su línea de explicación en texto secundario.` |

## 7. Errores previsibles y cómo corregirlos

| Lo que puede salir | Corrección |
| :--- | :--- |
| Un tucán realista o con el pico en degradado | Refinamiento "El estilo de Toco" y después "El pico" |
| Sombrero mexicano, de vaquero o de copa | Refinamiento "El sombrero" |
| Los anillos convertidos en gráfico de dona o barra circular | Refinamiento "El mapa de anillos" |
| La florada como mapa de calor de cuadrados verdes | Refinamiento "La florada" |
| Hojas tropicales o fondos de selva de relleno | `Quita las hojas, lianas y fondos de selva. Los fondos son de color plano.` |
| Palabras cambiadas ("Jengibre", "cunapes", "Eley") | `Escribe exactamente estas palabras, con sus tildes y eñes: "Elay", "Jenecherú", "cuñapés", "comparsa", "tajibo".` |
| "Anillo" usado para el nivel personal | `El nivel personal se escribe "Rama 4". La palabra "anillo" solo aparece en la tarjeta de la comparsa.` |
| Toco dormido en la hamaca en pantallas donde no corresponde | `Muestra al tucán despierto y posado en su rama. La hamaca aparece solo como icono en la ficha "2 hamacas".` |
| Texto en "tú" o en inglés | Refinamiento "El voseo" o la corrección de idioma de la guía |
| Emojis de flores o aves | `Quita todos los emojis y reemplázalos por iconos planos de la paleta.` |
| Toco distinto en cada pantalla | Es esperable. Pide el mismo espacio y tamaño; el personaje final se reemplaza por el SVG propio (guía, sección 5) |
