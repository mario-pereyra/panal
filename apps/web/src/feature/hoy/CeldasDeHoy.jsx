import { Boton } from "../../componentes/ui/Controles.jsx";
import { FilaDeCelda } from "../../componentes/panal/FilaDeCelda.jsx";
import { Tarjeta } from "../../componentes/ui/Tarjeta.jsx";
import estilos from "./Hoy.module.css";
import { NUEVA_ACTIVIDAD, PANAL_POR_ESTRENAR } from "../../nucleo/textos.js";
import { CELDAS_DE_HOY, llenasDe } from "./textos.js";

/** Las cumplidas se quedan a la vista. */
export function CeldasDeHoy({ celdas, resumen, alAlternar }) {
  if (celdas.length === 0) {
    return (
      <Tarjeta titulo={CELDAS_DE_HOY}>
        <div className={estilos.vacio}>
          <p>{PANAL_POR_ESTRENAR}</p>
          <Boton a="/celdas/nueva" ventana>
            {NUEVA_ACTIVIDAD}
          </Boton>
        </div>
      </Tarjeta>
    );
  }

  return (
    <Tarjeta titulo={CELDAS_DE_HOY} dato={llenasDe(resumen.llenas, resumen.programadas)}>
      {/* Sin viñetas, Safari deja de anunciar la lista: el rol la devuelve. */}
      <ul className={estilos.filas} role="list">
        {celdas.map((fila) => (
          <FilaDeCelda
            key={fila.id}
            titulo={fila.titulo}
            detalle={fila.detalle}
            gotas={fila.gotas}
            llena={fila.llena}
            vencida={fila.vencida}
            alCambiar={() => alAlternar(fila)}
            abrir={fila.permisos.editar ? `/celdas/${fila.id}` : undefined}
          />
        ))}
      </ul>
    </Tarjeta>
  );
}
