import { randomBytes, randomUUID } from "node:crypto";
import { diaLogico, HORA_DE_CAMBIO, lunesDe, reglaToca, sumarDias } from "@panal/motor";
import { cifrarClave } from "../seguridad/claves.js";
import { guardarActividad, insertarCelda } from "./actividades.js";
import { actualizarColmena, crearColmena, crearInvitacion, sumarIntegrante } from "./colmenas.js";
import { baseDelEntorno } from "./entorno.js";
import { aplicarMigraciones } from "./migrar.js";
import { anotarAjustes } from "../servicios/ajustes.js";
import { actualizarPersona, crearPersona } from "./personas.js";

/**
 * Semilla de demostración: siete abejas, sus actividades, cuatro colmenas y unas
 * seis semanas de historial.
 *
 * Todas las fechas son relativas a hoy, para que el panal se vea vivo el día
 * que se cargue. Con `--reiniciar` borra la demostración y la vuelve a crear;
 * sin él, no hace nada si ya está cargada.
 *
 *     node src/datos/semilla.js [--reiniciar]
 *
 * Lo que se ve al entrar como ana@panal.test (contraseña panal1234):
 *
 * - Una racha de 14 días con 2 reservas de miel. Antes, tres rachas cortas que
 *   se cortaron: por eso ya ganó el sello "Vuelta al panal".
 * - Nivel 5, Recolectora, entre 700 y 1000 gotas.
 * - Hoy, 3 celdas llenas. "Renovar el carnet universitario" está vencida y
 *   "Preparar la exposición de Auditoría" es de prioridad alta.
 * - "Proyecto final" al 60 %: 18 de 30 celdas, en el cuadro 3, con entrega en 9 días.
 *   "Diseñar pantalla de reportes" está asignada a Ana y le toca hoy.
 * - "Feria de ciencias", cerrada al 100 %, en el colmenar.
 * - "Club de lectura", fundada por Ana con Valeria, Tomás y Camila: 7 de 12
 *   celdas y un enlace de invitación. Ahí se ven Quitar y Pasar la fundación.
 * - "Viaje de promoción", fundada por Ana y archivada a medias: para Recuperar.
 */

export const CLAVE_DE_DEMOSTRACION = "panal1234";
export const ZONA_DE_DEMOSTRACION = "America/La_Paz";

/** La Paz está en UTC−4 todo el año: no tiene horario de verano. */
const HORAS_DE_DIFERENCIA_CON_UTC = 4;

export const CORREOS_DE_DEMOSTRACION = {
  ana: "ana@panal.test",
  luis: "luis@panal.test",
  sofia: "sofia@panal.test",
  diego: "diego@panal.test",
  valeria: "valeria@panal.test",
  tomas: "tomas@panal.test",
  camila: "camila@panal.test",
};

/**
 * Un instante a cierta hora local de un día, en La Paz.
 * @param {string} dia
 * @param {number} hora
 * @param {number} [minuto]
 */
function instanteLocal(dia, hora, minuto = 0) {
  const [anio, mes, numero] = dia.split("-").map(Number);
  return new Date(
    Date.UTC(anio, mes - 1, numero, hora + HORAS_DE_DIFERENCIA_CON_UTC, minuto),
  ).toISOString();
}

/**
 * Los días, contados desde hoy, en que Ana llenó al menos una celda. Entre una
 * racha y la siguiente hay días en blanco: el primero de la primera gasta la
 * reserva de regalo; los demás cortan la racha.
 */
const RACHAS_DE_ANA = [
  [-40, -36],
  [-30, -28],
  [-21, -17],
  [-13, 0],
];

/** Días en que Ana llenó una segunda celda de ronda, para que el panal de constancia no sea plano. */
const DIAS_CON_DOS_CELDAS = new Set([-12, -4]);

/** Su primer día, Ana llenó todo lo que tocaba: cerró su primer panal. */
const PRIMER_CIERRE_DE_ANA = -40;

/**
 * Quién llenó cada una de las 18 primeras celdas de "Proyecto final" y cuándo,
 * contado desde hoy. Los cuadros se cierran en la sexta, la duodécima y la última.
 */
const LLENAS_DEL_PROYECTO = [
  [-27, "sofia"],
  [-26, "luis"],
  [-24, "sofia"],
  [-23, "diego"],
  [-21, "luis"],
  [-20, "sofia"],
  [-19, "ana"],
  [-17, "luis"],
  [-15, "sofia"],
  [-12, "diego"],
  [-11, "ana"],
  [-10, "luis"],
  [-8, "sofia"],
  [-7, "ana"],
  [-5, "diego"],
  [-4, "luis"],
  [-2, "sofia"],
  [-1, "ana"],
];

/**
 * Las 30 actividades de "Proyecto final", en orden de creación: título, a
 * quién está asignada (o nadie) y cuándo se creó, contado desde hoy.
 * @type {Array<[string, string | null, number]>}
 */
const ACTIVIDADES_DEL_PROYECTO = [
  ["Definir el alcance del proyecto", "sofia", -30],
  ["Elegir el stack", "luis", -30],
  ["Crear el repositorio", null, -30],
  ["Escribir las historias de usuario", "diego", -30],
  ["Diseñar el modelo de datos", "luis", -30],
  ["Configurar Vite+ y pnpm", "sofia", -30],
  ["Bocetar la pantalla Hoy", null, -22],
  ["Escribir el motor de gotas", "luis", -22],
  ["Probar la racha con fast-check", null, -22],
  ["Generar las ilustraciones de Zum", "diego", -22],
  ["Maquetar la cabecera", null, -22],
  ["Armar el store de Redux", "luis", -22],
  ["Conectar RTK Query", "sofia", -13],
  ["Escribir las migraciones", "ana", -13],
  ["Diseñar la rejilla de la colmena", "diego", -13],
  ["Escribir los textos de Zum", null, -13],
  ["Revisar la accesibilidad del teclado", "sofia", -13],
  ["Crear la semilla de demostración", "ana", -13],
  ["Diseñar pantalla de reportes", "ana", -3],
  ["Implementar el inicio de sesión", "luis", -2],
  ["Implementar las invitaciones", "diego", -2],
  ["Probar en el teléfono", null, -2],
  ["Configurar la PWA", "sofia", -2],
  ["Escribir el manual de uso", null, -2],
  ["Preparar la presentación", "sofia", -1],
  ["Ensayar la defensa", null, -1],
  ["Desplegar en Vercel", "luis", -1],
  ["Revisar la ortografía de la interfaz", null, -1],
  ["Grabar el video de demostración", "diego", -1],
  ["Entregar el informe final", "sofia", -1],
];

/** Fechas límite de algunas pendientes del proyecto, contadas desde hoy. */
const VENCIMIENTOS_DEL_PROYECTO = {
  "Preparar la presentación": 7,
  "Ensayar la defensa": 8,
  "Entregar el informe final": 9,
};

/**
 * Todo lo que crea la semilla, sin tocar la base: personas, colmenas,
 * integrantes, actividades, celdas llenas e invitaciones, con sus instantes.
 * @param {number} ahora
 */
export function planDeDemostracion(ahora) {
  const hoy = diaLogico(ahora, ZONA_DE_DEMOSTRACION);
  const dia = (desplazamiento) => sumarDias(hoy, desplazamiento);
  const a = (desplazamiento, hora, minuto = 0) => instanteLocal(dia(desplazamiento), hora, minuto);

  // Las celdas de hoy se reparten entre las 03:00, cuando empezó el día, y ahora.
  const inicioDeHoy = Date.parse(instanteLocal(hoy, HORA_DE_CAMBIO));
  const hoyA = (fraccion) => new Date(inicioDeHoy + (ahora - inicioDeHoy) * fraccion).toISOString();

  const personas = {
    ana: { nombre: "Ana", creadaEn: a(-41, 21), metaDiaria: 5 },
    luis: { nombre: "Luis", creadaEn: a(-41, 9), metaDiaria: 3 },
    sofia: { nombre: "Sofía", creadaEn: a(-35, 18), metaDiaria: 5 },
    diego: { nombre: "Diego", creadaEn: a(-40, 12), metaDiaria: 3 },
    valeria: { nombre: "Valeria", creadaEn: a(-26, 19), metaDiaria: 3 },
    tomas: { nombre: "Tomás", creadaEn: a(-24, 7), metaDiaria: 3 },
    camila: { nombre: "Camila", creadaEn: a(-20, 16), metaDiaria: 3 },
  };
  for (const [clave, persona] of Object.entries(personas)) {
    Object.assign(persona, { id: randomUUID(), correo: CORREOS_DE_DEMOSTRACION[clave] });
  }
  const id = (clave) => (clave ? personas[clave].id : null);

  const colmenas = {
    feria: {
      id: randomUUID(),
      nombre: "Feria de ciencias",
      descripcion: "El volcán de bicarbonato del colegio de Diego.",
      fundadora: "luis",
      entregaEl: dia(-33),
      creadaEn: a(-40, 8),
    },
    proyecto: {
      id: randomUUID(),
      nombre: "Proyecto final",
      descripcion: "Panal: la plataforma gamificada de la materia.",
      fundadora: "sofia",
      entregaEl: dia(9),
      creadaEn: a(-30, 8),
    },
    club: {
      id: randomUUID(),
      nombre: "Club de lectura",
      descripcion: "Un libro por mes y una charla para comentarlo.",
      fundadora: "ana",
      entregaEl: dia(20),
      creadaEn: a(-18, 20),
    },
    viaje: {
      id: randomUUID(),
      nombre: "Viaje de promoción",
      descripcion: "Uyuni en las vacaciones, si juntamos el dinero.",
      fundadora: "ana",
      entregaEl: null,
      creadaEn: a(-22, 21),
      archivadaEn: a(-8, 20),
    },
  };
  const integrantes = [
    ["feria", "luis", a(-40, 8)],
    ["feria", "ana", a(-40, 9)],
    ["feria", "diego", a(-39, 10)],
    ["proyecto", "sofia", a(-30, 8)],
    ["proyecto", "ana", a(-29, 19)],
    ["proyecto", "luis", a(-29, 20)],
    ["proyecto", "diego", a(-28, 11)],
    ["club", "ana", a(-18, 20)],
    ["club", "valeria", a(-18, 21)],
    ["club", "tomas", a(-17, 8)],
    ["club", "camila", a(-16, 18)],
    ["viaje", "ana", a(-22, 21)],
    ["viaje", "luis", a(-22, 22)],
    ["viaje", "valeria", a(-21, 9)],
  ];

  /** @type {Array<{ clave?: string, id: string, creadaPor: string, colmenaId: string | null, asignadaA: string | null, titulo: string, tipo: "unica" | "recurrente", prioridadAlta: boolean, venceEl: string | null, regla: any, creadaEn: string, archivadaEn: string | null }>} */
  const actividades = [];
  const nuevaActividad = (datos) => {
    const actividad = {
      id: randomUUID(),
      colmenaId: null,
      asignadaA: null,
      tipo: "unica",
      prioridadAlta: false,
      venceEl: null,
      regla: null,
      archivadaEn: null,
      ...datos,
    };
    actividades.push(actividad);
    return actividad;
  };
  /** @type {Array<{ id: string, actividadId: string, personaId: string, dia: string, llenadaEn: string }>} */
  const celdas = [];
  const llenar = (actividad, quien, desplazamiento, llenadaEn) => {
    celdas.push({
      id: randomUUID(),
      actividadId: actividad.id,
      personaId: id(quien),
      dia: dia(desplazamiento),
      llenadaEn,
    });
  };

  // Ana: sus rondas y sus únicas.
  const deAna = { creadaPor: id("ana") };
  const redux = nuevaActividad({
    ...deAna,
    titulo: "Repasar apuntes de Redux",
    tipo: "recurrente",
    regla: { clase: "diaria" },
    creadaEn: a(-41, 21, 10),
  });
  const caminar = nuevaActividad({
    ...deAna,
    titulo: "Caminar 30 minutos",
    tipo: "recurrente",
    regla: { clase: "diaria" },
    creadaEn: a(-41, 21, 12),
  });
  const ingles = nuevaActividad({
    ...deAna,
    titulo: "Practicar inglés 15 minutos",
    tipo: "recurrente",
    regla: { clase: "dias", dias: [0, 2, 4] },
    creadaEn: a(-41, 21, 14),
  });
  const internet = nuevaActividad({
    ...deAna,
    titulo: "Pagar el internet",
    tipo: "recurrente",
    regla: { clase: "mes", dia: 10 },
    creadaEn: a(-41, 21, 16),
  });
  const leer = nuevaActividad({
    ...deAna,
    titulo: "Leer 20 páginas",
    tipo: "recurrente",
    regla: { clase: "veces", veces: 3 },
    creadaEn: a(-22, 8),
  });
  nuevaActividad({
    ...deAna,
    titulo: "Comprar audífonos nuevos",
    creadaEn: a(-37, 9),
    archivadaEn: a(-35, 20),
  });
  const informe = nuevaActividad({
    ...deAna,
    titulo: "Entregar informe de avance",
    venceEl: hoy,
    creadaEn: a(-6, 9),
  });
  nuevaActividad({
    ...deAna,
    titulo: "Renovar el carnet universitario",
    venceEl: dia(-3),
    creadaEn: a(-9, 10),
  });
  nuevaActividad({
    ...deAna,
    titulo: "Preparar la exposición de Auditoría",
    prioridadAlta: true,
    venceEl: dia(2),
    creadaEn: a(-2, 18),
  });

  // El historial de Ana, día por día. Cada día de racha llena una ronda: la del
  // mes si es día 10, inglés si toca, a veces leer y, si no, una de las diarias.
  const lecturasPorSemana = new Map();
  for (const [desde, hasta] of RACHAS_DE_ANA) {
    for (let desplazamiento = desde; desplazamiento <= Math.min(hasta, -1); desplazamiento += 1) {
      const elDia = dia(desplazamiento);
      const semana = lunesDe(elDia);
      const lecturas = lecturasPorSemana.get(semana) ?? 0;
      const diaria = desplazamiento % 2 === 0 ? redux : caminar;
      let ronda = diaria;
      if (Number(elDia.slice(8)) === internet.regla.dia) ronda = internet;
      else if (reglaToca(ingles.regla, elDia)) ronda = ingles;
      else if (desplazamiento >= -22 && lecturas < leer.regla.veces && desplazamiento % 3 !== 0) {
        ronda = leer;
        lecturasPorSemana.set(semana, lecturas + 1);
      }
      if (desplazamiento === PRIMER_CIERRE_DE_ANA) {
        [redux, caminar, ingles, internet]
          .filter((actividad) => reglaToca(actividad.regla, elDia))
          .forEach((actividad, orden) =>
            llenar(actividad, "ana", desplazamiento, a(desplazamiento, 20, orden)),
          );
        continue;
      }
      llenar(ronda, "ana", desplazamiento, a(desplazamiento, 19, 30));
      if (DIAS_CON_DOS_CELDAS.has(desplazamiento)) {
        llenar(ronda === redux ? caminar : redux, "ana", desplazamiento, a(desplazamiento, 7, 45));
      }
    }
  }
  // Hoy: tres celdas de cinco.
  llenar(redux, "ana", 0, hoyA(0.25));
  llenar(caminar, "ana", 0, hoyA(0.5));
  llenar(informe, "ana", 0, hoyA(0.75));

  // Las rondas del resto del enjambre.
  const tablero = nuevaActividad({
    creadaPor: id("sofia"),
    titulo: "Revisar el tablero del proyecto",
    tipo: "recurrente",
    regla: { clase: "diaria" },
    creadaEn: a(-30, 9),
  });
  const gimnasio = nuevaActividad({
    creadaPor: id("luis"),
    titulo: "Ir al gimnasio",
    tipo: "recurrente",
    regla: { clase: "dias", dias: [0, 2, 4] },
    creadaEn: a(-41, 10),
  });
  nuevaActividad({
    creadaPor: id("luis"),
    titulo: "Estudiar para el parcial de Redes",
    prioridadAlta: true,
    venceEl: dia(5),
    creadaEn: a(-3, 15),
  });
  const guitarra = nuevaActividad({
    creadaPor: id("diego"),
    titulo: "Practicar guitarra",
    tipo: "recurrente",
    regla: { clase: "veces", veces: 3 },
    creadaEn: a(-40, 13),
  });
  for (let desplazamiento = -16; desplazamiento <= -1; desplazamiento += 1) {
    if (desplazamiento !== -9) llenar(tablero, "sofia", desplazamiento, a(desplazamiento, 8, 15));
    if (reglaToca(gimnasio.regla, dia(desplazamiento))) {
      llenar(gimnasio, "luis", desplazamiento, a(desplazamiento, 18));
    }
    if (desplazamiento % 2 === 0) llenar(guitarra, "diego", desplazamiento, a(desplazamiento, 21));
  }
  llenar(tablero, "sofia", 0, hoyA(0.4));

  // Feria de ciencias: cinco celdas, ya cerrada.
  const feria = colmenas.feria;
  const deLaFeria = [
    ["Elegir el experimento", "luis", -39],
    ["Comprar los materiales", null, -38],
    ["Armar la maqueta", "luis", -37],
    ["Preparar el póster", null, -36],
    ["Presentar en la feria", "luis", -34],
  ];
  deLaFeria.forEach(([titulo, asignada, cuando], indice) => {
    const actividad = nuevaActividad({
      creadaPor: id("luis"),
      colmenaId: feria.id,
      asignadaA: id(asignada),
      titulo,
      venceEl: feria.entregaEl,
      creadaEn: a(-40, 8, 30 + indice),
    });
    llenar(actividad, asignada ?? "diego", cuando, a(cuando, 16, indice));
  });
  feria.cerradaEn = a(-34, 16, 4);

  // Proyecto final: 30 celdas, 18 llenas.
  const proyecto = colmenas.proyecto;
  ACTIVIDADES_DEL_PROYECTO.forEach(([titulo, asignada, cuando], indice) => {
    const actividad = nuevaActividad({
      creadaPor: id("sofia"),
      colmenaId: proyecto.id,
      asignadaA: id(asignada),
      titulo,
      venceEl: titulo in VENCIMIENTOS_DEL_PROYECTO ? dia(VENCIMIENTOS_DEL_PROYECTO[titulo]) : null,
      creadaEn: a(cuando, 9, indice),
    });
    const llena = LLENAS_DEL_PROYECTO[indice];
    if (llena) {
      const [desplazamiento, quien] = llena;
      llenar(actividad, quien, desplazamiento, a(desplazamiento, 20, indice));
    }
  });

  // Las rondas de quienes llegaron con el club de lectura.
  const rondas = [
    ["valeria", "Escribir en el diario", { clase: "diaria" }, -15],
    ["tomas", "Correr 5 km", { clase: "dias", dias: [1, 3, 5] }, -14],
    ["camila", "Estudiar francés", { clase: "veces", veces: 4 }, -14],
  ];
  for (const [quien, titulo, regla, desde] of rondas) {
    const ronda = nuevaActividad({
      creadaPor: id(quien),
      titulo,
      tipo: "recurrente",
      regla,
      creadaEn: a(desde - 1, 21),
    });
    for (let desplazamiento = desde; desplazamiento <= -1; desplazamiento += 1) {
      const toca =
        regla.clase === "veces" ? desplazamiento % 2 !== 0 : reglaToca(regla, dia(desplazamiento));
      if (toca && desplazamiento !== -6) {
        llenar(ronda, quien, desplazamiento, a(desplazamiento, 7 + (desplazamiento & 3), 20));
      }
    }
  }

  // Club de lectura: lo fundó Ana; 7 de 12 celdas llenas, la última antes que
  // las del proyecto, para que Hoy siga mostrando el proyecto.
  // Título, a quién está asignada, quién la llenó y cuándo, contado desde hoy.
  /** @type {Array<[string, string | null, string | null, number | null]>} */
  const DEL_CLUB = [
    ["Elegir el primer libro", "ana", "ana", -17],
    ["Leer los capítulos 1 a 3", null, "valeria", -15],
    ["Resumir los capítulos 1 a 3", "tomas", "tomas", -13],
    ["Leer los capítulos 4 a 6", null, "camila", -11],
    ["Preparar preguntas para la charla", "valeria", "valeria", -9],
    ["Reservar la sala de la biblioteca", "camila", "camila", -6],
    ["Moderar la primera charla", "ana", "ana", -4],
    ["Leer los capítulos 7 a 9", null, null, null],
    ["Subir las notas de la charla", "tomas", null, null],
    ["Escribir la reseña del libro", "ana", null, null],
    ["Elegir el segundo libro", null, null, null],
    ["Invitar a más abejas al club", "camila", null, null],
  ];
  DEL_CLUB.forEach(([titulo, asignada, quien, cuando], indice) => {
    const actividad = nuevaActividad({
      creadaPor: id("ana"),
      colmenaId: colmenas.club.id,
      asignadaA: id(asignada),
      titulo,
      venceEl: titulo === "Escribir la reseña del libro" ? dia(6) : null,
      creadaEn: a(-18, 20, 10 + indice),
    });
    if (quien) llenar(actividad, quien, cuando, a(cuando, 18, indice));
  });

  // Viaje de promoción: Ana lo archivó a medias, para mostrar cómo se recupera.
  const DEL_VIAJE = [
    ["Cotizar los pasajes", "luis", "luis", -20],
    ["Abrir la cuenta de ahorro", "ana", "ana", -19],
    ["Vender rifas", "valeria", "valeria", -16],
    ["Reservar el hotel", null, null, null],
    ["Armar el itinerario", "ana", null, null],
    ["Pedir permiso en la universidad", null, null, null],
  ];
  DEL_VIAJE.forEach(([titulo, asignada, quien, cuando], indice) => {
    const actividad = nuevaActividad({
      creadaPor: id("ana"),
      colmenaId: colmenas.viaje.id,
      asignadaA: id(asignada),
      titulo,
      creadaEn: a(-22, 21, 10 + indice),
    });
    if (quien) llenar(actividad, quien, cuando, a(cuando, 17, indice));
  });

  const invitaciones = [
    {
      codigo: randomBytes(16).toString("base64url"),
      colmenaId: proyecto.id,
      creadaPor: id("sofia"),
      creadaEn: a(-1, 10),
      venceEn: a(6, 10),
    },
    {
      codigo: randomBytes(16).toString("base64url"),
      colmenaId: colmenas.club.id,
      creadaPor: id("ana"),
      creadaEn: a(-2, 19),
      venceEn: a(5, 19),
    },
  ];

  return { hoy, personas, colmenas, integrantes, actividades, celdas, invitaciones };
}

/**
 * Si la base todavía no tiene ninguna persona.
 * @param {import("./base.js").Consultor} base
 */
export async function baseVacia(base) {
  const [{ cantidad }] = await base.consulta("select count(*)::int as cantidad from personas");
  return cantidad === 0;
}

/**
 * Borra las cuentas de demostración. Todo lo suyo se va con ellas: sesiones,
 * colmenas que fundaron, actividades y celdas.
 * @param {import("./base.js").Base} base
 */
export async function borrarDemostracion(base) {
  const correos = Object.values(CORREOS_DE_DEMOSTRACION);
  await base.transaccion(async (tx) => {
    await tx.consulta("delete from personas where correo = any($1::text[])", [correos]);
    await tx.consulta("delete from intentos_fallidos where correo = any($1::text[])", [correos]);
  });
}

/**
 * Carga la demostración en la base.
 * @param {import("./base.js").Base} base
 * @param {{ reloj?: () => number, reiniciar?: boolean, avisar?: (mensaje: string) => void }} [opciones]
 * @returns {Promise<{ sembrada: boolean, plan?: ReturnType<typeof planDeDemostracion> }>}
 */
export async function sembrar(
  base,
  { reloj = () => Date.now(), reiniciar = false, avisar = () => {} } = {},
) {
  if (reiniciar) {
    await borrarDemostracion(base);
  } else {
    const [ana] = await base.consulta("select 1 from personas where correo = $1", [
      CORREOS_DE_DEMOSTRACION.ana,
    ]);
    if (ana) {
      avisar("La demostración ya estaba cargada. Usa --reiniciar para volver a crearla.");
      return { sembrada: false };
    }
  }

  const plan = planDeDemostracion(reloj());
  const claves = await Promise.all(
    Object.keys(plan.personas).map(() => cifrarClave(CLAVE_DE_DEMOSTRACION)),
  );

  await base.transaccion(async (tx) => {
    for (const [indice, persona] of Object.values(plan.personas).entries()) {
      await crearPersona(tx, {
        ...persona,
        claveHash: claves[indice],
        zonaHoraria: ZONA_DE_DEMOSTRACION,
      });
      const fila = await actualizarPersona(tx, persona.id, {
        meta_diaria: persona.metaDiaria,
        primer_vuelo_en: new Date(Date.parse(persona.creadaEn) + 10 * 60 * 1000).toISOString(),
      });
      await anotarAjustes(tx, fila, diaLogico(persona.creadaEn, ZONA_DE_DEMOSTRACION));
    }
    for (const colmena of Object.values(plan.colmenas)) {
      await crearColmena(tx, { ...colmena, fundadoraId: plan.personas[colmena.fundadora].id });
      await actualizarColmena(tx, colmena.id, {
        cerrada_en: colmena.cerradaEn ?? null,
        archivada_en: colmena.archivadaEn ?? null,
      });
    }
    for (const [colmena, persona, unidaEn] of plan.integrantes) {
      await sumarIntegrante(tx, plan.colmenas[colmena].id, plan.personas[persona].id, unidaEn);
    }
    for (const actividad of plan.actividades) await guardarActividad(tx, actividad);
    for (const celda of plan.celdas) await insertarCelda(tx, celda);
    for (const invitacion of plan.invitaciones) await crearInvitacion(tx, invitacion);
  });

  avisar(
    `Semilla cargada para el ${plan.hoy}: ${plan.actividades.length} actividades y ` +
      `${plan.celdas.length} celdas llenas. Entra como ${CORREOS_DE_DEMOSTRACION.ana} ` +
      `con la contraseña ${CLAVE_DE_DEMOSTRACION}.`,
  );
  return { sembrada: true, plan };
}

if (import.meta.main) {
  const base = await baseDelEntorno();
  try {
    await aplicarMigraciones(base, { avisar: console.log });
    await sembrar(base, { reiniciar: process.argv.includes("--reiniciar"), avisar: console.log });
  } finally {
    await base.cerrar();
  }
}
