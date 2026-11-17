import { useFondo } from "../../componentes/useFondo.js";
import { Boton } from "../../componentes/Controles.jsx";
import { FilaDeCelda } from "../../componentes/FilaDeCelda.jsx";
import { Tarjeta } from "../../componentes/Tarjeta.jsx";
import estilos from "./Hoy.module.css";
import { detalleDeActividad } from "../../componentes/textos.js";

/** Las actividades de hoy, cada una con su casilla. Las cumplidas se quedan a la vista. */
export function CeldasDeHoy({ celdas, resumen, alAlternar }) {
  const { fondo } = useFondo();
  if (celdas.length === 0) {
    return (
      <Tarjeta titulo="Celdas de hoy">
        <div className={estilos.vacio}>
          <p>Tu panal de hoy está por estrenar. Crea tu primera celda.</p>
          <Boton a="/celdas/nueva" estado={{ fondo }}>
            Nueva actividad
          </Boton>
        </div>
      </Tarjeta>
    );
  }

  return (
    <Tarjeta titulo="Celdas de hoy" dato={`${resumen.llenas} de ${celdas.length}`}>
      {/* Sin viñetas, Safari deja de anunciar la lista: el rol la devuelve. */}
      <ul className={estilos.filas} role="list">
        {celdas.map((fila) => (
          <FilaDeCelda
            key={fila.id}
            titulo={fila.titulo}
            detalle={detalleDeActividad(fila)}
            gotas={fila.gotas}
            llena={fila.llena}
            vencida={fila.vencida}
            alCambiar={() => alAlternar(fila)}
          />
        ))}
      </ul>
    </Tarjeta>
  );
}
