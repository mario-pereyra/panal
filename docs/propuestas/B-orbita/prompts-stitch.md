# Prompts para Stitch: Órbita

Textos listos para copiar y pegar en Stitch (stitch.google.com) y generar las pantallas del mundo **B · Órbita**. Cada bloque es un mensaje: se copia entero, sin el título. Están en español para que la interfaz salga en español.

## Tabla de contenidos

1. [Cómo usar este archivo](#1-cómo-usar-este-archivo)
2. [Orden de generación](#2-orden-de-generación)
3. [Prompt 0: arranque del proyecto y pantalla Hoy](#3-prompt-0-arranque-del-proyecto-y-pantalla-hoy)
4. [Un prompt por pantalla](#4-un-prompt-por-pantalla)
5. [Hoja de la mascota](#5-hoja-de-la-mascota)
6. [Refinamientos propios de Órbita](#6-refinamientos-propios-de-órbita)
7. [Errores previsibles y cómo corregirlos](#7-errores-previsibles-y-cómo-corregirlos)

---

## 1. Cómo usar este archivo

1. Lee antes `../00-base-comun/guia-stitch.md`: explica el flujo completo, cómo cargar el `DESIGN.md` y los prompts de corrección generales.
2. Crea un proyecto en modo web, carga el `DESIGN.md` de esta carpeta y sube las imágenes de `referencia/` (la captura de la pantalla Hoy y la mascota).
3. Envía el Prompt 0 y no sigas hasta que la pantalla Hoy te convenza: todas las demás piden "el mismo estilo que la pantalla Hoy".
4. Genera el resto en el orden de la tabla, una pantalla por mensaje. Si Stitch omite algo, pide solo lo que faltó. Las pantallas de acceso van al final a propósito: con el estilo ya fijado, salen coherentes al primer intento.

## 2. Orden de generación

| Paso | Prompt | Pantalla | Caso de uso |
| :---: | :--- | :--- | :--- |
| 1 | Prompt 0 | P04 Hoy (ancla visual) | CU-02, CU-04 |
| 2 | P05 | Misiones | CU-02 |
| 3 | P06 | Nueva misión | CU-02 |
| 4 | P07 | Constelaciones | CU-03 |
| 5 | P08 | Detalle de constelación | CU-03, CU-04 |
| 6 | P09 | Sumar a la tripulación (modal) | CU-03 |
| 7 | P10 | Bitácora | CU-04 |
| 8 | P11 | Perfil | Transversal |
| 9 | P12 | Celebración (modal) | Transversal |
| 10 | P01, P02 | Entrar y Crear cuenta | CU-01 |
| 11 | P03-A, P03-B, P03-C | Preparar el despegue (tres pasos) | CU-01 |
| 12 | P04 teléfono | Hoy en teléfono | CU-02 |
| 13 | Hoja de la mascota | Los seis estados de Nova | Transversal |

## 3. Prompt 0: arranque del proyecto y pantalla Hoy

Es más largo que los demás porque fija el estilo de todo el proyecto. Adjunta la captura de la pantalla Hoy que está en `referencia/` y añade al final: "Usa la imagen adjunta como referencia de composición." Si Stitch lo corta, envía primero hasta el párrafo de la tarjeta principal y después el resto, empezando por "Completa la pantalla Hoy:".

```text
Diseña una aplicación web de escritorio llamada "Órbita": una plataforma gamificada para organizar y cumplir actividades personales y de equipo. El ambiente es sereno, preciso y luminoso, como un planetario de bolsillo o una carta celeste: fondo oscuro plano, líneas finas, círculos y una sola luz principal.

Estilo: tema oscuro. Fondo de página #0B1026; tarjetas #141A3A con borde de 1 px #2C3566 y radio de 24 px; elementos sobre tarjeta #1C2450. Texto principal #F3F5FF y secundario #AEB6DC. Amarillo #FFD25E solo para el botón principal y lo ya cumplido, con texto #1A1440. Acentos: aguamarina #5FD4E6 y coral #FF8E72. Títulos y cifras en Space Grotesk; texto en Inter. Colores planos: sin degradados, sin sombras, sin brillos difusos, sin emojis. Ilustración plana y geométrica; iconos de trazo fino. Todo el texto en español.

Pantalla "Hoy". Arriba, barra de navegación: a la izquierda el logotipo (planeta amarillo con anillo aguamarina y la palabra "Órbita"); al centro los destinos "Hoy" (activo, píldora amarilla), "Misiones", "Constelaciones" y "Bitácora"; a la derecha "Nivel 4 · Navegante" y un avatar circular con la letra A.

Debajo, una tarjeta principal ancha con tres zonas. Izquierda: la mascota Nova, una estrella amarilla de cinco puntas redondeadas con cara amable, en el centro de tres anillos concéntricos; cada anillo tiene un arco de progreso (aguamarina, coral y blanco) y un planeta pequeño al final del arco. Centro: fecha en mayúsculas pequeñas aguamarina "VIERNES 13 DE NOVIEMBRE", título grande "Buen despegue, Ana.", texto "Nova brilla al 60 %. Dos misiones más y enciendes todo el cielo de hoy.", botón principal "Nueva misión" y dos fichas: "12 días en órbita" y "2 escudos". Derecha: rótulo "TUS ÓRBITAS ESTA SEMANA" y tres filas con punto de color: "Repasar apuntes de Redux · 5 de 7 vueltas", "Caminar 30 minutos · 4 de 7 vueltas", "Practicar inglés 15 minutos · 1 de 3 vueltas".

Abajo, tres tarjetas iguales en fila.
Izquierda, "Misiones de hoy" con contador "3 de 5" y cinco filas con casilla circular, título, detalle y puntos a la derecha: "Repasar apuntes de Redux" (Órbita diaria, +10, hecha), "Caminar 30 minutos" (Órbita diaria, +10, hecha), "Entregar informe de avance" (Misión única · vence hoy, +25, hecha), "Diseñar pantalla de reportes" (Misión única · Proyecto final, +25, pendiente), "Practicar inglés 15 minutos" (Órbita de lunes, miércoles y viernes, +10, pendiente). Las hechas llevan casilla amarilla con marca; las pendientes, casilla hueca.
Centro, "Constelación: Proyecto final" con "60 %", texto "6 de 10 estrellas encendidas", un dibujo de constelación con seis estrellas amarillas unidas por líneas y cuatro círculos huecos unidos por líneas punteadas, rótulo "MISIONES APORTADAS POR LA TRIPULACIÓN" y píldoras "Ana 7", "Luis 5", "Sofía 4", "Diego 2".
Derecha, "Bitácora de la semana" con subtítulo "Misiones completadas por día", gráfica de siete barras (L 4, M 5, X 3, J 6 en aguamarina; V 3 en amarillo; S y D vacías) y la frase "21 misiones esta semana. Tu mejor día fue el jueves."
```

## 4. Un prompt por pantalla

### P05 · Misiones

```text
Crea la pantalla "Misiones" de Órbita, con la misma barra de navegación y el mismo estilo que la pantalla Hoy; el destino activo es "Misiones".

Arriba a la izquierda, el título "Misiones"; arriba a la derecha, el botón principal amarillo "Nueva misión". Debajo, una fila de pestañas: "Hoy (5)", "Próximas (8)", "Órbitas (3)" (activa) y "Archivadas". A la derecha de las pestañas, un campo de búsqueda "Buscar misión" y chips de filtro "Todas", "Personales" y "Proyecto final".

Contenido en dos columnas. Columna izquierda ancha: lista de tres órbitas. Cada fila es una tarjeta con un anillo pequeño con arco de progreso y planeta, el nombre, el ritmo, las vueltas de la semana, el estado en palabras y un menú de tres puntos:
- "Repasar apuntes de Redux" · Todos los días · "5 de 7 vueltas" · "Ritmo estable" · anillo aguamarina.
- "Caminar 30 minutos" · Todos los días · "4 de 7 vueltas" · "En curso" · anillo coral.
- "Practicar inglés 15 minutos" · Lunes, miércoles y viernes · "1 de 3 vueltas" · "En curso" · anillo blanco.

Columna derecha estrecha: tarjeta "Tu ritmo esta semana" con la mascota Nova pequeña y el texto "Una de tus tres órbitas ya va a buen ritmo. Una órbita es estable cuando cumple al menos el 70 % de sus vueltas." Debajo, tarjeta "Próxima misión única": "Diseñar pantalla de reportes · Proyecto final · +25".

Restricciones: sin degradados, sin sombras, sin emojis; el color de cada órbita siempre va con su nombre y su cifra.
```

### P06 · Nueva misión

```text
Crea la pantalla "Nueva misión" de Órbita con el mismo estilo que la pantalla Hoy. Es un formulario en una columna de 560 px a la izquierda y una vista previa a la derecha.

Arriba: enlace "Volver a Misiones" y título "Nueva misión".

Formulario: campo "¿Qué quieres cumplir?" con el ejemplo "Practicar inglés 15 minutos". Control segmentado "¿Se hace una vez o se repite?" con dos opciones: "Misión única" y "Órbita" (seleccionada). Como está elegida "Órbita", muestra el bloque "Ritmo" con cuatro chips: "Todos los días", "Ciertos días" (seleccionado), "Veces por semana" y "Un día del mes"; debajo, siete círculos con las letras L M X J V S D, con L, X y V seleccionados en aguamarina. Selector "Prioridad": "Normal" (seleccionada) y "Alta". Selector "Constelación (opcional)" con el valor "Sin constelación". Selector "Color de la órbita" con cuatro círculos: aguamarina, coral, blanco y lila. Abajo: botón principal amarillo "Crear órbita" y botón secundario "Cancelar".

Vista previa a la derecha, en una tarjeta: rótulo "ASÍ SE VERÁ", un anillo con tres marcas y un planeta en el inicio, el texto "3 vueltas por semana: lunes, miércoles y viernes" y una ficha "+10 destellos por vuelta". Debajo, la mascota Nova pequeña con la frase "Una órbita es algo que quieres repetir. Podrás cambiar su ritmo cuando quieras."

Restricciones: etiquetas siempre encima de los campos, un solo botón principal, sin degradados, sin emojis.
```

### P07 · Constelaciones

```text
Crea la pantalla "Constelaciones" de Órbita (lista de proyectos), con la misma barra de navegación y estilo que la pantalla Hoy; el destino activo es "Constelaciones".

Arriba a la izquierda, el título "Constelaciones" y el texto "Proyectos que se encienden entre varios."; arriba a la derecha, el botón principal amarillo "Nueva constelación".

Debajo, una cuadrícula de tres tarjetas por fila. Cada tarjeta muestra un dibujo pequeño de constelación de diez estrellas (las encendidas en amarillo unidas por líneas continuas, las apagadas como círculos huecos unidos por líneas punteadas), el nombre del proyecto, el porcentaje grande, el texto de estrellas, la estrella guía actual, una fila de avatares circulares con iniciales y la fecha objetivo:
- "Proyecto final" · "60 %" · "6 de 10 estrellas encendidas" · "Tercera estrella guía de cinco" · avatares A, L, S, D · "Entrega: 4 de diciembre".
- "Exposición de Historia" · "30 %" · "3 de 10 estrellas encendidas" · "Primera estrella guía de cinco" · avatares A, M · "Entrega: 27 de noviembre".
- "Club de lectura" · "90 %" · "9 de 10 estrellas encendidas" · "Cuarta estrella guía de cinco" · avatares A, L, C · "Sin fecha".

Después, una tarjeta con borde punteado y el texto "Nueva constelación: empieza un proyecto y suma a tu tripulación."

Restricciones: sin degradados, sin sombras, sin emojis; cada porcentaje va acompañado de su texto.
```

### P08 · Detalle de constelación

```text
Crea la pantalla de detalle de la constelación "Proyecto final" en Órbita, con la misma barra de navegación y estilo que la pantalla Hoy.

Encabezado: enlace "Volver a Constelaciones", título "Proyecto final", texto "Entrega: 4 de diciembre · 18 de 30 misiones" y, a la derecha, el botón principal amarillo "Sumar a la tripulación" y un botón secundario "Nueva misión".

Dos columnas. Columna izquierda ancha: una tarjeta grande con "60 %" y "6 de 10 estrellas encendidas · tercera estrella guía de cinco", y debajo el dibujo de la constelación: diez estrellas, seis encendidas en amarillo con halo plano y unidas por líneas continuas, cuatro apagadas como círculos huecos unidos por líneas punteadas; las estrellas 2, 4, 6, 8 y 10 son más grandes. Bajo el dibujo, una barra de progreso con el texto "Hacia la cuarta estrella guía: faltan 6 misiones." Más abajo, la tarjeta "Misiones de la constelación" con pestañas "Pendientes (12)" y "Hechas (18)" y cuatro filas con casilla, título, persona asignada y puntos; una de ellas lleva la etiqueta "Pide relevo".

Columna derecha: tarjeta "Tripulación" con cuatro filas de barra horizontal aguamarina y cifra: "Ana 7", "Luis 5", "Sofía 4", "Diego 2", cada una con un botón pequeño "Enviar señal". Debajo, tarjeta "Reconocimientos de la semana" con dos filas: "Estrella polar: Sofía, 5 días con aporte" e "Ignición: Ana encendió la tercera estrella guía".

Restricciones: sin podio ni clasificación, sin degradados, sin emojis.
```

### P09 · Sumar a la tripulación

```text
Crea una ventana modal "Sumar a la tripulación" sobre la pantalla de detalle de la constelación "Proyecto final", con el fondo oscurecido. Mismo estilo que la pantalla Hoy.

La ventana mide unos 520 px de ancho, color #1C2450, radio de 28 px, con un botón de cerrar arriba a la derecha. Título "Sumar a la tripulación" y texto "Quien se sume verá esta constelación y podrá aportar misiones."

Primer bloque, "Invitar por correo": un campo "Correo" con el ejemplo "nombre@correo.com" y, a su derecha, el botón principal amarillo "Enviar invitación".

Segundo bloque, "O comparte el enlace": un campo de solo lectura con "orbita.app/unirse/PF-7K2Q" y un botón secundario "Copiar enlace". Debajo, texto pequeño "El enlace vence en 7 días."

Tercer bloque, "Tripulación": una fila de asientos circulares. Cuatro ocupados con inicial y nombre: "Ana (creó la constelación)", "Luis", "Sofía" y "Diego". Uno pendiente con contorno punteado aguamarina: "marta@correo.com · Invitación enviada" con el enlace "Reenviar". Uno libre con contorno punteado gris y un signo más. Abajo a la derecha, un botón secundario "Listo".

Restricciones: un solo botón principal amarillo, etiquetas encima de los campos, sin degradados, sin emojis.
```

### P10 · Bitácora

```text
Crea la pantalla "Bitácora" de Órbita (reportes con gráficas), con la misma barra de navegación y estilo que la pantalla Hoy; el destino activo es "Bitácora".

Arriba a la izquierda, el título "Bitácora" y el texto "Tu progreso, de un vistazo."; arriba a la derecha, chips de periodo "Semana", "Mes" (seleccionado) y "Todo".

Primera fila, cuatro fichas de dato: "640 destellos · Navegante", "12 días en órbita · mejor racha", "21 misiones esta semana" y "1 de 3 órbitas a buen ritmo".

Segunda fila, dos tarjetas. Izquierda (ancha), "Cielo del mes": cuadrícula de siete columnas (L M X J V S D) y cinco filas donde cada día es una marca: destello amarillo grande con halo para "cielo encendido", destello amarillo pequeño para "día activo", círculo hueco para "sin misiones", media luna para "día en crucero"; el día de hoy lleva un anillo blanco. Debajo, la leyenda con esas cuatro marcas y la frase "9 cielos encendidos este mes." Derecha, "Ritmo por órbita": tres filas con anillo pequeño, nombre y vueltas: "5 de 7", "4 de 7" y "1 de 3".

Tercera fila, tres tarjetas. "Bitácora de la semana": siete barras (L 4, M 5, X 3, J 6, V 3 en amarillo, S y D vacías). "Tendencia": línea aguamarina de seis semanas con puntos y valores 14, 17, 16, 19, 22 y 21. "Únicas y órbitas": una barra horizontal dividida en "Órbitas 62 %" aguamarina y "Misiones únicas 38 %" amarilla.

Restricciones: cada gráfica con su cifra escrita y una frase de resumen; sin degradados ni rellenos bajo las líneas; sin emojis.
```

### P11 · Perfil

```text
Crea la pantalla "Perfil" de Órbita (nivel, logros y colección), con la misma barra de navegación y estilo que la pantalla Hoy.

Encabezado: avatar grande con la letra A y borde aguamarina, nombre "Ana", rango "Nivel 4 · Navegante" y una barra de progreso amarilla con el texto "640 destellos · faltan 60 para Especialista".

Fila de tres fichas: "12 días en órbita (mejor racha: 12)", "2 escudos guardados" y "Ritmo: órbita constante, 5 misiones al día" con el enlace "Cambiar".

Sección "Parches de misión" con el contador "6 de 17": cuadrícula de parches circulares con borde doble tipo bordado y un símbolo de trazo en el centro. Ganados, en color: "Despegue", "Primer cielo encendido", "Semana en órbita", "Primera constelación", "Primera estrella guía" y "Ventana de lanzamiento". Por ganar, en contorno gris con su requisito debajo: "Ciclo lunar · racha de 30 días", "Ritmo firme · 4 semanas seguidas" y "Constelación con nombre · llega al 100 %". Tres parches secretos con contorno punteado y signo de interrogación, con sus pistas: "Cuando todo gira a la vez", "Después de la sombra" y "Todos en el mismo cielo".

Sección "Cometas" con el contador "3 de 14": fila de fichas. Descubiertos, con un cometa pequeño de cola de tres trazos y su nombre: "Centella", "Menta" y "Compás". El resto, siluetas en contorno punteado con el texto "Pasan en días de cielo encendido."

Restricciones: sin degradados, sin sombras, sin emojis; lo no ganado se distingue por contorno y texto, no solo por color.
```

### P12 · Celebración

```text
Crea una ventana modal de celebración sobre la pantalla Hoy de Órbita, con el fondo oscurecido. Mismo estilo que la pantalla Hoy.

La ventana mide unos 480 px de ancho, color #1C2450, radio de 28 px, contenido centrado. Arriba, la mascota Nova celebrando: estrella amarilla con los ojos cerrados en arco sonriente, la boca abierta, un halo plano y ocho rayos cortos alrededor; detrás, unos pocos puntos blancos pequeños. Debajo, un dibujo pequeño de la constelación con seis estrellas encendidas, la última más grande y resaltada.

Rótulo en mayúsculas pequeñas aguamarina: "CONSTELACIÓN: PROYECTO FINAL". Título grande: "Tercera estrella guía encendida". Texto: "La constelación llegó al 60 %. La encendió Ana al completar la misión 18 de 30."

Una ficha de recompensa con icono de destello amarillo: "+30 destellos para cada integrante que aportó en este tramo". Una segunda línea más tenue: "Siguiente: cuarta estrella guía. Faltan 6 misiones." Abajo, el botón principal amarillo de ancho completo "Seguir" y un enlace aguamarina "Enviar señal a la tripulación".

Restricciones: sin confeti fotográfico, sin degradados, sin brillos difusos, sin emojis; un solo botón principal.
```

### P01 · Entrar a Órbita

```text
Crea la pantalla "Entrar a Órbita" (inicio de sesión) con el mismo estilo que la pantalla Hoy: tema oscuro, mismos colores, tipografías y botones. No lleva barra de navegación.

Estructura en dos mitades. Mitad izquierda, sobre el fondo #0B1026: una ilustración plana de la mascota Nova (estrella amarilla con cara tranquila) en el centro de un único anillo fino y vacío, con seis puntos blancos pequeños alrededor. Debajo, el título "Tu cielo te espera." y el texto "Organiza tu día, mantén tus órbitas y enciende constelaciones con tu equipo."

Mitad derecha: una tarjeta #141A3A centrada, de unos 440 px de ancho, con el logotipo "Órbita" arriba, el título "Entrar", un campo "Correo" con el ejemplo "ana@correo.com", un campo "Contraseña" con icono para mostrarla, un enlace aguamarina "¿Olvidaste tu contraseña?", el botón principal amarillo de ancho completo "Entrar" y, debajo, el texto "¿Primera vez aquí?" con el enlace "Crear cuenta". Muestra también, bajo el campo de contraseña, un mensaje de error de ejemplo en rosa #FF7A90 con icono de aviso: "El correo o la contraseña no coinciden. Revisa e intenta de nuevo."

Restricciones: un solo botón principal, sin degradados, sin sombras, sin emojis, sin fotos del espacio.
```

### P02 · Crear cuenta

```text
Crea la pantalla "Crear cuenta" de Órbita (registro) con el mismo estilo y la misma estructura de dos mitades que la pantalla "Entrar a Órbita". No lleva barra de navegación.

Mitad izquierda, sobre el fondo #0B1026: una ilustración plana de un cielo con unos veinte círculos huecos pequeños (estrellas apagadas) y una sola estrella amarilla encendida con halo plano. Debajo, el título "Tu cielo empieza oscuro. Lo enciendes tú." y tres líneas con icono de trazo: "Misiones y órbitas: lo de una vez y lo que repites.", "Constelaciones: proyectos que se encienden entre varios." y "Bitácora: tu progreso, de un vistazo."

Mitad derecha: una tarjeta #141A3A centrada, de unos 440 px de ancho, con el logotipo "Órbita", el título "Crear cuenta" y tres campos con la etiqueta encima: "Nombre" con el ejemplo "Ana", "Correo" con el ejemplo "ana@correo.com" y "Contraseña" con la ayuda "Mínimo 8 caracteres." y un icono para mostrarla. Debajo, el botón principal amarillo de ancho completo "Crear cuenta y despegar" y el texto "¿Ya tienes cuenta?" con el enlace aguamarina "Entrar". Muestra el campo "Correo" en estado de error, con borde rosa #FF7A90, icono de aviso y el mensaje "Ese correo ya tiene un cielo. ¿Quieres entrar?"

Restricciones: un solo botón principal, sin degradados, sin sombras, sin emojis.
```

### P03-A · Preparar el despegue: elegir el ritmo

```text
Crea el primer paso del recorrido inicial de Órbita, "Preparar el despegue", con el mismo estilo que la pantalla Hoy. Pantalla centrada, sin barra de navegación, solo el logotipo "Órbita" arriba a la izquierda.

Arriba, un indicador de tres pasos en línea: "1 Elige tu ritmo" (activo, en amarillo), "2 Tu primera misión" y "3 Despegue" (los dos últimos atenuados).

Al centro, la mascota Nova a tamaño mediano y, a su derecha, el título "¿Cuántas misiones quieres cumplir al día?" y el texto "Es tu meta diaria. Podrás cambiarla cuando quieras."

Debajo, tres tarjetas seleccionables en fila, cada una con un anillo dibujado con marcas y un texto: "Órbita tranquila · 3 misiones al día · Para empezar sin prisa", "Órbita constante · 5 misiones al día · El ritmo de la mayoría" (seleccionada, con borde amarillo y la etiqueta "Recomendada") y "Órbita intensa · 7 misiones al día · Para días llenos". Los anillos tienen 3, 5 y 7 marcas.

Abajo a la derecha, el botón principal amarillo "Continuar". Abajo a la izquierda, un texto tenue: "Al terminar ganas el parche Despegue y un escudo de regalo."

Restricciones: un solo botón principal, sin degradados, sin emojis.
```

### P03-B · Preparar el despegue: la primera misión

```text
Crea el segundo paso del recorrido inicial de Órbita, "Preparar el despegue", con el mismo estilo y la misma estructura centrada que el primer paso. Sin barra de navegación.

Arriba, el indicador de tres pasos: "1 Elige tu ritmo" (hecho, con marca), "2 Tu primera misión" (activo, en amarillo) y "3 Despegue" (atenuado).

Al centro, la mascota Nova a tamaño mediano y, a su derecha, el título "Crea tu primera misión" y el texto "Algo pequeño que puedas cumplir ahora mismo."

Debajo, una tarjeta de 560 px con un campo grande "¿Qué quieres cumplir?" con el ejemplo "Ordenar mi escritorio" y un control segmentado "¿Se hace una vez o se repite?" con "Misión única" (seleccionada) y "Órbita". Debajo, tres sugerencias en chips que se pueden pulsar: "Repasar apuntes 20 minutos", "Caminar 30 minutos" y "Leer 10 páginas". A la derecha del campo, una ficha "+25 destellos".

Abajo a la derecha, el botón principal amarillo "Crear misión"; abajo a la izquierda, un botón secundario "Atrás".

Restricciones: un solo campo obligatorio, un solo botón principal, sin degradados, sin emojis.
```

### P03-C · Preparar el despegue: despegue

```text
Crea el tercer paso del recorrido inicial de Órbita, "Preparar el despegue", con el mismo estilo y la misma estructura centrada que los pasos anteriores. Sin barra de navegación.

Arriba, el indicador de tres pasos con los dos primeros hechos (con marca) y "3 Despegue" activo en amarillo.

Al centro, la mascota Nova celebrando (ojos cerrados en arco sonriente, halo plano y rayos cortos) dentro de un anillo con un planeta pequeño. Título grande "¡Despegaste, Ana!" y texto "Cumpliste tu primera misión. Nova ya brilla."

Debajo, una fila de tres fichas de recompensa: un parche circular con borde tipo bordado y el texto "Parche: Despegue"; un icono de destello y "+25 destellos"; un icono de escudo de contorno y "1 escudo de regalo: cuida tu racha si un día no puedes". Debajo, una tarjeta pequeña con la misión recién cumplida: casilla amarilla con marca, "Ordenar mi escritorio", "Misión única" y "+25".

Abajo, el botón principal amarillo "Ir a Hoy" y un enlace aguamarina "Ver cómo se ganan los destellos".

Restricciones: sin confeti fotográfico, sin degradados, sin brillos difusos, sin emojis; un solo botón principal.
```

### P04 · Hoy en teléfono

```text
Crea la versión para teléfono de la pantalla Hoy de Órbita (360 px de ancho), con el mismo sistema de diseño.

Una sola columna con márgenes de 16 px. Arriba: logotipo "Órbita" a la izquierda y avatar con la letra A a la derecha. Luego la mascota Nova a tamaño mediano junto al saludo "Buen despegue, Ana." y el texto "Nova brilla al 60 %. Dos misiones más y enciendes todo el cielo de hoy." Debajo, dos fichas en fila: "12 días en órbita" y "2 escudos".

Después, la tarjeta "Misiones de hoy" con contador "3 de 5" y las cinco filas (tres hechas con casilla amarilla, dos pendientes con casilla hueca), cada una con título, detalle y puntos a la derecha. Luego la tarjeta "Tus órbitas esta semana" con los tres anillos concéntricos y Nova pequeña en el centro, y la leyenda debajo: "Repasar apuntes de Redux · 5 de 7 vueltas", "Caminar 30 minutos · 4 de 7 vueltas" y "Practicar inglés 15 minutos · 1 de 3 vueltas". Al final, la tarjeta "Constelación: Proyecto final · 60 %" y la tarjeta "Bitácora de la semana" con las siete barras.

Barra de navegación fija abajo con cuatro destinos con icono de trazo y texto: "Hoy" (activo, en amarillo), "Misiones", "Constelaciones" y "Bitácora". Sobre ella, a la derecha, un botón redondo amarillo con el signo más para "Nueva misión". Zonas pulsables de al menos 44 px. Sin degradados ni emojis.
```

## 5. Hoja de la mascota

Adjunta la imagen de la mascota que está en `referencia/`. El resultado sirve para decidir expresiones; la versión definitiva de Nova es un SVG propio (ver `direccion-visual.md`, sección 6).

```text
Crea una hoja de personaje de la mascota de Órbita, "Nova", sobre fondo plano #141A3A. Ilustración vectorial plana y geométrica, sin degradados, sin sombras, sin contornos negros.

Nova es una estrella amarilla #FFD25E de cinco puntas muy redondeadas, sin brazos ni piernas. Cara simple en el centro: dos ojos ovalados verticales color índigo #1A1440 con un punto blanco de brillo, mejillas redondas coral #FF8E72 y boca de trazo índigo. Su luz se representa con uno o dos círculos amarillos planos y muy transparentes detrás de ella.

Dibuja seis versiones del mismo personaje en una cuadrícula de tres columnas y dos filas, todas del mismo tamaño, cada una con su nombre debajo en Space Grotesk blanco:
1. "Esperando": ojos abiertos mirando a un lado, sonrisa leve, halo pequeño.
2. "Animando": inclinada un poco a la derecha, sonrisa pequeña, un destello de cuatro puntas junto a una punta.
3. "Feliz": sonrisa amplia, mejillas marcadas, dos halos.
4. "Celebrando": ojos cerrados en arco sonriente, boca abierta, dos halos y ocho rayos cortos alrededor.
5. "Preocupada": cejas cortas inclinadas, boca pequeña y redonda, inclinada un poco a la izquierda, halo mínimo. No está triste ni llora.
6. "Descansando": ojos cerrados, boca relajada, sin halo amarillo, con una media luna aguamarina #5FD4E6 a su lado.

Mantén idénticos la forma, el color y las proporciones en las seis. Sin texto adicional, sin emojis.
```

## 6. Refinamientos propios de Órbita

Uno por mensaje, sobre la pantalla que lo necesite.

| Qué ajusta | Prompt |
| :--- | :--- |
| Anillos | `En la tarjeta principal, dibuja las órbitas como círculos concéntricos perfectos vistos de frente: una pista de 4 px en #2C3566 y, encima, un arco de color de 5 px que empieza arriba y avanza en sentido horario.` |
| Halo de Nova | `Reemplaza el resplandor difuso de la estrella por dos círculos amarillos planos al 12 % de opacidad detrás de ella, sin desenfoque.` |
| Exceso de amarillo | `Reduce el amarillo #FFD25E: déjalo solo en el botón principal, el destino activo de la navegación, las casillas hechas y los puntos ganados.` |
| Constelación | `En la tarjeta Constelación, une las seis estrellas encendidas con líneas amarillas continuas de 2 px y las cuatro apagadas con líneas punteadas en #7C88C4.` |
| Cifras | `Pon todas las cifras (3 de 5, 60 %, +10 y los valores de las barras) en Space Grotesk seminegrita.` |
| Barras | `En la Bitácora de la semana, pinta la barra del viernes en amarillo #FFD25E y deja sábado y domingo como una marca baja de 8 px en #2C3566.` |
| Leyenda de órbitas | `En la leyenda Tus órbitas esta semana, pon delante de cada fila un punto del mismo color que su anillo y debajo del nombre el texto de vueltas.` |

## 7. Errores previsibles y cómo corregirlos

| Lo que puede salir | Por qué pasa | Corrección |
| :--- | :--- | :--- |
| Foto de galaxia, nebulosa o textura de estrellas de fondo | La palabra "espacio" arrastra imágenes fotográficas | `Quita cualquier imagen o textura de fondo. El fondo es un color plano #0B1026 con, como mucho, seis puntos blancos pequeños.` |
| Degradados morados, neón o brillos difusos | Es el cliché del tema oscuro | `Reemplaza todos los degradados y brillos por colores planos del sistema de diseño.` |
| Órbitas en perspectiva, como elipses inclinadas | Es la forma habitual de dibujar un sistema solar | `Dibuja las órbitas como círculos concéntricos vistos de frente, no como elipses.` |
| Un gráfico de rosca en lugar de anillos concéntricos | Confunde las órbitas con una gráfica circular | `No es una gráfica de rosca: son tres anillos separados, uno por actividad, cada uno con su propio arco de progreso.` |
| Nova con brazos, piernas, volumen o estilo 3D | Las mascotas generadas tienden al personaje completo | `La mascota es una estrella plana de cinco puntas redondeadas, sin brazos ni piernas, con ojos, mejillas y boca simples.` |
| Cohetes, astronautas o naves como adorno | Asociación con "misión" y "despegue" | `Quita cohetes, astronautas y naves. Las únicas figuras son la estrella Nova, anillos, planetas pequeños y estrellas.` |
| La constelación como gráfico de red o mapa | Interpreta "nodos unidos" | `La constelación es un dibujo simple: diez puntos unidos por líneas finas, como en un atlas de estrellas.` |
| Aguamarina o coral en botones | Reparte los acentos por igual | `El único botón de color es el principal, en amarillo #FFD25E. Aguamarina solo para enlaces y gráficas; coral solo para la segunda órbita.` |
| Nova distinta en cada pantalla | Stitch no conserva personajes | Ver `../00-base-comun/guia-stitch.md`, sección 5: pedir el espacio y reemplazar por el SVG propio |
