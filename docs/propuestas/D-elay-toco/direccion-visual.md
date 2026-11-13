# Dirección visual: Elay con Toco

Guía de cómo se ve este mundo: color, tipografía, forma, la mascota, las gráficas y el movimiento. Parte del tablero D del lienzo y lo extiende a todas las pantallas. Los valores exactos para herramientas están en `DESIGN.md`; aquí está el porqué y el detalle de dibujo.

## Tabla de contenidos

1. [Concepto](#1-concepto)
2. [Ambiente](#2-ambiente)
3. [Color](#3-color)
4. [Tipografía](#4-tipografía)
5. [Forma, borde y profundidad](#5-forma-borde-y-profundidad)
6. [La mascota: hoja de personaje](#6-la-mascota-hoja-de-personaje)
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

**Un patio con sombra y un tajibo en flor: todo lo que cumplís se pinta o florece.**

| Tres adjetivos | Lo que significa en pantalla |
| :--- | :--- |
| **Cálido** | Verde profundo, rosado y naranja; ningún gris frío; esquinas amplias |
| **Frondoso** | Dibujos que crecen: ramas, flores, anillos que se llenan |
| **Festivo** | Títulos gruesos de cartel, rosado tajibo para lo cumplido, banderines al final |

**Lo que no es.** No es postal turística de selva, ni recuerdo de aeropuerto, ni caricatura de lo camba. No es infantil: es para quien estudia y trabaja. No es realista: nada de plumas, texturas ni fotos. No es oscuro ni neón.

## 2. Ambiente

| Aspecto | Dirección |
| :--- | :--- |
| Materiales evocados | Paja tejida del sombrero, madera de rama, pétalo, masa horneada del cuñapé, tela de hamaca |
| Luz | Media mañana bajo un árbol: clara, pareja, sin contraluces ni brillos |
| Textura | Ninguna en la interfaz. Todo es color plano; la riqueza viene de las formas |
| Referencias, en palabras | Carteles de fiesta de barrio pintados a mano; láminas de álbum escolar de animales; el rosado del tajibo contra el verde de la ciudad; banderines de papel de colores |
| Lo que se evita | Hojas tropicales de relleno, loros de logotipo, tipografías "de selva", marcos de madera |

## 3. Color

**Paleta.**

| Nombre | Hex | Rol |
| :--- | :--- | :--- |
| Verde monte | `#0D7339` | Portada, navegación activa, botón principal, anillos recorridos, puntos ganados |
| Verde sombra | `#0A4D27` | Estado al pasar el cursor, texto sobre tintes verdes |
| Tinte verde | `#E3F1E7` | Avatares, pestaña activa, botón secundario |
| Rosado tajibo | `#C2255C` | Lo cumplido: marca de actividad, día redondo, plaza, avatar propio |
| Rosado medio | `#EC6A9A` | Flor mediana de la florada, cuarto tramo del pico |
| Rosado claro | `#F7A8C4` | Flor pequeña de la florada |
| Rosado pálido | `#F9B8CF` | Círculo de fondo de Toco |
| Naranja pico | `#F58A1F` | Punto de la comparsa, llama del jenecherú, tercer tramo |
| Ámbar | `#FFA928` | Segundo tramo, etiqueta "Pidió una mano" |
| Amarillo | `#FFC533` | Primer tramo, centro de las flores |
| Crema | `#FFF3DC` | Pico sin pintar, láminas del álbum, tarjetas de celebración |
| Fondo | `#F7FAF6` | Página |
| Superficie | `#FFFFFF` | Tarjetas, fichas, campos |
| Tinta | `#10261A` | Texto principal |
| Tinta suave | `#4C6355` | Texto secundario |
| Borde | `#CFE0D5` | Contorno de tarjetas |
| Borde fuerte | `#6F8A7A` | Contorno de campos y de la marca pendiente |
| Pista | `#DCE7DF` | Anillos por recorrer, pista de barras, lámina sin ganar |
| Día sin flor | `#D9CDD2` | Punto de un día sin actividad |
| Día futuro | `#A89BA1` | Aro de los días que no llegaron |
| Rojo urucú | `#A6321B` sobre `#FDECE6` | Errores |
| Pluma, ala, patas | `#15191C`, `#2B3338`, `#5F7C99` | Solo dentro de Toco |
| Rama | `#6B4423` | Rama del tajibo, postes de la hamaca |
| Río | `#7DBFE0` | El río en el mapa de anillos |
| Paja | `#F3DA9A`, `#E8C877`, `#9C7426` | Sombrero de saó |
| Cuñapé | `#F0C36A`, `#A8721A` | Moneda de puntos |
| Miel y coral | `#FFB72E`, `#F0795C` | Tonos intermedios del pico cuando tiene siete tramos |

**Dos reglas de significado.** El rosado tajibo quiere decir "cumplido". El verde quiere decir "estructura y acción". El naranja señala lo que se mueve. No se intercambian.

**Contraste calculado (fórmula WCAG).**

| Texto | Fondo | Razón | Uso |
| :--- | :--- | :---: | :--- |
| `#10261A` | `#FFFFFF` | 15,98 | Texto en tarjetas |
| `#10261A` | `#F7FAF6` | 15,19 | Texto sobre la página |
| `#4C6355` | `#FFFFFF` | 6,52 | Texto secundario |
| `#4C6355` | `#F7FAF6` | 6,19 | Texto secundario sobre la página |
| `#4C6355` | `#FFF3DC` | 5,93 | Texto secundario sobre crema |
| `#FFFFFF` | `#0D7339` | 5,95 | Portada y botón principal |
| `#FFFFFF` | `#0A4D27` | 9,98 | Botón al pasar el cursor |
| `#0D7339` | `#FFFFFF` | 5,95 | Puntos ganados, botón terciario |
| `#0A4D27` | `#E3F1E7` | 8,56 | Avatar, pestaña activa |
| `#FFFFFF` | `#C2255C` | 5,66 | Visto de actividad hecha, avatar propio |
| `#10261A` | `#FFA928` | 8,34 | Etiqueta "Pidió una mano" |
| `#10261A` | `#FFF3DC` | 14,54 | Lámina del álbum |
| `#10261A` | `#DCE7DF` | 12,58 | Lámina sin ganar |
| `#A6321B` | `#FDECE6` | 5,92 | Mensaje de error |
| `#FFFFFF` | `#A6321B` | 6,79 | Botón destructivo |
| `#FFFFFF` | `#15191C` | 17,68 | Globo de ayuda |

**Pares prohibidos para texto** (no llegan a 4,5:1): blanco sobre naranja (2,46), blanco sobre `#6F8A7A` (3,76), amarillo sobre verde (3,77), rosado claro sobre verde (3,22), naranja o rosados claros sobre blanco. Esos colores solo rellenan formas.

## 4. Tipografía

| Familia | Uso | Pesos |
| :--- | :--- | :--- |
| **Paytone One** | Títulos, botón principal, cifras | 400 (único) |
| **Figtree** | Texto, etiquetas, navegación | 400, 600, 700, 800 |

| Nivel | Familia | Tamaño | Peso | Interlínea | Uso |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `headline-display` | Paytone One | 58 px | 400 | 1,02 | Saludo de la portada |
| `headline-lg` | Paytone One | 36 px | 400 | 1,1 | Título de pantalla |
| `headline-md` | Paytone One | 22 px | 400 | 1,2 | Título de tarjeta |
| `headline-sm` | Paytone One | 18 px | 400 | 1,2 | Botón principal, "3 de 5", "60 %" |
| `number-md` | Paytone One | 16 px | 400 | 1 | "+10", "+25" |
| `body-lg` | Figtree | 19 px | 600 | 1,45 | Texto de la portada |
| `body-md` | Figtree | 16 px | 400 | 1,5 | Párrafos y campos |
| `body-sm` | Figtree | 14 px | 600 | 1,4 | Subtítulo de tarjeta |
| `label-lg` | Figtree | 16 px | 700 | 1,3 | Título de actividad, de ficha |
| `label-md` | Figtree | 15 px | 700 | 1,2 | Navegación, pestañas |
| `label-sm` | Figtree | 13 px | 600 | 1,35 | Tipo de actividad, ayudas |
| `label-caps` | Figtree | 13 px | 700 | 1,2 | Fecha en mayúsculas, espaciado 0,08 em |

Reglas: Paytone One nunca en párrafos ni por debajo de 16 px; no se simula negrita ni cursiva. El texto secundario va en 600, no en 400, para sostenerse en 13 px. Los signos de apertura (¡ ¿) se usan siempre.

## 5. Forma, borde y profundidad

| Elemento | Radio | Borde |
| :--- | :---: | :--- |
| Portada y ventanas | 28 px | Ninguno |
| Tarjetas | 24 px | 1,5 px `#CFE0D5` |
| Fichas de dato y láminas | 20 px | Ninguno |
| Campos | 12 px | 1,5 px `#6F8A7A` |
| Botones, pestañas, navegación | Píldora | Ninguno |
| Marcas, avatares, flores | Círculo | 2,5 px solo en la marca pendiente |

No hay sombras. La profundidad son tres planos: página, tarjeta blanca con borde y portada verde. Las ventanas se apoyan en un velo de tinta al 55 %. El único objeto con ángulos es el pico: por eso es lo primero que se mira.

## 6. La mascota: hoja de personaje

**Quién es.** Toco es un tucán toco con sombrero de saó. Curioso, tranquilo y atento; anima sin gritar. Vive en una rama de tajibo y no sale de ella: es el punto fijo del mundo.

**Construcción** (sobre un lienzo de 360 × 330).

| Parte | Forma | Color |
| :--- | :--- | :--- |
| Fondo | Círculo de 300 de diámetro | Rosado pálido |
| Cuerpo | Elipse vertical de 120 × 156 | Pluma |
| Ala | Elipse de 64 × 112, girada 10° | Ala |
| Cabeza | Círculo de 92 | Pluma |
| Pecho | Elipse de 56 × 64 bajo el pico | Blanco |
| Ojo | Aro naranja de 28, blanco de 18, pupila de 11 y brillo de 3,6 | Naranja, blanco, pluma |
| Pico | Polígono de 128 de largo y 60 de alto en la base, punta caída; contorno de 5 px, divisiones de 2,5 px y una línea de boca | Tramos de la rampa o crema |
| Sombrero | Ala elíptica de 120 × 22 y copa de 64 × 34, girado 10° hacia atrás; cinta de 10 px | Paja; cinta verde monte |
| Cola | Rectángulo redondeado de 38 × 70, girado 16° | Pluma |
| Patas | Dos rectángulos redondeados de 14 | Gris azulado |
| Rama | Trazo curvo de 12 px con extremos redondos | Rama |
| Flor | Cinco círculos de radio 7 y centro de radio 3,8 | Rosado tajibo y amarillo |

**Proporciones.** El pico mide un tercio del ancho del dibujo. La cabeza con el sombrero ocupa dos quintos del alto. Toco siempre está de perfil y mira a la derecha, hacia las fichas de dato.

**La rampa del pico** (colores planos, de la base a la punta).

| Objetivo | Colores |
| :---: | :--- |
| 3 | Amarillo, naranja, rosado tajibo |
| 5 | Amarillo, ámbar, naranja, rosado medio, rosado tajibo |
| 7 | Amarillo, miel, ámbar, naranja, coral, rosado medio, rosado tajibo |

**Los seis estados.**

| Estado | Postura | Ojo | Sombrero | Extra |
| :--- | :--- | :--- | :--- | :--- |
| Esperando | Recto, cabeza apenas ladeada | Redondo | Derecho | Pico en crema o con lo ya pintado |
| Animando | Un ala levantada | Redondo, brillo más grande | Derecho | Dos rayitas de impulso junto al ala |
| Feliz | Pecho inflado | Arco hacia arriba | Echado hacia atrás | Ninguno |
| Celebrando | Alas abiertas, un salto corto | Arco | En el aire, sobre la cabeza | Flores de tajibo cayendo; pico entero |
| Preocupada | Encogido, un ala abriga un tizón encendido sobre la rama | Redondo, mira al tizón | Bajo sobre la frente | Llama pequeña |
| Descansando | Echado en una hamaca verde colgada de la rama | Cerrado en línea | Sobre los ojos | Ninguno |

**Tamaños.** Toco completo desde 160 px de ancho. Entre 48 y 159 px se usa "Toco de cabeza": cabeza, sombrero y pico. Por debajo de 96 px el pico pierde las divisiones y muestra solo la parte pintada y la parte en crema. La marca de la aplicación es la flor de tajibo, no Toco.

**Lo que Toco nunca hace.** No habla con acento escrito, no reprocha, no llora, no aparece enjaulado ni con objetos ajenos a su mundo, no mira hacia la izquierda, no cambia de estilo de dibujo y no usa la hamaca como chiste: descansa porque se lo ganó.

## 7. Ilustración y escenas

Estilo único: siluetas planas, tres o cuatro colores por figura, sin contorno salvo en el pico, sin degradados.

| Pantalla | Qué se ilustra |
| :--- | :--- |
| P01 y P02 | Toco de cuerpo entero con el pico en crema sobre el panel verde |
| P03 | Toco con globo de texto; tres picos pequeños de 3, 5 y 7 tramos; al final, el primer tramo pintado |
| P04 | Toco en la portada según su estado; el pico y la rama con datos reales |
| P07 y P08 | Mapa de anillos; en P08 con el río, la plaza, las iniciales y, desde el 4to anillo, banderines |
| P10 | El tajibo de la florada y una rama horizontal por actividad |
| P11 | El tajibo completo de diez ramas con Toco en la suya; láminas del álbum |
| P12 | Toco celebrando; si hay visita, el animal posado a su lado |
| Estados vacíos | Toco de cabeza junto al texto; rama sin flores |

Las láminas del Álbum del monte son cuadros de fondo crema con el animal o la planta centrado, en la misma construcción geométrica que Toco. Sin ganar, se ven como silueta en `#6F8A7A` sobre fondo `#DCE7DF`, con el criterio escrito debajo.

## 8. Iconografía

Caja de 24 px, trazo de 2,2 px con extremos redondos, dos colores como máximo.

| Icono | Dibujo | Color |
| :--- | :--- | :--- |
| Jenecherú | Llama con llama interior | Naranja y amarillo |
| Hamaca | Dos postes y un arco relleno | Rama y verde |
| Rama | Trazo curvo con un botón y una flor | Rama y rosado |
| Anillos | Dos círculos concéntricos y un punto | Verde y rosado |
| Cuñapé | Círculo con borde | Dorado y borde pardo |
| Somó | Tutuma: media esfera con una línea de líquido | Rama y crema |
| Una mano | Mano abierta de trazo | Tinta |
| Visita | Silueta pequeña de picaflor | Verde |

Los iconos de sistema (cerrar, editar, calendario, filtro) son lineales en tinta. No se usan emojis en ningún caso.

## 9. Visualización de datos

| Gráfica | Dato | Codificación | Leyenda y texto | Alternativa accesible |
| :--- | :--- | :--- | :--- | :--- |
| **Pico de Toco** | Cumplidas sobre objetivo de hoy | Tramos pintados de base a punta; posición y color | "3 de 5" siempre al lado | `aria-label`: "Pico de Toco: 3 de 5 tramos pintados" |
| **Rama** | Avance hacia el nivel siguiente | Cuatro botones; abiertos en rosado, cerrados en verde | "Te faltan 60 cuñapés para la rama 5" | Barra de progreso con valor |
| **Florada del tajibo** | Actividades cumplidas por día | Siete columnas, una fila por semana; tamaño y tono en cuatro pasos; centro amarillo si el día fue redondo | "Menos" a "Más"; "Hoy con borde" | Tabla con fecha y cantidad |
| **Mapa de anillos** | Avance del proyecto | Cinco anillos; verdes los cruzados; punto naranja en el tramo actual | "Van por el 3er anillo de 5 · 18 de 30" | Lista de hitos con estado |
| **Rama por actividad** | Cumplimiento de cada recurrente | Rama horizontal con una flor por vez programada: abierta si se cumplió, botón si no | Porcentaje y "6 de 7" a la derecha | Tabla por actividad |
| **Cuñapés por semana** | Tendencia | Barras verdes de punta redonda; la semana en curso en naranja con su cifra en tinta encima | Eje con S1 a S6 y valor sobre cada barra | Tabla por semana |
| **Únicas y recurrentes** | Proporción | Una barra partida en verde (recurrentes) y rosado (únicas) | Cantidad escrita en cada parte | Dos cifras |
| **Aporte por comparsero** | Actividades y días con aporte | Barras horizontales verdes con la inicial delante | Cantidad al final de cada barra | Lista |

Detalle de la florada: día sin actividad, punto de 6 px en `#D9CDD2`; día activo con menos de la mitad del objetivo, flor de 12 px en rosado claro; con la mitad o más, flor de 18 px en rosado medio; día redondo, flor de 24 px en rosado tajibo con centro amarillo; día cubierto por una hamaca, un arco verde pequeño; siesta, aro fino verde; hoy, borde de tinta de 2,5 px; días futuros, aro gris.

## 10. Movimiento

| Evento | Movimiento | Duración | Curva |
| :--- | :--- | :---: | :--- |
| Completar una actividad | La marca se llena desde el centro; el tramo se pinta de la base a la punta; la cifra sube | 300 ms | Salida suave |
| Desmarcar | El tramo vuelve a crema sin rebote | 150 ms | Lineal |
| Pico pintado | Toco abre las alas, lanza el sombrero y caen cinco flores | 1200 ms | Rebote corto |
| Subir de rama | Toco salta a la rama de arriba; la rama anterior queda florecida | 600 ms | Entrada y salida suaves |
| Visita | El animal entra desde el borde derecho y se posa | 800 ms | Salida suave |
| Cruzar un anillo | El anillo se pinta en sentido horario y el punto naranja avanza | 900 ms | Entrada y salida suaves |
| Estado de reposo | Toco parpadea cada seis a nueve segundos | 120 ms | Lineal |

Con movimiento reducido: sin desplazamientos, saltos ni caídas; solo cambios de color en 150 ms y el estado final de cada dibujo.

## 11. Sonido

Apagado por defecto. Si la persona lo enciende: un golpe seco de madera al completar (el pico de Toco contra la rama), dos golpes al cerrar el pico y un redoble corto de percusión al cruzar un anillo. Ningún sonido dura más de un segundo y ninguno se repite en bucle.

## 12. Composición

**Escritorio (1360 px).** Margen de página de 32 px, ancho máximo de 1296 px, 20 px entre bloques.

| Franja | Alto | Contenido |
| :--- | :---: | :--- |
| Navegación | 52 px | Marca a la izquierda, cuatro destinos al centro, nivel y avatar a la derecha |
| Portada | 350 px mínimo | Texto y botón (izquierda, flexible), Toco de 360 px (centro), tres fichas de 300 px (derecha) |
| Tarjetas | 420 px mínimo | Tres columnas iguales: actividades, comparsa, florada |

Las pantallas de gestión (P05, P07, P10) usan dos columnas: contenido a la izquierda en dos tercios y resumen a la derecha en un tercio. Los formularios (P01, P02, P06) centran una tarjeta de 440 a 560 px.

**Teléfono (360 px).** Una columna. La portada apila texto, Toco de 220 px y las fichas en fila deslizable. Navegación abajo con los cuatro destinos e icono; botón "Nueva actividad" flotante en verde. La florada conserva las siete columnas con flores un tercio más pequeñas.

## 13. Accesibilidad

- Todo texto cumple 4,5:1; los pares están calculados en la sección 3.
- Ningún dato depende solo del color: el pico usa posición, la florada usa tamaño y centro, los anillos usan orden y el texto "3er anillo de 5".
- Las dos flores más claras de la florada (1,85:1 y 2,96:1 sobre blanco) no alcanzan el 3:1 de los elementos gráficos. Con la preferencia de más contraste activada llevan contorno de 1,5 px en rosado tajibo y los tramos sin pintar del pico muestran un aro de tinta.
- Áreas de toque de 44 px como mínimo; la marca de actividad mide 30 px dentro de un botón de 44.
- Cada gráfica tiene texto alternativo y una tabla equivalente en reportes.
- Foco visible: anillo de 3 px en verde sombra con 2 px de separación.
- Las palabras propias llevan su explicación en texto, no solo en un globo al pasar el cursor.
- Se respeta la preferencia de movimiento reducido.

## 14. Qué hacer y qué no

| Sí | No |
| :--- | :--- |
| Rosado tajibo solo para lo cumplido | Rosado como color de botón o de alerta |
| Toco de perfil, mirando a la derecha | Toco de frente, realista o con textura |
| Colores planos | Degradados, sombras, brillos, fotos |
| Un botón principal por pantalla | Dos píldoras verdes compitiendo |
| Palabra propia con su explicación | "Jenecherú" a secas en la primera aparición |
| Anillos para la comparsa, ramas para el nivel | "Anillo" para el nivel personal |
| Hamaca como descanso ganado | Hamaca como broma sobre la pereza |
| Cifra escrita junto a cada gráfica | Gráficas que solo se entienden por el color |
| Flores, ramas y anillos con datos | Hojas y flores de relleno |
