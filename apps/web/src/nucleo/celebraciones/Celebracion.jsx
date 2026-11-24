import { Boton, Ficha } from "../../componentes/ui/Controles.jsx";
import { EscaleraDeOficios } from "../../componentes/panal/EscaleraDeOficios.jsx";
import { IconoGota } from "../../componentes/panal/iconos.jsx";
import { PanalDeHoy } from "../../componentes/panal/PanalDeHoy.jsx";
import { SelloDeCera } from "../../componentes/panal/SelloDeCera.jsx";
import { useCerrarVentana, Ventana } from "../../componentes/ui/Ventana.jsx";
import { Zum } from "../../componentes/panal/Zum.jsx";
import estilos from "./Celebracion.module.css";
import { descripcionDeEscalera, PANAL_SELLADO, SEGUIR, textosDeLogro } from "./textos.js";
import { useCelebraciones } from "./useCelebraciones.js";

/**
 * P12. Celebración: una ventana con Zum y los logros en cola, del más grande
 * al más pequeño. Se cierra con "Seguir", con Escape o tocando fuera.
 */
export function Celebracion() {
  const { logros, meta, cerrar } = useCelebraciones();
  if (logros.length === 0) return null;

  const [principal, ...otros] = logros;

  return (
    <Ventana titulo={textosDeLogro(principal).titulo} alCerrar={cerrar} cerrarAlTocarFuera>
      <div className={estilos.celebracion}>
        <Zum className={estilos.zum} estado="celebrando" tamanos="160px" />
        <Logro logro={principal} meta={meta} principal />
        {otros.map((logro) => (
          <Logro key={logro.clave} logro={logro} meta={meta} />
        ))}
        <BotonSeguir />
      </div>
    </Ventana>
  );
}

function BotonSeguir() {
  const cerrar = useCerrarVentana();
  return (
    <Boton className={estilos.seguir} onClick={cerrar} autoFocus>
      {SEGUIR}
    </Boton>
  );
}

function Logro({ logro, meta, principal = false }) {
  const textos = textosDeLogro(logro);
  return (
    <section className={estilos.logro} data-principal={principal ? "" : undefined}>
      <Dibujo logro={logro} meta={meta} />
      <div className={estilos.textos}>
        {!principal && <h3 className={estilos.tituloSecundario}>{textos.titulo}</h3>}
        {textos.fichas.length > 0 && (
          <p className={estilos.fichas}>
            {textos.fichas.map((ficha) => (
              <Ficha key={ficha} icono={<IconoGota />}>
                {ficha}
              </Ficha>
            ))}
          </p>
        )}
        {textos.detalle && <p className={estilos.detalle}>{textos.detalle}</p>}
      </div>
    </section>
  );
}

function Dibujo({ logro, meta }) {
  switch (logro.tipo) {
    case "panal-cerrado":
      return (
        <PanalDeHoy
          className={estilos.dibujo}
          llenas={meta}
          meta={meta}
          descripcion={PANAL_SELLADO}
        />
      );
    case "oficio":
      return (
        <EscaleraDeOficios nivel={logro.nivel} descripcion={descripcionDeEscalera(logro.nivel)} />
      );
    case "sello":
      return <SelloDeCera id={logro.id} ganado tamano={88} />;
    default:
      return null;
  }
}
