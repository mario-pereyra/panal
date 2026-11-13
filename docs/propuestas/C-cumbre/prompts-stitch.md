# Prompts para Stitch: Cumbre

Textos listos para copiar en Stitch y generar las doce pantallas de la dirección Cumbre. Cada bloque es un mensaje. Están escritos en español para que la interfaz salga en español, con los datos de ejemplo comunes a las cinco direcciones.

## Tabla de contenidos

1. [Cómo usar este archivo](#1-cómo-usar-este-archivo)
2. [Orden de generación](#2-orden-de-generación)
3. [Prompt 0: arranque y pantalla Hoy](#3-prompt-0-arranque-y-pantalla-hoy)
4. [Un prompt por pantalla](#4-un-prompt-por-pantalla)
5. [Prompt para la hoja de la mascota](#5-prompt-para-la-hoja-de-la-mascota)
6. [Refinamientos propios de Cumbre](#6-refinamientos-propios-de-cumbre)
7. [Errores previsibles y cómo corregirlos](#7-errores-previsibles-y-cómo-corregirlos)

---

## 1. Cómo usar este archivo

1. Lee primero `../00-base-comun/guia-stitch.md`: explica el flujo, cómo cargar el `DESIGN.md` y qué esperar de la mascota.
2. Crea un proyecto web en Stitch, carga el `DESIGN.md` de esta carpeta y sube las imágenes de `referencia/`.
3. Envía el Prompt 0 y no sigas hasta que la pantalla "Hoy" te convenza: es el ancla de todo lo demás.
4. Genera el resto en el orden de la tabla, un prompt por mensaje. Para corregir, usa la sección 6 de este archivo y la sección 6 de la guía.

Kusi y la montaña que genere Stitch son una aproximación: sirven para decidir tamaño y ubicación. El dibujo definitivo es el SVG del tablero.

## 2. Orden de generación

| Orden | Prompt | Pantalla | Por qué en este lugar |
| :---: | :--- | :--- | :--- |
| 1 | Prompt 0 | P04 Hoy | Fija paleta, tipografías, navegación y tarjetas |
| 2 | P05 | Tramos | Reutiliza la fila de tramo de "Hoy" |
| 3 | P06 | Nuevo tramo | Define campos y ventanas |
| 4 | P08 | Detalle de expedición | La gráfica más importante del mundo |
| 5 | P07 | Expediciones | Reduce la ruta a una tarjeta |
| 6 | P10 | Bitácora | Las gráficas de altitud |
| 7 | P11 | Perfil | Banderines y hallazgos |
| 8 | P12 | Celebración | Usa todo lo anterior |
| 9 | P09 | Sumar a la cordada | Ventana sobre P08 |
| 10 | P03 | Campamento base | Recorrido inicial |
| 11 | P01 y P02 | Inicio de sesión y registro | Las más simples |
| 12 | P04 teléfono | Hoy en teléfono | Al final, con el sistema ya estable |

## 3. Prompt 0: arranque y pantalla Hoy

Si Stitch corta el mensaje, envíalo en dos partes: primero los dos párrafos iniciales (concepto y estilo) y después el resto.

```text
Diseña una aplicación web de escritorio llamada "Cumbre": una plataforma gamificada para organizar y cumplir actividades, sola o en equipo. La metáfora es una ascensión de montaña: cada actividad es un "tramo", los puntos son metros y cada proyecto es una expedición que un equipo sube en cordada. Ambiente sereno, firme, luminoso y cercano: una mañana clara en la montaña.

Estilo: diseño plano, sin degradados, sin sombras y sin emojis. Fondo de página #EEF4F3; tarjetas blancas con borde de 1 px #D3E0DD y esquinas de 24 px; texto #17302B; texto secundario #4F6661. Verde #2F7A6B para lo completado y #1F5F54 para cifras. Un solo acento cálido, terracota #D8502F, y ámbar #F2B441 para el sol. Títulos y cifras en Bricolage Grotesque negrita; texto en DM Sans. Botones con esquinas de 12 px; el botón principal es #17302B con texto blanco. Ilustración plana y geométrica, sin contorno. Todas las imágenes e iconos siguen esta paleta. Todo el texto en español.

Crea la pantalla "Hoy".
Arriba, barra de navegación: a la izquierda el logotipo (triángulo verde con punta blanca) y la palabra "Cumbre"; al centro los destinos "Hoy" (activo, fondo #17302B y texto blanco), "Tramos", "Expediciones" y "Bitácora"; a la derecha "Nivel 4 · Guía de ruta" y un avatar circular terracota con la letra "A".
Debajo, un bloque de bienvenida ancho con fondo #D6ECEE y esquinas de 28 px. A la izquierda, una llama color caramelo con una manta verde de tres franjas. Al centro: la fecha "VIERNES 13 DE NOVIEMBRE", el título grande "Hoy toca subir, Ana.", el texto "Kusi te espera en el campamento 3 del Proyecto final. Completa 2 tramos más y la cordada sigue subiendo.", el botón principal "Nuevo tramo" y dos fichas blancas: "Racha de 12 días" y "2 refugios". A la derecha, una montaña verde con nieve en la punta, un sendero blanco en zigzag con dos campamentos marcados en ámbar, un punto terracota en la posición actual, un tramo punteado hasta un banderín terracota en la cumbre y un sol ámbar.
Abajo, tres tarjetas iguales en fila:
1. "Tramos de hoy", con "3 de 5" y cinco peldaños ascendentes (tres llenos). Lista con casilla: "Repasar apuntes de Redux" (De rutina · diario, +10 m, hecho); "Caminar 30 minutos" (De rutina · diario, +10 m, hecho); "Entregar informe de avance" (Único · vence hoy, +25 m, hecho); "Diseñar pantalla de reportes" (Único · Proyecto final, +25 m, pendiente); "Practicar inglés 15 minutos" (De rutina · lunes, miércoles y viernes, +10 m, pendiente).
2. "Cordada: Proyecto final", con "60 %" y "Campamento 3 · hito 3 de 5 · 18 de 30 tramos". Cuatro personas en columna unidas por una línea vertical terracota, cada una con avatar circular y barra horizontal verde: Ana 7 tramos, Luis 5 tramos, Sofía 4 tramos, Diego 2 tramos.
3. "Altitud ganada", con "Metros acumulados por semana", la cifra grande "640 m", "+120 m esta semana" y una gráfica de área ascendente de seis semanas (S1 a S6) con el último punto en terracota y un banderín.
```

## 4. Un prompt por pantalla

### P01. Inicio de sesión: "Volver a la ruta"

```text
Crea la pantalla de inicio de sesión de Cumbre, para entrar a la cuenta. No lleva barra de navegación.
Estructura: pantalla dividida en dos mitades. A la izquierda, una escena ilustrada sobre fondo #D6ECEE: amanecer al pie de un sendero, una llama color caramelo con manta verde de tres franjas esperando junto a un poste de señal, y al fondo una montaña verde con nieve y un banderín terracota en la cumbre. Abajo de la escena, la frase "Se sube de a un tramo." A la derecha, sobre fondo #EEF4F3, una tarjeta blanca centrada de 400 px de ancho.
Contenido de la tarjeta: el logotipo con la palabra "Cumbre"; el título "Volver a la ruta."; el texto "Kusi guardó tu lugar en la cordada."; el campo "Correo" con el ejemplo "ana@correo.com"; el campo "Contraseña" con un botón para mostrarla; el enlace "¿Olvidaste tu contraseña?"; el botón principal de ancho completo "Entrar"; y debajo "¿Primera vez en la montaña?" con el enlace "Crear cuenta".
Muestra el campo de contraseña en estado de error, con el mensaje "Ese correo o esa contraseña no coinciden. Revisa y vuelve a intentar.", fondo #FBE9E4, texto #A3271B e icono de aviso.
Restricciones: mismo estilo que la pantalla Hoy (colores, Bricolage Grotesque en títulos, DM Sans en texto, esquinas de 12 px). Un solo botón principal. Sin degradados, sin sombras, sin emojis.
```

### P02. Registro: "Empezar la ascensión"

```text
Crea la pantalla de registro de Cumbre, para crear una cuenta nueva. No lleva barra de navegación.
Estructura: dos mitades, igual que el inicio de sesión. A la izquierda, sobre fondo #D6ECEE, una montaña verde vista de lejos con un sendero punteado blanco que sube desde abajo hasta un banderín terracota, y un sol ámbar. Debajo de la montaña, tres promesas en columna, cada una con un icono lineal: "Tus actividades, tramo a tramo."; "Tu avance, en metros que no bajan."; "Tu equipo, en una sola cordada.". A la derecha, sobre fondo #EEF4F3, una tarjeta blanca centrada de 400 px.
Contenido de la tarjeta: el logotipo con la palabra "Cumbre"; el título "Empezar la ascensión."; el texto "Tres datos y ya estás en el campamento base."; el campo "Nombre" con el ejemplo "Ana"; el campo "Correo"; el campo "Contraseña" con la ayuda "Mínimo 8 caracteres." y un botón para mostrarla; el botón principal de ancho completo "Crear cuenta"; y debajo "¿Ya tienes cuenta?" con el enlace "Entrar".
Restricciones: mismo estilo que la pantalla Hoy y que el inicio de sesión. Campos de 48 px de alto con borde #6F8B85. Un solo botón principal. Sin degradados, sin sombras, sin emojis.
```

### P03. Recorrido inicial: "Campamento base"

```text
Crea la pantalla del recorrido inicial de Cumbre, que se muestra justo después del registro. Tiene tres pasos; muestra el paso 1 activo. No lleva barra de navegación, solo el logotipo arriba a la izquierda.
Estructura: arriba, al centro, un indicador de tres pasos: "1 Tu paso" (activo), "2 Tu primer tramo", "3 Tu primer banderín". Debajo, dos columnas. A la izquierda, una escena sobre fondo #D6ECEE con esquinas de 28 px: una carpa de color #A9CFC6, la llama color caramelo con su manta al lado y tres piedras planas en el suelo. A la derecha, el contenido.
Contenido: el antetítulo "CAMPAMENTO BASE · PASO 1 DE 3"; el título "¿A qué paso quieres subir?"; el texto "Elige cuántos tramos quieres cumplir por día. Puedes cambiarlo cuando quieras."; tres tarjetas de opción en fila, seleccionables: "Paso tranquilo · 3 tramos al día"; "Paso constante · 5 tramos al día", seleccionada, con borde #17302B de 2 px y la etiqueta "Recomendado"; "Paso intenso · 7 tramos al día". Cada opción lleva un dibujo pequeño de escalones: tres, cinco o siete. Debajo, el botón principal "Continuar" y el enlace "Decidir después".
Restricciones: mismo estilo que la pantalla Hoy. Un solo botón principal. Sin degradados, sin sombras, sin emojis.
```

### P04. Hoy en teléfono

```text
Crea la versión para teléfono de la pantalla Hoy de Cumbre, en una sola columna de 390 px de ancho.
Estructura, de arriba abajo: una cabecera con el logotipo y "Cumbre" a la izquierda y el avatar terracota "A" a la derecha. El bloque de bienvenida con fondo #D6ECEE y esquinas de 28 px: la cabeza y el cuello de la llama arriba a la izquierda, la fecha "VIERNES 13 DE NOVIEMBRE", el título "Hoy toca subir, Ana." y el texto "Completa 2 tramos más y la cordada sigue subiendo.". Debajo, dos fichas blancas en fila: "Racha de 12 días" y "2 refugios". Luego una franja de 120 px con la montaña verde, el sendero blanco, dos campamentos ámbar, el punto terracota y el banderín en la cumbre.
Después, las tres tarjetas apiladas: "Tramos de hoy" con "3 de 5", cinco peldaños y la lista de cinco tramos con casilla, metadato y metros ("+10 m", "+25 m"); "Cordada: Proyecto final" con "60 %" y las cuatro barras (Ana 7, Luis 5, Sofía 4, Diego 2); "Altitud ganada" con "640 m" y la gráfica de área.
Abajo, fija, una barra de navegación con cuatro destinos con icono y texto: "Hoy" (activo), "Tramos", "Expediciones", "Bitácora". Sobre ella, el botón principal fijo "Nuevo tramo".
Restricciones: mismos colores y tipografías que la versión de escritorio. Objetivos táctiles de 44 px o más. Sin degradados, sin sombras, sin emojis.
```

### P05. Tramos

```text
Crea la pantalla "Tramos" de Cumbre, donde se gestionan todas las actividades. Usa la misma barra de navegación que la pantalla Hoy, con "Tramos" como destino activo.
Estructura: arriba, a la izquierda el título de página "Tramos" y a la derecha el botón principal "Nuevo tramo". Debajo, una fila de pestañas tipo control segmentado: "Hoy 5" (activa), "Próximos 4", "De rutina 3", "Archivados". A su derecha, dos filtros desplegables: "Todas las expediciones" y "Cualquier prioridad". El contenido va en dos columnas: la lista a la izquierda, más ancha, y un resumen a la derecha.
Columna izquierda: una tarjeta blanca con cinco filas, cada una con casilla, título, metadato y metros a la derecha: "Repasar apuntes de Redux" (De rutina · diario, +10 m, hecho); "Caminar 30 minutos" (De rutina · diario, +10 m, hecho); "Entregar informe de avance" (Único · vence hoy, +25 m, hecho); "Diseñar pantalla de reportes" (Único · Proyecto final, +25 m, pendiente); "Practicar inglés 15 minutos" (De rutina · lunes, miércoles y viernes, +10 m, pendiente).
Columna derecha: tarjeta "Jornada de hoy" con "3 de 5", cinco peldaños ascendentes (tres llenos), "45 m ganados hoy" y "Faltan 2 tramos para la jornada completa (+20 m)". Debajo, tarjeta "Tramos de rutina esta semana" con tres barras: "Repasar apuntes de Redux 5 de 7", "Caminar 30 minutos 4 de 7", "Practicar inglés 15 minutos 2 de 3".
Restricciones: mismo estilo que la pantalla Hoy. Sin degradados, sin sombras, sin emojis.
```

### P06. Nuevo tramo

```text
Crea la ventana modal "Nuevo tramo" de Cumbre, para crear o editar una actividad. Se muestra centrada sobre la pantalla Tramos, que queda detrás con un velo #17302B al 60 % de opacidad.
Estructura: ventana blanca de 560 px de ancho con esquinas de 28 px. Arriba el título "Nuevo tramo" y un botón de cerrar. En el cuerpo, los campos en una columna. Abajo, una franja de vista previa y los botones alineados a la derecha.
Contenido: campo "Nombre del tramo" con el texto "Diseñar pantalla de reportes". Selector de dos opciones "Tipo": "Único" (seleccionado) y "De rutina". Campo de fecha "Vence": "Viernes 13 de noviembre". Selector "Prioridad": "Normal" (seleccionado) y "Alta". Desplegable "Expedición": "Proyecto final". Desplegable "Asignado a": "Ana", con su avatar. Debajo, una franja con fondo #D6ECEE y esquinas de 12 px que dice "Este tramo dará +25 m", con la cifra en Bricolage Grotesque, y el enlace "Cómo se ganan los metros". Botones: "Cancelar" (secundario) y "Crear tramo" (principal).
Restricciones: mismo estilo que la pantalla Hoy. Campos de 48 px de alto con borde #6F8B85 y esquinas de 12 px; el campo activo con borde #17302B de 2 px. Un solo botón principal. Sin degradados, sin sombras, sin emojis.
```

### P07. Expediciones

```text
Crea la pantalla "Expediciones" de Cumbre, que muestra los proyectos de la persona. Usa la misma barra de navegación que la pantalla Hoy, con "Expediciones" como destino activo.
Estructura: arriba, a la izquierda el título de página "Expediciones" y el texto "Cada proyecto es una montaña. Cada equipo, una cordada."; a la derecha el botón principal "Nueva expedición". Debajo, una cuadrícula de tres columnas con tarjetas blancas iguales.
Cada tarjeta tiene arriba una ilustración pequeña sobre fondo #D6ECEE: una montaña verde con sendero blanco, campamentos y un banderín terracota en la cumbre; debajo, el nombre, el porcentaje grande, el hito, los tramos, los avatares del equipo y la fecha.
Tarjeta 1: "Proyecto final", "60 %", "Campamento 3 · hito 3 de 5", "18 de 30 tramos", avatares A, L, S y D, "Cumbre prevista: 5 de diciembre" y la ficha "Abre huella: Luis".
Tarjeta 2: "Feria de ciencias", "25 %", "Campamento 1 · hito 1 de 5", "5 de 20 tramos", avatares A y S, "Cumbre prevista: 20 de diciembre".
Tarjeta 3: "Lectura del mes", "80 %", "Campamento 4 · hito 4 de 5", "8 de 10 tramos", avatar A.
Cuarta tarjeta, con borde punteado y fondo #E4EEEC: "Nueva expedición" y "Arma una y suma a tu cordada.".
Las tres montañas tienen siluetas distintas: pico agudo, doble cima y meseta.
Restricciones: mismo estilo que la pantalla Hoy. Sin gráficas circulares. Sin degradados, sin sombras, sin emojis.
```

### P08. Detalle de expedición

```text
Crea la pantalla de detalle de la expedición "Proyecto final" de Cumbre. Usa la misma barra de navegación que la pantalla Hoy, con "Expediciones" activo.
Arriba: el título "Proyecto final", el texto "Cumbre prevista: 5 de diciembre" y, a la derecha, los botones "Sumar a la cordada" (secundario) y "Nuevo tramo" (principal).
A la izquierda, tarjeta ancha "Ruta" con fondo #D6ECEE: una montaña verde grande con nieve y un sendero blanco en zigzag. Sobre el sendero, cinco marcas con etiqueta: "Campamento 1" y "Campamento 2" (círculos ámbar con marca), "Campamento 3" (círculo terracota con aro blanco, posición actual), "Campamento 4" (círculo hueco) y "Cumbre" (banderín terracota). El sendero es continuo hasta el campamento 3 y punteado después. Debajo: "60 % · 18 de 30 tramos · Faltan 6 tramos para el campamento 4".
A la derecha, tarjeta "Cordada": cuatro avatares en columna unidos por una línea vertical terracota, con barra verde y cifra: Ana 7 tramos, Luis 5 tramos (ficha "Abre huella esta semana"), Sofía 4 tramos, Diego 2 tramos (ficha "Pidió cuerda"). En cada fila, el botón pequeño "Mandar eco". Al pie: "Paso firme de la semana: Ana".
Abajo, tarjeta "Tramos de la expedición" con pestañas "Pendientes 12" y "Hechos 18", y filas: "Conectar el store con la API" (Luis, etiqueta "Tramo clave", +25 m); "Conectar la base de datos" (Diego, botón "Dar cuerda", +25 m).
Restricciones: mismo estilo que la pantalla Hoy. Sin clasificación ni medallas. Sin degradados, sin sombras, sin emojis.
```

### P09. Invitar personas: "Sumar a la cordada"

```text
Crea la ventana modal "Sumar a la cordada" de Cumbre, para invitar personas a un proyecto. Se muestra centrada sobre el detalle de la expedición Proyecto final, que queda detrás con un velo #17302B al 60 % de opacidad.
Estructura: ventana blanca de 560 px de ancho con esquinas de 28 px. Arriba, el título y un botón de cerrar. Debajo, una ilustración horizontal; luego tres secciones separadas por una línea fina #D3E0DD.
Contenido: título "Sumar a la cordada". Texto: "Invita por correo o comparte el enlace. Quien acepte se ata a la cuerda del Proyecto final.". Ilustración: una cuerda terracota horizontal que une cuatro avatares circulares verdes con las letras A, L, S y D, y al final un círculo vacío de borde punteado con el signo "+".
Sección 1, "Invitar por correo": campo "Correo" con el ejemplo "marta@correo.com" y, a su derecha, el botón principal "Enviar invitación".
Sección 2, "Enlace de invitación": campo de solo lectura con "cumbre.example/unirse/PF-7K2M" y el botón secundario "Copiar enlace". Ayuda debajo: "El enlace vence en 7 días.".
Sección 3, "Invitaciones pendientes": una fila con "carla@correo.com", "Enviada hace 2 días" y los enlaces "Reenviar" y "Cancelar".
Restricciones: mismo estilo que la pantalla Hoy y que la ventana Nuevo tramo. Un solo botón principal. Sin degradados, sin sombras, sin emojis.
```

### P10. Reportes: "Bitácora"

```text
Crea la pantalla "Bitácora" de Cumbre, que muestra los reportes de progreso. Usa la misma barra de navegación que la pantalla Hoy, con "Bitácora" como destino activo.
Arriba: el título de página "Bitácora" y, a la derecha, dos desplegables: "Últimas 6 semanas" y "Todas las expediciones".
Primera fila: a la izquierda, tarjeta ancha "Altitud ganada" con "Metros acumulados por semana", la cifra grande "640 m", "+120 m esta semana" y una gráfica de área siempre ascendente con seis puntos (S1 80, S2 170, S3 250, S4 370, S5 520, S6 640): último punto terracota con banderín. A la derecha, tres fichas apiladas: "Racha de ascenso · 12 días", "Refugios · 2", "Nivel 4 · Guía de ruta · faltan 60 m".
Segunda fila, tarjeta de ancho completo "Perfil de la travesía" con "Últimas 5 semanas, un escalón por día": una gráfica de escalones que solo sube, con 35 días; algunos días son rellanos planos con un icono pequeño de carpa. Leyenda: "Escalón: día con tramos", "Carpa: día de aclimatación", "Llano: día sin tramos".
Tercera fila, tres tarjetas: "Cumplimiento por tramo de rutina" con barras "Repasar apuntes de Redux 5 de 7", "Caminar 30 minutos 4 de 7", "Practicar inglés 15 minutos 2 de 3"; "Únicos y de rutina" con dos barras "De rutina 11" y "Únicos 4"; "Proyecto final" con "60 %", una montaña pequeña con ruta y barras de aporte: Ana 7, Luis 5, Sofía 4, Diego 2.
Restricciones: mismo estilo que la pantalla Hoy. Sin gráficas circulares. Sin degradados, sin sombras, sin emojis.
```

### P11. Perfil y logros

```text
Crea la pantalla "Perfil" de Cumbre. Usa la misma barra de navegación que la pantalla Hoy, sin destino activo.
Estructura: tres columnas; la central es la más ancha.
Columna izquierda, tarjeta de nivel: avatar circular terracota grande con la letra "A", el nombre "Ana", "Nivel 4 · Guía de ruta", una barra de progreso verde con "640 m de 700 m" y "Faltan 60 m para Montañista". Debajo, la etiqueta "Zona: Ladera".
Columna central, dos tarjetas. "Banderines", con "5 de 17": una cuadrícula de banderines triangulares sobre un asta. Cinco ganados, en ámbar #F2B441 con su nombre: "Primer paso", "Primera jornada", "Siete amaneceres", "Primera expedición", "Primer campamento". Los demás, en gris #E4EEEC con su criterio: "Treinta amaneceres · racha de 30 días", "Antes del anochecer · 10 tramos únicos a tiempo", "Cumbre · cerrar una expedición", y tres con signo de interrogación y la palabra "Secreto". Debajo, "Hallazgos del sendero", con "3 de 16" y pestañas "Valle", "Ladera", "Puna", "Nieve y cielo": tres fichas encontradas ("Colibrí gigante", "Flor de cantuta", "Mojón de piedras") y el resto como siluetas grises.
Columna derecha, tarjeta "Mi paso": "Paso constante · 5 tramos al día" con el enlace "Cambiar"; "Día de aclimatación: domingo"; "Refugios: 2 de 2"; el botón secundario "Volver al campamento base" con la ayuda "Pausa de hasta 14 días."; y el enlace "Cómo se ganan los metros".
Restricciones: mismo estilo que la pantalla Hoy. Sin degradados, sin sombras, sin emojis.
```

### P12. Celebración

```text
Crea la ventana modal de celebración de Cumbre, que aparece cuando el equipo alcanza un hito. Se muestra centrada sobre la pantalla Hoy, que queda detrás con un velo #17302B al 60 % de opacidad.
Estructura: ventana blanca de 520 px de ancho con esquinas de 28 px y contenido centrado. Arriba, una ilustración; al medio, el texto; abajo, las acciones.
Ilustración, sobre fondo #D6ECEE con esquinas de 24 px: la llama color caramelo con su manta verde dando un salto corto, con las cuatro patas en el aire y una sombra ovalada en el suelo; a su lado un banderín terracota sobre un asta y tres triángulos pequeños ámbar alrededor. Detrás, la montaña verde con el sendero blanco.
Contenido: el antetítulo "CAMPAMENTO ALCANZADO"; el título grande "Campamento 3."; el texto "La cordada del Proyecto final llegó junta. +30 m para cada integrante que aportó en esta etapa."; una fila de cuatro avatares circulares (A, L, S, D) unidos por una cuerda terracota horizontal; la ficha "Último largo: Ana"; y la línea "Siguiente parada: campamento 4, a 6 tramos.".
Acciones: el botón "Seguir subiendo" de ancho completo, en terracota #C4441F con texto blanco, y debajo el enlace "Ver la expedición".
Restricciones: mismo estilo que la pantalla Hoy. Sin confeti, sin estrellas, sin medallas. Un solo botón. Sin degradados, sin sombras, sin emojis.
```

## 5. Prompt para la hoja de la mascota

```text
Crea una hoja de personaje con seis versiones de la misma mascota: Kusi, una llama. Es una lámina de referencia, no una pantalla de la aplicación.
Estilo: ilustración plana y geométrica, sin contorno, sin degradados y sin sombreado. Cuerpo y cuello color caramelo #B8732F, patas traseras #8F5622, copete rizado y hocico crema #FFF1DC, mejillas rosadas #F2A48C, ojos redondos #17302B con un brillo blanco, pezuñas #17302B. Lleva una manta verde #1F5F54 con tres franjas horizontales (ámbar #F2B441, crema #FFF1DC y terracota #D8502F) y una borla terracota pequeña junto a la oreja. Cuello largo, cabeza redondeada, orejas ovaladas. Siempre de tres cuartos, mirando hacia la derecha.
Composición: cuadrícula de tres columnas por dos filas sobre fondo #D6ECEE. Cada celda tiene la llama sobre un óvalo de suelo verde #2F7A6B y, debajo, una etiqueta en DM Sans negrita #17302B.
Las seis versiones: "Esperando": de pie, tranquila. "Animando": una pata delantera levantada y orejas hacia adelante. "Feliz": cuello erguido y ojos cerrados en arco. "Celebrando": salto corto con las cuatro patas en el aire y un banderín terracota al lado. "Preocupada": orejas hacia los lados, mirando hacia arriba, con un farol encendido a sus pies. "Descansando": echada con las patas dobladas, ojos cerrados y una carpa pequeña detrás.
Restricciones: el mismo personaje, con las mismas proporciones y colores, en las seis celdas. Sin ropa humana, sin gorros, sin texto fuera de las etiquetas, sin emojis.
```

## 6. Refinamientos propios de Cumbre

Uno por mensaje, sobre la pantalla indicada.

| Sobre | Prompt |
| :--- | :--- |
| P04 Hoy | `Haz que el sendero de la montaña sea una línea blanca continua hasta el punto terracota y punteada desde ahí hasta el banderín de la cumbre.` |
| P04 Hoy | `En la tarjeta Tramos de hoy, reemplaza la barra de progreso por cinco escalones ascendentes: tres en verde #2F7A6B y dos en gris #E4EEEC, con un banderín pequeño sobre el último.` |
| P04 Hoy | `En la tarjeta Cordada, une los cuatro avatares con una línea vertical terracota de 3 px por detrás y mantén el orden Ana, Luis, Sofía, Diego.` |
| P04 Hoy | `Crea una variante para el día de descanso: título "Día de aclimatación.", texto "Hoy no se espera nada de ti. Descansar también es subir.", la llama echada junto a una carpa y la tarjeta de tramos con el mensaje "Hoy no hay tramos programados.".` |
| P03 Campamento base | `Crea el paso 2 de este recorrido: antetítulo "CAMPAMENTO BASE · PASO 2 DE 3", título "Tu primer tramo.", un campo "¿Qué quieres cumplir hoy?" con el ejemplo "Repasar apuntes de Redux", el selector "Único" y "De rutina", y el botón principal "Crear y completar".` |
| P03 Campamento base | `Crea el paso 3 de este recorrido: antetítulo "CAMPAMENTO BASE · PASO 3 DE 3", título "Primer paso.", un banderín ámbar grande, el texto "Ganaste tu primer banderín, tus primeros 25 m y un refugio que protege tu racha." y el botón principal "Ir a Hoy".` |
| P06 Nuevo tramo | `Crea la variante con "De rutina" seleccionado: reemplaza el campo Vence por "Se repite" con cuatro opciones ("Cada día", "Días de la semana", "Veces por semana", "Día del mes"); muestra siete botones redondos L M X J V S D con L, X y V marcados, y cambia la vista previa a "Cada vez dará +10 m".` |
| P12 Celebración | `Crea la variante de cumbre: ventana con fondo #17302B y texto blanco, antetítulo "CUMBRE", título "La cordada llegó completa.", texto "+100 m para cada integrante. Proyecto final: 30 de 30 tramos.", la llama junto al banderín en la punta de la montaña, un cuaderno abierto con cuatro líneas de firma y el botón "Firmar el libro de cumbre" en terracota #C4441F.` |

## 7. Errores previsibles y cómo corregirlos

| Lo que puede salir | Prompt de corrección |
| :--- | :--- |
| La llama sale realista, en tres dimensiones o con contorno | `Redibuja la llama como ilustración plana y geométrica, sin contorno ni sombreado: cuerpo caramelo #B8732F, copete crema y manta verde #1F5F54 con tres franjas.` |
| La montaña sale como fotografía | `Reemplaza la fotografía por una ilustración plana: tres triángulos verdes superpuestos, nieve blanca en la punta del mayor y un sol ámbar circular.` |
| El cielo tiene degradado | `Reemplaza el degradado del bloque de bienvenida por el color plano #D6ECEE.` |
| El botón principal sale terracota | `El botón principal debe ser #17302B con texto blanco. Reserva el terracota para el avatar, el punto de posición y el banderín.` |
| El proyecto se muestra con una gráfica circular | `Reemplaza la gráfica circular por la montaña con sendero, campamentos y banderín, y deja el porcentaje como texto.` |
| La cordada aparece como clasificación con medallas | `Quita las medallas y los números de posición. Ordena a las personas como Ana, Luis, Sofía y Diego y deja solo la barra y la cifra de tramos.` |
| Dice "puntos" o "XP" | `Cambia "puntos" y "XP" por metros, con la unidad "m" separada por un espacio: "+10 m", "640 m".` |
| La gráfica de altitud baja en algún punto | `La gráfica de altitud es acumulada: cada punto debe ser igual o más alto que el anterior.` |
| Aparecen tejidos, gorros o banderas de colores en hilera | `Quita los adornos textiles y las banderas en hilera. Usa solo banderines triangulares lisos sobre un asta y la manta de tres franjas.` |
| Títulos con signos de exclamación | `Quita los signos de exclamación de los títulos y termínalos con punto.` |
