-- Esquema inicial de Panal.
--
-- Solo se guardan hechos: personas, actividades, celdas llenas, colmenas e
-- invitaciones. Las gotas, la racha, el oficio, los sellos y el avance de cada
-- colmena no tienen columna: los calcula el motor al leer.
--
-- Los instantes van en timestamptz (UTC). Los días lógicos de Panal, que
-- cambian a las 03:00 de la zona de cada persona, van en date.

create table personas (
  id uuid primary key,
  nombre text not null check (char_length(nombre) between 1 and 40),
  correo text not null unique check (correo = lower(correo)),
  clave_hash text not null,
  meta_diaria smallint not null default 5 check (meta_diaria in (3, 5, 7)),
  -- Un cambio de meta rige desde el día lógico siguiente: aquí espera hasta entonces.
  meta_siguiente smallint check (meta_siguiente in (3, 5, 7)),
  meta_cambia_el date,
  zona_horaria text not null default 'America/La_Paz',
  -- 0 es lunes y 6, domingo, como en el motor.
  dia_sin_flores smallint check (dia_sin_flores between 0 and 6),
  invernada_desde date,
  invernada_hasta date,
  primer_vuelo_en timestamptz,
  creada_en timestamptz not null,
  check ((meta_siguiente is null) = (meta_cambia_el is null)),
  check ((invernada_desde is null) = (invernada_hasta is null)),
  check (invernada_desde is null or invernada_desde <= invernada_hasta)
);

-- La sesión viaja en una cookie; aquí solo queda el SHA-256 de su identificador.
create table sesiones (
  id_hash text primary key,
  persona_id uuid not null references personas (id) on delete cascade,
  creada_en timestamptz not null,
  vence_en timestamptz not null
);

create index sesiones_persona on sesiones (persona_id);

-- Entradas fallidas recientes, para limitar los intentos por correo.
create table intentos_fallidos (
  correo text not null,
  fallido_en timestamptz not null
);

create index intentos_fallidos_correo on intentos_fallidos (correo, fallido_en);

create table colmenas (
  id uuid primary key,
  nombre text not null check (char_length(nombre) between 1 and 60),
  descripcion text check (char_length(descripcion) <= 280),
  fundadora_id uuid not null references personas (id) on delete cascade,
  entrega_el date,
  creada_en timestamptz not null,
  -- Se fija al llegar al 100 % y se borra si la colmena vuelve a bajar.
  cerrada_en timestamptz,
  archivada_en timestamptz
);

create table integrantes (
  colmena_id uuid not null references colmenas (id) on delete cascade,
  persona_id uuid not null references personas (id) on delete cascade,
  -- Posición en la paleta de abejas: el menor índice libre al llegar.
  color smallint not null check (color between 0 and 5),
  unida_en timestamptz not null,
  -- Nulo mientras siga dentro. Sus celdas llenas se conservan al salir.
  salio_en timestamptz,
  primary key (colmena_id, persona_id)
);

create index integrantes_persona on integrantes (persona_id);

-- El código va en claro: la pantalla "Invitar" vuelve a mostrar el enlace.
-- Son 128 bits aleatorios, así que no se puede adivinar.
create table invitaciones (
  codigo text primary key,
  colmena_id uuid not null references colmenas (id) on delete cascade,
  creada_por uuid not null references personas (id) on delete cascade,
  creada_en timestamptz not null,
  vence_en timestamptz not null,
  anulada_en timestamptz
);

create index invitaciones_colmena on invitaciones (colmena_id);

create table actividades (
  -- Lo crea el navegador: repetir el mismo envío no duplica nada.
  id uuid primary key,
  creada_por uuid not null references personas (id) on delete cascade,
  colmena_id uuid references colmenas (id) on delete cascade,
  asignada_a uuid references personas (id) on delete set null,
  titulo text not null check (char_length(titulo) between 1 and 80),
  tipo text not null check (tipo in ('unica', 'recurrente')),
  prioridad_alta boolean not null default false,
  vence_el date,
  archivada_en timestamptz,
  -- También sirve para la regla de las celdas relámpago.
  creada_en timestamptz not null,
  -- La fecha, la prioridad alta y la colmena son solo para las únicas.
  check (tipo = 'unica' or (not prioridad_alta and vence_el is null and colmena_id is null)),
  -- Solo se asignan las actividades de una colmena.
  check (asignada_a is null or colmena_id is not null)
);

create index actividades_creada_por on actividades (creada_por);
create index actividades_asignada_a on actividades (asignada_a);
create index actividades_colmena on actividades (colmena_id);

-- Una fila por actividad recurrente: cada cuánto se repite.
create table repeticiones (
  actividad_id uuid primary key references actividades (id) on delete cascade,
  clase text not null check (clase in ('diaria', 'dias', 'veces', 'mes')),
  -- 0 es lunes y 6, domingo.
  dias smallint[] check (dias is null or (dias <@ array[0, 1, 2, 3, 4, 5, 6]::smallint[] and cardinality(dias) between 1 and 7)),
  veces smallint check (veces between 1 and 6),
  dia_mes smallint check (dia_mes between 1 and 31),
  check (
    (clase = 'diaria' and dias is null and veces is null and dia_mes is null)
    or (clase = 'dias' and dias is not null and veces is null and dia_mes is null)
    or (clase = 'veces' and veces is not null and dias is null and dia_mes is null)
    or (clase = 'mes' and dia_mes is not null and dias is null and veces is null)
  )
);

-- El registro de hechos: la tabla más importante.
create table celdas_llenas (
  -- Lo crea el navegador: repetir el mismo envío no duplica nada.
  id uuid primary key,
  actividad_id uuid not null references actividades (id) on delete cascade,
  -- Quien la llenó.
  persona_id uuid not null references personas (id) on delete cascade,
  -- Día lógico, calculado por el servidor con su propio reloj.
  dia date not null,
  llenada_en timestamptz not null,
  -- Una actividad se llena una sola vez por día, sea quien sea. Su índice
  -- empieza por actividad_id, así que también sirve para buscar por actividad.
  unique (actividad_id, dia)
);

create index celdas_llenas_persona_dia on celdas_llenas (persona_id, dia);
