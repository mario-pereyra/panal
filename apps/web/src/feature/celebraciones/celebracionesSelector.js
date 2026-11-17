import { PESO_DE_CELEBRACION } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";

const selectCola = (estado) => estado.celebraciones.cola;

/** Los logros en cola, del más grande al más pequeño, sin repetir. */
export const selectColaDeCelebraciones = createSelector([selectCola], (cola) => {
  const unicos = new Map();
  for (const logro of cola) {
    const clave = `${logro.tipo}:${logro.id ?? logro.colmenaId ?? logro.nivel ?? logro.dias ?? ""}`;
    unicos.set(clave, logro);
  }
  return [...unicos.values()].sort(
    (a, b) => (PESO_DE_CELEBRACION[b.tipo] ?? 0) - (PESO_DE_CELEBRACION[a.tipo] ?? 0),
  );
});
