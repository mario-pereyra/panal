import { buildUpdateSet } from "../db/client.js";

export const BEE_COLORS_COUNT = 6;

const HIVE_COLUMNS =
  "c.id, c.nombre, c.descripcion, c.fundadora_id, c.entrega_el, c.creada_en, c.cerrada_en, c.archivada_en";

const EDITABLE_HIVE_COLUMNS = [
  "nombre",
  "descripcion",
  "entrega_el",
  "archivada_en",
  "cerrada_en",
  "fundadora_id",
];

const HIVE_COLUMN_MAP = {
  name: "nombre",
  description: "descripcion",
  dueDate: "entrega_el",
  archivedAt: "archivada_en",
  closedAt: "cerrada_en",
  ownerId: "fundadora_id",
};

function mapHiveRow(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    name: row.nombre,
    description: row.descripcion ?? null,
    ownerId: row.fundadora_id,
    dueDate: row.entrega_el ?? null,
    createdAt: new Date(row.creada_en).toISOString(),
    closedAt: row.cerrada_en ? new Date(row.cerrada_en).toISOString() : null,
    archivedAt: row.archivada_en ? new Date(row.archivada_en).toISOString() : null,
  };
}

function mapMemberRow(row) {
  return {
    hiveId: row.colmena_id,
    id: row.id,
    name: row.nombre,
    color: Number(row.color),
    joinedAt: new Date(row.unida_en).toISOString(),
  };
}

export async function findHiveById(db, id) {
  const row = await db.queryOne(`select ${HIVE_COLUMNS} from colmenas c where c.id = $1`, [id]);
  return mapHiveRow(row);
}

export async function findHivesByUser(db, userId) {
  const rows = await db.query(
    `select ${HIVE_COLUMNS}
     from colmenas c join integrantes i on i.colmena_id = c.id
     where i.persona_id = $1 and i.salio_en is null
     order by c.creada_en desc, c.id`,
    [userId],
  );
  return rows.map(mapHiveRow);
}

export async function isHiveMember(db, hiveId, userId) {
  const rows = await db.query(
    "select 1 from integrantes where colmena_id = $1 and persona_id = $2 and salio_en is null",
    [hiveId, userId],
  );
  return rows.length > 0;
}

export async function findHiveMembers(db, hiveIds) {
  if (hiveIds.length === 0) return [];
  const rows = await db.query(
    `select i.colmena_id, p.id, p.nombre, i.color, i.unida_en
     from integrantes i join personas p on p.id = i.persona_id
     where i.colmena_id = any($1::uuid[]) and i.salio_en is null
     order by i.unida_en, p.id`,
    [hiveIds],
  );
  return rows.map(mapMemberRow);
}

export async function findHiveCells(db, hiveIds) {
  if (hiveIds.length === 0) return [];
  const rows = await db.query(
    `select a.colmena_id, a.id as actividad_id, a.asignada_a,
            celda.persona_id as llena_por, celda.llenada_en
     from actividades a
     left join lateral (
       select cl.persona_id, cl.llenada_en from celdas_llenas cl
       where cl.actividad_id = a.id order by cl.llenada_en limit 1
     ) as celda on true
     where a.colmena_id = any($1::uuid[]) and a.archivada_en is null
     order by a.creada_en, a.id`,
    [hiveIds],
  );
  return rows.map((row) => ({
    hiveId: row.colmena_id,
    activityId: row.actividad_id,
    assigneeId: row.asignada_a ?? null,
    filledBy: row.llena_por ?? null,
    filledAt: row.llenada_en ? new Date(row.llenada_en).toISOString() : null,
  }));
}

export async function findHivesForProgress(db, userId) {
  const rows = await db.query(
    `select c.id, c.nombre, c.fundadora_id,
            (select count(*)::int from integrantes otra
             where otra.colmena_id = c.id and otra.persona_id <> c.fundadora_id) as unidas,
            (select count(*)::int from actividades a
             where a.colmena_id = c.id and a.archivada_en is null) as total
     from colmenas c join integrantes i on i.colmena_id = c.id
     where i.persona_id = $1
     order by c.creada_en, c.id`,
    [userId],
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.nombre,
    ownerId: row.fundadora_id,
    joinedCount: Number(row.unidas),
    total: Number(row.total),
  }));
}

export async function findHiveFilledCellsForProgress(db, userId) {
  const rows = await db.query(
    `select a.colmena_id, cl.persona_id, cl.dia, cl.llenada_en
     from celdas_llenas cl
     join actividades a on a.id = cl.actividad_id and a.archivada_en is null
     join integrantes i on i.colmena_id = a.colmena_id and i.persona_id = $1
     order by cl.llenada_en, cl.id`,
    [userId],
  );
  return rows.map((row) => ({
    hiveId: row.colmena_id,
    userId: row.persona_id,
    day: row.dia,
    filledAt: new Date(row.llenada_en).toISOString(),
  }));
}

export async function findHiveContributionsInPeriod(db, hiveIds, from, to) {
  if (hiveIds.length === 0) return [];
  const rows = await db.query(
    `select a.colmena_id, cl.persona_id, count(*)::int as celdas
     from celdas_llenas cl
     join actividades a on a.id = cl.actividad_id and a.archivada_en is null
     where a.colmena_id = any($1::uuid[]) and cl.dia between $2 and $3
     group by a.colmena_id, cl.persona_id`,
    [hiveIds, from, to],
  );
  return rows.map((row) => ({
    hiveId: row.colmena_id,
    userId: row.persona_id,
    cells: Number(row.celdas),
  }));
}

export async function createHive(db, { id, name, description, ownerId, dueDate, createdAt }) {
  await db.query(
    `insert into colmenas (id, nombre, descripcion, fundadora_id, entrega_el, creada_en)
     values ($1, $2, $3, $4, $5, $6)`,
    [id, name, description ?? null, ownerId, dueDate ?? null, createdAt],
  );
}

export async function updateHive(db, id, changes) {
  const dbChanges = {};
  for (const [key, column] of Object.entries(HIVE_COLUMN_MAP)) {
    if (key in changes && changes[key] !== undefined) {
      dbChanges[column] = changes[key];
    }
  }
  const updateSet = buildUpdateSet(EDITABLE_HIVE_COLUMNS, dbChanges);
  if (!updateSet) return;
  await db.query(`update colmenas set ${updateSet.clause} where id = $1`, [
    id,
    ...updateSet.values,
  ]);
}

export async function addHiveMember(db, hiveId, userId, nowIso) {
  const occupied = await db.query(
    "select color from integrantes where colmena_id = $1 and salio_en is null and persona_id <> $2",
    [hiveId, userId],
  );
  const usedColors = new Set(occupied.map((row) => Number(row.color)));
  const availableColor = Array.from({ length: BEE_COLORS_COUNT }, (_, color) => color).find(
    (color) => !usedColors.has(color),
  );
  const color = availableColor ?? occupied.length % BEE_COLORS_COUNT;
  await db.query(
    `insert into integrantes (colmena_id, persona_id, color, unida_en) values ($1, $2, $3, $4)
     on conflict (colmena_id, persona_id) do update set color = $3, unida_en = $4, salio_en = null`,
    [hiveId, userId, color, nowIso],
  );
}

export async function removeHiveMember(db, hiveId, userId, nowIso) {
  await db.query(
    "update integrantes set salio_en = $3 where colmena_id = $1 and persona_id = $2 and salio_en is null",
    [hiveId, userId, nowIso],
  );
}

export async function findActiveInvitation(db, hiveId, nowIso) {
  const row = await db.queryOne(
    `select codigo, vence_en from invitaciones
     where colmena_id = $1 and anulada_en is null and vence_en > $2
     order by creada_en desc limit 1`,
    [hiveId, nowIso],
  );
  if (!row) return undefined;
  return {
    code: row.codigo,
    expiresAt: new Date(row.vence_en).toISOString(),
  };
}

export async function createInvitation(db, { code, hiveId, createdBy, createdAt, expiresAt }) {
  await db.query(
    "update invitaciones set anulada_en = $2 where colmena_id = $1 and anulada_en is null",
    [hiveId, createdAt],
  );
  await db.query(
    `insert into invitaciones (codigo, colmena_id, creada_por, creada_en, vence_en)
     values ($1, $2, $3, $4, $5)`,
    [code, hiveId, createdBy, createdAt, expiresAt],
  );
}

export async function revokeInvitations(db, hiveId, nowIso) {
  await db.query(
    "update invitaciones set anulada_en = $2 where colmena_id = $1 and anulada_en is null",
    [hiveId, nowIso],
  );
}

export async function findInvitationByCode(db, code) {
  const row = await db.queryOne(
    `select inv.codigo, inv.colmena_id, c.nombre as colmena_nombre,
            c.descripcion as colmena_descripcion, c.archivada_en as colmena_archivada_en,
            (select count(*)::int from integrantes i
             where i.colmena_id = c.id and i.salio_en is null) as abejas,
            p.nombre as invita, inv.vence_en, inv.anulada_en
     from invitaciones inv
     join colmenas c on c.id = inv.colmena_id
     join personas p on p.id = inv.creada_por
     where inv.codigo = $1`,
    [code],
  );
  if (!row) return undefined;
  return {
    code: row.codigo,
    hiveId: row.colmena_id,
    hiveName: row.colmena_nombre,
    hiveDescription: row.colmena_descripcion ?? null,
    hiveArchivedAt: row.colmena_archivada_en
      ? new Date(row.colmena_archivada_en).toISOString()
      : null,
    memberCount: Number(row.abejas),
    invitedByName: row.invita,
    expiresAt: new Date(row.vence_en).toISOString(),
    revokedAt: row.anulada_en ? new Date(row.anulada_en).toISOString() : null,
  };
}
