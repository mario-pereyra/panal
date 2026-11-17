import { Boton } from "../../componentes/Controles.jsx";
import { Zum } from "../../componentes/Zum.jsx";
import estilos from "./Errores.module.css";
import { NO_ENCONTRADA, SIN_CONEXION } from "./textos.js";

/** El marco de las dos pantallas: Zum, un título, una frase y una salida. */
function Tropiezo({ titulo, texto, zum, children }) {
  return (
    <main id="contenido" className={estilos.pagina} tabIndex={-1}>
      <title>{`${titulo} · Panal`}</title>
      <section className={estilos.tarjeta}>
        <Zum className={estilos.zum} estado={zum} principal tamanos="160px" />
        <h1 className={estilos.titulo}>{titulo}</h1>
        <p className={estilos.texto}>{texto}</p>
        {children}
      </section>
    </main>
  );
}

/** P14. La dirección no lleva a ninguna parte del panal. */
export function NoEncontrada() {
  return (
    <Tropiezo titulo={NO_ENCONTRADA.titulo} texto={NO_ENCONTRADA.texto} zum="esperando">
      <Boton a="/">Ir a Hoy</Boton>
    </Tropiezo>
  );
}

/**
 * P14. Sin conexión y sin nada guardado que mostrar: la primera carga necesita red.
 * @param {{ alReintentar: () => void }} props
 */
export function SinConexion({ alReintentar }) {
  return (
    <Tropiezo titulo={SIN_CONEXION.titulo} texto={SIN_CONEXION.texto} zum="descansando">
      <Boton onClick={alReintentar}>Reintentar</Boton>
    </Tropiezo>
  );
}
