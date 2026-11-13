# Dirección visual: Órbita

Este documento fija cómo se ve y se mueve el mundo **B · Órbita**: color, tipografía, forma, la mascota Nova, las gráficas propias y el movimiento. Parte del tablero "B · Órbita" del lienzo y lo extiende a toda la aplicación. Los valores exactos para herramientas están en `DESIGN.md`; aquí está el porqué de cada decisión.

## Tabla de contenidos

1. [Concepto](#1-concepto)
2. [Ambiente](#2-ambiente)
3. [Color](#3-color)
4. [Tipografía](#4-tipografía)
5. [Forma, borde y profundidad](#5-forma-borde-y-profundidad)
6. [Nova: hoja de personaje](#6-nova-hoja-de-personaje)
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

**Un planetario de bolsillo: el cielo empieza oscuro y solo brilla lo que ya cumpliste.**

| Adjetivo | Qué significa aquí |
| :--- | :--- |
| **Sereno** | Mucho espacio oscuro, pocas cosas por pantalla, nada que parpadee |
| **Preciso** | Líneas finas, cifras en tipografía de instrumento, círculos exactos |
| **Luminoso** | Una sola luz principal, el amarillo de Nova, que se gana con cada misión |

**Lo que no es.**

- No es ciencia ficción: sin naves, láseres, cascos ni paneles de mando recargados.
- No es neón ni estética *cyberpunk*: sin brillos difusos, sin magenta eléctrico.
- No es astronomía fotográfica: sin nebulosas, galaxias ni fotos de planetas.
- No es un tablero corporativo en modo oscuro: tiene una mascota con cara y un mundo propio.

## 2. Ambiente

| Aspecto | Dirección |
| :--- | :--- |
| **Material** | Papel azul noche, mate, como una carta celeste impresa. Tinta clara encima |
| **Instrumento de referencia** | El planetario mecánico de mesa: aros concéntricos, esferas pequeñas que giran alrededor de un centro |
| **Luz** | Viene de dentro de los objetos. No hay foco externo, por eso no hay sombras |
| **Textura** | Ninguna. Superficies lisas; la riqueza está en los puntos y las líneas |
| **Temperatura** | Fondo frío (azules) con acentos cálidos (amarillo y coral) para que lo logrado se sienta cercano |
| **Hora** | La madrugada tranquila, antes del amanecer. No la medianoche dramática |

Referencias descritas, sin copiar ninguna marca: las láminas de constelaciones de un atlas escolar, los aros de un astrolabio, las esferas de un móvil infantil, los parches bordados de una tripulación.

## 3. Color

**Paleta completa.**

| Nombre | Hex | Rol |
| :--- | :--- | :--- |
| Espacio profundo | `#0B1026` | Fondo de página y de la barra de navegación |
| Noche | `#141A3A` | Tarjetas y paneles |
| Noche alta | `#1C2450` | Fichas de dato, campos, píldoras, ventanas |
| Borde | `#2C3566` | Bordes de 1 px, pistas de órbita y de progreso, avatar pequeño |
| Contorno | `#7C88C4` | Casillas pendientes y estrellas apagadas |
| Blanco estelar | `#F3F5FF` | Texto principal; tercera órbita |
| Bruma | `#D5DAF5` | Texto de apoyo, navegación inactiva |
| Bruma tenue | `#AEB6DC` | Metadatos, contadores, rótulos |
| Amarillo Nova | `#FFD25E` | Acción principal, lo cumplido, destellos, estrellas encendidas |
| Amarillo claro | `#FFDE85` | Botón principal con el cursor encima |
| Amarillo hondo | `#F2C140` | Botón principal presionado |
| Tinta índigo | `#1A1440` | Texto sobre amarillo, aguamarina, coral y rosa; cara de Nova |
| Aguamarina | `#5FD4E6` | Información y ritmo: primera órbita, barras, enlaces, foco |
| Coral | `#FF8E72` | Segunda órbita, mejillas de Nova, aviso "vence hoy" |
| Lila | `#B9A8FF` | Cuarta órbita y series adicionales |
| Rosa señal | `#FF7A90` | Errores, siempre con icono y texto |

**Reglas de uso.**

- El amarillo ocupa poco: alrededor del 5 % de cada pantalla. Si todo es amarillo, nada está encendido.
- Orden fijo de colores para órbitas, de dentro hacia fuera: aguamarina, coral, blanco estelar, lila.
- Coral avisa con amabilidad; rosa señal marca error. No se intercambian.
- Todos los colores son planos. El halo se hace con círculos del mismo color al 10 a 16 % de opacidad.

**Contraste calculado** (fórmula WCAG 2.1; mínimo 4,5:1 para texto normal y 3:1 para elementos gráficos).

| Texto o elemento | Fondo | Razón | Uso permitido |
| :--- | :--- | :---: | :--- |
| Blanco estelar `#F3F5FF` | Espacio profundo, noche y noche alta | 17,3 · 15,6 · 13,6 | Texto |
| Blanco estelar `#F3F5FF` | Borde | 10,7:1 | Inicial en avatar pequeño |
| Bruma `#D5DAF5` | Noche | 12,3:1 | Texto |
| Bruma tenue `#AEB6DC` | Noche y noche alta | 8,5 · 7,4 | Texto |
| Amarillo Nova `#FFD25E` | Noche | 11,8:1 | Texto y gráficos |
| Aguamarina `#5FD4E6` | Noche | 9,7:1 | Texto y gráficos |
| Coral `#FF8E72` | Noche | 7,6:1 | Texto y gráficos |
| Lila `#B9A8FF` | Noche | 8,2:1 | Texto y gráficos |
| Rosa señal `#FF7A90` | Noche alta | 6,0:1 | Texto de error |
| Contorno `#7C88C4` | Noche | 5,0:1 | Gráficos y contornos |
| Contorno `#7C88C4` | Noche alta | 4,4:1 | Solo gráficos, nunca texto |
| Tinta índigo `#1A1440` | Amarillo Nova, claro y hondo | 12,0 · 13,2 · 10,2 | Texto de botón |
| Tinta índigo `#1A1440` | Coral | 7,7:1 | Texto de chip |
| Tinta índigo `#1A1440` | Rosa señal | 6,9:1 | Texto de aviso |
| Espacio profundo `#0B1026` | Aguamarina | 10,8:1 | Texto de filtro activo |

## 4. Tipografía

Dos familias de Google Fonts.

| Familia | Papel | Pesos | Por qué |
| :--- | :--- | :--- | :--- |
| **Space Grotesk** | Títulos, botones y cifras | 600, 700 | Geométrica con carácter; sus números parecen de instrumento sin ser fríos |
| **Inter** | Lectura, navegación y metadatos | 400, 600 | Muy legible en tamaños pequeños sobre fondo oscuro |

**Escala.**

| Nivel | Familia | Tamaño | Peso | Interlínea | Uso |
| :--- | :--- | :---: | :---: | :---: | :--- |
| Display | Space Grotesk | 48 px | 700 | 1,05 | Saludo de Hoy; título de celebración |
| Título grande | Space Grotesk | 28 px | 700 | 1,1 | Marca; título de pantalla interior |
| Título de tarjeta | Space Grotesk | 22 px | 600 | 1,25 | Encabezado de cada tarjeta |
| Cifra grande | Space Grotesk | 18 px | 600 | 1,2 | "3 de 5", "60 %", inicial de avatar |
| Cifra | Space Grotesk | 16 px | 600 | 1,2 | "+10", valores sobre barras |
| Botón | Space Grotesk | 17 px | 700 | 1 | Botón principal |
| Etiqueta | Inter | 15 px | 600 | 1,2 | Navegación, fichas, pestañas |
| Rótulo | Inter | 13 px | 600 | 1,2 | Mayúsculas con espaciado 0,08 em |
| Texto grande | Inter | 18 px | 400 | 1,5 | Frase de Nova |
| Texto | Inter | 16 px | 400 | 1,5 | Párrafos y campos |
| Texto fuerte | Inter | 16 px | 600 | 1,35 | Título de misión |
| Texto pequeño | Inter | 14 px | 400 | 1,5 | Metadatos y pies de gráfica |

**Reglas.**

- Toda cifra va en Space Grotesk. Un número en Inter es un error.
- Un solo Display por pantalla.
- Mayúsculas solo en rótulos de 13 px; es el único texto por debajo de 14 px y siempre va en peso 600.
- El saludo cierra con punto: "Buen despegue, Ana." El punto es parte del tono sereno.

## 5. Forma, borde y profundidad

| Elemento | Radio | Borde |
| :--- | :---: | :--- |
| Tarjeta principal | 28 px | 1 px `#2C3566` |
| Tarjeta | 24 px | 1 px `#2C3566` |
| Botón, ficha de dato | 14 px | El secundario lleva 1 px `#2C3566` |
| Destino de navegación, pestaña, campo | 12 px | Campo con foco: 2 px aguamarina |
| Barra de gráfica | 10 px | Ninguno |
| Avatar, casilla, píldora, parche, planeta | Círculo | Avatar: 1,5 px aguamarina |

**Profundidad sin sombras.** Tres capas tonales, de más lejos a más cerca: espacio profundo, noche y noche alta. Cada capa es un paso más clara. Las ventanas modales se apoyan sobre el fondo oscurecido al 70 %.

**Halo plano.** El único efecto de luz: uno o dos círculos concéntricos del color del objeto, con opacidad del 10 al 16 %, sin desenfoque. Lo llevan Nova y las estrellas encendidas.

**Línea.** Extremos y uniones siempre redondeados. Grosores: 1 px bordes, 1,5 a 2 px constelaciones e iconos, 4 px pistas de órbita, 5 px arcos.

## 6. Nova: hoja de personaje

**Quién es.** Una estrella joven, curiosa y tranquila. Acompaña, no dirige. Su luz no es suya: es el reflejo de lo que la persona cumple.

**Construcción geométrica** (sobre un cuadro de 220 unidades).

| Parte | Construcción | Color |
| :--- | :--- | :--- |
| Cuerpo | Estrella de cinco puntas, radio exterior 70 y radio interior 38, con contorno del mismo color de 20 unidades y uniones redondas: las puntas quedan como dedos romos | `#FFD25E` |
| Ojos | Dos óvalos verticales de 12 por 16, separados 28 entre centros, un poco por encima del centro | `#1A1440` |
| Brillo de los ojos | Un punto de radio 2,2 arriba a la derecha de cada ojo | `#FFFFFF` |
| Mejillas | Dos círculos de radio 6,5 bajo los ojos y hacia fuera, al 75 % de opacidad | `#FF8E72` |
| Boca | Curva de 14 de ancho, trazo de 3,5 con extremos redondos | `#1A1440` |
| Halo | Círculos de radio 80 y 96, al 12 y 10 % de opacidad | `#FFD25E` |

**Proporciones.** La cara ocupa el tercio central. Los ojos son grandes respecto al cuerpo (un sexto del ancho cada uno) para que se lean en tamaño pequeño. No tiene brazos, piernas ni accesorios.

**El brillo es un dato.** El halo tiene cuatro pasos según el progreso del día: sin halo (0 %), un halo pequeño (hasta 49 %), dos halos (50 a 99 %) y dos halos con rayos (100 %).

**Los seis estados.**

| Estado | Ojos | Boca | Postura | Halo y extras |
| :--- | :--- | :--- | :--- | :--- |
| Esperando | Abiertos, mirando hacia las órbitas | Sonrisa leve | Recta | Halo mínimo |
| Animando | Abiertos, mirando al frente | Sonrisa pequeña | Inclinada 8 grados a la derecha | Un halo; un destello de cuatro puntas junto a la punta superior derecha |
| Feliz | Abiertos, brillo más grande | Sonrisa amplia | Recta, 4 % más grande | Dos halos; mejillas al 100 % |
| Celebrando | Cerrados en arco hacia arriba | Abierta, en media luna rellena | Recta, 8 % más grande | Dos halos y ocho rayos cortos alrededor |
| Preocupada | Abiertos, con cejas cortas inclinadas hacia dentro | Pequeña y redonda | Inclinada 6 grados a la izquierda | Halo mínimo |
| Descansando | Cerrados en arco hacia abajo | Línea corta y relajada | Recta | Sin halo amarillo; una media luna aguamarina arriba a la derecha |

**Tamaños.**

| Uso | Tamaño | Detalle |
| :--- | :---: | :--- |
| Tarjeta principal de Hoy | 160 px | Completa, con halo |
| Celebración | 200 px | Completa, con rayos |
| Estados vacíos y recorrido inicial | 96 a 120 px | Completa |
| Junto a un mensaje | 48 px | Sin mejillas ni brillo de ojos |
| Mínimo con cara | 32 px | Solo ojos y boca |
| Por debajo de 32 px | — | Se usa el destello de cuatro puntas, sin cara |

**Lo que Nova nunca hace.** No llora ni se enoja. No señala a la persona. No aparece apagada, rota o cayendo. No lleva casco, capa ni gafas. No habla en mayúsculas. No ocupa más de un tercio del ancho de una pantalla.

## 7. Ilustración y escenas

Todo se dibuja con círculos, elipses, líneas y puntos. Sin perspectiva ni volumen.

| Pantalla | Escena |
| :--- | :--- |
| P01 Entrar | Nova esperando dentro de un único anillo vacío, con seis puntos de cielo alrededor |
| P02 Crear cuenta | Un campo de estrellas apagadas (círculos huecos) y una sola encendida |
| P03 Preparar el despegue | Tres anillos que se dibujan uno por paso; al final Nova se enciende en el centro |
| P04 Hoy | Sistema de órbitas con Nova, planetas y arcos |
| P07 y P08 Constelaciones | La figura de diez estrellas, con líneas continuas y punteadas |
| P10 Bitácora | El cielo del mes como retícula de puntos |
| P11 Perfil | Cometas: núcleo redondo y cola de dos o tres trazos; parches con borde bordado |
| P12 Celebración | Nova con rayos sobre un cielo con todas las estrellas encendidas |
| Estados vacíos | Nova a 96 px con un anillo punteado donde luego habrá contenido |

**Cielo de fondo.** Puntos blancos de 1 a 2 px al 70 % de opacidad, entre seis y doce por escena, nunca en retícula regular. **Parches.** Circulares, con doble borde (una línea continua y otra punteada, que evoca el bordado) y un símbolo de trazo en el centro. Hasta tres colores por parche.

## 8. Iconografía

- Trazo de 2 px, extremos y uniones redondeados, retícula de 20 px, sin relleno.
- El relleno se reserva para indicar "hecho" (casilla amarilla con marca índigo).
- Color por defecto bruma `#D5DAF5`; aguamarina si el icono es pulsable; amarillo si representa algo ganado.

Repertorio: destello de cuatro puntas con lados cóncavos (destellos y racha), escudo de contorno, planeta con anillo inclinado (órbita), tres puntos unidos por dos líneas (constelación), cuaderno con espiral (bitácora), núcleo con cola de tres trazos (cometa), antena con dos ondas (señal), dos flechas en círculo (relevo), media luna (día en crucero) y signo más dentro de un círculo (nueva misión).

## 9. Visualización de datos

Principio común: **forma y posición antes que color**. Cada gráfica lleva su cifra escrita, una frase de resumen debajo y texto alternativo con los valores.

**Progreso del día.** No es una barra: es el halo de Nova en cuatro pasos, acompañado por el contador "3 de 5" en la tarjeta de misiones y la frase "Nova brilla al 60 %".

**Sistema de órbitas (ritmo de recurrentes).**

| Parte | Especificación |
| :--- | :--- |
| Pistas | Círculos concéntricos de 4 px en `#2C3566`; radios 84, 114, 144 y 174 sobre un lienzo de 320 a 380 px |
| Arco | 5 px, extremos redondos; empieza arriba (las 12) y avanza en sentido horario; longitud igual a vueltas hechas sobre planeadas |
| Planeta | Círculo de 18 a 22 px al final del arco, con borde de 3 px del color de la tarjeta |
| Lunas y anillo | Puntos de 6 px junto al planeta (hasta tres); anillo elíptico inclinado 20 grados a la cuarta semana estable |
| Marcas de vuelta | Rayas cortas sobre la pista, una por vuelta planeada |
| Cambio de ritmo | La pista se dibuja punteada |
| Leyenda | Punto de color, nombre de la actividad y "5 de 7 vueltas", en el mismo orden que los anillos |
| Límite | Cuatro órbitas. Con más, un enlace "Ver todas tus órbitas" |
| Alternativa accesible | Lista con nombre, vueltas y estado en palabras |

**Constelación (avance de proyecto).** Diez estrellas en una figura única. Encendida: destello amarillo de 20 px con halo plano. Apagada: círculo hueco de 10 px con contorno `#7C88C4`. Estrella guía: un tercio más grande. Líneas continuas amarillas de 2 px entre encendidas; punteadas (3 y 6) entre apagadas. Siempre con "60 %" y "6 de 10 estrellas encendidas" escritos.

**Aporte de la tripulación.** Píldoras con inicial, nombre y número, ordenadas de mayor a menor. En el detalle de la constelación, barras horizontales aguamarina con la cifra al final.

**Bitácora semanal.** Siete barras de 40 px de ancho como máximo y radio de 10 px. Días pasados en aguamarina, hoy en amarillo con su letra también en amarillo y en negrita, días futuros como marca de 8 px en `#2C3566`. Valor encima de cada barra.

**Cielo del mes (constancia).** Retícula de siete columnas, de lunes a domingo, una fila por semana. La forma codifica el día:

| Día | Marca |
| :--- | :--- |
| Sin misiones cumplidas | Círculo hueco de 6 px en `#7C88C4` |
| Día activo | Destello amarillo de 12 px |
| Cielo encendido | Destello amarillo de 18 px con halo |
| Cubierto por un escudo | Círculo hueco con contorno aguamarina |
| Día en crucero | Media luna en `#AEB6DC` |
| Hoy | Anillo de 1,5 px en blanco estelar alrededor de la marca |

**Otras gráficas de la Bitácora.** Tendencia de seis semanas: línea aguamarina de 2 px con puntos de 6 px y sin relleno bajo la curva. Únicas frente a órbitas: una barra horizontal partida en dos tramos, amarillo y aguamarina, cada uno con su etiqueta y su cifra.

## 10. Movimiento

| Momento | Movimiento | Duración |
| :--- | :--- | :---: |
| Completar una misión | La casilla se llena de amarillo y se dibuja la marca | 200 ms |
| | "+10" sube 8 px y se asienta | 300 ms |
| | El planeta avanza por su órbita hasta la nueva posición | 600 ms |
| | El halo de Nova crece un paso | 400 ms |
| Cielo encendido | Los puntos del fondo se encienden en cadena; Nova pasa a celebrar | 1200 ms |
| Estrella guía | La línea se traza hasta la estrella y esta se enciende con un pulso de halo | 900 ms |
| Cometa | Cruza la tarjeta principal en diagonal y deja su ficha | 1500 ms |
| Cambio de pantalla | El contenido aparece con un desplazamiento de 8 px hacia arriba | 250 ms |

- Curva de entrada: `cubic-bezier(0.2, 0.8, 0.2, 1)`. Movimiento orbital: `ease-in-out`.
- Los planetas **no giran solos**. Se mueven solo cuando algo se cumple: el movimiento es consecuencia, no adorno.
- Único movimiento ambiental: un punto del cielo de fondo cambia de opacidad cada varios segundos.
- Con movimiento reducido activado: sin desplazamientos ni trazados; los estados cambian de forma instantánea y el cometa aparece directamente como ficha.

## 11. Sonido

Opcional y apagado por defecto. Si se activa: una nota breve de campanilla al completar, un acorde ascendente de tres notas en el cielo encendido y un sonido suave de paso para el cometa. Sin voces ni melodías. Nunca suena al abrir la aplicación.

## 12. Composición

**Escritorio (1360 px).** Columna central de 1296 px, márgenes de 32 px, separación de 20 px.

| Franja | Alto | Contenido |
| :--- | :---: | :--- |
| Barra de navegación | 52 px | Marca a la izquierda; Hoy, Misiones, Constelaciones y Bitácora al centro; rango y avatar a la derecha |
| Tarjeta principal | 360 px mínimo | Izquierda: sistema de órbitas (320 px). Centro: fecha, saludo, frase de Nova, botón "Nueva misión", fichas de racha y escudos. Derecha: leyenda "Tus órbitas esta semana" (290 px) |
| Fila de tarjetas | 420 px mínimo | Tres tarjetas iguales: Misiones de hoy, Constelación, Bitácora de la semana |

Pantallas interiores: título de 28 px arriba a la izquierda, acción principal arriba a la derecha y dos columnas (dos tercios y un tercio). Formularios en una columna de 560 px como máximo, con la vista previa a la derecha.

**Teléfono (desde 360 px).** Una columna con márgenes de 16 px. Orden en Hoy: saludo con Nova a 96 px, fichas de racha y escudos, misiones de hoy, sistema de órbitas con su leyenda debajo, constelación y bitácora. Navegación inferior con cuatro destinos e icono. Botón "Nueva misión" fijo sobre la navegación.

## 13. Accesibilidad

- Contraste: todas las combinaciones de texto superan 4,5:1; la más baja en uso es rosa señal sobre noche alta, con 6,0:1.
- El color nunca es la única pista: órbitas con nombre y cifra, días del cielo del mes con formas distintas, errores con icono y texto.
- Zonas pulsables de 44 px como mínimo, aunque la casilla visible mida 30 px.
- Foco de teclado: anillo aguamarina de 2 px separado 2 px del elemento, visible sobre las tres capas.
- Cada gráfica es una imagen con texto alternativo que incluye los valores ("5 de 7 vueltas").
- Las misiones hechas no se tachan: el estado se anuncia en la etiqueta del botón ("Completada: Caminar 30 minutos").
- Se respeta la preferencia de movimiento reducido.
- Al imprimir o exportar un reporte se usa una versión clara (texto índigo sobre blanco) para no gastar tinta ni perder legibilidad.

## 14. Qué hacer y qué no

| Hacer | No hacer |
| :--- | :--- |
| Reservar el amarillo para lo cumplido y la acción principal | Usar amarillo en títulos, bordes o adornos |
| Dejar espacio oscuro alrededor de cada tarjeta | Llenar el fondo de estrellas o texturas |
| Dibujar con círculos, líneas finas y puntos | Usar fotos del espacio, naves o astronautas |
| Hacer el halo con círculos planos de baja opacidad | Usar degradados, desenfoques o vidrio esmerilado |
| Mover un planeta cuando se cumple una vuelta | Hacer girar los planetas todo el tiempo |
| Acompañar cada palabra del mundo con la común la primera vez | Suponer que "destellos" o "relevo" se entienden solos |
| Mantener a Nova amable en los seis estados | Dibujarla triste, apagada o regañando |
| Usar iconos de trazo | Usar emojis |
