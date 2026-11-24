import { ErrorAlCargar, Silueta } from "../../componentes/ui/Estados.jsx";
import { BarraDeAvance } from "../../componentes/ui/BarraDeAvance.jsx";
import { EscaleraDeOficios } from "../../componentes/panal/EscaleraDeOficios.jsx";
import { Pagina } from "../../componentes/ui/Pagina.jsx";
import { SelloDeCera } from "../../componentes/panal/SelloDeCera.jsx";
import { textoDeNivel } from "../../nucleo/textos.js";
import { Ventana } from "../../componentes/ui/Ventana.jsx";
import { Zum } from "../../componentes/panal/Zum.jsx";
import { Ajustes } from "./Ajustes.jsx";
import estilos from "./MiVuelo.module.css";
import {
  CARGANDO_TU_VUELO,
  conteoDeSellos,
  descripcionDeEscalera,
  ERROR_AL_CARGAR,
  ESCALERA_DE_OFICIOS,
  etiquetaDeSello,
  MI_VUELO,
  nombreDeSello,
  SELLOS_DE_CERA,
  SIN_SELLOS,
  textoDeSello,
  textoDeSiguienteOficio,
  textoDeTotales,
  TU_OFICIO,
} from "./textos.js";
import { useMiVuelo } from "./useMiVuelo.js";

/** P11. Mi vuelo: el oficio, los sellos y los ajustes. */
export function MiVuelo() {
  const vuelo = useMiVuelo();

  if (vuelo.cargando) return <Silueta etiqueta={CARGANDO_TU_VUELO} bloques={[160, 200, 320]} />;
  if (vuelo.fallo) {
    return (
      <Pagina titulo={MI_VUELO}>
        <ErrorAlCargar titulo={ERROR_AL_CARGAR} alReintentar={vuelo.reintentar} />
      </Pagina>
    );
  }

  const { oficio, resumen, sellos } = vuelo;

  return (
    <Pagina titulo={MI_VUELO}>
      <section className={estilos.perfil} aria-label={TU_OFICIO}>
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
          {resumen && <p className={estilos.totales}>{textoDeTotales(resumen)}</p>}
        </div>
      </section>

      {oficio && (
        <section className={estilos.tarjeta} aria-labelledby="titulo-oficios">
          <h2 id="titulo-oficios" className={estilos.titulo}>
            {ESCALERA_DE_OFICIOS}
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
            {SELLOS_DE_CERA}
          </h2>
          <span className={estilos.conteo}>{conteoDeSellos(sellos)}</span>
        </header>
        {sellos.ganados === 0 && <p className={estilos.nota}>{SIN_SELLOS}</p>}
        <ul className={estilos.sellos} role="list">
          {sellos.lista.map((sello) => (
            <li key={sello.id}>
              <button
                type="button"
                className={estilos.sello}
                data-siguiente={sello.siguiente ? "" : undefined}
                aria-label={etiquetaDeSello(sello)}
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
            {!vuelo.sello.oculto && <p className={estilos.criterio}>{vuelo.sello.criterio}</p>}
            <p>{textoDeSello(vuelo.sello)}</p>
            {vuelo.sello.avance !== null && <BarraDeAvance avance={vuelo.sello.avance} />}
          </div>
        </Ventana>
      )}
    </Pagina>
  );
}
