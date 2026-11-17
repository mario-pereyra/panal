# Stack y arquitectura de Panal

Estado: **confirmado el 13 de noviembre de 2026**. Cada elección tiene su razón y lo que se descartó. Lo que confirmaste está en la [sección 7](#7-decisiones-confirmadas).

## Tabla de contenidos

1. [Lo que condiciona la decisión](#1-lo-que-condiciona-la-decisión)
2. [La recomendación en una tabla](#2-la-recomendación-en-una-tabla)
3. [Las decisiones, una por una](#3-las-decisiones-una-por-una)
4. [Dónde se ve la materia en el código](#4-dónde-se-ve-la-materia-en-el-código)
5. [Estructura del repositorio](#5-estructura-del-repositorio)
6. [Lo que no está verificado](#6-lo-que-no-está-verificado)
7. [Decisiones confirmadas](#7-decisiones-confirmadas)
8. [Fuentes](#8-fuentes)

## 1. Lo que condiciona la decisión

Hechos comprobados el 13 de noviembre de 2026. El stack sale de aquí, no de la costumbre.

| Origen | Hecho | Consecuencia |
| :--- | :--- | :--- |
| Enunciado | Redux es obligatorio en el frontend | Redux tiene que ser el centro real del estado, no un adorno |
| Enunciado | Base de datos libre, obligatoria | Motor de código abierto; se descartan Firestore y similares |
| Enunciado | Backend de tecnología libre | Hay libertad total de lenguaje y framework |
| Materia | Unidades 1 a 3: funciones y mutabilidad, recursión y clausuras, iteradores e iterables. Unidad 4: gestores de estado | La materia es programación funcional **en JavaScript**. El código tiene que mostrar esas ideas |
| Materia | El ejemplo del docente (`unidad-2/src.zip`) usa Redux Toolkit (`configureStore`, `createSlice`), `useSelector` y `useDispatch`, archivos `.jsx` y carpetas `app/store.js` y `feature/<nombre>/` con `Slice`, `Selector` y un hook `use<Nombre>` | Conviene seguir esa misma estructura: es la que el docente va a reconocer y evaluar |
| Docente | Enseña programación, bases de datos, desarrollo web, React, Laravel y arquitectura | Un SQL bien hecho y una arquitectura explicable suman |
| Tu máquina | Windows 11, Node 26, Vite+ (`vp` 1.3.0) con pnpm y Bun, Git. WSL 3.0.5 con `wslc`, su gestor de contenedores, y Ubuntu 26.04. No hay Docker ni PostgreSQL instalados | La base puede correr en un contenedor de `wslc` sin instalar nada más; Vite+ ya resuelve las herramientas |
| Tu pedido | Web adaptable, PWA en el teléfono, probar todo en local y poder desplegar gratis | Un solo proyecto que corra completo en tu máquina y se pueda subir sin reescribir nada |
| Tu pedido | El personaje y los assets los genera un modelo de imágenes con `agy` | Las ilustraciones son imágenes ráster: hace falta un flujo para optimizarlas |

## 2. La recomendación en una tabla

| Capa | Elección | La razón en una línea |
| :--- | :--- | :--- |
| Lenguaje | JavaScript moderno en cliente y servidor, con JSDoc donde ayude | Es el lenguaje de la materia y permite compartir las reglas del juego |
| Reglas del juego | Un paquete propio de funciones puras, sin dependencias | Es el corazón funcional del proyecto y se prueba solo |
| Interfaz | React 19 | Lo usa el docente y es donde vive Redux |
| Estado | Redux Toolkit con slices, selectores y hooks, más RTK Query para los datos del servidor | Cumple el enunciado con la estructura de clase |
| Navegación | React Router, aplicación de una sola página | Toda la aplicación está tras el inicio de sesión: no hace falta renderizar en servidor |
| Estilos | CSS propio con variables y CSS Modules | El estilo de pegatina es a medida; un kit de componentes estorbaría |
| Gráficas | Componentes SVG propios | Las gráficas del diseño son panales de hexágonos: ninguna librería las trae |
| PWA | Service worker propio (`apps/web/pwa/`) | Instalable y con arranque sin conexión. Se pensó en `vite-plugin-pwa`, pero no reconoce el Vite de Vite+ (ver §8) |
| Servidor | Hono sobre Node | Pequeño, basado en estándares web y se prueba sin levantar un servidor |
| Base de datos | PostgreSQL 18. En local, un contenedor de `wslc`; en las pruebas, PGlite; desplegado, Neon | Código abierto, el mismo motor y la misma versión en tu máquina y en la nube |
| Acceso a datos | SQL escrito a la vista, con parámetros, y migraciones en archivos `.sql` | Transparente y fácil de defender ante un docente de bases de datos |
| Sesión | Cookie de sesión segura y contraseñas con `scrypt` | Más simple y más segura que un token guardado en el navegador |
| Validación | Zod, compartido entre cliente y servidor | Una sola definición de qué datos son válidos |
| Herramientas | Vite+ (`vp`) con espacios de trabajo de pnpm | Ya está en tu máquina: un comando para desarrollar, probar, revisar y construir |
| Pruebas | Vitest con `vp test`, y pruebas basadas en propiedades con fast-check para el motor | Las funciones puras se prueban con propiedades, no solo con ejemplos |
| Despliegue | Vercel (plan Hobby) para web y API, Neon (plan Free) para la base | Gratis, sin tarjeta y sin que el servidor se duerma medio minuto |

## 3. Las decisiones, una por una

### D1. Un solo lenguaje para compartir las reglas del juego

Las reglas (cuántas gotas vale una celda, qué nivel corresponde, cuándo se rompe una racha, qué días toca una actividad recurrente) viven en un paquete propio, `packages/motor`, hecho solo de funciones puras. Lo importan los dos lados:

- El **servidor** lo usa como autoridad: es quien otorga las gotas, así nadie puede inventarse puntos desde el navegador.
- El **cliente** lo usa para responder al instante: al marcar una celda muestra el resultado sin esperar al servidor y luego lo confirma.

Esto solo es posible si cliente y servidor hablan el mismo lenguaje. Es la razón de fondo para un backend en JavaScript, y además es la mejor demostración de la materia: un núcleo funcional puro rodeado por una capa fina que habla con la base de datos y la red.

**Descartado.** Laravel (lo conoce el docente, pero obliga a escribir las reglas dos veces, en PHP y en JavaScript). Un servicio sin backend propio como Supabase (las reglas terminarían en funciones de base de datos o duplicadas).

### D2. JavaScript con JSDoc, no TypeScript

La materia se dicta en JavaScript y el ejemplo del docente es `.jsx`. El día de la defensa hay que explicar cada línea, y los nombres de archivo van a ser los mismos que en clase (`store.js`, `celdasSlice.js`). La seguridad que daría TypeScript se cubre de otra forma: Zod valida todo lo que entra y sale por la API, las reglas se prueban a fondo, y el motor lleva anotaciones JSDoc que el editor y `vp check` verifican.

**Alternativa válida.** TypeScript de punta a punta. Atrapa más errores mientras se escribe y es lo habitual en la industria. Si lo prefieres, cambia una sola cosa más: el acceso a datos pasaría a Drizzle (ver D9). Es una decisión tuya.

### D3. Redux Toolkit como en clase, con RTK Query para el servidor

El estado se organiza por funcionalidad, igual que el ejemplo del docente:

```
src/app/store.js
src/features/celdas/celdasSlice.js
src/features/celdas/celdasSelectors.js
src/features/celdas/useCeldas.js
src/features/celdas/components/
```

Hay dos clases de estado y cada una va donde corresponde:

- **Estado de la aplicación**, en slices escritos a mano: sesión, ventanas abiertas, cola de celebraciones, borradores de formularios, preferencias y avisos. Es el Redux que se evalúa: reducers puros y selectores memorizados, como `selectEstadoDeZum` o `selectPanalDeHoy`, que derivan lo que se ve a partir de lo que se sabe.
- **Datos del servidor**, con RTK Query: actividades, colmenas y reportes. RTK Query es parte de Redux Toolkit y guarda todo en el mismo store. Aporta lo que más cuesta hacer bien a mano: caché, recarga al volver a la pestaña y actualización optimista al marcar una celda.

Los efectos, como lanzar la celebración cuando el servidor confirma que se cerró el panal, van en el *listener middleware* de Redux Toolkit. Así los reducers se mantienen puros.

**Descartado.** TanStack Query: sacaría los datos del servidor fuera de Redux y debilitaría el requisito del enunciado. Zustand o Context: no cumplen el enunciado.

**Si el docente quiere ver todo a mano.** Se puede reemplazar RTK Query por `createAsyncThunk` y slices. Es más código y más errores posibles, pero la estructura de carpetas no cambia.

### D4. Aplicación de una sola página, no Next.js

Todo Panal está detrás del inicio de sesión: no hay nada que posicionar en buscadores ni que renderizar en servidor. Una aplicación de una sola página se construye como archivos estáticos, se aloja gratis en cualquier parte, se instala como PWA sin complicaciones y deja a Redux como única fuente de verdad. Next.js añadiría un segundo lugar donde vive el estado (el servidor de React) y complejidad en el service worker, sin dar nada a cambio aquí.

### D5. CSS propio con variables, sin Tailwind ni kit de componentes

El diseño de la abeja es de autor: borde de tinta de 2,5 px, sombra dura de 6 px, píldoras y hexágonos. Son unas treinta variables (ya están en `DESIGN.md`) y pocos componentes propios. Con variables CSS y CSS Modules cada componente tiene su hoja al lado, sin clases de utilidad que ensucien el JSX y sin dependencias. El CSS actual ya trae lo que antes pedía un framework: anidado, consultas de contenedor para lo adaptable y `<dialog>` nativo para las ventanas.

**Descartado.** shadcn, MUI y similares: traen su propia estética y habría que pelear contra ella. Tailwind: no es mala opción, pero aquí no ahorra trabajo y aleja el código de lo que se ve en clase.

### D6. Gráficas en SVG propio

El enunciado pide gráficas que muestren el avance de un vistazo, y las de Panal son parte de la identidad: el panal del día, la colmena de 30 celdas, el mapa de constancia en hexágonos y los tarros de miel. Ninguna librería de gráficas dibuja eso. Son componentes React que reciben datos y devuelven SVG: funciones puras de datos a dibujo. Las columnas de "Celdas por día" son rectángulos; no justifican una dependencia.

### D7. PWA: qué entra y qué no

| Capacidad | Versión 1 | Detalle |
| :--- | :---: | :--- |
| Instalable en Android, iOS y escritorio | Sí | Manifiesto, iconos (incluido el enmascarable) y modo de pantalla completa. En iOS la instalación es manual desde Compartir; la aplicación muestra cómo |
| Abre sin conexión | Sí | El service worker guarda la aplicación; sin red se ve lo último consultado |
| Aviso de versión nueva | Sí | "Hay una versión nueva" con botón para actualizar |
| Marcar celdas sin conexión | Preparado, no incluido | Cada celda cumplida viaja con un identificador creado en el teléfono, así el servidor puede recibirla dos veces sin duplicarla. Eso deja lista la cola de envíos pendientes para una segunda etapa |
| Notificaciones push | No | Necesitan un servidor que envíe a horas fijas y en iOS solo funcionan con la aplicación instalada. Los recordatorios aparecen al abrir la aplicación |

Para probar la instalación en un teléfono real hace falta HTTPS. Hay dos caminos: el despliegue en Vercel o un túnel desde tu máquina (por ejemplo `cloudflared`, que no está instalado todavía).

### D8. Servidor con Hono sobre Node

Una aplicación de Hono es, en el fondo, una función que recibe una petición estándar y devuelve una respuesta estándar. Eso tiene tres ventajas concretas aquí:

- **Se prueba sin servidor.** `app.request('/api/celdas')` ejecuta la ruta completa dentro de una prueba, contra una base en memoria.
- **Corre igual en todas partes.** En tu máquina con Node; desplegado, Vercel lo reconoce sin configuración. No ata el proyecto a un proveedor.
- **Trae lo necesario.** Cookies, cabeceras de seguridad y validación con Zod vienen incluidas; con Express serían cuatro paquetes más.

**Alternativa conservadora.** Express 5: es el más conocido y Vercel también lo despliega sin configuración. Si prefieres lo más reconocible, el cambio es pequeño.

**Descartado.** NestJS (demasiada estructura para este tamaño). Un backend sin servidor propio en Cloudflare Workers: su plan gratuito limita cada petición a 10 ms de procesador, y cifrar una contraseña tarda más que eso a propósito.

### D9. PostgreSQL: contenedor en local, Neon desplegado, SQL a la vista

**Por qué PostgreSQL y no SQLite.** Los dos son libres y los dos alcanzan. PostgreSQL gana por tres razones: tiene tipos de fecha y zona horaria de verdad, que importan porque el día de Panal cambia a las 03:00 hora local; es el motor libre de referencia, el que un docente de bases de datos espera ver; y es el que más alojamientos gratuitos tiene, así que no ata el proyecto a un proveedor.

**En local, un PostgreSQL real en un contenedor de `wslc`.** Tu WSL trae `wslc`, que ejecuta contenedores con órdenes como las de Docker, sin instalar Docker. Se usa la imagen oficial `postgres:18-alpine`: la misma versión mayor que Neon crea por defecto. Los datos viven en un volumen, así que sobreviven a apagar y encender el contenedor, y el puerto se publica solo para tu máquina (`127.0.0.1:5432`). Te puedes conectar con pgAdmin, DBeaver o `psql`.

**Comprobado el 13 de noviembre de 2026:** el contenedor `panal-db` arranca con PostgreSQL 18.7, Node en Windows se conecta por `127.0.0.1:5432` en 29 ms y una tabla de prueba siguió ahí tras detener y volver a iniciar el contenedor. El contenedor y su volumen `panal-datos` ya existen en tu máquina.

```bash
# crear (una sola vez)
wslc volume create panal-datos
wslc run -d --name panal-db -e POSTGRES_USER=panal -e POSTGRES_PASSWORD=panal -e POSTGRES_DB=panal \
     -p 127.0.0.1:5432:5432 -v panal-datos:/var/lib/postgresql postgres:18-alpine

wslc start panal-db   # cada vez que enciendas la máquina
wslc stop panal-db
```

El usuario y la clave `panal` son solo para desarrollo: la base no es accesible desde fuera de tu máquina. Las credenciales de Neon van en variables de entorno y nunca en el repositorio.

**Por qué no instalar PostgreSQL dentro de Ubuntu ni mover el proyecto a WSL.** Instalarlo con `apt` también funciona, pero deja un servicio permanente en la distribución y otra cosa que mantener; el contenedor se crea y se borra con una orden. Y el código se queda en Windows, donde ya están Node 26 y Vite+: trabajar desde WSL sobre una carpeta de Windows (`/mnt/d`) hace lenta la recarga en caliente.

**En las pruebas, PGlite.** Es PostgreSQL compilado para ejecutarse dentro de Node. Cada prueba arranca con una base nueva en memoria, en milisegundos, sin depender de que el contenedor esté encendido. Así `vp test` funciona en cualquier máquina.

El código decide con una sola variable de entorno:

| `DATABASE_URL` | Qué se usa | Cuándo |
| :--- | :--- | :--- |
| `postgres://panal:panal@127.0.0.1:5432/panal` | El contenedor local, con el controlador `pg` | Desarrollo en tu máquina |
| La dirección de Neon | PostgreSQL en la nube, con el mismo controlador | Desplegado |
| Vacía | PGlite en memoria | Pruebas automáticas |

**Por qué SQL a la vista.** Las consultas se escriben en SQL dentro de funciones pequeñas, siempre con parámetros (nunca concatenando texto), y los cambios de esquema son archivos `.sql` numerados que aplica un script corto. Los reportes necesitan agrupar por día y por semana, y eso en SQL es directo. No hay una capa mágica que explicar.

**Alternativa.** Drizzle, si eliges TypeScript: define el esquema en código y genera las migraciones. En JavaScript pierde su principal ventaja, que son los tipos.

**Descartado.** MongoDB (los datos son relacionales: personas, colmenas, membresías y actividades). Supabase como base (pausa los proyectos gratuitos tras una semana sin uso, un riesgo antes de la defensa). Firestore (no es libre).

### D10. Sesión con cookie, no un token en el navegador

Al iniciar sesión el servidor crea una sesión en la base y entrega una cookie que el JavaScript de la página no puede leer (`HttpOnly`, `Secure`, `SameSite=Lax`). Frente al token guardado en `localStorage` de los tutoriales, la cookie no se puede robar con un script inyectado y la sesión se puede cerrar de verdad desde el servidor. Las contraseñas se guardan con `scrypt`, que viene con Node y no necesita compilar nada en Windows.

Esto pide que la web y la API estén en el **mismo dominio**; por eso se despliegan juntas. De paso desaparece toda la configuración de CORS.

**Alcance.** Registro, inicio y cierre de sesión van en la versión 1. Recuperar la contraseña e invitar por correo necesitan un servicio de envío de correos; quedan como opcionales, y la invitación principal es por enlace, que no necesita nada externo.

### D11. Nada depende de tareas programadas ni de tiempo real

Los alojamientos gratuitos no garantizan procesos en segundo plano. Por eso Panal no los necesita: se guarda una lista de hechos (qué celda se llenó, quién y qué día), y las gotas, la racha, el nivel y los cuadros de cada colmena se **calculan al leer** con funciones puras a partir de esos hechos y de la fecha actual. No hay un proceso nocturno que pueda fallar. El avance del equipo se refresca al volver a la pestaña y cada cierto tiempo, sin conexiones permanentes.

Es, otra vez, la idea de la materia: el estado es el resultado de reducir una lista de hechos.

### D12. Herramientas: Vite+

Ya está instalado en tu máquina y reemplaza cinco configuraciones sueltas: `vp dev` para desarrollar, `vp test` para probar, `vp check` para formato y revisión de código, `vp build` para construir y `vp run` para ejecutar tareas en todo el repositorio. El repositorio es uno solo, con espacios de trabajo de pnpm.

### D13. Despliegue gratuito

| Opción | Web y API | Base de datos | Lo bueno | El riesgo |
| :--- | :--- | :--- | :--- | :--- |
| **Recomendada** | Vercel, plan Hobby | Neon, plan Free | Sin tarjeta, mismo dominio para web y API, la base despierta en décimas de segundo | Hobby es solo para uso no comercial; un proyecto universitario cumple |
| Alternativa | Render, plan gratuito | Neon | Un servidor Node tradicional | Se duerme tras 15 minutos sin uso y tarda entre 30 y 60 segundos en despertar: mala impresión en una demostración |
| Respaldo para la defensa | Tu máquina con un túnel HTTPS | PGlite local | No depende de ningún servicio | Tu máquina tiene que estar encendida y con internet |

Neon, según su página oficial actualizada el 1 de octubre de 2026: 100 horas de cómputo al mes y 1 GB por proyecto, se suspende a los 5 minutos sin uso y se reactiva con la siguiente consulta en unas décimas de segundo, sin cobros por exceso.

Vercel Hobby, según su página oficial actualizada el 14 de septiembre de 2026: 1 000 000 de invocaciones de función, 4 horas de procesador activo, 360 GB-hora de memoria y 100 GB de transferencia al mes; cada función puede durar hasta 300 segundos; 100 despliegues por día. Si se supera un límite, hay que esperar 30 días para volver a usar esa función; no se cobra. Para un proyecto universitario sobra.

**Cómo quedó (17 de noviembre de 2026).** Publicado en <https://panal-drab.vercel.app>, con la forma clásica, sin Services:

- `vercel.json` compila con `pnpm run build && pnpm run migrar`, publica `apps/web/dist` y reescribe `/api/*` a la función y el resto a `index.html`. Los archivos con huella se guardan un año en caché; `sw.js` nunca.
- `api/index.js` es la función: abre la base con `DATABASE_URL` una vez por instancia y pasa cada petición a la misma aplicación Hono de `apps/api`. Sin `DATABASE_URL` se niega a arrancar, en lugar de intentar PGlite en un disco de solo lectura.
- Las migraciones corren al compilar. Por eso los scripts de `package.json` van sin caché en `vp run`: con caché, Vite+ solo pasa las variables declaradas y `migrar` corría sin `DATABASE_URL` (ver [`07-decisiones.md`](07-decisiones.md#despliegue-y-herramientas)).
- Node 24.2 o más nuevo (`engines`): los scripts usan `import.meta.main`. Vercel compila con Node 24 y con el pnpm 12.18 de `devEngines`.
- La base se creó desde el Marketplace de Vercel (`vercel integration add neon`), que carga `DATABASE_URL` sin que la clave se copie a mano. La base y la función están en São Paulo (`gru1`, `regions` en `vercel.json`): la región más cercana a Bolivia, y las dos juntas para que cada consulta no cruce el continente.

Los pasos, también para montarlo desde cero, están en el [README](../../README.md#desplegar).

## 4. Dónde se ve la materia en el código

| Unidad | Idea | Dónde aparece en Panal |
| :--- | :--- | :--- |
| 1. Funciones y mutabilidad | Funciones puras e inmutabilidad | Todo `packages/motor`: `gotasDeEvento`, `nivelDe`, `rachaDe`. Los reducers. Ninguna función del motor modifica lo que recibe |
| 2. Recursión y clausuras | Clausuras | `crearMotor(reglas)` devuelve funciones que recuerdan la tabla de reglas. Los selectores memorizados. La semilla del día para la sorpresa |
| 2. Recursión y clausuras | Recursión | El cálculo de la racha recorriendo los días hacia atrás. El nivel a partir de la tabla de umbrales |
| 3. Iteradores e iterables | Generadores | `function* ocurrencias(regla, desde)` produce, sin límite, los días en que toca una actividad recurrente; quien la usa toma solo los que necesita |
| 3. Iteradores e iterables | Iterables | El calendario de constancia se arma recorriendo un iterable de días |
| 4. Gestores de estado | Redux | El store, los slices, los selectores y los hooks, con la estructura del ejemplo de clase |
| 5 a 7. Gamificación | Mecánicas, jugadores y Octalysis | [`../propuestas/00-base-comun/motor-de-gamificacion.md`](../propuestas/00-base-comun/motor-de-gamificacion.md) y [`../propuestas/A-panal/estrategia-gamificacion.md`](../propuestas/A-panal/estrategia-gamificacion.md) |

## 5. Estructura del repositorio

```
Proyecto-final/
├── docs/                      documentación
├── assets-fuente/             originales generados por el modelo de imágenes (no se publican)
├── packages/
│   ├── motor/                 reglas del juego: funciones puras, sin dependencias
│   └── contratos/             esquemas Zod de lo que viaja por la API
├── apps/
│   ├── web/                   React, Redux Toolkit y PWA
│   │   ├── public/            iconos de la PWA y manifiesto
│   │   ├── pwa/               service worker, su complemento de Vite y el registro en la página
│   │   └── src/
│   │       ├── app/           store, rutas, estructura y efectos
│   │       ├── feature/       una carpeta por funcionalidad (slice, selectores, hook, componentes)
│   │       ├── componentes/   piezas compartidas: Zum, hexágonos, tarjetas, botones
│   │       ├── assets/        imágenes optimizadas que usa la interfaz
│   │       └── estilos/       variables y base
│   └── api/                   Hono y PostgreSQL
│       ├── migraciones/       archivos .sql numerados
│       └── src/
│           ├── rutas/         una por recurso
│           ├── datos/         consultas SQL en funciones pequeñas
│           └── servicios/     usan el motor y los datos
├── api/index.js               la API como función de Vercel
├── vercel.json                compilación, reescrituras y cabeceras del despliegue
├── pnpm-workspace.yaml
└── package.json
```

## 6. Lo que no está verificado

- **Compatibilidad de `vite-plugin-pwa` con Vite+.** La versión 2.0.0 del complemento declara compatibilidad con Vite 3 a 8. Qué versión de Vite instala Vite+ 1.3 se sabrá al crear el proyecto. Si no coincidieran, el service worker se escribe a mano: para este tamaño son unas sesenta líneas. **Resultado:** no coinciden (Vite+ se presenta como `vite-plus-core@1.3.0`) y se escribió a mano; está en [`07-decisiones.md`](07-decisiones.md#pwa-e-ilustraciones).
- **PGlite sigue en versión 0.x** (0.5.16 hoy). Es estable para desarrollo y pruebas, que es para lo que se usa aquí, pero puede cambiar entre versiones. Por eso la versión se fija en el proyecto y la base desplegada es PostgreSQL real.
- **Web y API en un mismo proyecto de Vercel.** La función que lo permite, Services, está en beta en todos los planes. Si diera problemas, queda la forma clásica: la aplicación como archivos estáticos y la API como una función en la carpeta `api/`, con una regla de reescritura. El código de Hono no cambia. **Resultado:** se eligió directamente la forma clásica, que no depende de una beta (D13).
- **Diferencias entre PGlite y PostgreSQL real.** Usan el mismo motor, pero PGlite atiende una sola conexión. Como el desarrollo diario ya ocurre contra PostgreSQL real, una diferencia se notaría pronto; además, las pruebas se pueden correr contra el contenedor cambiando `DATABASE_URL`.
- **`wslc` es reciente.** No ofrece la interfaz de Docker ni está confirmado que admita Docker Compose, así que el proyecto no depende de ninguno de los dos: bastan las órdenes de D9. No se ha comprobado si el contenedor vuelve a arrancar solo tras reiniciar Windows; por eso hay una orden para iniciarlo.
- **El primer despliegue.** Lo que solo se podía ver desplegando ya se vio: Vercel respeta el pnpm de `devEngines` y la función arranca contra Neon. Queda por medir el arranque en frío tras horas sin uso, cuando Neon también está suspendida.

## 7. Decisiones confirmadas

Confirmadas por ti el 13 de noviembre de 2026.

| Decisión | Elegido |
| :--- | :--- |
| Lenguaje (D2) | JavaScript con JSDoc |
| Servidor (D8) | Hono |
| Datos del servidor en Redux (D3) | RTK Query |
| Base en local (D9) | PostgreSQL real en un contenedor de `wslc`, a propuesta tuya; PGlite queda solo para las pruebas |

**Sigue como supuesto, sin confirmar:** el alcance sin conexión (D7). La versión 1 es instalable y abre sin red, pero marcar celdas pide conexión.

## 8. Fuentes

- [Neon: límites del plan gratuito](https://neon.com/faqs/free-plan-limits-and-quotas)
- [Vercel: Hono sin configuración](https://vercel.com/docs/frameworks/backend/hono)
- [Vercel: plan Hobby](https://vercel.com/docs/plans/hobby)
- [Vercel: Services](https://vercel.com/docs/services)
- [Vercel: precios de Fluid compute](https://vercel.com/docs/fluid-compute/pricing)
- [Render: plataformas con plan gratuito real en 2026](https://render.com/articles/platforms-with-a-real-free-tier-for-developers-in-2026)
- [Comparativa de planes gratuitos de alojamiento 2026](https://agentdeals.dev/hosting-free-tier-comparison-2026)
- [Alojamiento gratuito de backend: límites reales](https://snapdeploy.dev/blog/free-backend-hosting-2026-apis-servers)
- [Drizzle con PGlite](https://orm.drizzle.team/docs/get-started/pglite-new)
- [PGlite: compatibilidad con ORM](https://pglite.dev/docs/orm-support)
- [Neon: versiones de PostgreSQL admitidas](https://neon.com/docs/postgresql/postgres-version-support)
- [Microsoft: contenedores en WSL](https://learn.microsoft.com/en-us/windows/wsl/wsl-container)
