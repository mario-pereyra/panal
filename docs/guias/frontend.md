# Guía de frontend

Cómo está hecha `apps/web` y cómo se agrega algo sin romper su orden. Las razones del stack están en [`../proyecto/04-stack-y-arquitectura.md`](../proyecto/04-stack-y-arquitectura.md); qué muestra cada pantalla, en [`../proyecto/03-pantallas.md`](../proyecto/03-pantallas.md).

## Tabla de contenidos

1. [Mapa de carpetas](#1-mapa-de-carpetas)
2. [El recorrido de un dato](#2-el-recorrido-de-un-dato)
3. [El store](#3-el-store)
4. [Una funcionalidad por dentro](#4-una-funcionalidad-por-dentro)
5. [Rutas y ventanas](#5-rutas-y-ventanas)
6. [Formularios](#6-formularios)
7. [Efectos: escuchas, avisos y celebraciones](#7-efectos-escuchas-avisos-y-celebraciones)
8. [Estilos](#8-estilos)
9. [PWA: instalar y abrir sin red](#9-pwa-instalar-y-abrir-sin-red)
10. [Agregar una pantalla, paso a paso](#10-agregar-una-pantalla-paso-a-paso)

## 1. Mapa de carpetas

```
apps/web/
├── pwa/                # sw.js, complemento.js, registro.js y sus pruebas (sección 9)
├── public/             # manifiesto, iconos y favicon
└── src/
apps/web/src/
├── main.jsx            # monta Provider, BrowserRouter y App; importa fuentes y estilos globales
├── app/
│   ├── App.jsx         # las rutas: fondo y ventanas con ruta propia; las pantallas se cargan bajo demanda
│   ├── Estructura.jsx  # cabecera, navegación, <main>, avisos, celebración, franjas de estado
│   ├── store.js        # crearStore(): un reducer por funcionalidad + RTK Query
│   ├── escuchas.js     # listener middleware: todos los efectos "después de"
│   ├── almacen.js      # leer, guardar y borrar en localStorage o sessionStorage sin que un fallo rompa nada
│   └── reglas.test.js  # avisa si una lista de la interfaz deja de cubrir una regla del motor
├── api/
│   ├── panalApi.js     # RTK Query: cada ruta de la API, sus etiquetas y las mutaciones optimistas
│   └── errores.js      # leerError(): cualquier fallo → { codigo, mensaje, campos }; mensajeGeneral()
├── componentes/        # piezas que usan varias pantallas (ver sistema-de-diseno.md)
├── estilos/            # tokens.css (variables) y base.css (lo global)
├── assets/zum/         # los seis estados de Zum en WebP, copiados de assets-fuente/listos
└── feature/<nombre>/   # una carpeta por funcionalidad
```

| Funcionalidad | Pantalla | Qué guarda su slice |
| :--- | :--- | :--- |
| `sesion` | P01 Entrar, P02 Crear, guardias | La invitación pendiente (sessionStorage) |
| `primerVuelo` | P03 | El paso del recorrido (localStorage) |
| `hoy` | P04 | El día en que se cerró la franja de racha |
| `celdas` | P05 | Los filtros. La pestaña va en la dirección |
| `actividad` | P06 | Los borradores del formulario |
| `colmenas` | P07, P08, P09, P13 | La pestaña del detalle |
| `reportes` | P10 | El periodo |
| `miVuelo` | P11 | El sello abierto y la preferencia de movimiento |
| `celebraciones` | P12 | La cola de logros |
| `errores` | P14 | Nada: solo pantallas |
| `avisos` | Todas | La cola de avisos |
| `conexion` | Todas | Si hay red, si se puede instalar y si hay una versión nueva |
| `reloj` | Todas | La hora, para que ningún selector lea el reloj |

## 2. El recorrido de un dato

```mermaid
flowchart LR
    S["Servidor Hono"] -->|JSON| Q["RTK Query<br/>panalApi.js"]
    Q --> SEL["Selectores<br/>*Selector.js"]
    M["Motor<br/>@panal/motor"] --> SEL
    SL["Slice de la pantalla"] --> SEL
    SEL --> H["Hook use&lt;Nombre&gt;"]
    H --> C["Componente"]
    C -->|acción| H
    H -->|mutación| Q
```

- **El servidor manda hechos; el cliente calcula.** `GET /api/panal` trae actividades, celdas llenas y `progreso` hasta ayer. La racha, las gotas de hoy, el oficio y el estado de Zum los calculan los selectores con el motor (`avanzarDia`, `rachaParaHoy`, `gotasDelVuelo`, `estadoDeZum`). Así la pantalla responde al instante y el servidor no guarda lo que se puede deducir.
- **El motor no lee el reloj.** "Hoy" llega del servidor (`panal.hoy`) y la hora, del slice `reloj`.
- **Los ajustes viajan con su historial.** `GET /api/panal` trae `tramosDeAjustes`; `hoySelector` los pasa al motor como `historial`, y el panal de constancia dibuja cada día con la meta de entonces.
- **Llenar o vaciar una celda** se hace siempre con `useAlternarCelda()` (`componentes/`), desde Hoy, Celdas o una colmena: ignora un segundo toque mientras el primero viaja.
- **Los componentes muestran lo que reciben.** Nada de `.filter` ni cuentas en un JSX: eso va en un selector memorizado (`createSelector`).

## 3. El store

`app/store.js` monta `api` (RTK Query) y un slice por funcionalidad. Tres reglas:

1. **Lo que es verdad en el servidor vive en el caché de RTK Query**, nunca copiado en un slice. Las etiquetas (`Yo`, `Panal`, `Actividades`, `Colmenas`, `Invitacion`, `Progreso`, `Reporte`) deciden qué se vuelve a pedir tras cada mutación.
2. **Lo que solo existe en la pantalla vive en el slice de su funcionalidad**: filtros, pestañas, borradores, colas.
3. **Los efectos no van en los reducers ni en los componentes**, sino en `app/escuchas.js` (sección 7).

Mutaciones optimistas: `llenarCelda` y `vaciarCelda` cambian el caché de `obtenerPanal` y de `obtenerColmena` antes de que responda el servidor y lo deshacen si falla (`onQueryStarted` con `updateQueryData` y `patch.undo()`). La celda nueva lleva un `id` creado en el navegador (`crypto.randomUUID()`), de modo que repetir el envío no crea dos.

## 4. Una funcionalidad por dentro

Es la estructura del ejemplo del docente y un requisito de la materia:

| Archivo | Responsabilidad |
| :--- | :--- |
| `<nombre>Slice.js` | Estado de la pantalla y sus acciones. `initialState` como función si lee el navegador |
| `<nombre>Selector.js` | Todo valor calculado, memorizado. Combina caché, slice y motor |
| `use<Nombre>.js` | El único punto de contacto del componente: consultas, selectores y acciones |
| `<Pantalla>.jsx` | Lo que se ve. Recibe datos listos y llama funciones del hook |
| `textos.js` | Cada texto de la interfaz, con sus funciones de plural y fecha |
| `<Pantalla>.module.css` | Sus estilos, con las variables de `tokens.css` |

Los textos compartidos (fechas, plurales, `textoDeRegla`, `detalleDeActividad`) están en `componentes/textos.js`. Una funcionalidad no importa componentes de otra; si dos la necesitan, la pieza sube a `componentes/`. Sí puede importar selectores de otra (`hoySelector` es la base de varias).

## 5. Rutas y ventanas

`App.jsx` tiene dos `Routes`:

- El primero dibuja la pantalla de fondo con `location={state.fondo ?? ubicacion}`.
- El segundo dibuja solo las ventanas con ruta propia: P06 (`/celdas/nueva`, `/celdas/:id`) y P09 (`/colmenas/:id/invitar`).

Quien abre una ventana pasa la ubicación actual: `const { fondo } = useFondo()` y `<Boton a="/celdas/nueva" estado={{ fondo }}>`. Para cerrarla, `salir(destino)` del mismo hook: vuelve con `navigate(-1)` si hay fondo o va a `destino`, la pantalla madre, si se abrió con un enlace directo. Así funcionan el botón Atrás del teléfono y los enlaces compartidos.

Las guardias de `feature/sesion/Guardias.jsx` reparten las zonas: `SinSesion` (entrar, crear), `ConSesion` (primer vuelo y aplicación) y `SoloConSesion`, una ruta de layout que envuelve las tres ventanas.

**Carga bajo demanda.** Hoy va en el archivo principal; las demás pantallas se declaran con `perezosa(() => import(...), "Nombre")` y llegan la primera vez que se visitan. Mientras tanto, `Estructura` muestra una `Silueta`; si la descarga falla, `LimiteDeError` pone "Reintentar" en el lugar de la pantalla y la navegación sigue en pie. Una pantalla nueva se agrega igual. El service worker guarda todos los archivos al instalarse, así que también abren sin red.

`componentes/Ventana.jsx` envuelve el `<dialog>` nativo con `showModal()`: foco atrapado, Escape, capa superior y fondo inerte vienen del navegador. Sus opciones:

| Opción | Para qué |
| :--- | :--- |
| `cerrarAlTocarFuera` | Menús y avisos de solo lectura. Usa `closedby="any"` y un respaldo para Safari |
| `antesDeCerrar(evento)` | Preguntar antes de descartar cambios: `evento.preventDefault()` |
| `tamano="completa"` | Formularios largos: pantalla completa en teléfono |
| `pie` | Botones fijos abajo, fuera del desplazamiento |

Dentro de una ventana, `useCerrarVentana()` la cierra; el evento `close` llama a `alCerrar`, que desmonta la ventana o navega.

## 6. Formularios

`componentes/useFormulario.js` + los campos de `componentes/Formulario.jsx` + un esquema de `@panal/contratos`, el mismo que valida el servidor.

- `noValidate` en el `<form>`: los mensajes son los de Zod, en español.
- Se valida al salir de un campo tocado; un error desaparece en cuanto el valor es válido.
- Al enviar con errores, el foco va al primer campo inválido.
- `convertir` transforma los campos (cómodos de editar) a la forma del contrato antes de validar.
- `mostrarErroresDelServidor(leerError(resultado.error).campos)` pinta los errores `datos_invalidos` junto a su campo, y `mensajeGeneral(error)` da lo que va arriba del formulario: cualquier otro error, sin repetir los de los campos.
- Lo escrito en P06 se guarda como borrador en el slice `actividad`: no se pierde si la ventana se cierra o el guardado falla.

## 7. Efectos: escuchas, avisos y celebraciones

`app/escuchas.js` es el único lugar con efectos de Redux:

| Escucha | Efecto |
| :--- | :--- |
| `llenarCelda` cumplida | Encola sus celebraciones (salvo en el primer vuelo) |
| `llenarCelda` o `vaciarCelda` rechazada | Un aviso que explica que la celda volvió a como estaba |
| Invitación pendiente | La guarda en sessionStorage |
| Franja cerrada, primer vuelo, movimiento | Los guarda en localStorage, con `app/almacen.js` |
| `marcarAhora` que cruza las 03:00 | Invalida `Panal`, `Actividades`, `Colmenas`, `Progreso` y `Reporte`: el día nuevo se vuelve a pedir |

Para avisar desde un hook: `const avisar = useAvisar(); avisar({ texto, tono, accion })`. Una `accion` con `mutacion` y `argumentos` ofrece "Deshacer" sin escribir otro código. Las celebraciones las dibuja `Celebracion.jsx` cuando la cola tiene logros.

## 8. Estilos

- **CSS Modules** con las variables de `estilos/tokens.css`. Un color, radio, sombra o fuente nuevo es primero una variable.
- **Las piezas miran su contenedor** (`container-type` y `@container`); solo `Estructura.module.css` mira el ancho de la ventana.
- **Estados con atributos**: `data-llena`, `data-tono`, `aria-current`, `[open]`. El JSX no arma nombres de clase condicionales.
- **Variables para el tamaño de una pieza**: una pieza que acepta `className` expone su tamaño como variable (`--tamano-zum`). Si quien la usa escribe `inline-size`, las dos reglas empatan en especificidad y gana el orden de carga del CSS, que no es fijo.
- **Movimiento solo con permiso**: las animaciones van dentro de `@media (prefers-reduced-motion: no-preference)`. "Reducir animaciones" de Mi vuelo pone `data-movimiento="reducido"` en `<html>` y `base.css` las apaga.

## 9. PWA: instalar y abrir sin red

Lo que entra en la versión 1 está en [D7 de `04-stack-y-arquitectura.md`](../proyecto/04-stack-y-arquitectura.md#d7-pwa-qué-entra-y-qué-no). Todo vive en `apps/web/pwa/`, un archivo por tarea:

| Archivo | Corre en | Qué hace |
| :--- | :--- | :--- |
| `sw.js` | El service worker | La aplicación se sirve desde el caché; los `GET /api/*` van primero a la red y se guardan en `panal-datos`; una navegación sin red recibe la página guardada. Escribir siempre pide red. Una versión nueva espera el mensaje `"actualizar"` |
| `complemento.js` | Node, al compilar | Publica `sw.js` con `self.__PANAL__ = { version, precarga }`: los JS, CSS y fuentes latinas de esa compilación, más lo que el `index.html` enlaza en su `<head>` (favicon, manifiesto, icono de Apple). La versión sale de esos nombres, que llevan la huella del contenido |
| `registro.js` | La página | Registra el service worker (solo en producción), avisa de una versión nueva y la activa, escucha la oferta de instalación e instala: `navigator.install()` si existe; si no, `beforeinstallprompt`, que sirve una sola vez. No sabe de React |
| `sw.test.js` | Las pruebas | Evalúa `sw.js` tal como se publica, con `caches` y `fetch` de mentira, y prueba el complemento |

`feature/conexion/useConexion.js` solo conecta `registro.js` con el slice `conexion`: `FranjaDeVersion` ofrece "Actualizar" y Mi vuelo, "Instalar", cuando hay cómo. Al cerrar sesión se borra `panal-datos`: lo guardado era de esa cuenta.

**Cambiar una estrategia de caché**: primero la prueba en `sw.test.js`, después `sw.js`. `vp run test` lo comprueba en milisegundos.

**Verla en el navegador**: `vp run preview`, con `vp run dev` apagado. Compila la web y la sirve en <http://localhost:4173> junto a la API. En desarrollo no hay service worker. Para borrarlo después: DevTools, Application, Service workers, Unregister, y Storage, Clear site data.

## 10. Agregar una pantalla, paso a paso

1. Leer su ficha en [`03-pantallas.md`](../proyecto/03-pantallas.md) y su diseño de referencia.
2. Si necesita datos nuevos, agregar el endpoint en `api/panalApi.js` con sus etiquetas, y la ruta en el servidor (ver [`backend.md`](backend.md)).
3. Crear `feature/<nombre>/` con slice, selector, hook, componente, `textos.js` y estilos. Registrar el slice en `app/store.js`.
4. Declarar la pantalla con `perezosa(...)` y agregar su ruta en `app/App.jsx` (y en el segundo `Routes` si es una ventana).
5. Resolver los siete estados de [`ux-ui.md`](ux-ui.md#2-estados-que-toda-pantalla-resuelve).
6. Comprobar: `vp run check`, `vp run test`, `vp run build` y el navegador a 1366 y 390 px sin errores en la consola.
