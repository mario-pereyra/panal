import { randomBytes, randomUUID } from "node:crypto";
import {
  addDays,
  DAY_ROLLOVER_HOUR,
  doesRuleMatchDay,
  getLogicalDay,
  getMonday,
} from "@panal/motor";
import { hashPassword } from "../auth/password.js";
import { saveActivity } from "../repositories/activityRepository.js";
import { insertCell } from "../repositories/cellRepository.js";
import {
  addHiveMember,
  createHive,
  createInvitation,
  updateHive,
} from "../repositories/hiveRepository.js";
import {
  countUsers,
  createUser,
  deleteUsersByEmails,
  findUserByEmail,
  updateUser,
} from "../repositories/userRepository.js";
import { syncSettingsHistory } from "../services/profileService.js";
import { createDbFromEnv } from "./env.js";
import { runMigrations } from "./migrate.js";

export const DEMO_PASSWORD = "panal1234";
export const DEMO_TIME_ZONE = "America/La_Paz";

const UTC_OFFSET_HOURS = 4;

export const DEMO_EMAILS = {
  ana: "ana@panal.test",
  luis: "luis@panal.test",
  sofia: "sofia@panal.test",
  diego: "diego@panal.test",
  valeria: "valeria@panal.test",
  tomas: "tomas@panal.test",
  camila: "camila@panal.test",
};

function localTimestamp(day, hour, minute = 0) {
  const [year, month, dayOfMonth] = day.split("-").map(Number);
  return new Date(
    Date.UTC(year, month - 1, dayOfMonth, hour + UTC_OFFSET_HOURS, minute),
  ).toISOString();
}

const ANA_STREAKS = [
  [-40, -36],
  [-30, -28],
  [-21, -17],
  [-13, 0],
];

const TWO_CELL_DAYS = new Set([-12, -4]);
const ANA_FIRST_CLOSE = -40;

const PROJECT_COMPLETIONS = [
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

const PROJECT_ACTIVITIES = [
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

const PROJECT_DUE_DAYS = {
  "Preparar la presentación": 7,
  "Ensayar la defensa": 8,
  "Entregar el informe final": 9,
};

export function buildDemoPlan(now) {
  const today = getLogicalDay(now, DEMO_TIME_ZONE);
  const day = (offset) => addDays(today, offset);
  const at = (offset, hour, minute = 0) => localTimestamp(day(offset), hour, minute);

  const startOfToday = Date.parse(localTimestamp(today, DAY_ROLLOVER_HOUR));
  const todayAt = (fraction) =>
    new Date(startOfToday + (now - startOfToday) * fraction).toISOString();

  const users = {
    ana: { name: "Ana", createdAt: at(-41, 21), dailyGoal: 5 },
    luis: { name: "Luis", createdAt: at(-41, 9), dailyGoal: 3 },
    sofia: { name: "Sofía", createdAt: at(-35, 18), dailyGoal: 5 },
    diego: { name: "Diego", createdAt: at(-40, 12), dailyGoal: 3 },
    valeria: { name: "Valeria", createdAt: at(-26, 19), dailyGoal: 3 },
    tomas: { name: "Tomás", createdAt: at(-24, 7), dailyGoal: 3 },
    camila: { name: "Camila", createdAt: at(-20, 16), dailyGoal: 3 },
  };
  for (const [key, user] of Object.entries(users)) {
    Object.assign(user, { id: randomUUID(), email: DEMO_EMAILS[key] });
  }
  const idOf = (key) => (key ? users[key].id : null);

  const hives = {
    feria: {
      id: randomUUID(),
      name: "Feria de ciencias",
      description: "El volcán de bicarbonato del colegio de Diego.",
      owner: "luis",
      dueDate: day(-33),
      createdAt: at(-40, 8),
    },
    proyecto: {
      id: randomUUID(),
      name: "Proyecto final",
      description: "Panal: la plataforma gamificada de la materia.",
      owner: "sofia",
      dueDate: day(9),
      createdAt: at(-30, 8),
    },
    club: {
      id: randomUUID(),
      name: "Club de lectura",
      description: "Un libro por mes y una charla para comentarlo.",
      owner: "ana",
      dueDate: day(20),
      createdAt: at(-18, 20),
    },
    viaje: {
      id: randomUUID(),
      name: "Viaje de promoción",
      description: "Uyuni en las vacaciones, si juntamos el dinero.",
      owner: "ana",
      dueDate: null,
      createdAt: at(-22, 21),
      archivedAt: at(-8, 20),
    },
  };

  const memberships = [
    ["feria", "luis", at(-40, 8)],
    ["feria", "ana", at(-40, 9)],
    ["feria", "diego", at(-39, 10)],
    ["proyecto", "sofia", at(-30, 8)],
    ["proyecto", "ana", at(-29, 19)],
    ["proyecto", "luis", at(-29, 20)],
    ["proyecto", "diego", at(-28, 11)],
    ["club", "ana", at(-18, 20)],
    ["club", "valeria", at(-18, 21)],
    ["club", "tomas", at(-17, 8)],
    ["club", "camila", at(-16, 18)],
    ["viaje", "ana", at(-22, 21)],
    ["viaje", "luis", at(-22, 22)],
    ["viaje", "valeria", at(-21, 9)],
  ];

  const activities = [];
  const createActivityEntry = (data) => {
    const activity = {
      id: randomUUID(),
      hiveId: null,
      assigneeId: null,
      type: "unica",
      highPriority: false,
      dueDate: null,
      rule: null,
      archivedAt: null,
      ...data,
    };
    activities.push(activity);
    return activity;
  };

  const cells = [];
  const fill = (activity, whoKey, offset, filledAt) => {
    cells.push({
      id: randomUUID(),
      activityId: activity.id,
      userId: idOf(whoKey),
      day: day(offset),
      filledAt,
    });
  };

  const anaBase = { createdBy: idOf("ana") };
  const redux = createActivityEntry({
    ...anaBase,
    title: "Repasar apuntes de Redux",
    type: "recurrente",
    rule: { kind: "diaria" },
    createdAt: at(-41, 21, 10),
  });
  const caminar = createActivityEntry({
    ...anaBase,
    title: "Caminar 30 minutos",
    type: "recurrente",
    rule: { kind: "diaria" },
    createdAt: at(-41, 21, 12),
  });
  const ingles = createActivityEntry({
    ...anaBase,
    title: "Practicar inglés 15 minutos",
    type: "recurrente",
    rule: { kind: "dias", days: [0, 2, 4] },
    createdAt: at(-41, 21, 14),
  });
  const internet = createActivityEntry({
    ...anaBase,
    title: "Pagar el internet",
    type: "recurrente",
    rule: { kind: "mes", day: 10 },
    createdAt: at(-41, 21, 16),
  });
  const leer = createActivityEntry({
    ...anaBase,
    title: "Leer 20 páginas",
    type: "recurrente",
    rule: { kind: "veces", count: 3 },
    createdAt: at(-22, 8),
  });
  createActivityEntry({
    ...anaBase,
    title: "Comprar audífonos nuevos",
    createdAt: at(-37, 9),
    archivedAt: at(-35, 20),
  });
  const informe = createActivityEntry({
    ...anaBase,
    title: "Entregar informe de avance",
    dueDate: today,
    createdAt: at(-6, 9),
  });
  createActivityEntry({
    ...anaBase,
    title: "Renovar el carnet universitario",
    dueDate: day(-3),
    createdAt: at(-9, 10),
  });
  createActivityEntry({
    ...anaBase,
    title: "Preparar la exposición de Auditoría",
    highPriority: true,
    dueDate: day(2),
    createdAt: at(-2, 18),
  });

  const readingsPerWeek = new Map();
  for (const [fromOffset, toOffset] of ANA_STREAKS) {
    for (let offset = fromOffset; offset <= Math.min(toOffset, -1); offset += 1) {
      const currentDay = day(offset);
      const week = getMonday(currentDay);
      const readings = readingsPerWeek.get(week) ?? 0;
      const daily = offset % 2 === 0 ? redux : caminar;
      let routine = daily;
      if (Number(currentDay.slice(8)) === internet.rule.day) routine = internet;
      else if (doesRuleMatchDay(ingles.rule, currentDay)) routine = ingles;
      else if (offset >= -22 && readings < leer.rule.count && offset % 3 !== 0) {
        routine = leer;
        readingsPerWeek.set(week, readings + 1);
      }
      if (offset === ANA_FIRST_CLOSE) {
        [redux, caminar, ingles, internet]
          .filter((act) => doesRuleMatchDay(act.rule, currentDay))
          .forEach((act, order) => fill(act, "ana", offset, at(offset, 20, order)));
        continue;
      }
      fill(routine, "ana", offset, at(offset, 19, 30));
      if (TWO_CELL_DAYS.has(offset)) {
        fill(routine === redux ? caminar : redux, "ana", offset, at(offset, 7, 45));
      }
    }
  }

  fill(redux, "ana", 0, todayAt(0.25));
  fill(caminar, "ana", 0, todayAt(0.5));
  fill(informe, "ana", 0, todayAt(0.75));

  const tablero = createActivityEntry({
    createdBy: idOf("sofia"),
    title: "Revisar el tablero del proyecto",
    type: "recurrente",
    rule: { kind: "diaria" },
    createdAt: at(-30, 9),
  });
  const gimnasio = createActivityEntry({
    createdBy: idOf("luis"),
    title: "Ir al gimnasio",
    type: "recurrente",
    rule: { kind: "dias", days: [0, 2, 4] },
    createdAt: at(-41, 10),
  });
  createActivityEntry({
    createdBy: idOf("luis"),
    title: "Estudiar para el parcial de Redes",
    highPriority: true,
    dueDate: day(5),
    createdAt: at(-3, 15),
  });
  const guitarra = createActivityEntry({
    createdBy: idOf("diego"),
    title: "Practicar guitarra",
    type: "recurrente",
    rule: { kind: "veces", count: 3 },
    createdAt: at(-40, 13),
  });

  for (let offset = -16; offset <= -1; offset += 1) {
    if (offset !== -9) fill(tablero, "sofia", offset, at(offset, 8, 15));
    if (doesRuleMatchDay(gimnasio.rule, day(offset))) {
      fill(gimnasio, "luis", offset, at(offset, 18));
    }
    if (offset % 2 === 0) fill(guitarra, "diego", offset, at(offset, 21));
  }
  fill(tablero, "sofia", 0, todayAt(0.4));

  const feria = hives.feria;
  const feriaItems = [
    ["Elegir el experimento", "luis", -39],
    ["Comprar los materiales", null, -38],
    ["Armar la maqueta", "luis", -37],
    ["Preparar el póster", null, -36],
    ["Presentar en la feria", "luis", -34],
  ];
  feriaItems.forEach(([title, assignee, when], index) => {
    const activity = createActivityEntry({
      createdBy: idOf("luis"),
      hiveId: feria.id,
      assigneeId: idOf(assignee),
      title,
      dueDate: feria.dueDate,
      createdAt: at(-40, 8, 30 + index),
    });
    fill(activity, assignee ?? "diego", when, at(when, 16, index));
  });
  feria.closedAt = at(-34, 16, 4);

  const proyecto = hives.proyecto;
  PROJECT_ACTIVITIES.forEach(([title, assignee, when], index) => {
    const activity = createActivityEntry({
      createdBy: idOf("sofia"),
      hiveId: proyecto.id,
      assigneeId: idOf(assignee),
      title,
      dueDate: title in PROJECT_DUE_DAYS ? day(PROJECT_DUE_DAYS[title]) : null,
      createdAt: at(when, 9, index),
    });
    const completion = PROJECT_COMPLETIONS[index];
    if (completion) {
      const [offset, who] = completion;
      fill(activity, who, offset, at(offset, 20, index));
    }
  });

  const extraRoutines = [
    ["valeria", "Escribir en el diario", { kind: "diaria" }, -15],
    ["tomas", "Correr 5 km", { kind: "dias", days: [1, 3, 5] }, -14],
    ["camila", "Estudiar francés", { kind: "veces", count: 4 }, -14],
  ];
  for (const [who, title, rule, sinceOffset] of extraRoutines) {
    const routine = createActivityEntry({
      createdBy: idOf(who),
      title,
      type: "recurrente",
      rule,
      createdAt: at(sinceOffset - 1, 21),
    });
    for (let offset = sinceOffset; offset <= -1; offset += 1) {
      const matches =
        rule.kind === "veces" ? offset % 2 !== 0 : doesRuleMatchDay(rule, day(offset));
      if (matches && offset !== -6) {
        fill(routine, who, offset, at(offset, 7 + (offset & 3), 20));
      }
    }
  }

  const CLUB_ITEMS = [
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
  CLUB_ITEMS.forEach(([title, assignee, who, when], index) => {
    const activity = createActivityEntry({
      createdBy: idOf("ana"),
      hiveId: hives.club.id,
      assigneeId: idOf(assignee),
      title,
      dueDate: title === "Escribir la reseña del libro" ? day(6) : null,
      createdAt: at(-18, 20, 10 + index),
    });
    if (who) fill(activity, who, when, at(when, 18, index));
  });

  const TRIP_ITEMS = [
    ["Cotizar los pasajes", "luis", "luis", -20],
    ["Abrir la cuenta de ahorro", "ana", "ana", -19],
    ["Vender rifas", "valeria", "valeria", -16],
    ["Reservar el hotel", null, null, null],
    ["Armar el itinerario", "ana", null, null],
    ["Pedir permiso en la universidad", null, null, null],
  ];
  TRIP_ITEMS.forEach(([title, assignee, who, when], index) => {
    const activity = createActivityEntry({
      createdBy: idOf("ana"),
      hiveId: hives.viaje.id,
      assigneeId: idOf(assignee),
      title,
      createdAt: at(-22, 21, 10 + index),
    });
    if (who) fill(activity, who, when, at(when, 17, index));
  });

  const invitations = [
    {
      code: randomBytes(16).toString("base64url"),
      hiveId: proyecto.id,
      createdBy: idOf("sofia"),
      createdAt: at(-1, 10),
      expiresAt: at(6, 10),
    },
    {
      code: randomBytes(16).toString("base64url"),
      hiveId: hives.club.id,
      createdBy: idOf("ana"),
      createdAt: at(-2, 19),
      expiresAt: at(5, 19),
    },
  ];

  return { today, users, hives, memberships, activities, cells, invitations };
}

export async function isDatabaseEmpty(db) {
  return (await countUsers(db)) === 0;
}

export async function clearDemoData(db) {
  const emails = Object.values(DEMO_EMAILS);
  await db.transaction(async (tx) => {
    await deleteUsersByEmails(tx, emails);
  });
}

export async function seedDatabase(
  db,
  { clock = () => Date.now(), reset = false, log = () => {} } = {},
) {
  if (reset) {
    await clearDemoData(db);
  } else {
    const existingAna = await findUserByEmail(db, DEMO_EMAILS.ana);
    if (existingAna) {
      log("La demostración ya estaba cargada. Usa --reiniciar para volver a crearla.");
      return { seeded: false };
    }
  }

  const plan = buildDemoPlan(clock());
  const passwordHashes = await Promise.all(
    Object.keys(plan.users).map(() => hashPassword(DEMO_PASSWORD)),
  );

  await db.transaction(async (tx) => {
    for (const [index, user] of Object.values(plan.users).entries()) {
      await createUser(tx, {
        ...user,
        passwordHash: passwordHashes[index],
        timeZone: DEMO_TIME_ZONE,
      });
      const updated = await updateUser(tx, user.id, {
        dailyGoal: user.dailyGoal,
        onboardedAt: new Date(Date.parse(user.createdAt) + 10 * 60 * 1000).toISOString(),
      });
      await syncSettingsHistory(tx, updated, getLogicalDay(user.createdAt, DEMO_TIME_ZONE));
    }

    for (const hive of Object.values(plan.hives)) {
      await createHive(tx, {
        ...hive,
        ownerId: plan.users[hive.owner].id,
      });
      await updateHive(tx, hive.id, {
        closedAt: hive.closedAt ?? null,
        archivedAt: hive.archivedAt ?? null,
      });
    }

    for (const [hiveKey, userKey, joinedAt] of plan.memberships) {
      await addHiveMember(tx, plan.hives[hiveKey].id, plan.users[userKey].id, joinedAt);
    }

    for (const activity of plan.activities) await saveActivity(tx, activity);
    for (const cell of plan.cells) await insertCell(tx, cell);
    for (const invitation of plan.invitations) await createInvitation(tx, invitation);
  });

  log(
    `Semilla cargada para el ${plan.today}: ${plan.activities.length} actividades y ` +
      `${plan.cells.length} celdas llenas. Entra como ${DEMO_EMAILS.ana} ` +
      `con la contraseña ${DEMO_PASSWORD}.`,
  );
  return { seeded: true, plan };
}

if (import.meta.main) {
  const db = await createDbFromEnv();
  try {
    await runMigrations(db, { log: console.log });
    const reset = process.argv.includes("--reiniciar") || process.argv.includes("--reset");
    await seedDatabase(db, { reset, log: console.log });
  } finally {
    await db.close();
  }
}
