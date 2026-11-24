import { PanalDeConstancia } from "../../componentes/panal/PanalDeConstancia.jsx";
import { Tarjeta } from "../../componentes/ui/Tarjeta.jsx";
import { CONSTANCIA, descripcionDeConstancia, notaDeConstancia } from "./textos.js";

export function Constancia({ constancia }) {
  return (
    <Tarjeta titulo={CONSTANCIA} nota={notaDeConstancia(constancia.semanas.length)} a="/reportes">
      <PanalDeConstancia
        semanas={constancia.semanas}
        descripcion={descripcionDeConstancia(constancia)}
      />
    </Tarjeta>
  );
}
