import { useId } from "react";
import { BarraDeAvance } from "../../componentes/ui/BarraDeAvance.jsx";
import { ErrorAlCargar, Silueta } from "../../componentes/ui/Estados.jsx";
import { EstadoVacio } from "../../componentes/panal/EstadoVacio.jsx";
import { Opciones } from "../../componentes/ui/Formulario.jsx";
import { Pagina } from "../../componentes/ui/Pagina.jsx";
import { PanalDeConstancia } from "../../componentes/panal/PanalDeConstancia.jsx";
import { RACHA_DE_VUELO } from "../../nucleo/textos.js";
import { Zum } from "../../componentes/panal/Zum.jsx";
import { Columnas, Tarros, TiraDeCeldas, VerComoTabla } from "./Graficas.jsx";
import estilos from "./Reportes.module.css";
import {
  CARGANDO_TUS_REPORTES,
  CELDAS_DEL_PERIODO,
  CELDAS_POR_DIA,
  COLUMNAS_DE_REPARTO,
  COLUMNAS_POR_DIA,
  columnasDeRondas,
  cumplimiento,
  enDias,
  ERROR_AL_CARGAR,
  FRASE_DE_COLMENAS,
  FRASE_DE_RECURRENTES,
  FRASE_DE_ZUM,
  fraseDeCeldasPorDia,
  fraseDeColmena,
  fraseDeConstancia,
  fraseDeReparto,
  fraseDeRondas,
  MEJOR_RACHA,
  PANAL_DE_CONSTANCIA,
  PERIODO,
  PERIODOS,
  REPORTES,
  SIN_HISTORIAL,
  SIN_RONDAS,
  TABLA_DE_CELDAS_POR_DIA,
  TABLA_DE_CONSTANCIA,
  TABLA_DE_REPARTO,
  TABLA_DE_RONDAS,
  TUS_COLMENAS,
  TUS_RECURRENTES,
  UNICAS_Y_RECURRENTES,
} from "./textos.js";
import { useReportes } from "./useReportes.js";

/** P10. Reportes: el progreso en gráficas hechas de celdas. */
export function Reportes() {
  const reportes = useReportes();

  if (reportes.cargando)
    return <Silueta etiqueta={CARGANDO_TUS_REPORTES} bloques={[120, 280, 280]} />;

  if (reportes.fallo) {
    return (
      <Pagina titulo={REPORTES}>
        <ErrorAlCargar titulo={ERROR_AL_CARGAR} alReintentar={reportes.reintentar} />
      </Pagina>
    );
  }

  if (reportes.sinHistorial) {
    return (
      <Pagina titulo={REPORTES}>
        <section className={estilos.vacio}>
          <EstadoVacio frase={SIN_HISTORIAL} />
        </section>
      </Pagina>
    );
  }

  const { celdasPorDia, constancia, racha, periodo, reparto } = reportes;

  return (
    <Pagina titulo={REPORTES}>
      <dl className={estilos.cifras}>
        <div>
          <dt>{CELDAS_DEL_PERIODO[periodo]}</dt>
          <dd>{celdasPorDia?.total ?? "–"}</dd>
        </div>
        <div>
          <dt>{RACHA_DE_VUELO}</dt>
          <dd>{enDias(racha.actual)}</dd>
        </div>
        <div>
          <dt>{MEJOR_RACHA}</dt>
          <dd>{enDias(racha.mejor)}</dd>
        </div>
      </dl>

      <div className={estilos.rejilla}>
        <Grafica titulo={PANAL_DE_CONSTANCIA} frase={fraseDeConstancia(constancia)} ancha>
          <div className={estilos.constancia}>
            <PanalDeConstancia
              semanas={constancia.semanas}
              descripcion={fraseDeConstancia(constancia)}
            />
          </div>
          <VerComoTabla
            titulo={TABLA_DE_CONSTANCIA}
            columnas={COLUMNAS_POR_DIA}
            filas={reportes.tablaDeConstancia}
          />
        </Grafica>

        <Grafica
          titulo={CELDAS_POR_DIA}
          frase={celdasPorDia ? fraseDeCeldasPorDia(celdasPorDia, periodo) : ""}
          ocupada={reportes.actualizando}
          ancha
          extra={
            <Opciones
              leyenda={PERIODO}
              leyendaVisible={false}
              nombre="periodo"
              opciones={PERIODOS}
              valor={periodo}
              alCambiar={reportes.elegirPeriodo}
            />
          }
        >
          {celdasPorDia && (
            <>
              <Columnas
                dias={celdasPorDia.semana}
                meta={reportes.persona.metaDiaria}
                descripcion={fraseDeCeldasPorDia(celdasPorDia, periodo)}
              />
              <VerComoTabla
                titulo={TABLA_DE_CELDAS_POR_DIA}
                columnas={COLUMNAS_POR_DIA}
                filas={reportes.tablaDeCeldasPorDia}
              />
            </>
          )}
        </Grafica>

        <Grafica titulo={TUS_RECURRENTES} frase={FRASE_DE_RECURRENTES}>
          {reportes.rondas.length === 0 ? (
            <p className={estilos.nota}>{SIN_RONDAS}</p>
          ) : (
            <>
              <ul className={estilos.rondas} role="list">
                {reportes.rondas.map((ronda) => (
                  <li key={ronda.actividadId} className={estilos.ronda}>
                    <span className={estilos.tituloDeRonda}>{ronda.titulo}</span>
                    <TiraDeCeldas dias={ronda.dias} />
                    <span className={estilos.porcentaje}>{cumplimiento(ronda)}</span>
                  </li>
                ))}
              </ul>
              <p className="solo-lectores">{fraseDeRondas(reportes.rondas)}</p>
              <VerComoTabla
                titulo={TABLA_DE_RONDAS}
                columnas={columnasDeRondas(reportes.tablaDeRondas.dias)}
                filas={reportes.tablaDeRondas.filas}
              />
            </>
          )}
        </Grafica>

        <Grafica titulo={UNICAS_Y_RECURRENTES} frase={reparto ? fraseDeReparto(reparto) : ""}>
          {reparto && (
            <>
              <Tarros tarros={reparto} descripcion={fraseDeReparto(reparto)} />
              <VerComoTabla
                titulo={TABLA_DE_REPARTO}
                columnas={COLUMNAS_DE_REPARTO}
                filas={reparto.map((tarro) => [tarro.nombre, tarro.cantidad])}
              />
            </>
          )}
        </Grafica>

        {reportes.colmenas.length > 0 && (
          <Grafica titulo={TUS_COLMENAS} frase={FRASE_DE_COLMENAS} ancha>
            <div className={estilos.colmenas}>
              {reportes.colmenas.map((colmena) => (
                <section
                  key={colmena.id}
                  className={estilos.colmena}
                  aria-labelledby={`aporte-${colmena.id}`}
                >
                  <h3 id={`aporte-${colmena.id}`} className={estilos.nombreDeColmena}>
                    {colmena.nombre}
                  </h3>
                  {colmena.total === 0 ? (
                    <p className={estilos.nota}>{fraseDeColmena(colmena)}</p>
                  ) : (
                    <>
                      <p className="solo-lectores">{fraseDeColmena(colmena)}</p>
                      <ul className={estilos.aportes} role="list" aria-hidden="true">
                        {colmena.aportes.map((abeja) => (
                          <li key={abeja.id} style={{ "--color-abeja": abeja.color }}>
                            <span className={estilos.avatar}>{abeja.inicial}</span>
                            <span className={estilos.nombre}>{abeja.nombre}</span>
                            <BarraDeAvance avance={abeja.parte} color={abeja.color} />
                            <span className={estilos.cantidad}>{abeja.celdas}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </section>
              ))}
            </div>
          </Grafica>
        )}
      </div>

      <aside className={estilos.zum}>
        <Zum estado="animando" tamanos="72px" className={estilos.retrato} />
        <p>{FRASE_DE_ZUM}</p>
      </aside>
    </Pagina>
  );
}

function Grafica({ titulo, frase, extra, ancha = false, ocupada = false, children }) {
  const id = useId();
  return (
    <section
      className={estilos.grafica}
      data-ancha={ancha ? "" : undefined}
      aria-labelledby={id}
      aria-busy={ocupada || undefined}
    >
      <header className={estilos.cabeza}>
        <h2 id={id} className={estilos.titulo}>
          {titulo}
        </h2>
        {extra}
      </header>
      {frase && (
        <p className={estilos.frase} aria-hidden="true">
          {frase}
        </p>
      )}
      {children}
    </section>
  );
}
