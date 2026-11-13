import { diaDeLaSemana, sumarDias } from "@panal/motor";

/**
 * Datos de ejemplo: lo que respondería `GET /api/panal` para Ana, la persona
 * de las maquetas. Se construyen alrededor de "hoy" para que el panal de
 * constancia y la racha tengan sentido cualquier día que se abra la aplicación.
 *
 * Cuando exista el servidor, este archivo deja de usarse.
 */

/** Celdas llenas hace 1, 2, 3… días. El primer cero corta la racha: con hoy, son 12 días. */
const CELDAS_HACE = [
  5, 3, 5, 3, 1, 2, 4, 5, 5, 3, 5, 0, 1, 5, 3, 4, 5, 3, 0, 2, 1, 3, 5, 4, 3, 0, 0, 2, 0, 3, 3, 1, 2,
  3,
];

/** Quién llenó cada celda de la colmena, fila por fila. El punto es una celda vacía. */
const CELDAS_DE_LA_COLMENA = "AALASL" + "LADSAL" + "SALDSA" + "......" + "......";
const INICIALES = { A: "p-ana", L: "p-luis", S: "p-sofia", D: "p-diego" };

/**
 * @param {string} hoy Día lógico de hoy, AAAA-MM-DD.
 */
export function crearDatosDeEjemplo(hoy) {
  const diaDeHoy = diaDeLaSemana(hoy);
  // Tres días por semana, uno de ellos hoy: un viernes sale lunes, miércoles y viernes.
  const tresPorSemana = [(diaDeHoy + 3) % 7, (diaDeHoy + 5) % 7, diaDeHoy].sort((a, b) => a - b);

  const actividades = [
    {
      id: "a-redux",
      titulo: "Repasar apuntes de Redux",
      tipo: "recurrente",
      prioridad: "normal",
      regla: { clase: "diaria" },
      vence: null,
      colmenaId: null,
    },
    {
      id: "a-caminar",
      titulo: "Caminar 30 minutos",
      tipo: "recurrente",
      prioridad: "normal",
      regla: { clase: "diaria" },
      vence: null,
      colmenaId: null,
    },
    {
      id: "a-informe",
      titulo: "Entregar informe de avance",
      tipo: "unica",
      prioridad: "normal",
      regla: null,
      vence: hoy,
      colmenaId: null,
    },
    {
      id: "a-reportes",
      titulo: "Diseñar pantalla de reportes",
      tipo: "unica",
      prioridad: "normal",
      regla: null,
      vence: null,
      colmenaId: "c-proyecto-final",
    },
    {
      id: "a-ingles",
      titulo: "Practicar inglés 15 minutos",
      tipo: "recurrente",
      prioridad: "normal",
      regla: { clase: "semanal", dias: tresPorSemana },
      vence: null,
      colmenaId: null,
    },
  ];

  // Lo que Ana ya llenó hoy: dos recurrentes y una única, 45 gotas.
  const celdasLlenas = [
    { id: "c-hoy-redux", actividadId: "a-redux", dia: hoy, gotas: 10 },
    { id: "c-hoy-caminar", actividadId: "a-caminar", dia: hoy, gotas: 10 },
    { id: "c-hoy-informe", actividadId: "a-informe", dia: hoy, gotas: 25 },
  ];

  // El historial de las cinco semanas. Las únicas de días pasados ya no están entre las activas.
  CELDAS_HACE.forEach((cantidad, indice) => {
    const dia = sumarDias(hoy, -(indice + 1));
    for (let numero = 0; numero < cantidad; numero += 1) {
      const recurrente = numero < 2;
      celdasLlenas.push({
        id: `c-${dia}-${numero}`,
        actividadId: recurrente ? actividades[numero].id : `a-pasada-${dia}-${numero}`,
        dia,
        gotas: recurrente ? 10 : 25,
      });
    }
  });

  return {
    hoy,
    persona: {
      id: "p-ana",
      nombre: "Ana",
      color: "#2F6FB7",
      zonaHoraria: "America/La_Paz",
      metaDiaria: 5,
      diaSinFlores: null,
      invernada: null,
      reservas: 2,
      mejorRacha: 12,
      // Con las 45 de hoy son 640: nivel 4, Exploradora.
      gotasHastaAyer: 595,
    },
    actividades,
    celdasLlenas,
    colmena: {
      id: "c-proyecto-final",
      nombre: "Proyecto final",
      integrantes: [
        { id: "p-ana", nombre: "Ana" },
        { id: "p-luis", nombre: "Luis" },
        { id: "p-sofia", nombre: "Sofía" },
        { id: "p-diego", nombre: "Diego" },
      ],
      celdas: [...CELDAS_DE_LA_COLMENA].map((inicial, indice) => ({
        // La primera celda vacía es la actividad de la colmena que Ana tiene para hoy.
        actividadId: indice === 18 ? "a-reportes" : `a-colmena-${indice + 1}`,
        llenaPor: INICIALES[inicial] ?? null,
      })),
    },
  };
}
