/**
 * Forma de las respuestas de la API de Panal.
 *
 * Solo tipos (JSDoc): el servidor las construye y el navegador las lee. Los
 * nombres van en camelCase; las fechas de día son AAAA-MM-DD y los instantes,
 * ISO 8601 en UTC.
 *
 * @typedef {import("@panal/motor").Regla} Regla
 * @typedef {import("@panal/motor").Vuelo} Vuelo
 *
 * @typedef {object} Perfil
 *   `GET /api/yo`, y también la respuesta de `POST /api/cuenta`, `POST /api/sesion`,
 *   `PATCH /api/yo` y `POST /api/yo/primer-vuelo`.
 * @property {string} id
 * @property {string} nombre
 * @property {string} correo
 * @property {3 | 5 | 7} metaDiaria La que rige hoy.
 * @property {3 | 5 | 7 | null} metaSiguiente Un cambio de meta que rige desde mañana.
 * @property {string} zonaHoraria
 * @property {number | null} diaSinFlores 0 es lunes y 6, domingo.
 * @property {{ desde: string, hasta: string } | null} invernada
 * @property {string | null} primerVueloEn Nulo hasta terminar el recorrido inicial.
 * @property {string} creadaEl Día lógico en que se creó la cuenta.
 *
 * @typedef {object} Actividad
 * @property {string} id
 * @property {string} titulo
 * @property {"unica" | "recurrente"} tipo
 * @property {"normal" | "alta"} prioridad
 * @property {Regla | null} regla
 * @property {string | null} vence
 * @property {string | null} colmenaId
 * @property {{ id: string, nombre: string } | null} colmena
 * @property {string | null} asignadaA
 * @property {string} creadaPor
 * @property {string} creadaEl Día lógico de creación.
 * @property {string} creadaEn Instante de creación.
 * @property {string | null} archivadaEl
 *
 * @typedef {object} CeldaLlena
 * @property {string} id Lo crea el navegador.
 * @property {string} actividadId
 * @property {string} personaId Quien la llenó.
 * @property {string} dia Día lógico, calculado por el servidor.
 * @property {string} llenadaEn
 * @property {number} gotas Calculadas por el motor al leer.
 *
 * @typedef {object} Integrante
 * @property {string} id
 * @property {string} nombre
 * @property {number} color Posición en la paleta de abejas, de 0 a 5, por orden de llegada.
 *
 * @typedef {object} ResumenDeColmena
 * @property {string} id
 * @property {string} nombre
 * @property {Integrante[]} integrantes
 * @property {Array<{ actividadId: string, llenaPor: string | null }>} celdas Una por actividad activa, en orden de creación.
 *
 * @typedef {object} Panal `GET /api/panal`: todo lo que necesita "Hoy" en una sola llamada.
 * @property {string} hoy Día lógico de hoy para la persona.
 * @property {Perfil} persona
 * @property {{ vueloHastaAyer: Vuelo, gotasHastaAyer: number, bonosDeHoy: number }} progreso
 *   Lo calculado por el servidor hasta ayer. El navegador da el paso de hoy con
 *   `avanzarDia` del motor. `bonosDeHoy` son las gotas de cuotas y cuadros ganadas hoy.
 * @property {Actividad[]} actividades Las activas del panal de la persona: personales y
 *   asignadas a ella en sus colmenas. No incluye las únicas cumplidas antes de hoy.
 * @property {CeldaLlena[]} celdasLlenas Las de la persona en las últimas cinco semanas.
 * @property {Array<{ desde: string, metaDiaria: 3 | 5 | 7, diaSinFlores: number | null }>} tramosDeAjustes
 *   Desde qué día rigió cada meta y día sin flores, del más antiguo al más nuevo. El
 *   navegador los pasa al motor como `historial`: cada día se cuenta con lo de entonces.
 * @property {ResumenDeColmena | null} colmena La colmena activa con actividad más reciente.
 * @property {number} colmenasActivas
 *
 * @typedef {object} Celebracion Ver `celebracionesEntre` en el motor.
 * @property {"panal-cerrado" | "racha" | "oficio" | "sello" | "cuadro" | "colmena-cerrada"} tipo
 * @property {number} [gotas]
 *
 * @typedef {object} CeldaGuardada `PUT /api/celdas/:id`
 * @property {CeldaLlena} celda
 * @property {Celebracion[]} celebraciones
 *
 * @typedef {object} ListaDeActividades `GET /api/actividades?ver=activas|archivadas`
 * @property {string} hoy
 * @property {Actividad[]} actividades Todas las de la persona en esa vista, personales y de sus colmenas.
 *
 * @typedef {object} Avance Ver `avanceDeColmena` en el motor.
 * @property {number} total
 * @property {number} llenas
 * @property {number} porcentaje
 * @property {number} cuadro
 * @property {number} faltanParaElSiguiente
 * @property {boolean} cerrada
 *
 * @typedef {object} Colmena `GET /api/colmenas` devuelve `{ colmenas: Colmena[] }`.
 * @property {string} id
 * @property {string} nombre
 * @property {string | null} descripcion
 * @property {string | null} entregaEl
 * @property {string} fundadoraId
 * @property {string | null} cerradaEn
 * @property {string | null} archivadaEn
 * @property {Avance} avance
 * @property {Integrante[]} integrantes Solo quienes siguen dentro.
 * @property {Array<{ actividadId: string, llenaPor: string | null }>} celdas
 *
 * @typedef {object} DetalleDeColmena `GET /api/colmenas/:id`
 * @property {string} hoy
 * @property {Colmena} colmena
 * @property {Array<Actividad & { llenaPor: string | null, llenadaEl: string | null, celdaId: string | null }>} actividades
 * @property {Array<Integrante & { unidaEn: string, aportes: number, pendientes: number }>} enjambre
 *
 * @typedef {object} Invitacion `GET` y `POST /api/colmenas/:id/invitacion`
 * @property {string} codigo Va en el enlace `/unirme/:codigo`.
 * @property {string} venceEn
 *
 * @typedef {object} VistaDeInvitacion `GET /api/invitaciones/:codigo`. No pide sesión.
 * @property {{ id: string, nombre: string, abejas: number }} colmena
 * @property {{ nombre: string }} invita
 * @property {string} venceEn
 * @property {boolean} yaSoyIntegrante Falso si no hay sesión.
 *
 * @typedef {object} Progreso `GET /api/yo/progreso`: lo que muestra "Mi vuelo".
 * @property {string} hoy
 * @property {{ nivel: number, nombre: string, gotas: number, siguiente: string | null, faltan: number, avance: number }} oficio
 * @property {{ total: number, desglose: { celdas: number, cierres: number, hitos: number, cuotas: number, colmenas: number } }} gotas
 * @property {{ actual: number, mejor: number, reservas: number }} racha
 * @property {Array<import("@panal/motor").DefinicionDeSello & { ganado: boolean, ganadoEl: string | null, actual: number }>} sellos
 *
 * @typedef {object} Reporte `GET /api/reportes?desde=&hasta=`
 * @property {string} desde
 * @property {string} hasta
 * @property {string} hoy
 * @property {Array<{ dia: string, llenas: number }>} celdasPorDia Un elemento por día del periodo, hasta hoy.
 * @property {number} periodoAnterior Celdas llenas en el periodo anterior del mismo largo.
 * @property {Array<{ actividadId: string, titulo: string, dias: Array<{ dia: string, tocaba: boolean, llena: boolean }>, porcentaje: number }>} rondas
 *   Las recurrentes activas, con los últimos siete días del periodo.
 * @property {{ unicas: number, recurrentes: number }} reparto Celdas llenas del periodo por tipo.
 * @property {Array<{ id: string, nombre: string, aportes: Array<Integrante & { celdas: number }> }>} colmenas
 *   Celdas de cada colmena llenas en el periodo, por integrante.
 */
export {};
