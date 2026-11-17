# Sistema de diseño

El sistema de diseño de Panal tal como está en el código: las variables, las piezas y cómo se combinan. Las razones de cada elección (por qué miel, por qué Fredoka, por qué sombra dura) están en [`../propuestas/A-panal/direccion-visual.md`](../propuestas/A-panal/direccion-visual.md) y su versión para herramientas, en [`../propuestas/A-panal/DESIGN.md`](../propuestas/A-panal/DESIGN.md). La referencia aprobada es [`pantalla-hoy.png`](../propuestas/A-panal/referencia/pantalla-hoy.png).

## Tabla de contenidos

1. [La idea en una línea](#1-la-idea-en-una-línea)
2. [Variables](#2-variables)
3. [Tipografía](#3-tipografía)
4. [Forma y profundidad](#4-forma-y-profundidad)
5. [Piezas](#5-piezas)
6. [Movimiento](#6-movimiento)
7. [Cómo crece el sistema](#7-cómo-crece-el-sistema)

## 1. La idea en una línea

**Papel cálido, tinta marrón y miel: todo tiene borde de tinta, sombra dura sin desenfoque y, cuando cuenta algo, forma de hexágono.**

## 2. Variables

La fuente de verdad es [`apps/web/src/estilos/tokens.css`](../../apps/web/src/estilos/tokens.css). Ningún componente escribe un color, radio o sombra a mano.

| Grupo | Variables | Para qué |
| :--- | :--- | :--- |
| Base | `--papel`, `--blanco`, `--tinta`, `--tinta-suave`, `--tinta-sobre-miel` | Fondo de la página, tarjetas, texto principal y secundario, texto sobre miel |
| Miel y cera | `--miel`, `--miel-zum`, `--miel-oscura`, `--miel-profunda`, `--miel-clara`, `--cera`, `--cera-clara` | Lo lleno, lo destacado y sus fondos suaves |
| Apoyo | `--ala`, `--hoja`, `--lino`, `--lino-claro`, `--lino-borde` | Avisos informativos, lo positivo, lo vacío y los bordes suaves |
| Coral | `--coral`, `--coral-oscuro`, `--coral-claro` | Vencido, errores y acciones que borran. El texto va en `--coral-oscuro` sobre `--coral-claro` (5,6:1) |
| Enjambre | `--abeja-1` a `--abeja-6` | El color de cada integrante de una colmena, por orden de llegada |
| Tipografía | `--fuente-titulos`, `--fuente-texto` | Fredoka y Nunito |
| Forma | `--grosor`, `--borde`, `--radio-principal`, `--radio-tarjeta`, `--radio-control`, `--sombra`, `--sombra-chica` | Bordes, esquinas y la sombra dura |
| Espacio | `--ancho-maximo`, `--margen-pagina`, `--separacion` | Ancho de lectura y márgenes, que crecen desde 700 px |
| Movimiento | `--resorte`, `--suave` | Curvas de las animaciones |
| Toque | `--toque` | 24 px con ratón, 44 px con el dedo |

**Qué significa cada color en la interfaz.**

| Color | Significa | Ejemplos |
| :--- | :--- | :--- |
| Miel | Lleno, logrado, lo que importa ahora | Celda llena, pestaña activa (sobre tinta), botón principal |
| Lino | Vacío o pendiente | Celda por llenar, fondo de bloques de la silueta |
| Cera | Cálido y suave, sin urgencia | Vista previa de gotas, franja de reserva usada, sello siguiente |
| Ala | Información neutra | Franja de racha que descansó |
| Coral | Algo salió mal o se va a borrar | Vencida, error, Archivar, Salir |
| Tinta | Estructura y texto | Bordes, sombras, textos |

## 3. Tipografía

| Uso | Fuente | Peso | Tamaño |
| :--- | :--- | :--- | :--- |
| Título de pantalla (`h1`) | Fredoka | 600–700 | 2 a 2,5 rem |
| Título de tarjeta (`h2`) | Fredoka | 600 | 1,25 rem |
| Texto | Nunito | 700 | 1 rem |
| Etiquetas y botones | Nunito | 800 | 0,9375 a 1 rem |
| Cifras | Fredoka o Nunito con `tabular-nums` | 600–800 | Según el dato |

Nunito va en 700 por defecto (no 400): con la tinta marrón y el papel cálido, el peso normal se ve débil. Las fuentes se sirven desde el propio paquete (`@fontsource-variable`), sin pedir nada a otro dominio.

## 4. Forma y profundidad

- **Borde de tinta** de 2,5 px (`--borde`) en tarjetas, botones, casillas y campos.
- **Sombra dura** hacia abajo y sin desenfoque (`--sombra`, `--sombra-chica`): la profundidad se lee como papel recortado, no como vidrio.
- **Esquinas**: 28 px en tarjetas, píldora completa en controles (`--radio-control`).
- **El hexágono** es la forma de todo lo que cuenta: celdas, casillas, sellos, gráficas. Se dibuja con `puntosDeHexagono(radio, orientacion)` de `componentes/hexagono.js`, nunca con coordenadas a mano.
- **Sin degradados, sin brillos, sin desenfoques.**

## 5. Piezas

Todas viven en `apps/web/src/componentes/`. Antes de crear algo, buscar aquí.

| Pieza | Archivo | Cuándo |
| :--- | :--- | :--- |
| `Boton` | `Controles.jsx` | Toda acción. `a` lo vuelve enlace; tonos `tinta`, `miel`, `claro`, `sutil`, `peligro`; tamaños `normal` y `chico` |
| `Ficha` | `Controles.jsx` | Cifra corta con icono: racha, reservas, gotas |
| `Tarjeta` | `Tarjeta.jsx` | Contenedor con título, cifra y nota; con `a`, toda la tarjeta lleva a su destino |
| `Pagina`, `Rejilla` | `Pagina.jsx` | Título de pantalla con acciones; rejilla de tarjetas de una a tres columnas |
| `Ventana` | `Ventana.jsx` | Toda ventana modal (ver [`frontend.md` §5](frontend.md#5-rutas-y-ventanas)) |
| Campos | `Formulario.jsx` | `Campo`, `CampoDeClave`, `AreaDeTexto`, `Selector`, `Interruptor`, `Opciones`, `Fichas`, `Contador`, `ErrorDelFormulario` |
| `CasillaHexagonal` | `CasillaHexagonal.jsx` | La casilla para llenar una celda: un `checkbox` real con aspecto de hexágono |
| `FilaDeCelda` | `FilaDeCelda.jsx` | Una actividad en una lista: casilla, título, detalle, gotas, etiquetas y menú |
| Estados | `Estados.jsx` | `Silueta`, `EstadoVacio`, `PanalVacio`, `ErrorAlCargar`, `FranjaDeEstado` (con `alCerrar` o con un botón de `accion`, como "Actualizar") |
| Gráficas | `Graficas.jsx`, `PanalDeHoy.jsx`, `PanalDeConstancia.jsx`, `RejillaDeColmena.jsx` | Ver [`representacion-visual.md`](representacion-visual.md) |
| `SelloDeCera` | `SelloDeCera.jsx` | Las 17 insignias, dibujadas en SVG |
| `Zum` | `Zum.jsx` | La mascota en uno de sus seis estados (ver [`personajes.md`](personajes.md)) |
| Iconos | `iconos.jsx` | Trazo de tinta de 2,5 px, extremos redondos, en `currentColor` |
| Textos comunes | `textos.js` | Fechas, plurales, reglas y detalles de actividad |

**Reglas de composición.**

- Una pantalla tiene un solo botón en tono `tinta` o `miel`: la acción principal. Las demás van en `claro` o `sutil`.
- Las tarjetas no se anidan. Dentro de una tarjeta, las secciones se separan con espacio o una línea de lino.
- Un dato importante va arriba a la derecha de su tarjeta (`dato` de `Tarjeta`); su explicación, debajo del título (`nota`).

## 6. Movimiento

| Momento | Movimiento | Duración |
| :--- | :--- | :--- |
| Llenar una casilla | El relleno cambia y la casilla rebota con `--resorte` | 180 a 280 ms |
| Una celda del panal se llena | `llenarse`, con `--resorte` | 350 ms |
| Abrir una ventana | Sube desde abajo (teléfono) o aparece (computador) | 240 ms |
| Llega un aviso | Sube desde abajo, con `--resorte` | 280 ms |
| Cambia el estado de Zum | La ilustración entra de nuevo | 450 ms |
| Silueta de carga | Aparece después de 200 ms, sin pulso | 200 ms |

Todo movimiento es opcional: va dentro de `@media (prefers-reduced-motion: no-preference)` y se apaga con "Reducir animaciones".

## 7. Cómo crece el sistema

1. ¿Ya existe? Buscar en `componentes/` y en `tokens.css`.
2. ¿Es un valor nuevo? Primero una variable en `tokens.css`, con un comentario que diga para qué.
3. ¿Lo usan dos pantallas o más? Va a `componentes/`, con JSDoc de sus propiedades. Si lo usa una sola, se queda en su funcionalidad.
4. ¿Cambia una regla de esta guía? Se actualiza esta guía en el mismo cambio.
