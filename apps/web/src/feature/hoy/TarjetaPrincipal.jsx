import { useFondo } from "../../componentes/useFondo.js";
import { Boton, Ficha } from "../../componentes/Controles.jsx";
import { IconoGota, IconoTarro } from "../../componentes/iconos.jsx";
import { PanalDeHoy } from "../../componentes/PanalDeHoy.jsx";
import { Zum } from "../../componentes/Zum.jsx";
import estilos from "./TarjetaPrincipal.module.css";
import { fechaLarga } from "../../componentes/textos.js";
import {
  descripcionDelPanal,
  fraseDeZum,
  saludoDeHoy,
  textoDeRacha,
  textoDeReservas,
} from "./textos.js";

/**
 * La tarjeta principal de "Hoy": Zum según su estado, el saludo, la frase del
 * momento y el panal de hoy.
 */
export function TarjetaPrincipal({ hoy, nombre, zum, resumen, racha }) {
  const { fondo } = useFondo();
  return (
    <section
      className={estilos.principal}
      data-tono={zum === "descansando" ? "ala" : "miel"}
      aria-labelledby="saludo-de-hoy"
    >
      <div className={estilos.interior}>
        <Zum
          className={estilos.zum}
          estado={zum}
          conFondo
          principal
          tamanos="(min-width: 1000px) 240px, (min-width: 700px) 200px, 120px"
        />
        <div className={estilos.saludo}>
          <p className={estilos.fecha}>
            <time dateTime={hoy}>{fechaLarga(hoy)}</time>
          </p>
          <h1 id="saludo-de-hoy" className={estilos.titulo}>
            {saludoDeHoy(zum, nombre)}
          </h1>
        </div>
        {/* Al llenar una celda la frase cambia, y los lectores de pantalla la anuncian. */}
        <p className={estilos.frase} role="status">
          {fraseDeZum(zum, resumen)}
        </p>
        <PanalDeHoy
          className={estilos.panal}
          llenas={resumen.llenas}
          meta={resumen.meta}
          descripcion={descripcionDelPanal(resumen)}
        />
        <div className={estilos.acciones}>
          <Boton a="/celdas/nueva" estado={{ fondo }} className={estilos.crear}>
            Nueva actividad
          </Boton>
          {/* Las dos fichas van juntas: si no caben junto al botón, bajan las dos. */}
          <div className={estilos.fichas}>
            <Ficha icono={<IconoGota />}>{textoDeRacha(racha)}</Ficha>
            <Ficha icono={<IconoTarro />}>{textoDeReservas(racha.reservas)}</Ficha>
          </div>
        </div>
      </div>
    </section>
  );
}
