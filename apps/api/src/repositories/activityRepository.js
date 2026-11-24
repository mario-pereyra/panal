function mapRule(row) {
  switch (row.clase) {
    case "diaria":
      return { kind: "diaria" };
    case "dias":
      return { kind: "dias", days: [...row.dias].map(Number).sort((a, b) => a - b) };
    case "veces":
      return { kind: "veces", count: Number(row.veces) };
    case "mes":
      return { kind: "mes", day: Number(row.dia_mes) };
    default:
      return null;
  }
}

function mapActivityRow(row) {
  if (!row) return undefined;
  return {
    id: row.id,
    title: row.titulo,
    type: row.tipo,
    highPriority: Boolean(row.prioridad_alta),
    priority: row.prioridad_alta ? "high" : "normal",
    dueDate: row.vence_el ?? null,
    hiveId: row.colmena_id ?? null,
    hiveName: row.colmena_nombre ?? null,
    hiveArchivedAt: row.colmena_archivada_en
      ? new Date(row.colmena_archivada_en).toISOString()
      : null,
    hiveOwnerId: row.colmena_fundadora_id ?? null,
    assigneeId: row.asignada_a ?? null,
    createdBy: row.creada_por,
    createdAt: new Date(row.creada_en).toISOString(),
    archivedAt: row.archivada_en ? new Date(row.archivada_en).toISOString() : null,
    rule: mapRule(row),
    firstFilledDay: row.primera_llena_el ?? null,
    latestCellId: row.ultima_celda_id ?? null,
    latestCellDay: row.ultima_celda_dia ?? null,
    ...(row.del_panal !== undefined ? { inHoneycomb: Boolean(row.del_panal) } : {}),
    ...(row.celda_id !== undefined
      ? {
          cellId: row.celda_id ?? null,
          filledBy: row.llena_por ?? null,
          filledDay: row.llenada_el ?? null,
        }
      : {}),
  };
}

function buildSelectQuery({ extraColumns = "", extraJoins = "" } = {}) {
  return `
    select a.id, a.titulo, a.tipo, a.prioridad_alta, a.vence_el, a.colmena_id,
           c.nombre as colmena_nombre, c.archivada_en as colmena_archivada_en,
           c.fundadora_id as colmena_fundadora_id,
           a.asignada_a, a.creada_por, a.creada_en, a.archivada_en,
           r.clase, r.dias, r.veces, r.dia_mes,
           (select min(cl.dia) from celdas_llenas cl where cl.actividad_id = a.id) as primera_llena_el,
           ultima.id as ultima_celda_id,
           ultima.dia as ultima_celda_dia
           ${extraColumns}
    from actividades a
    left join colmenas c on c.id = a.colmena_id
    left join repeticiones r on r.actividad_id = a.id
    left join lateral (
      select cl.id, cl.dia from celdas_llenas cl
      where cl.actividad_id = a.id
      order by cl.dia desc, cl.llenada_en desc, cl.id desc
      limit 1
    ) as ultima on true
    ${extraJoins}
  `;
}

const ORDER_BY = "order by a.creada_en, a.id";

export async function findActivityById(db, id) {
  const row = await db.queryOne(`${buildSelectQuery()} where a.id = $1`, [id]);
  return mapActivityRow(row);
}

export async function findActivitiesForProgress(db, userId) {
  const rows = await db.query(
    `${buildSelectQuery({
      extraColumns: `, coalesce((a.colmena_id is null and a.creada_por = $1) or a.asignada_a = $1, false) as del_panal`,
    })}
     where (a.colmena_id is null and a.creada_por = $1)
        or a.asignada_a = $1
        or exists (select 1 from celdas_llenas cl where cl.actividad_id = a.id and cl.persona_id = $1)
     ${ORDER_BY}`,
    [userId],
  );
  return rows.map(mapActivityRow);
}

export async function findVisibleActivities(db, userId) {
  const rows = await db.query(
    `${buildSelectQuery()}
     where (a.colmena_id is null and a.creada_por = $1)
        or a.colmena_id in (
          select i.colmena_id from integrantes i where i.persona_id = $1 and i.salio_en is null
        )
     ${ORDER_BY}`,
    [userId],
  );
  return rows.map(mapActivityRow);
}

export async function findHiveActivities(db, hiveId) {
  const rows = await db.query(
    `${buildSelectQuery({
      extraColumns:
        ", celda.id as celda_id, celda.persona_id as llena_por, celda.dia as llenada_el",
      extraJoins: `left join lateral (
                    select cl.id, cl.persona_id, cl.dia from celdas_llenas cl
                    where cl.actividad_id = a.id order by cl.llenada_en limit 1
                  ) as celda on true`,
    })}
     where a.colmena_id = $1 and a.archivada_en is null
     ${ORDER_BY}`,
    [hiveId],
  );
  return rows.map(mapActivityRow);
}

export async function saveActivity(db, activity) {
  await db.query(
    `insert into actividades
       (id, creada_por, colmena_id, asignada_a, titulo, tipo, prioridad_alta, vence_el, creada_en, archivada_en)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     on conflict (id) do update set
       colmena_id = excluded.colmena_id,
       asignada_a = excluded.asignada_a,
       titulo = excluded.titulo,
       tipo = excluded.tipo,
       prioridad_alta = excluded.prioridad_alta,
       vence_el = excluded.vence_el,
       archivada_en = excluded.archivada_en`,
    [
      activity.id,
      activity.createdBy,
      activity.hiveId,
      activity.assigneeId,
      activity.title,
      activity.type,
      Boolean(activity.highPriority),
      activity.dueDate,
      activity.createdAt,
      activity.archivedAt ?? null,
    ],
  );
  await db.query("delete from repeticiones where actividad_id = $1", [activity.id]);
  const { rule } = activity;
  if (rule) {
    await db.query(
      "insert into repeticiones (actividad_id, clase, dias, veces, dia_mes) values ($1, $2, $3, $4, $5)",
      [
        activity.id,
        rule.kind,
        rule.kind === "dias" ? rule.days : null,
        rule.kind === "veces" ? rule.count : null,
        rule.kind === "mes" ? rule.day : null,
      ],
    );
  }
}

export async function countPendingHighPriority(db, userId, excludeId = null) {
  const row = await db.queryOne(
    `select count(*)::int as count
     from actividades a
     left join colmenas c on c.id = a.colmena_id
     where a.tipo = 'unica' and a.prioridad_alta and a.archivada_en is null and c.archivada_en is null
       and ($2::uuid is null or a.id <> $2::uuid)
       and ((a.colmena_id is null and a.creada_por = $1) or a.asignada_a = $1)
       and not exists (select 1 from celdas_llenas cl where cl.actividad_id = a.id)`,
    [userId, excludeId],
  );
  return row?.count ?? 0;
}

export async function unassignPendingActivities(db, hiveId, userId) {
  await db.query(
    `update actividades a set asignada_a = null
     where a.colmena_id = $1 and a.asignada_a = $2
       and not exists (select 1 from celdas_llenas cl where cl.actividad_id = a.id)`,
    [hiveId, userId],
  );
}
