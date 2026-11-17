import { Boton, Ficha } from "../../componentes/Controles.jsx";
import { EscaleraDeOficios } from "../../componentes/Graficas.jsx";
import { IconoGota } from "../../componentes/iconos.jsx";
import { PanalDeHoy } from "../../componentes/PanalDeHoy.jsx";
import { SelloDeCera } from "../../componentes/SelloDeCera.jsx";
import { useCerrarVentana, Ventana } from "../../componentes/Ventana.jsx";
import { Zum } from "../../componentes/Zum.jsx";
import estilos from "./Celebracion.module.css";
import { textosDeLogro } from "./textos.js";
import { useCelebraciones } from "./useCelebraciones.js";

/**
 * P12. Celebración: una ventana con Zum y los logros en cola, del más grande
 * al más pequeño. Se cierra con "Seguir", con Escape o tocando fuera.
 */
export function Celebracion() {
  const { logros, meta, cerrar } = useCelebraciones();
  if (logros.length === 0) return null;

  const [principal, ...otros] = logros;
  const textos = textosDeLogro(principal);

  return (
    <Ventana titulo={textos.titulo} alCerrar={cerrar} cerrarAlTocarFuera>
      <div className={estilos.celebracion}>
        <Zum className={estilos.zum} estado="celebrando" tamanos="160px" />
        <Logro logro={principal} textos={textos} meta={meta} principal />
        {otros.map((logro) => (
          <Logro
            key={`${logro.tipo}-${logro.id ?? logro.colmenaId ?? logro.nivel ?? ""}`}
            logro={logro}
            meta={meta}
          />
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
      Seguir
    </Boton>
  );
}

/** Un logro: su dibujo, lo ganado y la siguiente meta. */
function Logro({ logro, textos = textosDeLogro(logro), meta, principal = false }) {
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
          descripcion="El panal de hoy, sellado"
        />
      );
    case "oficio":
      return (
        <EscaleraDeOficios
          nivel={logro.nivel}
          descripcion={`Escalera de oficios en el nivel ${logro.nivel}`}
        />
      );
    case "sello":
      return <SelloDeCera id={logro.id} ganado tamano={88} />;
    default:
      return null;
  }
}
