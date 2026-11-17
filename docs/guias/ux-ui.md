# Guía de UX y UI

Las reglas de experiencia que valen en todas las pantallas. Qué contiene cada pantalla está en [`../proyecto/03-pantallas.md`](../proyecto/03-pantallas.md); el aspecto, en [`sistema-de-diseno.md`](sistema-de-diseno.md); la voz de Zum, en [`personajes.md`](personajes.md).

## Tabla de contenidos

1. [Principios](#1-principios)
2. [Estados que toda pantalla resuelve](#2-estados-que-toda-pantalla-resuelve)
3. [Patrones de interacción](#3-patrones-de-interacción)
4. [Textos](#4-textos)
5. [Accesibilidad](#5-accesibilidad)
6. [Tamaños de pantalla](#6-tamaños-de-pantalla)
7. [Revisión antes de dar algo por terminado](#7-revisión-antes-de-dar-algo-por-terminado)

## 1. Principios

1. **El avance se celebra; la falta no se castiga.** No hay rojo por una racha perdida, ni cuentas regresivas, ni Zum triste. Una racha que descansó se cuenta con la mejor racha al lado y "hoy empieza otra".
2. **Un toque y listo.** Llenar una celda es un toque en su casilla, sin confirmación, con respuesta inmediata (actualización optimista) y deshacer con otro toque.
3. **Nada se pierde.** Lo escrito en un formulario sobrevive a un cierre accidental, a un error del servidor y a la falta de red.
4. **Lo destructivo pide una segunda señal**: confirmar (salir de una colmena) o deshacer en un aviso (archivar).
5. **Cada número tiene su frase.** Ninguna cifra ni gráfica aparece sin un texto que la explique.

## 2. Estados que toda pantalla resuelve

| Estado | Qué se ve | Pieza |
| :--- | :--- | :--- |
| Cargando por primera vez | La silueta de la pantalla, que aparece solo si la carga pasa de 200 ms | `Silueta` |
| Actualizando | Lo anterior, sin cambios; a lo sumo `aria-busy` y una opacidad leve | El caché de RTK Query |
| Vacío | El panal sin miel, una frase cálida y la acción principal | `EstadoVacio` |
| Error al cargar | "No pudimos traer…" y "Reintentar". El resto de la pantalla sigue funcionando | `ErrorAlCargar` |
| Error al guardar | La acción se deshace a la vista y un aviso explica qué pasó | `avisar({ tono: "error" })` |
| Sin conexión | Lo último visto (lo guarda el service worker), la franja "Sin conexión" y los botones que guardan desactivados con su porqué | `FranjaSinConexion`, `useConexion` |
| Sin permiso | "Esta colmena es de otro enjambre" con salida a Colmenas | `ErrorAlCargar` |

## 3. Patrones de interacción

**Ventanas.** Un `<dialog>` modal (`componentes/Ventana.jsx`). En teléfono es una hoja que sube desde abajo; desde 700 px, una ventana centrada. Los menús se cierran al tocar fuera; los formularios no, y si tienen cambios preguntan antes de descartar. El mensaje de confirmación reserva su espacio para no mover los botones bajo el dedo.

**Confirmar.** Solo para lo que no se deshace solo: salir o archivar una colmena. El foco empieza en "Cancelar", la opción segura, y el botón destructivo va en tono coral.

**Deshacer.** Archivar una celda no pregunta: avisa "Celda archivada" con "Deshacer" durante 6 segundos (el aviso se queda mientras el puntero o el foco estén encima).

**Avisos.** Uno a la vez, abajo, sobre la navegación. Son `popover="manual"` para quedar en la capa superior sin robar el foco. No aparecen sobre una ventana abierta: los errores de una ventana se muestran dentro de ella.

**Pestañas.** Las de Celdas cambian la dirección (`?ver=proximas`), así que son enlaces con `aria-current="page"` y no un control de pestañas. Las de una colmena filtran una lista en el sitio: son botones de radio.

**Formularios.** Validación al salir de cada campo, errores junto al campo, foco al primer error al enviar, botón que dice lo que hace ("Guardando…"). Los campos usan `autocomplete` correcto (`username`, `current-password`, `new-password`, `name`) para que el navegador y los gestores de contraseñas ayuden.

**Celebraciones.** Una ventana por llenado, con el logro mayor primero (cierre del panal, racha, oficio, sello, cuadro, colmena cerrada) y los demás debajo. Se cierra con "Seguir", con Escape o tocando fuera.

## 4. Textos

- Español neutro, tuteo, frases cortas. Ortografía completa y sin emojis.
- Sin género cuando se habla a la persona: "Te damos la bienvenida", no "Bienvenida".
- Los números se escriben con la palabra que cuentan: "1 celda", "3 celdas" (`cuenta()` de `componentes/textos.js`).
- Las fechas, en palabras y con el día: "Viernes 13 de noviembre", "Mañana", "Faltan 9 días".
- El botón dice la acción con verbo: "Fundar", "Guardar", "Reintentar". Nunca "Aceptar" ni "OK".
- Los errores dicen qué pasó y qué hacer: "Sin conexión: la celda volvió a como estaba. Inténtalo con señal."
- Cada texto vive en el `textos.js` de su funcionalidad: se cambia en un solo lugar y se prueba.

## 5. Accesibilidad

| Necesidad | Cómo se resuelve |
| :--- | :--- |
| Teclado | Todo control es `button`, `a` o `input`. Foco visible de 3 px. "Saltar al contenido" al principio |
| Toque | Zona mínima de 44 px con el dedo (`--toque`) |
| Lector de pantalla | Encabezados en orden, regiones con nombre, `<title>` por pantalla. Las casillas hexagonales son casillas de verificación nativas |
| Anuncios | `anunciar()` usa `document.ariaNotify` o, si no existe, la región `#anuncios` de `index.html` |
| Errores de formulario | `aria-invalid` y `aria-describedby` hacia el mensaje solo mientras se ve; se anuncian al salir del campo |
| Gráficas | `role="img"` con una frase que dice el dato, y "Ver como tabla" con los números |
| Color | Contraste AA. Ningún estado depende solo del color: lleno, vencido y prioridad llevan texto o forma |
| Movimiento | Animaciones solo con `prefers-reduced-motion: no-preference`, y el ajuste "Reducir animaciones" |
| Zoom | Hasta 200 % sin desplazamiento horizontal; las palabras largas se parten |

## 6. Tamaños de pantalla

Los tres tramos (teléfono, tableta y computador) y su navegación están en [`03-pantallas.md` §4](../proyecto/03-pantallas.md#4-adaptación-al-tamaño-de-pantalla). En la práctica:

- Se escribe primero para teléfono y se agrega espacio hacia arriba.
- Las tarjetas se adaptan a su contenedor con `@container`, no a la ventana.
- Las rejillas usan `repeat(auto-fill, minmax(min(100%, 340px), 1fr))`: una, dos o tres columnas sin reglas por ancho.
- Las listas largas en horizontal (pestañas, la colmena grande) se deslizan dentro de su caja; la página nunca.
- La aplicación instalada respeta la muesca y la barra de gestos con `env(safe-area-inset-*)`.

## 7. Revisión antes de dar algo por terminado

- [ ] Los siete estados de la sección 2, cada uno visto en el navegador.
- [ ] 1366 px y 390 px de ancho, sin desplazamiento horizontal ni errores en la consola.
- [ ] Recorrido completo solo con teclado, con el foco siempre visible.
- [ ] Los textos nuevos están en `textos.js` y suenan a Zum: cercanos, breves y sin culpa.
- [ ] Toda gráfica nueva tiene su frase y su tabla.
