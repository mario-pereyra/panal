import { ErrorAlCargar, FranjaDeEstado } from "../../componentes/Estados.jsx";
import { IconoTarro } from "../../componentes/iconos.jsx";
import { CeldasDeHoy } from "./CeldasDeHoy.jsx";
import { Constancia } from "./Constancia.jsx";
import estilos from "./Hoy.module.css";
import { ResumenDeColmena } from "./ResumenDeColmena.jsx";
import { TarjetaPrincipal } from "./TarjetaPrincipal.jsx";
import { useHoy } from "./useHoy.js";

/** P04. Hoy: ver y cumplir lo del día. */
export function Hoy() {
  const hoy = useHoy();

  if (hoy.cargando) return <SiluetaDeHoy />;

  if (hoy.fallo || !hoy.persona) {
    return (
      <div className={estilos.hoy}>
        <title>Hoy · Panal</title>
        <ErrorAlCargar alReintentar={hoy.reintentar} />
      </div>
    );
  }

  return (
    <div className={estilos.hoy}>
      <title>Hoy · Panal</title>
      {hoy.franja && (
        <FranjaDeEstado tono={hoy.franja.tono} icono={<IconoTarro />} alCerrar={hoy.cerrarFranja}>
          {hoy.franja.texto}
        </FranjaDeEstado>
      )}
      <TarjetaPrincipal
        hoy={hoy.hoy}
        nombre={hoy.persona.nombre}
        zum={hoy.zum}
        resumen={hoy.resumen}
        racha={hoy.racha}
      />
      <div className={estilos.tarjetas}>
        <CeldasDeHoy celdas={hoy.celdas} resumen={hoy.resumen} alAlternar={hoy.alternarCelda} />
        <ResumenDeColmena colmena={hoy.colmena} />
        <Constancia semanas={hoy.constancia} />
      </div>
    </div>
  );
}

/**
 * La silueta de la pantalla mientras llega la primera respuesta. Aparece solo
 * si la carga tarda: una carga rápida no deja ver nada.
 */
function SiluetaDeHoy() {
  return (
    <div className={`${estilos.hoy} ${estilos.silueta}`} role="status">
      <title>Hoy · Panal</title>
      <span className="solo-lectores">Cargando tu panal</span>
      <div className={estilos.siluetaPrincipal} />
      <div className={estilos.tarjetas}>
        <div className={estilos.siluetaTarjeta} />
        <div className={estilos.siluetaTarjeta} />
        <div className={estilos.siluetaTarjeta} />
      </div>
    </div>
  );
}
