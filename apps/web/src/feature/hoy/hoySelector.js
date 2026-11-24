import { avanceDeColmena } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { pintarColmena } from "../../nucleo/panal/abejas.js";
import { selectPanal } from "../../store/api.js";
import { selectRacha } from "../../nucleo/panal/panalSelector.js";
import { textoDeFranja } from "./textos.js";

/** La colmena con actividad más reciente. */
export const selectResumenColmenaActiva = createSelector([selectPanal], (panal) => {
  const colmena = panal?.colmena;
  if (!colmena) return null;
  const avance = avanceDeColmena(colmena.celdas);
  const aporteDe = new Map(avance.aportes.map((aporte) => [aporte.personaId, aporte.celdas]));
  const { integrantes, celdas } = pintarColmena(colmena);
  return {
    id: colmena.id,
    nombre: colmena.nombre,
    avance,
    otras: Math.max(0, panal.colmenasActivas - 1),
    celdas,
    integrantes: integrantes.map((abeja) => ({ ...abeja, celdas: aporteDe.get(abeja.id) ?? 0 })),
  };
});

export const selectFranjaDeHoy = createSelector(
  [selectPanal, selectRacha, (estado) => estado.hoy.franjaCerradaEl],
  (panal, racha, cerradaEl) => {
    if (!panal || !racha || cerradaEl === panal.hoy) return null;
    const texto = textoDeFranja(racha);
    return texto ? { texto, tono: racha.perdidaAyer > 0 ? "ala" : "cera" } : null;
  },
);
