import { gotasDeCelda } from "@panal/motor";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Todo lo que es verdad en el servidor vive aquí, en el caché de RTK Query.
 *
 * Las peticiones van a `/api` en el mismo origen: en desarrollo, Vite las
 * reenvía al servidor de `apps/api`. La forma de cada respuesta está en
 * `packages/contratos/src/respuestas.js`.
 */

const consultar = fetchBaseQuery({ baseUrl: "/api", credentials: "same-origin" });

/** Si la sesión vence en mitad del uso, se vuelve a pedir el perfil y la ruta protegida lleva a "Entrar". */
async function baseDePanal(peticion, api, extra) {
  const respuesta = await consultar(peticion, api, extra);
  const sinSesion = respuesta.error?.status === 401;
  if (sinSesion && !["obtenerYo", "entrar", "crearCuenta"].includes(api.endpoint)) {
    api.dispatch(panalApi.util.invalidateTags(["Yo"]));
  }
  return respuesta;
}

/** Guarda el perfil que devolvió una mutación, sin pedirlo otra vez. */
async function guardarPerfil(_, { dispatch, queryFulfilled }) {
  try {
    const { data } = await queryFulfilled;
    dispatch(panalApi.util.upsertQueryData("obtenerYo", undefined, data));
  } catch {
    // El formulario muestra el error con lo que devuelve la mutación.
  }
}

/** Lo que cambia en cualquier pantalla cuando se llena o se vacía una celda. */
const TRAS_UNA_CELDA = ["Progreso", "Colmenas", "Reporte"];
/** Lo que cambia cuando se crea, edita o archiva una actividad. */
const TRAS_UNA_ACTIVIDAD = ["Actividades", "Panal", "Colmenas", "Reporte", "Progreso"];

export const panalApi = createApi({
  reducerPath: "api",
  baseQuery: baseDePanal,
  tagTypes: ["Yo", "Panal", "Actividades", "Colmenas", "Invitacion", "Progreso", "Reporte"],
  // Al volver a la pestaña o recuperar la red, lo visible se pone al día por detrás.
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (crear) => ({
    // Cuenta y sesión

    obtenerYo: crear.query({ query: () => "/yo", providesTags: ["Yo"] }),

    crearCuenta: crear.mutation({
      query: (cuenta) => ({ url: "/cuenta", method: "POST", body: cuenta }),
      onQueryStarted: guardarPerfil,
    }),

    entrar: crear.mutation({
      query: (credenciales) => ({ url: "/sesion", method: "POST", body: credenciales }),
      onQueryStarted: guardarPerfil,
    }),

    salir: crear.mutation({ query: () => ({ url: "/sesion", method: "DELETE" }) }),

    cambiarPerfil: crear.mutation({
      query: (cambios) => ({ url: "/yo", method: "PATCH", body: cambios }),
      onQueryStarted: guardarPerfil,
      invalidatesTags: ["Panal", "Progreso", "Reporte"],
    }),

    completarPrimerVuelo: crear.mutation({
      query: (datos) => ({ url: "/yo/primer-vuelo", method: "POST", body: datos }),
      onQueryStarted: guardarPerfil,
      invalidatesTags: ["Panal", "Progreso"],
    }),

    obtenerProgreso: crear.query({ query: () => "/yo/progreso", providesTags: ["Progreso"] }),

    // Actividades y celdas

    /** Todo lo que necesita "Hoy", en una sola llamada. */
    obtenerPanal: crear.query({ query: () => "/panal", providesTags: ["Panal"] }),

    obtenerActividades: crear.query({
      query: (ver = "activas") => `/actividades?ver=${ver}`,
      providesTags: ["Actividades"],
    }),

    /** Crear o reemplazar. El identificador nace en el navegador: repetir el envío no duplica. */
    guardarActividad: crear.mutation({
      query: ({ id, ...actividad }) => ({
        url: `/actividades/${id}`,
        method: "PUT",
        body: actividad,
      }),
      invalidatesTags: TRAS_UNA_ACTIVIDAD,
    }),

    /** Editar, posponer, archivar o recuperar. */
    cambiarActividad: crear.mutation({
      query: ({ id, ...cambios }) => ({
        url: `/actividades/${id}`,
        method: "PATCH",
        body: cambios,
      }),
      invalidatesTags: TRAS_UNA_ACTIVIDAD,
    }),

    /**
     * Llenar una celda. La pantalla cambia antes de que el servidor responda:
     * la celda se agrega al caché y, si el servidor falla, se deshace.
     */
    llenarCelda: crear.mutation({
      query: ({ id, actividadId }) => ({
        url: `/celdas/${id}`,
        method: "PUT",
        body: { actividadId },
      }),
      async onQueryStarted(
        { id, actividadId, vencida, colmenaId },
        { dispatch, queryFulfilled, getState },
      ) {
        const personaId = panalApi.endpoints.obtenerYo.select()(getState()).data?.id ?? null;
        const cambios = [
          dispatch(
            panalApi.util.updateQueryData("obtenerPanal", undefined, (panal) => {
              const actividad = panal.actividades.find((candidata) => candidata.id === actividadId);
              if (actividad) {
                const llenasAntes = panal.celdasLlenas.filter(
                  (celda) => celda.dia === panal.hoy,
                ).length;
                panal.celdasLlenas.push({
                  id,
                  actividadId,
                  personaId: panal.persona.id,
                  dia: panal.hoy,
                  llenadaEn: new Date().toISOString(),
                  // El mismo motor que usa el servidor: las gotas aparecen al instante.
                  gotas: gotasDeCelda({ ...actividad, vencida }, { llenasAntes }),
                });
              }
              const enColmena = panal.colmena?.celdas.find(
                (otra) => otra.actividadId === actividadId,
              );
              if (enColmena) enColmena.llenaPor = panal.persona.id;
            }),
          ),
        ];
        if (colmenaId) {
          cambios.push(
            dispatch(
              panalApi.util.updateQueryData("obtenerColmena", colmenaId, (detalle) => {
                const actividad = detalle.actividades.find(
                  (candidata) => candidata.id === actividadId,
                );
                if (!actividad) return;
                actividad.llenaPor = personaId;
                actividad.llenadaEl = detalle.hoy;
                actividad.celdaId = id;
              }),
            ),
          );
        }
        try {
          const { data } = await queryFulfilled;
          // El servidor es la autoridad: su celda reemplaza a la que supusimos.
          dispatch(
            panalApi.util.updateQueryData("obtenerPanal", undefined, (panal) => {
              const celda = panal.celdasLlenas.find((candidata) => candidata.id === id);
              if (celda && data?.celda) Object.assign(celda, data.celda);
              // Los bonos de colmena ganados con esta celda suman a las gotas de hoy.
              for (const celebracion of data?.celebraciones ?? []) {
                if (celebracion.tipo === "cuadro" || celebracion.tipo === "colmena-cerrada") {
                  panal.progreso.bonosDeHoy += celebracion.gotas ?? 0;
                }
              }
            }),
          );
        } catch {
          for (const cambio of cambios) cambio.undo();
        }
      },
      invalidatesTags: (_, error) => (error ? [] : TRAS_UNA_CELDA),
    }),

    /** Deshacer una celda llena. Las gotas son derivadas: desaparecen con ella. */
    vaciarCelda: crear.mutation({
      query: ({ id }) => ({ url: `/celdas/${id}`, method: "DELETE" }),
      async onQueryStarted({ id, colmenaId }, { dispatch, queryFulfilled }) {
        const cambios = [
          dispatch(
            panalApi.util.updateQueryData("obtenerPanal", undefined, (panal) => {
              const celda = panal.celdasLlenas.find((candidata) => candidata.id === id);
              if (!celda) return;
              panal.celdasLlenas = panal.celdasLlenas.filter((otra) => otra.id !== id);
              const enColmena = panal.colmena?.celdas.find(
                (otra) => otra.actividadId === celda.actividadId,
              );
              if (enColmena) enColmena.llenaPor = null;
            }),
          ),
        ];
        if (colmenaId) {
          cambios.push(
            dispatch(
              panalApi.util.updateQueryData("obtenerColmena", colmenaId, (detalle) => {
                const actividad = detalle.actividades.find((candidata) => candidata.celdaId === id);
                if (!actividad) return;
                actividad.llenaPor = null;
                actividad.llenadaEl = null;
                actividad.celdaId = null;
              }),
            ),
          );
        }
        try {
          await queryFulfilled;
        } catch {
          for (const cambio of cambios) cambio.undo();
        }
      },
      invalidatesTags: (_, error) => (error ? [] : TRAS_UNA_CELDA),
    }),

    // Colmenas

    obtenerColmenas: crear.query({ query: () => "/colmenas", providesTags: ["Colmenas"] }),

    obtenerColmena: crear.query({
      query: (id) => `/colmenas/${id}`,
      providesTags: (_, __, id) => [{ type: "Colmenas", id }],
    }),

    fundarColmena: crear.mutation({
      query: (colmena) => ({ url: "/colmenas", method: "POST", body: colmena }),
      invalidatesTags: ["Colmenas", "Panal", "Progreso"],
    }),

    cambiarColmena: crear.mutation({
      query: ({ id, ...cambios }) => ({ url: `/colmenas/${id}`, method: "PATCH", body: cambios }),
      invalidatesTags: ["Colmenas", "Panal"],
    }),

    salirDeColmena: crear.mutation({
      query: ({ colmenaId, personaId }) => ({
        url: `/colmenas/${colmenaId}/integrantes/${personaId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Colmenas", "Panal", "Actividades", "Progreso"],
    }),

    obtenerInvitacion: crear.query({
      query: (colmenaId) => `/colmenas/${colmenaId}/invitacion`,
      providesTags: (_, __, colmenaId) => [{ type: "Invitacion", id: colmenaId }],
    }),

    /** Crea el enlace, o anula el actual y crea otro. */
    crearInvitacion: crear.mutation({
      query: (colmenaId) => ({ url: `/colmenas/${colmenaId}/invitacion`, method: "POST" }),
      invalidatesTags: (_, error, colmenaId) =>
        error ? [] : [{ type: "Invitacion", id: colmenaId }],
    }),

    /** A qué colmena invita un enlace. No pide sesión. */
    verInvitacion: crear.query({ query: (codigo) => `/invitaciones/${codigo}` }),

    aceptarInvitacion: crear.mutation({
      query: (codigo) => ({ url: `/invitaciones/${codigo}/aceptar`, method: "POST" }),
      invalidatesTags: ["Colmenas", "Panal", "Actividades", "Progreso"],
    }),

    // Reportes

    obtenerReporte: crear.query({
      query: ({ desde, hasta }) => `/reportes?desde=${desde}&hasta=${hasta}`,
      providesTags: ["Reporte"],
    }),
  }),
});

export const {
  useObtenerYoQuery,
  useCrearCuentaMutation,
  useEntrarMutation,
  useSalirMutation,
  useCambiarPerfilMutation,
  useCompletarPrimerVueloMutation,
  useObtenerProgresoQuery,
  useObtenerPanalQuery,
  useObtenerActividadesQuery,
  useGuardarActividadMutation,
  useCambiarActividadMutation,
  useLlenarCeldaMutation,
  useVaciarCeldaMutation,
  useObtenerColmenasQuery,
  useObtenerColmenaQuery,
  useFundarColmenaMutation,
  useCambiarColmenaMutation,
  useSalirDeColmenaMutation,
  useObtenerInvitacionQuery,
  useCrearInvitacionMutation,
  useVerInvitacionQuery,
  useAceptarInvitacionMutation,
  useObtenerReporteQuery,
} = panalApi;
