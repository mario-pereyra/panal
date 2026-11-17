# Guía de backend

Cómo está hecho `apps/api` y cómo se agrega una ruta. El contrato de la API (rutas, tablas, permisos) está en [`../proyecto/05-datos-y-api.md`](../proyecto/05-datos-y-api.md); las razones del stack, en [`../proyecto/04-stack-y-arquitectura.md`](../proyecto/04-stack-y-arquitectura.md) (D8 a D11).

## Tabla de contenidos

1. [Mapa de carpetas](#1-mapa-de-carpetas)
2. [Capas de una petición](#2-capas-de-una-petición)
3. [Contratos compartidos](#3-contratos-compartidos)
4. [Base de datos](#4-base-de-datos)
5. [Sesión y seguridad](#5-sesión-y-seguridad)
6. [Errores](#6-errores)
7. [El tiempo](#7-el-tiempo)
8. [Pruebas](#8-pruebas)
9. [Agregar una ruta, paso a paso](#9-agregar-una-ruta-paso-a-paso)
10. [Desplegar](#10-desplegar)

## 1. Mapa de carpetas

```
apps/api/
├── migraciones/        # SQL numerado (001_esquema_inicial.sql, 002_tramos_de_ajustes.sql), se aplica una vez y en orden
├── src/
│   ├── servidor.js     # arranque en Node: base del entorno, migraciones, semilla en PGlite nueva, puerto 8787
│   ├── app.js          # crearApp({ base, reloj }): cabeceras, sesión, rutas y manejador de errores
│   ├── errores.js      # ErrorDePanal, falla(), validar(), leerCuerpo()
│   ├── rutas/          # una por recurso: cuenta, yo, panal, actividades, celdas, colmenas, reportes
│   ├── servicios/      # reglas que combinan consultas y motor: permisos, progreso, ajustes, colmenas, formatos
│   ├── datos/          # SQL con parámetros, y nada más: base, entorno, migrar, semilla, personas…
│   └── seguridad/      # claves (scrypt) y sesión (cookie, hash, límite de intentos)
└── tests/              # una app por archivo sobre PGlite en memoria, con reloj inyectado
```

Comandos, desde la raíz: `vp run dev` (servidor y web juntos), `vp run dev:api` o `vp run migrar`. Desde `apps/api`: `vp run semilla` y `vp test run`. Para rehacer la demostración, `node src/datos/semilla.js --reiniciar` con el servidor apagado: PGlite no admite dos procesos sobre la misma carpeta.

Los scripts reciben todas las variables de entorno porque `vp run` no los guarda en caché (`vite.config.js`). Con caché, Vite+ solo pasa las variables declaradas, y `DATABASE_URL=… vp run migrar` migraba PGlite.

## 2. Capas de una petición

```mermaid
flowchart LR
    P["Petición"] --> S["cargarSesion<br/>seguridad/sesion.js"]
    S --> R["Ruta<br/>rutas/*.js"]
    R -->|leerCuerpo + Zod| C["@panal/contratos"]
    R --> SV["Servicio<br/>servicios/*.js"]
    SV --> D["Datos<br/>datos/*.js"]
    SV --> M["@panal/motor"]
    D --> B[("PostgreSQL<br/>o PGlite")]
    R -->|"c.json(...)"| F["Formato<br/>servicios/formatos.js"]
```

| Capa | Hace | No hace |
| :--- | :--- | :--- |
| **Ruta** | Valida la entrada, exige sesión, abre la transacción, responde | SQL ni reglas del juego |
| **Servicio** | Permisos, reglas que cruzan tablas, llamadas al motor | Leer la petición |
| **Datos** | Una función por consulta, con parámetros `$1, $2…` | Decidir nada |
| **Formato** | Convierte filas (`snake_case`, `Date`) en las formas de `respuestas.js` | Consultar |
| **Motor** | Calcula: día lógico, gotas, vuelo, sellos, celebraciones | Leer el reloj o la base |

**Se guardan hechos y se calcula el resto.** Una celda llena es una fila de `celdas_llenas`; las gotas, la racha y los sellos se calculan con el motor al leer. Así deshacer una celda deshace todo lo que había dado.

## 3. Contratos compartidos

`packages/contratos` es el idioma común del servidor y el navegador:

- **Esquemas Zod** de cada cuerpo y parámetro (`actividad`, `cambiosDeActividad`, `nuevaColmena`, `periodoDeReporte`…). El servidor los usa con `leerCuerpo` y `validar`; el navegador, en sus formularios. Un mensaje de error se escribe una sola vez.
- **`ERRORES`**: cada código con su estado HTTP y su mensaje.
- **`respuestas.js`**: las formas de las respuestas, en JSDoc. Si una ruta cambia lo que devuelve, se actualiza aquí.

## 4. Base de datos

`datos/base.js` ofrece la misma interfaz pequeña (`consulta`, `ejecutar`, `transaccion`, `cerrar`) sobre dos motores:

| `DATABASE_URL` | Motor | Uso |
| :--- | :--- | :--- |
| Vacía | **PGlite** en `apps/api/.datos/pglite` (ignorada por git); la primera vez carga la semilla | Desarrollar sin contenedor |
| Vacía, en pruebas | PGlite en memoria, una por archivo | `vp test run` |
| Con valor | **PostgreSQL** real con `pg`: el contenedor `panal-db` o Neon | Comprobar concurrencia, desplegar |

Reglas:

- **SQL a la vista**, sin ORM, y siempre con parámetros: nunca se concatena un valor en una consulta.
- **Cambios de esquema en una migración nueva** (`002_…sql`); las aplicadas no se editan.
- **Las fechas de día (`date`) viajan como texto** `AAAA-MM-DD`, sin pasar por la zona horaria del proceso.
- **Lo que debe ser único lo asegura la base**: una celda por actividad y día (`unique (actividad_id, dia)`). Dos envíos simultáneos dan una celda y un 409, también en PostgreSQL real.
- **Escrituras que tocan varias tablas, en `base.transaccion`.**
- **Un `update` con columnas variables** usa `asignacionesDe(EDITABLES, cambios)` de `base.js`: los nombres salen de una lista fija del archivo de datos y los valores van como parámetros.
- **Los ajustes guardan su historia.** Al cambiar la meta o el día sin flores, la ruta llama a `anotarAjustes` en la misma transacción: reemplaza los tramos de hoy en adelante y deja intactos los anteriores. `ajustesDe(persona, hoy, tramos)` arma lo que recibe el motor.

Cuentas de demostración: `ana`, `luis`, `sofia` y `diego` `@panal.test`, todas con la contraseña `panal1234`.

## 5. Sesión y seguridad

- **Cookie `panal_sesion`**: `HttpOnly`, `SameSite=Lax`, `Path=/`, 30 días, y `Secure` con `NODE_ENV=production`. En la base se guarda solo su hash SHA-256.
- **Claves con scrypt** (`seguridad/claves.js`).
- **Cinco intentos fallidos en diez minutos** bloquean la entrada de ese correo: 429 con `reintentarEn` y la cabecera `Retry-After`.
- **Sin CORS.** En desarrollo, Vite reenvía `/api` a `127.0.0.1:8787`; en producción se sirven desde el mismo origen.
- **Permisos en una sola capa**, en los servicios (`exigirPermisoSobreActividad`, `colmenaDeIntegrante`…), antes de tocar la base. Una colmena ajena responde 403; algo que no existe, 404.
- `secureHeaders()` de Hono en todas las respuestas.

## 6. Errores

Las rutas lanzan, no responden errores: `throw falla("celda_ya_llena")`. El manejador de `app.js` arma siempre la misma forma:

```json
{ "error": { "codigo": "datos_invalidos", "mensaje": "Revisa los datos: algo no está bien.", "campos": { "titulo": "…" } } }
```

Un error que no es un `ErrorDePanal` se registra en la consola y responde 500 con `error_interno`, sin detalles. El navegador lee cualquier fallo con `leerError()` y decide qué mostrar por `codigo`.

## 7. El tiempo

- **El reloj se inyecta**: `crearApp({ base, reloj })`. Las pruebas mueven `reloj.ahora` para cruzar las 03:00 o cambiar de semana.
- **El día lo decide el servidor**: `diaLogico(reloj(), persona.zona_horaria)`. El navegador nunca manda el día de una celda.
- **La zona horaria llega del dispositivo** al crear la cuenta y se cambia en Mi vuelo; sin ella rige `America/La_Paz`.

## 8. Pruebas

`tests/ayudantes.js` da `crearEntorno()`: una base PGlite en memoria con las migraciones, la aplicación con su reloj y un `cliente()` que guarda la cookie. Las peticiones van por `app.request()`, sin abrir puertos.

Toda ruta nueva se prueba con:

1. El caso feliz, con la forma de la respuesta.
2. Datos inválidos: 400 con el mensaje de cada campo.
3. Sin sesión: 401 (y se agrega a la tabla de rutas protegidas).
4. Sin permiso: 403 o 404.
5. Si tiene que ver con días: el cambio a las 03:00 con el reloj inyectado.

## 9. Agregar una ruta, paso a paso

1. **Contrato.** El esquema del cuerpo en `packages/contratos/src/index.js` y la forma de la respuesta en `respuestas.js`. Si hay un código de error nuevo, a `errores.js` de contratos.
2. **Datos.** La consulta en `src/datos/<recurso>.js`; si cambia el esquema, una migración nueva.
3. **Servicio.** Permisos y reglas en `src/servicios/`; los cálculos del juego, en el motor con su prueba.
4. **Ruta.** En `src/rutas/<recurso>.js`, con `exigirSesion`, `leerCuerpo` o `validar`, y la respuesta pasada por `formatos.js`.
5. **Pruebas** de la sección 8.
6. **Cliente.** El endpoint en `apps/web/src/api/panalApi.js`, con las etiquetas que invalida.
7. **Documento.** La tabla de rutas de [`05-datos-y-api.md` §7](../proyecto/05-datos-y-api.md#7-api).

## 10. Desplegar

La API desplegada es la misma aplicación, envuelta en una función de Vercel:

- **`api/index.js`** (en la raíz del repositorio) abre la base con `DATABASE_URL` una vez por instancia y responde cada método con `app.fetch`. Sin `DATABASE_URL` no arranca.
- **`vercel.json`** compila con `pnpm run build && pnpm run migrar`: las migraciones se aplican al compilar, contra la base de ese entorno. Reescribe `/api/*` a la función y lo demás a `index.html`.
- **PGlite no viaja a producción**: `base.js` lo importa solo cuando no hay `DATABASE_URL`.
- **La cookie sale con `Secure`** porque Vercel corre con `NODE_ENV=production`.
- **La base es Neon, en São Paulo como la función.** Su cadena trae `sslmode=require`, que `crearPostgres` pide como `verify-full`: lo mismo que hace `pg` hoy, sin su aviso en cada arranque.

Para probar la función sin desplegar, con el contenedor encendido: `DATABASE_URL=postgres://panal:panal@127.0.0.1:5432/panal NODE_ENV=production` y llamar a sus exportaciones con un `Request`, como hace la prueba de la sección 8 con `app.request()`. Los pasos para crear el proyecto están en el [README](../../README.md#desplegar).

