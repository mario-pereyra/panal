import { PanalDeConstancia } from "../../componentes/PanalDeConstancia.jsx";
import { Tarjeta } from "../../componentes/Tarjeta.jsx";
import estilos from "./Hoy.module.css";

/** El panal de constancia de las últimas semanas, con su leyenda. */
export function Constancia({ semanas }) {
  const dias = semanas.flat().filter((dia) => !dia.futuro);
  const conCeldas = dias.filter((dia) => dia.nivel > 0).length;
  const cerrados = dias.filter((dia) => dia.nivel === 3).length;

  return (
    <Tarjeta
      titulo="Constancia"
      nota={`Últimas ${semanas.length} semanas, un día por celda`}
      a="/reportes"
    >
      <PanalDeConstancia
        semanas={semanas}
        descripcion={
          `Panal de constancia de las últimas ${semanas.length} semanas: ` +
          `${conCeldas} de ${dias.length} días con celdas llenas, ` +
          `${cerrados} de ellos con el panal cerrado.`
        }
      />
      <p className={estilos.leyenda}>
        <span>Menos</span>
        <span className={estilos.escala} aria-hidden="true">
          <span data-nivel="0" />
          <span data-nivel="1" />
          <span data-nivel="2" />
          <span data-nivel="3" />
        </span>
        <span>Más</span>
        <span className={estilos.hoyConBorde}>Hoy con borde</span>
      </p>
    </Tarjeta>
  );
}
