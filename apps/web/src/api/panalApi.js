import { gotasDeCelda } from "@panal/motor";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseDeEjemplo } from "./baseDeEjemplo.js";

/**
 * Todo lo que es verdad en el servidor vive aquí, en el caché de RTK Query.
 *
 * Mientras no exista el servidor, las peticiones las responde `baseDeEjemplo`.
 * Con `VITE_API_URL` definida, van al servidor real y nada más cambia.
 */
const base = import.meta.env.VITE_API_URL
  ? fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL, credentials: "include" })
  : baseDeEjemplo;

export const panalApi = createApi({
  reducerPath: "api",
  baseQuery: base,
  tagTypes: ["Panal"],
  endpoints: (crear) => ({
    /** Todo lo que necesita "Hoy", en una sola llamada. */
    obtenerPanal: crear.query({
      query: () => "/panal",
      providesTags: ["Panal"],
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
      async onQueryStarted({ id, actividadId, vencida }, { dispatch, queryFulfilled }) {
        const cambio = dispatch(
          panalApi.util.updateQueryData("obtenerPanal", undefined, (panal) => {
            const actividad = panal.actividades.find((candidata) => candidata.id === actividadId);
            if (!actividad) return;
            const llenasAntes = panal.celdasLlenas.filter(
              (celda) => celda.dia === panal.hoy,
            ).length;
            panal.celdasLlenas.push({
              id,
              actividadId,
              dia: panal.hoy,
              // El mismo motor que usa el servidor: las gotas aparecen al instante.
              gotas: gotasDeCelda({ ...actividad, vencida }, { llenasAntes }),
            });
            const enColmena = panal.colmena?.celdas.find(
              (otra) => otra.actividadId === actividadId,
            );
            if (enColmena) enColmena.llenaPor = panal.persona.id;
          }),
        );
        try {
          const { data } = await queryFulfilled;
          // El servidor es la autoridad: su celda reemplaza a la que supusimos.
          dispatch(
            panalApi.util.updateQueryData("obtenerPanal", undefined, (panal) => {
              const celda = panal.celdasLlenas.find((candidata) => candidata.id === id);
              if (celda && data?.celda) Object.assign(celda, data.celda);
            }),
          );
        } catch {
          cambio.undo();
        }
      },
    }),

    /** Deshacer una celda llena. Las gotas son derivadas: desaparecen con ella. */
    vaciarCelda: crear.mutation({
      query: (id) => ({ url: `/celdas/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const cambio = dispatch(
          panalApi.util.updateQueryData("obtenerPanal", undefined, (panal) => {
            const celda = panal.celdasLlenas.find((candidata) => candidata.id === id);
            if (!celda) return;
            panal.celdasLlenas = panal.celdasLlenas.filter((otra) => otra.id !== id);
            const enColmena = panal.colmena?.celdas.find(
              (otra) => otra.actividadId === celda.actividadId,
            );
            if (enColmena) enColmena.llenaPor = null;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          cambio.undo();
        }
      },
    }),
  }),
});

export const { useObtenerPanalQuery, useLlenarCeldaMutation, useVaciarCeldaMutation } = panalApi;
