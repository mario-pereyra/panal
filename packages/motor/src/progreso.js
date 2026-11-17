import { agruparPor, programadasEl } from "./actividades.js";
import { CUADROS_POR_COLMENA, cuadrosDeColmena } from "./colmena.js";
import { cuotasCumplidas, seriesDeCuotas } from "./cuotas.js";
import { sumarDias } from "./dia.js";
import { GOTAS, valorarDia } from "./gotas.js";
import { oficioDe } from "./oficios.js";
import { resumenDelDia } from "./resumen.js";
import { sellosDe } from "./sellos.js";
import { avanzarDia, gotasDelVuelo, rachaParaHoy, recorrerVuelo } from "./vuelo.js";

/**
 * El progreso de una persona: todo lo que se calcula a partir de sus hechos.
 *
 * Es la función que usa el servidor como autoridad. Recibe la lista de celdas
 * que llenó, sus actividades y sus colmenas, y deduce el resto: el valor de
 * cada celda, la racha, las reservas, las gotas, el oficio, los sellos y el
 * avance de cada colmena. No hay nada guardado aparte que se pueda desincronizar.
 */

/** Hora local antes de la cual una celda cuenta para el sello "Madrugadora". */
export const HORA_MADRUGADORA = 7;

/**
 * Los días entre dos fechas, ambos incluidos.
 * @param {string} desde
 * @param {string} hasta
 * @returns {Generator<string>}
 */
export function* diasEntre(desde, hasta) {
  for (let dia = desde; dia <= hasta; dia = sumarDias(dia, 1)) yield dia;
}

/**
 * @typedef {object} CeldaLlena
 * @property {string} id
 * @property {string} actividadId
 * @property {string} dia Día lógico, calculado por el servidor.
 * @property {string} [llenadaEn] Instante.
 * @property {number} [horaLocal] Hora local en que se llenó.
 *
 * @typedef {object} ColmenaParaProgreso
 * @property {string} id
 * @property {string} nombre
 * @property {string} fundadoraId
 * @property {number} unidas Otras abejas que se unieron, sin contar a la fundadora.
 * @property {number} total Actividades activas de la colmena.
 * @property {Array<{ personaId: string, dia: string, llenadaEn?: string }>} llenas Todas sus celdas llenas.
 *
 * @typedef {object} EntradaDeProgreso
 * @property {string} personaId
 * @property {string} hoy
 * @property {string} [desde] Día en que empezó la cuenta.
 * @property {import("./dia.js").Ajustes} ajustes Con `historial`, cada día se cuenta con los ajustes de entonces.
 * @property {import("./actividades.js").Actividad[]} actividades Las del panal de la persona, también las archivadas.
 * @property {import("./actividades.js").Actividad[]} [otras] Actividades que llenó sin ser de su panal, como las libres de una colmena.
 * @property {CeldaLlena[]} celdas Todas las que llenó la persona.
 * @property {ColmenaParaProgreso[]} [colmenas]
 */

/**
 * @param {EntradaDeProgreso} entrada
 */
export function progresoDe(entrada) {
  const { personaId, hoy, ajustes, actividades, otras = [], celdas, colmenas = [] } = entrada;
  const porId = new Map([...otras, ...actividades].map((actividad) => [actividad.id, actividad]));

  // 1. El valor de cada celda, día por día y en orden de llegada.
  const porDia = agruparPor(celdas, (celda) => celda.dia);
  const valoradas = [...porDia.values()].flatMap((delDia) => valorarDia(delDia, porId));
  const valoradasPorDia = agruparPor(valoradas, (celda) => celda.dia);

  // 2. Una jornada por día desde que empezó la cuenta, y el vuelo que resulta.
  const hechosPorActividad = agruparPor(celdas, (celda) => celda.actividadId);
  const primerDia = [entrada.desde ?? hoy, ...porDia.keys()].reduce((menor, dia) =>
    dia < menor ? dia : menor,
  );
  const jornadas = [...diasEntre(primerDia, hoy)].map((dia) => {
    const programadas = programadasEl(actividades, hechosPorActividad, dia);
    const resumen = resumenDelDia(
      { celdas: valoradasPorDia.get(dia) ?? [], programadas },
      ajustes,
      dia,
    );
    return {
      dia,
      llenas: resumen.llenas,
      programadas,
      cerrado: resumen.cerrado,
      descanso: resumen.descanso,
      terminado: dia < hoy,
      resumen,
    };
  });
  const jornadaDeHoy = jornadas[jornadas.length - 1];
  const vueloHastaAyer = recorrerVuelo(jornadas.slice(0, -1));
  const vuelo = avanzarDia(vueloHastaAyer, jornadaDeHoy);

  // 3. Bonos que no dependen del día: cuotas semanales y cuadros de colmena.
  const recurrentes = actividades.filter((actividad) => actividad.tipo === "recurrente");
  const cuotas = recurrentes.map((actividad) =>
    cuotasCumplidas(actividad, hechosPorActividad.get(actividad.id) ?? []),
  );
  const cuotasHechas = cuotas.flat();
  const series = cuotas.map(seriesDeCuotas);
  const mejorSerie = series.reduce((mejor, serie) => (serie.mejor > mejor.mejor ? serie : mejor), {
    mejor: 0,
    alcanzada: {},
  });

  const deColmenas = colmenas.map((colmena) => {
    const { cuadros, bonos } = cuadrosDeColmena(colmena.llenas, colmena.total);
    const llenas = Math.min(colmena.llenas.length, colmena.total);
    return {
      colmena,
      cuadros,
      bonos: bonos.filter((bono) => bono.personaId === personaId),
      cuadro: colmena.total > 0 ? Math.floor((llenas * CUADROS_POR_COLMENA) / colmena.total) : 0,
      cerrada: colmena.total > 0 && llenas >= colmena.total,
      // Los logros de una colmena son de quien aportó al menos una celda.
      aporto: colmena.llenas.some((celda) => celda.personaId === personaId),
    };
  });
  const conAporte = deColmenas.filter((resultado) => resultado.aporto);
  const bonosDeColmena = deColmenas.flatMap((resultado) => resultado.bonos);

  // 4. Las gotas: las de las celdas más todos los bonos.
  const suma = (lista, valor) => lista.reduce((total, elemento) => total + valor(elemento), 0);
  const desglose = {
    celdas: suma(valoradas, (celda) => celda.gotas),
    cierres: vuelo.panalesCerrados * GOTAS.cierreDelPanal,
    hitos: vuelo.hitos * GOTAS.hitoDeRacha,
    cuotas: cuotasHechas.length * GOTAS.cuotaSemanal,
    colmenas: suma(bonosDeColmena, (bono) => bono.gotas),
  };
  const total = Object.values(desglose).reduce((a, b) => a + b, 0);

  const bonosDeHoy =
    cuotasHechas.filter((cuota) => cuota.dia === hoy).length * GOTAS.cuotaSemanal +
    suma(
      bonosDeColmena.filter((bono) => bono.dia === hoy),
      (bono) => bono.gotas,
    );
  const deHoy =
    jornadaDeHoy.resumen.gotasDeCeldas +
    gotasDelVuelo(vuelo) -
    gotasDelVuelo(vueloHastaAyer) +
    bonosDeHoy;

  // 5. Sellos de cera.
  const conVencimiento = valoradas.filter((celda) => {
    const actividad = porId.get(celda.actividadId);
    return actividad?.tipo === "unica" && actividad.vence;
  });
  const aTiempo = conVencimiento
    .filter((celda) => celda.dia <= porId.get(celda.actividadId).vence)
    .map((celda) => celda.dia)
    .sort();
  const vencidasLlenadas = conVencimiento
    .filter((celda) => celda.dia > porId.get(celda.actividadId).vence)
    .map((celda) => celda.dia)
    .sort();
  const vencidasPendientes = actividades.filter(
    (actividad) =>
      actividad.tipo === "unica" &&
      !actividad.archivadaEl &&
      actividad.vence &&
      actividad.vence < hoy &&
      !(hechosPorActividad.get(actividad.id) ?? []).length,
  ).length;
  const diasMadrugadores = [
    ...new Set(
      celdas
        .filter((celda) => celda.horaLocal != null && celda.horaLocal < HORA_MADRUGADORA)
        .map((celda) => celda.dia),
    ),
  ].sort();
  const primerosCuadros = conAporte
    .flatMap((resultado) => resultado.cuadros)
    .map((cuadro) => cuadro.dia)
    .sort();
  const cierres = conAporte
    .flatMap((resultado) =>
      resultado.cuadros.filter((cuadro) => cuadro.cuadro === CUADROS_POR_COLMENA),
    )
    .map((cuadro) => cuadro.dia)
    .sort();
  const fundadas = colmenas.filter((colmena) => colmena.fundadoraId === personaId);

  const sellos = sellosDe({
    vuelo,
    celdas: celdas.length,
    unicasATiempo: { cantidad: aTiempo.length, decimaEl: aTiempo[9] ?? null },
    cuotas: { mejor: mejorSerie.mejor, cuartaEl: mejorSerie.alcanzada[4] ?? null },
    vencidas: {
      llenadas: vencidasLlenadas.length,
      pendientes: vencidasPendientes,
      ultimaEl: vencidasLlenadas[vencidasLlenadas.length - 1] ?? null,
    },
    colmenas: {
      fundadasConEnjambre: fundadas.filter((colmena) => colmena.unidas > 0).length,
      unidas: suma(fundadas, (colmena) => colmena.unidas),
      mejorCuadro: Math.max(0, ...conAporte.map((resultado) => resultado.cuadro)),
      primerCuadroEl: primerosCuadros[0] ?? null,
      cerradas: conAporte.filter((resultado) => resultado.cerrada).length,
      cerradaEl: cierres[0] ?? null,
    },
    madrugadas: { dias: diasMadrugadores.length, quintoEl: diasMadrugadores[4] ?? null },
  });

  return {
    hoy: jornadaDeHoy.resumen,
    vuelo,
    vueloHastaAyer,
    racha: rachaParaHoy(vuelo, hoy, jornadaDeHoy.llenas > 0),
    celdas: valoradas,
    gotas: { total, hastaAyer: total - deHoy, deHoy, bonosDeHoy, desglose },
    oficio: oficioDe(total),
    sellos,
    colmenas: deColmenas.map(({ colmena, cuadro, cerrada }) => ({
      id: colmena.id,
      nombre: colmena.nombre,
      cuadro,
      cerrada,
    })),
  };
}
