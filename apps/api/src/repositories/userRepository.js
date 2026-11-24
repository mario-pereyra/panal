import { buildUpdateSet } from "../db/client.js";

const USER_COLUMNS = [
  "id",
  "nombre",
  "correo",
  "clave_hash",
  "meta_diaria",
  "meta_siguiente",
  "meta_cambia_el",
  "zona_horaria",
  "dia_sin_flores",
  "invernada_desde",
  "invernada_hasta",
  "primer_vuelo_en",
  "creada_en",
];

const PREFIXED_USER_COLUMNS = USER_COLUMNS.map((col) => `p.${col}`).join(", ");
const RETURNING_USER = `returning ${USER_COLUMNS.join(", ")}`;

const EDITABLE_USER_COLUMNS = [
  "nombre",
  "meta_diaria",
  "meta_siguiente",
  "meta_cambia_el",
  "zona_horaria",
  "dia_sin_flores",
  "invernada_desde",
  "invernada_hasta",
  "primer_vuelo_en",
];

const USER_COLUMN_MAP = {
  name: "nombre",
  dailyGoal: "meta_diaria",
  nextGoal: "meta_siguiente",
  goalChangesOn: "meta_cambia_el",
  timeZone: "zona_horaria",
  restDay: "dia_sin_flores",
  pauseFrom: "invernada_desde",
  pauseTo: "invernada_hasta",
  onboardedAt: "primer_vuelo_en",
};

function mapUserRow(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    name: row.nombre,
    email: row.correo,
    passwordHash: row.clave_hash,
    dailyGoal: Number(row.meta_diaria),
    nextGoal: row.meta_siguiente != null ? Number(row.meta_siguiente) : null,
    goalChangesOn: row.meta_cambia_el ?? null,
    timeZone: row.zona_horaria,
    restDay: row.dia_sin_flores != null ? Number(row.dia_sin_flores) : null,
    pauseFrom: row.invernada_desde ?? null,
    pauseTo: row.invernada_hasta ?? null,
    onboardedAt: row.primer_vuelo_en ? new Date(row.primer_vuelo_en).toISOString() : null,
    createdAt: new Date(row.creada_en).toISOString(),
    ...(row.sesion_vence_en
      ? { sessionExpiresAt: new Date(row.sesion_vence_en).toISOString() }
      : {}),
  };
}

export async function findUserByEmail(db, email) {
  const row = await db.queryOne(
    `select ${PREFIXED_USER_COLUMNS} from personas p where p.correo = $1`,
    [email],
  );
  return mapUserRow(row);
}

export async function findUserById(db, id) {
  const row = await db.queryOne(`select ${PREFIXED_USER_COLUMNS} from personas p where p.id = $1`, [
    id,
  ]);
  return mapUserRow(row);
}

export async function createUser(db, { id, name, email, passwordHash, createdAt, timeZone }) {
  const row = await db.queryOne(
    `insert into personas (id, nombre, correo, clave_hash, creada_en, zona_horaria)
     values ($1, $2, $3, $4, $5, coalesce($6, 'America/La_Paz'))
     ${RETURNING_USER}`,
    [id, name, email, passwordHash, createdAt, timeZone ?? null],
  );
  return mapUserRow(row);
}

export async function updateUser(db, id, changes) {
  const dbChanges = {};
  for (const [key, column] of Object.entries(USER_COLUMN_MAP)) {
    if (key in changes && changes[key] !== undefined) {
      dbChanges[column] = changes[key];
    }
  }
  const updateSet = buildUpdateSet(EDITABLE_USER_COLUMNS, dbChanges);
  if (!updateSet) return findUserById(db, id);
  const row = await db.queryOne(
    `update personas set ${updateSet.clause} where id = $1 ${RETURNING_USER}`,
    [id, ...updateSet.values],
  );
  return mapUserRow(row);
}

export async function findSettingsHistory(db, userId) {
  const rows = await db.query(
    `select desde, meta_diaria, dia_sin_flores from tramos_de_ajustes
     where persona_id = $1 order by desde`,
    [userId],
  );
  return rows.map((row) => ({
    from: row.desde,
    dailyGoal: Number(row.meta_diaria),
    restDay: row.dia_sin_flores != null ? Number(row.dia_sin_flores) : null,
  }));
}

export async function replaceSettingsHistoryFrom(db, userId, fromDay, entries) {
  await db.query("delete from tramos_de_ajustes where persona_id = $1 and desde >= $2", [
    userId,
    fromDay,
  ]);
  for (const entry of entries) {
    await db.query(
      `insert into tramos_de_ajustes (persona_id, desde, meta_diaria, dia_sin_flores)
       values ($1, $2, $3, $4)`,
      [userId, entry.from, entry.dailyGoal, entry.restDay],
    );
  }
}

export async function createSession(db, { idHash, userId, createdAt, expiresAt }) {
  await db.query(
    "insert into sesiones (id_hash, persona_id, creada_en, vence_en) values ($1, $2, $3, $4)",
    [idHash, userId, createdAt, expiresAt],
  );
}

export async function findUserBySession(db, idHash, nowIso) {
  const row = await db.queryOne(
    `select ${PREFIXED_USER_COLUMNS}, s.vence_en as sesion_vence_en
     from sesiones s join personas p on p.id = s.persona_id
     where s.id_hash = $1 and s.vence_en > $2`,
    [idHash, nowIso],
  );
  return mapUserRow(row);
}

export async function renewSession(db, idHash, expiresAt) {
  await db.query("update sesiones set vence_en = $2 where id_hash = $1", [idHash, expiresAt]);
}

export async function deleteSession(db, idHash) {
  await db.query("delete from sesiones where id_hash = $1", [idHash]);
}

export async function findRecentFailedLogins(db, email, sinceIso, limit) {
  const rows = await db.query(
    `select fallido_en from intentos_fallidos
     where correo = $1 and fallido_en > $2
     order by fallido_en desc
     limit $3`,
    [email, sinceIso, limit],
  );
  return rows.map((row) => new Date(row.fallido_en).toISOString());
}

export async function insertFailedLogin(db, email, nowIso, expiredBeforeIso) {
  await db.query("delete from intentos_fallidos where fallido_en <= $1", [expiredBeforeIso]);
  await db.query("insert into intentos_fallidos (correo, fallido_en) values ($1, $2)", [
    email,
    nowIso,
  ]);
}

export async function deleteFailedLogins(db, email) {
  await db.query("delete from intentos_fallidos where correo = $1", [email]);
}

export async function countUsers(db) {
  const row = await db.queryOne("select count(*)::int as count from personas");
  return row?.count ?? 0;
}

export async function deleteUsersByEmails(db, emails) {
  await db.query("delete from personas where correo = any($1::text[])", [emails]);
  await db.query("delete from intentos_fallidos where correo = any($1::text[])", [emails]);
}
