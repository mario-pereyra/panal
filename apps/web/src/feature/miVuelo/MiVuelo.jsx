import { DIAS_DE_INVERNADA } from "@panal/contratos";
import { DIAS_DE_LA_SEMANA, GOTAS, sumarDias, TOPE_SUAVE_DIARIO } from "@panal/motor";
import { useState } from "react";
import { Boton } from "../../componentes/Controles.jsx";
import { ErrorAlCargar, Silueta } from "../../componentes/Estados.jsx";
import { Campo, Interruptor, Opciones, Selector } from "../../componentes/Formulario.jsx";
import { BarraDeAvance, EscaleraDeOficios } from "../../componentes/Graficas.jsx";
import { Pagina } from "../../componentes/Pagina.jsx";
import { SelloDeCera } from "../../componentes/SelloDeCera.jsx";
import { conMayuscula, cuenta, fechaCorta } from "../../componentes/textos.js";
import { Ventana } from "../../componentes/Ventana.jsx";
import { Zum } from "../../componentes/Zum.jsx";
import estilos from "./MiVuelo.module.css";
import {
  AYUDA_DE_DIA_SIN_FLORES,
  AYUDA_DE_INVERNADA,
  AYUDA_DE_MOVIMIENTO,
  COMO_SE_GANAN,
  descripcionDeEscalera,
  NOMBRES_DEL_DESGLOSE,
  NOTA_DE_META,
  nombreDeSello,
  TAMANOS_DE_PANAL,
  textoDeNivel,
  textoDeSello,
  textoDeSiguienteOficio,
} from "./textos.js";
import { useMiVuelo } from "./useMiVuelo.js";

/** P11. Mi vuelo: el oficio, los sellos y los ajustes. */
export function MiVuelo() {
  const vuelo = useMiVuelo();

  if (vuelo.cargando) return <Silueta etiqueta="Cargando tu vuelo" bloques={[160, 200, 320]} />;
  if (vuelo.fallo) {
    return (
      <Pagina titulo="Mi vuelo">
        <ErrorAlCargar titulo="No pudimos traer tu vuelo" alReintentar={vuelo.reintentar} />
      </Pagina>
    );
  }

  const { oficio, resumen, sellos } = vuelo;

  return (
    <Pagina titulo="Mi vuelo">
      <section className={estilos.perfil} aria-label="Tu oficio">
        <Zum
          estado="feliz"
          conFondo
          principal
          tamanos="(max-width: 699px) 120px, 160px"
          className={estilos.retrato}
        />
        <div className={estilos.datos}>
          <p className={estilos.nombre}>{vuelo.yo?.nombre}</p>
          {oficio && <p className={estilos.nivel}>{textoDeNivel(oficio)}</p>}
          {resumen && (
            <p className={estilos.totales}>
              {cuenta(resumen.gotas.total, "gota de miel", "gotas de miel")} ·{" "}
              {`racha de ${cuenta(resumen.racha.actual, "día", "días")}`} ·{" "}
              {`${cuenta(resumen.racha.reservas, "reserva", "reservas")}`}
            </p>
          )}
        </div>
      </section>

      {oficio && (
        <section className={estilos.tarjeta} aria-labelledby="titulo-oficios">
          <h2 id="titulo-oficios" className={estilos.titulo}>
            Escalera de oficios
          </h2>
          <EscaleraDeOficios nivel={oficio.nivel} descripcion={descripcionDeEscalera(oficio)} />
          <div className={estilos.siguiente}>
            <BarraDeAvance avance={oficio.avance} />
            <p>{textoDeSiguienteOficio(oficio)}</p>
          </div>
        </section>
      )}

      <section className={estilos.tarjeta} aria-labelledby="titulo-sellos">
        <header className={estilos.cabeza}>
          <h2 id="titulo-sellos" className={estilos.titulo}>
            Sellos de cera
          </h2>
          <span className={estilos.conteo}>
            {sellos.ganados} de {sellos.total}
          </span>
        </header>
        {sellos.ganados === 0 && (
          <p className={estilos.nota}>
            Tu primer sello está a una celda de distancia. El resaltado es el siguiente.
          </p>
        )}
        <ul className={estilos.sellos} role="list">
          {sellos.lista.map((sello) => (
            <li key={sello.id}>
              <button
                type="button"
                className={estilos.sello}
                data-siguiente={sello.siguiente ? "" : undefined}
                aria-label={`${nombreDeSello(sello)}${sello.ganado ? ", ganado" : ""}${sello.siguiente ? ", el siguiente" : ""}`}
                onClick={() => vuelo.abrirSello(sello.id)}
              >
                <SelloDeCera
                  id={sello.id}
                  ganado={sello.ganado}
                  secreto={sello.secreto}
                  tamano={64}
                />
                <span className={estilos.nombreDeSello} aria-hidden="true">
                  {nombreDeSello(sello)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <Ajustes vuelo={vuelo} />

      {vuelo.sello && (
        <Ventana
          titulo={nombreDeSello(vuelo.sello)}
          alCerrar={vuelo.cerrarSello}
          cerrarAlTocarFuera
        >
          <div className={estilos.detalleDeSello}>
            <SelloDeCera
              id={vuelo.sello.id}
              ganado={vuelo.sello.ganado}
              secreto={vuelo.sello.secreto}
              tamano={120}
            />
            {!(vuelo.sello.secreto && !vuelo.sello.ganado) && (
              <p className={estilos.criterio}>{vuelo.sello.criterio}</p>
            )}
            <p>{textoDeSello(vuelo.sello)}</p>
            {!vuelo.sello.ganado &&
              vuelo.sello.disponible &&
              !vuelo.sello.secreto &&
              vuelo.sello.meta > 1 && (
                <BarraDeAvance avance={vuelo.sello.actual / vuelo.sello.meta} />
              )}
          </div>
        </Ventana>
      )}
    </Pagina>
  );
}

function Ajustes({ vuelo }) {
  const { ajustes } = vuelo;
  if (!ajustes) return null;
  const hoy = vuelo.resumen?.hoy;
  const desactivado = !vuelo.enLinea || vuelo.guardando;
  const metaVisible = ajustes.metaSiguiente ?? ajustes.metaDiaria;

  return (
    <section className={estilos.tarjeta} aria-labelledby="titulo-ajustes">
      <h2 id="titulo-ajustes" className={estilos.titulo}>
        Ajustes
      </h2>
      {!vuelo.enLinea && (
        <p className={estilos.nota}>
          Sin conexión: los ajustes se pueden cambiar cuando vuelva la señal.
        </p>
      )}

      <div className={estilos.ajustes}>
        <div className={estilos.ajuste}>
          <fieldset disabled={desactivado} className={estilos.sinMarco}>
            <Opciones
              leyenda="Tamaño del panal"
              nombre="metaDiaria"
              opciones={TAMANOS_DE_PANAL}
              valor={metaVisible}
              alCambiar={(metaDiaria) =>
                vuelo.guardarAjuste(
                  { metaDiaria },
                  metaDiaria === ajustes.metaDiaria
                    ? "Tu panal queda como estaba"
                    : NOTA_DE_META(metaDiaria),
                )
              }
            />
          </fieldset>
          {ajustes.metaSiguiente && ajustes.metaSiguiente !== ajustes.metaDiaria && (
            <p
              className={estilos.nota}
            >{`Hoy tu panal tiene ${ajustes.metaDiaria} celdas. ${NOTA_DE_META(ajustes.metaSiguiente)}`}</p>
          )}
        </div>

        <div className={estilos.ajuste}>
          <Selector
            etiqueta="Día sin flores"
            ayuda={AYUDA_DE_DIA_SIN_FLORES}
            value={ajustes.diaSinFlores ?? ""}
            disabled={desactivado}
            onChange={(evento) =>
              vuelo.guardarAjuste({
                diaSinFlores: evento.target.value === "" ? null : Number(evento.target.value),
              })
            }
            opciones={[
              { valor: "", etiqueta: "Ninguno" },
              ...DIAS_DE_LA_SEMANA.map((nombre, valor) => ({
                valor,
                etiqueta: conMayuscula(nombre),
              })),
            ]}
          />
        </div>

        <Invernada vuelo={vuelo} hoy={hoy} desactivado={desactivado} />

        <ZonaHoraria vuelo={vuelo} desactivado={desactivado} />

        <div className={estilos.ajuste}>
          <Interruptor
            etiqueta="Reducir animaciones"
            descripcion={AYUDA_DE_MOVIMIENTO}
            encendido={vuelo.movimiento === "reducido"}
            alCambiar={(encendido) => vuelo.elegirMovimiento(encendido ? "reducido" : "sistema")}
          />
        </div>
      </div>

      <details className={estilos.comoSeGanan}>
        <summary>Cómo se ganan las gotas</summary>
        <table>
          <caption className="solo-lectores">Gotas que vale cada logro</caption>
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
            <h3 className={estilos.subtitulo}>Tus gotas, de dónde vienen</h3>
            <table>
              <caption className="solo-lectores">Tus gotas por origen</caption>
              <tbody>
                {Object.entries(vuelo.resumen.gotas.desglose).map(([origen, gotas]) => (
                  <tr key={origen}>
                    <th scope="row">{NOMBRES_DEL_DESGLOSE[origen] ?? origen}</th>
                    <td>{gotas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <p className={estilos.nota}>
          {`Pasadas las primeras ${TOPE_SUAVE_DIARIO} celdas del día, cada una vale ${GOTAS.trasElTope} gotas: el panal premia la constancia, no el atracón.`}
        </p>
      </details>

      <div className={estilos.acciones}>
        {vuelo.puedeInstalar && (
          <Boton tono="claro" onClick={vuelo.instalar}>
            Instalar Panal
          </Boton>
        )}
        {vuelo.instalada && (
          <p className={estilos.nota}>Ya tienes Panal instalado en este dispositivo.</p>
        )}
        <Boton tono="peligro" onClick={vuelo.cerrarSesion} disabled={vuelo.saliendo}>
          {vuelo.saliendo ? "Cerrando sesión…" : "Cerrar sesión"}
        </Boton>
      </div>
    </section>
  );
}

/** La invernada: una pausa con fecha de fin, de hasta catorce días. */
function Invernada({ vuelo, hoy, desactivado }) {
  const actual = vuelo.ajustes.invernada;
  const activa = Boolean(actual && hoy && actual.hasta >= hoy);
  const [eligiendo, setEligiendo] = useState(false);
  const [hasta, setHasta] = useState(() => (hoy ? sumarDias(hoy, 6) : ""));
  const maximo = hoy ? sumarDias(hoy, DIAS_DE_INVERNADA - 1) : undefined;

  const empezar = async (evento) => {
    evento.preventDefault();
    if (!hasta || !hoy) return;
    if (
      await vuelo.guardarAjuste(
        { invernada: { desde: hoy, hasta } },
        `Invernada hasta el ${fechaCorta(hasta)}. Zum cuida tu racha.`,
      )
    ) {
      setEligiendo(false);
    }
  };

  return (
    <div className={estilos.ajuste}>
      <Interruptor
        etiqueta="Invernada"
        descripcion={
          activa ? `En invernada hasta el ${fechaCorta(actual.hasta)}.` : AYUDA_DE_INVERNADA
        }
        encendido={activa || eligiendo}
        disabled={desactivado}
        alCambiar={(encendido) => {
          if (encendido) setEligiendo(true);
          else if (activa)
            vuelo.guardarAjuste(
              { invernada: null },
              "Invernada terminada: qué bueno verte de vuelta.",
            );
          else setEligiendo(false);
        }}
      />
      {eligiendo && !activa && (
        <form className={estilos.invernada} onSubmit={empezar}>
          <Campo
            etiqueta="Hasta"
            type="date"
            min={hoy}
            max={maximo}
            value={hasta}
            onChange={(evento) => setHasta(evento.target.value)}
            required
          />
          <Boton type="submit" tamano="chico" disabled={desactivado || !hasta}>
            Empezar invernada
          </Boton>
        </form>
      )}
    </div>
  );
}

function zonasDisponibles(actual) {
  let zonas = [];
  try {
    zonas = Intl.supportedValuesOf("timeZone");
  } catch {
    zonas = [];
  }
  return zonas.includes(actual) ? zonas : [actual, ...zonas];
}

function ZonaHoraria({ vuelo, desactivado }) {
  const actual = vuelo.ajustes.zonaHoraria;
  const delDispositivo = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [zonas] = useState(() => zonasDisponibles(actual));
  return (
    <div className={estilos.ajuste}>
      <Selector
        etiqueta="Zona horaria"
        ayuda="El día de Panal cambia a las 3 de la madrugada de esta zona."
        value={actual}
        disabled={desactivado}
        onChange={(evento) => vuelo.guardarAjuste({ zonaHoraria: evento.target.value })}
        opciones={zonas.map((zona) => ({ valor: zona, etiqueta: zona.replaceAll("_", " ") }))}
      />
      {delDispositivo && delDispositivo !== actual && (
        <Boton
          tono="sutil"
          tamano="chico"
          disabled={desactivado}
          onClick={() => vuelo.guardarAjuste({ zonaHoraria: delDispositivo })}
        >
          Usar la de este dispositivo ({delDispositivo.replaceAll("_", " ")})
        </Boton>
      )}
    </div>
  );
}
