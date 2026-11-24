import { ErrorAlCargar, FranjaDeEstado, Silueta } from "../../componentes/ui/Estados.jsx";
import { IconoTarro } from "../../componentes/panal/iconos.jsx";
import { TituloDePestana } from "../../componentes/ui/Pagina.jsx";
import { CeldasDeHoy } from "./CeldasDeHoy.jsx";
import { Constancia } from "./Constancia.jsx";
import estilos from "./Hoy.module.css";
import { ResumenDeColmena } from "./ResumenDeColmena.jsx";
import { TarjetaPrincipal } from "./TarjetaPrincipal.jsx";
import { CARGANDO_TU_PANAL, ERROR_AL_CARGAR, HOY } from "./textos.js";
import { useHoy } from "./useHoy.js";

/** P04. Hoy: ver y cumplir lo del día. */
export function Hoy() {
  const hoy = useHoy();

  if (hoy.cargando || hoy.fallo) {
    return (
      <div className={estilos.hoy}>
        <TituloDePestana>{HOY}</TituloDePestana>
        {hoy.cargando ? (
          <Silueta etiqueta={CARGANDO_TU_PANAL} bloques={[340, 320]} />
        ) : (
          <ErrorAlCargar titulo={ERROR_AL_CARGAR} alReintentar={hoy.reintentar} />
        )}
      </div>
    );
  }

  return (
    <div className={estilos.hoy}>
      <TituloDePestana>{HOY}</TituloDePestana>
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
        <Constancia constancia={hoy.constancia} />
      </div>
    </div>
  );
}
