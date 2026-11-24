import { Boton, Ficha } from "../../componentes/ui/Controles.jsx";
import { IconoGota, IconoTarro } from "../../componentes/panal/iconos.jsx";
import { PanalDeHoy } from "../../componentes/panal/PanalDeHoy.jsx";
import { Zum } from "../../componentes/panal/Zum.jsx";
import estilos from "./TarjetaPrincipal.module.css";
import { fechaLarga } from "../../lib/formato.js";
import { NUEVA_ACTIVIDAD, textoDeRachaDeVuelo, textoDeReservas } from "../../nucleo/textos.js";
import { descripcionDelPanal, fraseDeZum, saludoDeHoy } from "./textos.js";

export function TarjetaPrincipal({ hoy, nombre, zum, resumen, racha }) {
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
          // El corte de 940 px del contenedor, en ancho de ventana: más 64 px de márgenes y 5 de bordes.
          tamanos="(min-width: 1009px) 240px, 128px"
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
          <Boton a="/celdas/nueva" ventana className={estilos.crear}>
            {NUEVA_ACTIVIDAD}
          </Boton>
          {/* Las dos fichas van juntas: si no caben junto al botón, bajan las dos. */}
          <div className={estilos.fichas}>
            <Ficha icono={<IconoGota />}>{textoDeRachaDeVuelo(racha.actual)}</Ficha>
            <Ficha icono={<IconoTarro />}>{textoDeReservas(racha.reservas)}</Ficha>
          </div>
        </div>
      </div>
    </section>
  );
}
