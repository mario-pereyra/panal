-- Desde qué día rigió cada meta y cada día sin flores.
--
-- Sin esta tabla, el motor contaba todo el historial con los ajustes de hoy:
-- bajar la meta cerraba panales de días pasados. Cada tramo rige desde su día
-- hasta el siguiente. La fila de `personas` sigue diciendo lo que rige hoy y
-- lo que espera; los tramos guardan el pasado.

create table tramos_de_ajustes (
  persona_id uuid not null references personas (id) on delete cascade,
  desde date not null,
  meta_diaria smallint not null check (meta_diaria in (3, 5, 7)),
  dia_sin_flores smallint check (dia_sin_flores between 0 and 6),
  primary key (persona_id, desde)
);

-- Las personas que ya existían: no se sabe qué regía antes, así que su primer
-- día lógico (cambia a las 03:00 de su zona) empieza con lo de hoy.
insert into tramos_de_ajustes (persona_id, desde, meta_diaria, dia_sin_flores)
select id, ((creada_en at time zone zona_horaria) - interval '3 hours')::date, meta_diaria, dia_sin_flores
from personas;

-- Y un cambio de meta que espera su día.
insert into tramos_de_ajustes (persona_id, desde, meta_diaria, dia_sin_flores)
select id, meta_cambia_el, meta_siguiente, dia_sin_flores
from personas
where meta_siguiente is not null
on conflict (persona_id, desde) do update set meta_diaria = excluded.meta_diaria;
