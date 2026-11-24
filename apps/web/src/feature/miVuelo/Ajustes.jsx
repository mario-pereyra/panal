import { useState } from "react";
import { AvisoSinConexion, Boton } from "../../componentes/ui/Controles.jsx";
import { Campo, Interruptor, Opciones, Selector } from "../../componentes/ui/Formulario.jsx";
import { zonaDelDispositivo } from "../../lib/dispositivo.js";
import estilos from "./MiVuelo.module.css";
import {
  AJUSTES,
  AYUDA_DE_DIA_SIN_FLORES,
  AYUDA_DE_MOVIMIENTO,
  AYUDA_DE_ZONA,
  CERRANDO_SESION,
  CERRAR_SESION,
  COMO_SE_GANAN,
  COMO_SE_GANAN_LAS_GOTAS,
  confirmacionDeMeta,
  descripcionDeInvernada,
  DIA_SIN_FLORES,
  DIAS_SIN_FLORES,
  EMPEZAR_INVERNADA,
  GOTAS_POR_LOGRO,
  GOTAS_POR_ORIGEN,
  HASTA,
  INSTALAR_PANAL,
  INVERNADA,
  INVERNADA_TERMINADA,
  invernadaEmpezada,
  nombreDeZona,
  NOMBRES_DEL_DESGLOSE,
  NOTA_DEL_TOPE,
  notaDeMetaDeManana,
  PANAL_INSTALADO,
  REDUCIR_ANIMACIONES,
  SIN_CONEXION,
  TAMANO_DEL_PANAL,
  TAMANOS_DE_PANAL,
  TUS_GOTAS,
  usarZonaDelDispositivo,
  ZONA_HORARIA,
} from "./textos.js";

export function Ajustes({ vuelo }) {
  const { ajustes } = vuelo;
  if (!ajustes) return null;
  const desactivado = !vuelo.enLinea || vuelo.guardando;

  return (
    <section className={estilos.tarjeta} aria-labelledby="titulo-ajustes">
      <h2 id="titulo-ajustes" className={estilos.titulo}>
        {AJUSTES}
      </h2>
      {!vuelo.enLinea && <AvisoSinConexion>{SIN_CONEXION}</AvisoSinConexion>}

      <div className={estilos.ajustes}>
        <div className={estilos.ajuste}>
          <fieldset disabled={desactivado} className={estilos.sinMarco}>
            <Opciones
              leyenda={TAMANO_DEL_PANAL}
              nombre="metaDiaria"
              opciones={TAMANOS_DE_PANAL}
              valor={ajustes.metaElegida}
              alCambiar={(metaDiaria) =>
                vuelo.guardarAjuste(
                  { metaDiaria },
                  confirmacionDeMeta(metaDiaria, ajustes.metaDiaria),
                )
              }
            />
          </fieldset>
          {ajustes.metaDeManana && <p className={estilos.nota}>{notaDeMetaDeManana(ajustes)}</p>}
        </div>

        <div className={estilos.ajuste}>
          <Selector
            etiqueta={DIA_SIN_FLORES}
            ayuda={AYUDA_DE_DIA_SIN_FLORES}
            value={ajustes.diaSinFlores ?? ""}
            disabled={desactivado}
            onChange={(evento) =>
              vuelo.guardarAjuste({
                diaSinFlores: evento.target.value === "" ? null : Number(evento.target.value),
              })
            }
            opciones={DIAS_SIN_FLORES}
          />
        </div>

        {vuelo.invernada && (
          <Invernada
            invernada={vuelo.invernada}
            guardarAjuste={vuelo.guardarAjuste}
            desactivado={desactivado}
          />
        )}

        <ZonaHoraria
          actual={ajustes.zonaHoraria}
          guardarAjuste={vuelo.guardarAjuste}
          desactivado={desactivado}
        />

        <div className={estilos.ajuste}>
          <Interruptor
            etiqueta={REDUCIR_ANIMACIONES}
            descripcion={AYUDA_DE_MOVIMIENTO}
            encendido={vuelo.movimiento === "reducido"}
            alCambiar={(encendido) => vuelo.elegirMovimiento(encendido ? "reducido" : "sistema")}
          />
        </div>
      </div>

      <details className={estilos.comoSeGanan}>
        <summary>{COMO_SE_GANAN_LAS_GOTAS}</summary>
        <table>
          <caption className="solo-lectores">{GOTAS_POR_LOGRO}</caption>
          <tbody>
            {COMO_SE_GANAN.map(([logro, gotas]) => (
              <tr key={logro}>
                <th scope="row">{logro}</th>
                <td>+{gotas}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {vuelo.resumen && (
          <>
            <h3 className={estilos.subtitulo}>{TUS_GOTAS}</h3>
            <table>
              <caption className="solo-lectores">{GOTAS_POR_ORIGEN}</caption>
              <tbody>
                {Object.entries(vuelo.resumen.gotas.desglose).map(([origen, gotas]) => (
                  <tr key={origen}>
                    <th scope="row">{NOMBRES_DEL_DESGLOSE[origen]}</th>
                    <td>{gotas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <p className={estilos.nota}>{NOTA_DEL_TOPE}</p>
      </details>

      <div className={estilos.acciones}>
        {vuelo.puedeInstalar && (
          <Boton tono="claro" onClick={vuelo.instalar}>
            {INSTALAR_PANAL}
          </Boton>
        )}
        {vuelo.instalada && <p className={estilos.nota}>{PANAL_INSTALADO}</p>}
        <Boton tono="peligro" onClick={vuelo.cerrarSesion} disabled={vuelo.saliendo}>
          {vuelo.saliendo ? CERRANDO_SESION : CERRAR_SESION}
        </Boton>
      </div>
    </section>
  );
}

function Invernada({ invernada, guardarAjuste, desactivado }) {
  const { hoy, vigenteHasta } = invernada;
  const [eligiendo, setEligiendo] = useState(false);
  const [hasta, setHasta] = useState(invernada.propuesta);

  const empezar = async (evento) => {
    evento.preventDefault();
    if (await guardarAjuste({ invernada: { desde: hoy, hasta } }, invernadaEmpezada(hasta))) {
      setEligiendo(false);
    }
  };

  return (
    <div className={estilos.ajuste}>
      <Interruptor
        etiqueta={INVERNADA}
        descripcion={descripcionDeInvernada(vigenteHasta)}
        encendido={Boolean(vigenteHasta) || eligiendo}
        disabled={desactivado}
        alCambiar={(encendido) => {
          if (encendido) setEligiendo(true);
          else if (vigenteHasta) guardarAjuste({ invernada: null }, INVERNADA_TERMINADA);
          else setEligiendo(false);
        }}
      />
      {eligiendo && !vigenteHasta && (
        <form className={estilos.invernada} onSubmit={empezar}>
          <Campo
            etiqueta={HASTA}
            type="date"
            min={hoy}
            max={invernada.maximo}
            value={hasta}
            onChange={(evento) => setHasta(evento.target.value)}
            required
          />
          <Boton type="submit" tamano="chico" disabled={desactivado || !hasta}>
            {EMPEZAR_INVERNADA}
          </Boton>
        </form>
      )}
    </div>
  );
}

// Safari antes de la 15.4 no tiene Intl.supportedValuesOf: ahí la lista queda con la zona actual.
function zonasDisponibles(actual) {
  const zonas = Intl.supportedValuesOf?.("timeZone") ?? [];
  return zonas.includes(actual) ? zonas : [actual, ...zonas];
}

function ZonaHoraria({ actual, guardarAjuste, desactivado }) {
  const delDispositivo = zonaDelDispositivo();
  const [zonas] = useState(() => zonasDisponibles(actual));
  return (
    <div className={estilos.ajuste}>
      <Selector
        etiqueta={ZONA_HORARIA}
        ayuda={AYUDA_DE_ZONA}
        value={actual}
        disabled={desactivado}
        onChange={(evento) => guardarAjuste({ zonaHoraria: evento.target.value })}
        opciones={zonas.map((zona) => ({ valor: zona, etiqueta: nombreDeZona(zona) }))}
      />
      {delDispositivo && delDispositivo !== actual && (
        <Boton
          tono="sutil"
          tamano="chico"
          disabled={desactivado}
          onClick={() => guardarAjuste({ zonaHoraria: delDispositivo })}
        >
          {usarZonaDelDispositivo(delDispositivo)}
        </Boton>
      )}
    </div>
  );
}
