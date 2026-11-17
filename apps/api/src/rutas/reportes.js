import { dia as esquemaDeDia, periodoDeReporte } from "@panal/contratos";
import { agruparPor, diasEntre, sumarDias, tocaHoy, vivaEl } from "@panal/motor";
import { Hono } from "hono";
import { aportesEnPeriodo, colmenasDePersona, integrantesDe } from "../datos/colmenas.js";
import { validar } from "../errores.js";
import { exigirSesion, personaDe } from "../seguridad/sesion.js";
import { integranteDe } from "../servicios/formatos.js";
import { hechosDe } from "../servicios/progreso.js";

/** Días de la tira de cada ronda. */
const DIAS_DE_LA_TIRA = 7;

/**
 * `GET /api/reportes?desde=&hasta=`. Sin periodo, los últimos siete días.
 * @param {import("../app.js").Contexto} contexto
 */
export function rutasDeReportes({ base, reloj }) {
  const rutas = new Hono();

  rutas.get("/reportes", exigirSesion, async (c) => {
    const persona = personaDe(c);
    const hechos = await hechosDe(base, persona, reloj());
    const { hoy } = hechos;
    const consulta = c.req.query();
    const hasta =
      consulta.hasta === undefined
        ? hoy
        : validar(esquemaDeDia, consulta.hasta, { campo: "hasta" });
    const { desde } = validar(periodoDeReporte, {
      desde: consulta.desde ?? sumarDias(hasta, -(DIAS_DE_LA_TIRA - 1)),
      hasta,
    });

    // Los días del periodo que ya pasaron o son hoy: el futuro no tiene celdas.
    const fin = hasta < hoy ? hasta : hoy;
    const delPeriodo = (dia, inicio = desde, final = hasta) => dia >= inicio && dia <= final;
    const porDia = agruparPor(hechos.celdas, (celda) => celda.dia);

    const celdasPorDia = [...diasEntre(desde, fin)].map((dia) => ({
      dia,
      llenas: porDia.get(dia)?.length ?? 0,
    }));

    const largo = [...diasEntre(desde, hasta)].length;
    const periodoAnterior = hechos.celdas.filter((celda) =>
      delPeriodo(celda.dia, sumarDias(desde, -largo), sumarDias(desde, -1)),
    ).length;

    // Las rondas: cada recurrente activa, con su tira de los siete días que terminan
    // en el último día del periodo, aunque empiecen antes: así se comparan semanas enteras.
    const inicioDeLaTira = sumarDias(fin, -(DIAS_DE_LA_TIRA - 1));
    const diasDeLaTira = [...diasEntre(inicioDeLaTira, fin)];
    const hechosPorActividad = agruparPor(hechos.celdas, (celda) => celda.actividad_id);
    const rondas = hechos.actividades
      .filter(
        ({ actividad, delPanal }) =>
          delPanal && actividad.tipo === "recurrente" && !actividad.archivadaEl,
      )
      .map(({ actividad }) => {
        const suyos = hechosPorActividad.get(actividad.id) ?? [];
        const dias = diasDeLaTira.map((dia) => ({
          dia,
          tocaba: vivaEl(actividad, dia) && tocaHoy(actividad, actividad.regla, suyos, dia).toca,
          llena: suyos.some((hecho) => hecho.dia === dia),
        }));
        const tocaban = dias.filter((dia) => dia.tocaba);
        const cumplidas = tocaban.filter((dia) => dia.llena).length;
        return {
          actividadId: actividad.id,
          titulo: actividad.titulo,
          dias,
          porcentaje: tocaban.length > 0 ? Math.round((cumplidas * 100) / tocaban.length) : 0,
        };
      });

    const tipoDe = new Map(
      hechos.actividades.map(({ actividad }) => [actividad.id, actividad.tipo]),
    );
    const enElPeriodo = hechos.celdas.filter((celda) => delPeriodo(celda.dia));
    const reparto = {
      unicas: enElPeriodo.filter((celda) => tipoDe.get(celda.actividad_id) === "unica").length,
      recurrentes: enElPeriodo.filter((celda) => tipoDe.get(celda.actividad_id) === "recurrente")
        .length,
    };

    const colmenas = (await colmenasDePersona(base, persona.id)).filter(
      (colmena) => !colmena.archivada_en,
    );
    const ids = colmenas.map((colmena) => colmena.id);
    const integrantes = await integrantesDe(base, ids);
    const aportes = await aportesEnPeriodo(base, ids, desde, hasta);
    const celdasDe = (colmenaId, personaId) =>
      aportes.find((aporte) => aporte.colmena_id === colmenaId && aporte.persona_id === personaId)
        ?.celdas ?? 0;

    return c.json({
      desde,
      hasta,
      hoy,
      celdasPorDia,
      periodoAnterior,
      rondas,
      reparto,
      colmenas: colmenas.map((colmena) => ({
        id: colmena.id,
        nombre: colmena.nombre,
        aportes: integrantes
          .filter((integrante) => integrante.colmena_id === colmena.id)
          .map((integrante) => ({
            ...integranteDe(integrante),
            celdas: celdasDe(colmena.id, integrante.id),
          }))
          .sort((a, b) => b.celdas - a.celdas),
      })),
    });
  });

  return rutas;
}
