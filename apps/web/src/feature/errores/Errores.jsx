import { PantallaConZum } from "../../componentes/panal/PantallaConZum.jsx";
import { Boton } from "../../componentes/ui/Controles.jsx";
import { IR_A_HOY } from "../../nucleo/textos.js";
import { NO_ENCONTRADA } from "./textos.js";

/** P14. La dirección no lleva a ninguna parte del panal. */
export function NoEncontrada() {
  return (
    <PantallaConZum titulo={NO_ENCONTRADA.titulo} texto={NO_ENCONTRADA.texto} zum="esperando">
      <Boton a="/">{IR_A_HOY}</Boton>
    </PantallaConZum>
  );
}
