function mapCellRow(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    activityId: row.actividad_id,
    userId: row.persona_id,
    day: row.dia,
    filledAt: new Date(row.llenada_en).toISOString(),
  };
}

export async function findCellById(db, id) {
  const row = await db.queryOne(
    "select id, actividad_id, persona_id, dia, llenada_en from celdas_llenas where id = $1",
    [id],
  );
  return mapCellRow(row);
}

export async function isActivityFilled(db, activityId, day) {
  const rows = await db.query(
    "select 1 from celdas_llenas where actividad_id = $1 and ($2::date is null or dia = $2::date) limit 1",
    [activityId, day],
  );
  return rows.length > 0;
}

export async function insertCell(db, { id, activityId, userId, day, filledAt }) {
  await db.query(
    "insert into celdas_llenas (id, actividad_id, persona_id, dia, llenada_en) values ($1, $2, $3, $4, $5)",
    [id, activityId, userId, day, filledAt],
  );
}

export async function deleteCell(db, id) {
  await db.query("delete from celdas_llenas where id = $1", [id]);
}

export async function findCellsByUser(db, userId) {
  const rows = await db.query(
    `select id, actividad_id, persona_id, dia, llenada_en from celdas_llenas
     where persona_id = $1 order by llenada_en, id`,
    [userId],
  );
  return rows.map(mapCellRow);
}

export async function findFilledCellsByHive(db, hiveId) {
  const rows = await db.query(
    `select cl.id, cl.actividad_id, cl.persona_id, cl.dia, cl.llenada_en
     from celdas_llenas cl
     join actividades a on a.id = cl.actividad_id
     where a.colmena_id = $1 and a.archivada_en is null
     order by cl.llenada_en, cl.id`,
    [hiveId],
  );
  return rows.map(mapCellRow);
}
