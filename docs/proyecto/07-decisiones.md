# Decisiones tomadas al construir

Lo que se decidió al escribir el código y no estaba cerrado en los documentos 01 a 06, o los cambia. Cada decisión dice por qué y dónde vive, para poder revisarla sin buscar en el historial. Las decisiones de stack siguen en [`04-stack-y-arquitectura.md`](04-stack-y-arquitectura.md).

## Reglas y vocabulario

| Decisión | Por qué | Dónde |
| :--- | :--- | :--- |
| **"Recurrente" en lugar de "de ronda"** | Se entiende sin explicación y es el término de la materia. "De ronda" queda como antecedente en las propuestas | Contratos, motor, interfaz, docs 01 a 05 |
| **Cuatro clases de regla**: `diaria`, `dias`, `veces` y `mes` | Cubren los casos del enunciado con una forma validable. En `dias`, 0 es lunes y 6 es domingo, igual que `DIAS_DE_LA_SEMANA`. En `mes`, un día 29 a 31 cae el último día de los meses cortos | `regla` en `packages/contratos`, `reglaToca` en el motor |
| **Prioridad alta: como máximo tres únicas pendientes** | Si todo es urgente, nada lo es. El límite se valida en el servidor y la interfaz lo explica antes de que falle. Qué ocupa un cupo lo dice una sola función del motor: antes el formulario contaba también las de otras abejas y las ya llenadas, y bloqueaba lo que el servidor aceptaba | `MAXIMO_DE_PRIORIDAD_ALTA` en contratos, `ocupaCupoDeAlta` en el motor |
| **Un ajuste rige desde su día y no reescribe el pasado** | Antes el motor contaba todo el historial con la meta de hoy: bajar de 5 a 3 cerraba panales de días pasados y daba gotas de cierre. Ahora cada día se cuenta con la meta y el día sin flores de entonces. Una meta nueva rige desde mañana; un día sin flores nuevo, desde hoy, como antes | Tabla `tramos_de_ajustes`, `ajustesDelDia` en el motor |
| **Las celdas de una colmena son siempre únicas** | El avance de una colmena es un porcentaje de celdas: una que se repite no tendría fin | `superRefine` de `actividad` en contratos |
| **"Hoy" lo decide el servidor; el paso de hoy, el navegador** | El servidor manda el vuelo y las gotas hasta ayer (`progreso`); los selectores calculan hoy con el motor. La racha y las gotas responden al instante y no se guarda nada calculado | `GET /api/panal`, `hoySelector.js` |
| **La zona horaria sale del dispositivo al crear la cuenta** | El registro pide solo nombre, correo y clave; el navegador agrega la zona del dispositivo para que el primer día ya cambie a las 03:00 locales. Sin ella rige La Paz; se cambia en Mi vuelo | `CrearPanal.jsx`, `nuevaCuenta` en contratos, `MiVuelo.jsx` |

## Servidor y datos

| Decisión | Por qué | Dónde |
| :--- | :--- | :--- |
| **PGlite cuando `DATABASE_URL` está vacía** | Las pruebas y una primera ejecución no necesitan el contenedor: PostgreSQL compilado a WebAssembly, en memoria o en `apps/api/.datos/`. Con `DATABASE_URL`, el mismo SQL corre sobre PostgreSQL | `apps/api/src/datos/base.js` |
| **El código de invitación se guarda tal cual** | Caduca, se puede anular y solo da acceso a unirse; guardarlo permite volver a mostrar el enlace vigente en P09 sin crear otro | Tabla `invitaciones`, `GET /api/colmenas/:id/invitacion` |
| **Dos rutas nuevas**: `GET /api/yo/progreso` y `GET /api/colmenas/:id/invitacion` | Mi vuelo necesita el historial resumido (oficio, desglose de gotas, sellos) y P09 el enlace vigente | [`05-datos-y-api.md` §7](05-datos-y-api.md#7-api) |
| **Reportes de hasta 92 días** | Basta para "Esta semana", "30 días" y "90 días", y acota el costo de la consulta | `periodoDeReporte` en contratos |
| **La tira de recurrentes siempre tiene siete días** | Así lo pide P10, y una tira de dos días un martes no dice nada. Termina en el último día del periodo y puede empezar antes; los días previos a la actividad salen como "no tocaba" | `GET /api/reportes`, `rondas` |

## Interfaz

| Decisión | Por qué | Dónde |
| :--- | :--- | :--- |
| **Un slice por funcionalidad** en lugar de `interfaz` y `borradores` comunes | Cada pantalla es dueña de su estado, como en el ejemplo del docente. Los efectos van en un solo archivo | `app/store.js`, `app/escuchas.js` |
| **Ventanas con ruta sobre su fondo** | P06 y P09 se abren sobre la pantalla de origen, se comparten por enlace y se cierran con Atrás | `App.jsx`, [`../guias/frontend.md` §5](../guias/frontend.md#5-rutas-y-ventanas) |
| **Las pestañas de Celdas son enlaces; las de una colmena, botones de radio** | Las primeras cambian la dirección y se recuerdan con Atrás; las segundas filtran en el sitio | `Celdas.jsx`, `Colmena.jsx` |
| **Archivar no pregunta: avisa con "Deshacer"** | Es reversible. Confirmar se reserva para salir o archivar una colmena | `useCeldas.js`, `useColmenas.js` |
| **Las ilustraciones que faltan se dibujan en SVG** | El panal sin miel y los 17 sellos de cera están en código mientras no se generen las escenas E01 a E06 y los sellos S01 a S17 | `Estados.jsx`, `SelloDeCera.jsx` |
| **"Esta semana" se dibuja de lunes a domingo** | Los días que faltan se rotulan apagados: la gráfica no cambia de ancho según el día | `selectCeldasPorDia`, `Columnas` |
| **Una recurrente que no tocaba muestra una raya, no "0 %"** | Cero diría que se incumplió | `cumplimiento` en `reportes/textos.js` |
| **El cambio de día vuelve a pedir los datos** | A las 03:00 el reloj del store cruza de día y una escucha invalida lo que depende de "hoy" | `escuchas.js` |
| **"Reducir animaciones" es del dispositivo** | Es una preferencia de lectura, no de la cuenta; se guarda en el navegador y se suma a la del sistema | `miVueloSlice.js`, `base.css` |
| **La guardia de sesión espera solo la primera respuesta** | Sin sesión, `/api/yo` responde 401 y no hay datos; al volver a la pestaña, RTK Query la repite y `isLoading` vuelve a ser cierto. La guardia cambiaba el formulario de Entrar por la silueta y se perdía lo escrito. Se notó en producción, al cambiar de pestaña | `useYo` en `useSesion.js` |
| **Cada pantalla se descarga al visitarla** | El archivo principal pasaba de 500 kB. Hoy va en él porque es la puerta de entrada; las demás llegan aparte, con una silueta mientras tanto. Zod llega con los formularios: `api/errores.js` importa `@panal/contratos/errores`, que no lo trae. La carga inicial bajó de 578 a unos 415 kB | `App.jsx`, `LimiteDeError` en `Estados.jsx` |
| **Tableta en dos columnas** | Entre 700 y 1079 px el panal de hoy bajaba debajo del texto. Ahora va a la derecha, con Zum junto al saludo, como pide P04 | `TarjetaPrincipal.module.css` |

## PWA e ilustraciones

| Decisión | Por qué | Dónde |
| :--- | :--- | :--- |
| **Service worker escrito a mano** | Se cumplió el riesgo previsto en `04-stack-y-arquitectura.md`: Vite+ 1.3 se presenta como `vite-plus-core@1.3.0` y `vite-plugin-pwa` no lo reconoce. Un complemento corto publica `sw.js` con la lista de archivos de cada compilación | `apps/web/pwa/` |
| **La PWA vive entera en `pwa/`, con pruebas** | Tres archivos con una tarea cada uno: `sw.js` (el trabajador), `complemento.js` (lo publica al compilar) y `registro.js` (la página: registrar, actualizar, instalar). `useConexion` solo los conecta con el slice. `sw.test.js` evalúa el trabajador con `caches` y `fetch` de mentira: cambiar una estrategia ya no pide compilar y abrir DevTools | `apps/web/pwa/` |
| **Lo público que se guarda sale del HTML** | La lista de favicon, iconos y manifiesto estaba escrita a mano y había que mantenerla junto al `<head>`. Ahora el complemento la lee de los `<link>` del `index.html` compilado | `publicosEnlazados` en `complemento.js` |
| **Qué se guarda y cómo** | La aplicación, al instalar, y se sirve desde el caché. Los `GET /api/*` van primero a la red y se guardan; sin red se ve lo último consultado. Al cerrar sesión se borra lo guardado | `apps/web/pwa/sw.js`, `useSalir` |
| **La versión nueva espera a la persona** | Actualizar recarga la página: una franja fija con "Actualizar" deja elegir el momento | `FranjaDeVersion.jsx` |
| **Instalar con `navigator.install()` si existe** | Es el mecanismo estándar; donde no está, se usa `beforeinstallprompt`. El manifiesto declara `id` | `useConexion.js`, `manifest.webmanifest` |
| **El icono I01 se compuso con la pose "feliz"** | Zum dentro de un círculo de cera sobre miel, como en la tarjeta de Hoy, sin generar una imagen más. Los tamaños salen de ahí, como pide 06-assets §7 | `assets-fuente/listos/icono/`, `apps/web/public/iconos/` |

## Despliegue y herramientas

| Decisión | Por qué | Dónde |
| :--- | :--- | :--- |
| **Vercel en su forma clásica, sin Services** | Una función en `api/` con una reescritura no depende de una beta y no cambia el código de Hono. Las migraciones corren al compilar | `api/index.js`, `vercel.json`, [`04-stack-y-arquitectura.md` D13](04-stack-y-arquitectura.md#d13-despliegue-gratuito) |
| **Los scripts de `package.json` van sin caché en `vp run`** | Con caché, Vite+ solo pasa a la tarea las variables de entorno declaradas: `DATABASE_URL=… vp run migrar` migraba PGlite en lugar de PostgreSQL, y una migración podía darse por hecha sin correr | `run.cache` en `vite.config.js` |
| **Node 24.2 o más nuevo** | `migrar.js` y `semilla.js` usan `import.meta.main`. Con el mínimo anterior (22.18) no habrían hecho nada, y en silencio | `engines` en `package.json` |
| **Neon desde el Marketplace de Vercel, en São Paulo** | La integración crea la base y carga `DATABASE_URL` en Production y Preview: la clave no se copia a mano. `gru1` es la región más cercana a Bolivia, y la función va a la misma (`regions`) para que cada consulta no cruce el continente | `vercel.json`, [README](../../README.md#desplegar) |
| **`sslmode=require` se pide como `verify-full`** | Neon entrega `require`. En `pg` eso ya verifica el certificado, pero avisa en cada arranque que cambiará; pedirlo explícito deja lo mismo, sin el aviso | `crearPostgres` en `datos/base.js` |
| **`.vercelignore`** | `vercel deploy` sube la carpeta: sin la lista, también irían `docs/`, `assets-fuente/` y la base PGlite local, unos 70 MB que no hacen falta para compilar | `.vercelignore` |
| **`vp run preview` prueba lo que se publicaría** | Compila la web con su service worker y la sirve en 4173 junto a la API, en una sola orden | `package.json` de la raíz, `apps/web`, `apps/api` |

