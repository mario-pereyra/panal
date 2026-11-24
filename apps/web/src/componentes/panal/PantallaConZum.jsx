import { clases } from "../../lib/clases.js";
import { Principal, TituloDePestana } from "../ui/Pagina.jsx";
import estilos from "./PantallaConZum.module.css";
import { Zum } from "./Zum.jsx";

/**
 * Pantalla completa sin la estructura de la aplicación: una tarjeta centrada
 * con Zum, un título, una frase y una salida. La usan los tropiezos (no
 * encontrada, sin conexión) y la invitación a una colmena.
 */
export function PantallaConZum({ titulo, texto, zum, pestana = titulo, className, children }) {
  return (
    <Principal className={clases(estilos.pantalla, className)}>
      <TituloDePestana>{pestana}</TituloDePestana>
      <section className={estilos.tarjeta}>
        <Zum className={estilos.zum} estado={zum} principal tamanos="160px" />
        {titulo && <h1 className={estilos.titulo}>{titulo}</h1>}
        {texto && <p className={estilos.texto}>{texto}</p>}
        {children}
      </section>
    </Principal>
  );
}
