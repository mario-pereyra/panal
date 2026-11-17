import { useId } from "react";
import { EstadoVacio, ErrorAlCargar, Silueta } from "../../componentes/Estados.jsx";
import { Opciones } from "../../componentes/Formulario.jsx";
import {
  BarraDeAvance,
  Columnas,
  Tarros,
  TiraDeCeldas,
  VerComoTabla,
} from "../../componentes/Graficas.jsx";
import { puntosDeHexagono } from "../../componentes/hexagono.js";
import { Pagina } from "../../componentes/Pagina.jsx";
import { PanalDeConstancia } from "../../componentes/PanalDeConstancia.jsx";
import { cuenta, diaConNombre, fechaCorta } from "../../componentes/textos.js";
import { Zum } from "../../componentes/Zum.jsx";
import { PERIODOS } from "./reportesSelector.js";
import estilos from "./Reportes.module.css";
import {
  fraseDeCeldasPorDia,
  fraseDeColmena,
  fraseDeConstancia,
  fraseDeReparto,
  fraseDeRondas,
  cumplimiento,
  SIN_HISTORIAL,
} from "./textos.js";
import { useReportes } from "./useReportes.js";

const NIVELES = ["Sin celdas", "Al menos una", "La mitad o más", "Panal cerrado"];
const MUESTRA = puntosDeHexagono(7.5);

/** P10. Reportes: el progreso en gráficas hechas de celdas. */
export function Reportes() {
  const reportes = useReportes();

  if (reportes.cargando)
    return <Silueta etiqueta="Cargando tus reportes" bloques={[120, 280, 280]} />;

  if (reportes.fallo && !reportes.celdasPorDia) {
    return (
      <Pagina titulo="Reportes">
        <ErrorAlCargar titulo="No pudimos traer tus reportes" alReintentar={reportes.reintentar} />
      </Pagina>
    );
  }

  if (reportes.sinHistorial) {
    return (
      <Pagina titulo="Reportes">
        <section className={estilos.vacio}>
          <EstadoVacio frase={SIN_HISTORIAL} />
        </section>
      </Pagina>
    );
  }

  const { celdasPorDia, racha, periodo } = reportes;

  return (
    <Pagina titulo="Reportes">
      <dl className={estilos.cifras}>
        <div>
          <dt>Celdas {periodo === "semana" ? "de la semana" : "del periodo"}</dt>
          <dd>{celdasPorDia?.total ?? "–"}</dd>
        </div>
        <div>
          <dt>Racha de vuelo</dt>
          <dd>{cuenta(racha?.actual ?? 0, "día", "días")}</dd>
        </div>
        <div>
          <dt>Mejor racha</dt>
          <dd>{cuenta(racha?.mejor ?? 0, "día", "días")}</dd>
        </div>
      </dl>

      <div className={estilos.rejilla}>
        <Grafica titulo="Panal de constancia" frase={fraseDeConstancia(reportes.constancia)} ancha>
          <div className={estilos.constancia}>
            <PanalDeConstancia
              semanas={reportes.constancia}
              descripcion={fraseDeConstancia(reportes.constancia)}
            />
            <ul className={estilos.leyenda} role="list" aria-label="Leyenda">
              {NIVELES.map((nombre, nivel) => (
                <li key={nombre}>
                  <svg
                    className={estilos.muestra}
                    data-nivel={nivel}
                    viewBox="-8 -9 16 18"
                    aria-hidden="true"
                  >
                    <polygon points={MUESTRA} />
                  </svg>
                  {nombre}
                </li>
              ))}
            </ul>
          </div>
          <VerComoTabla
            titulo="Celdas llenas por día en las últimas semanas"
            columnas={["Día", "Celdas llenas"]}
            filas={reportes.constancia
              .flat()
              .filter((dia) => !dia.futuro)
              .map((dia) => [diaConNombre(dia.dia), dia.llenas])}
          />
        </Grafica>

        <Grafica
          titulo="Celdas por día"
          frase={celdasPorDia ? fraseDeCeldasPorDia(celdasPorDia, periodo) : ""}
          ocupada={reportes.actualizando}
          ancha
          extra={
            <Opciones
              leyenda="Periodo"
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
                meta={reportes.persona?.metaDiaria ?? 5}
                descripcion={fraseDeCeldasPorDia(celdasPorDia, periodo)}
              />
              <VerComoTabla
                titulo="Celdas llenas por día"
                columnas={["Día", "Celdas llenas"]}
                filas={celdasPorDia.dias.map((dia) => [
                  periodo === "semana" ? diaConNombre(dia.dia) : fechaCorta(dia.dia),
                  dia.llenas,
                ])}
              />
            </>
          )}
        </Grafica>

        <Grafica
          titulo="Tus recurrentes"
          frase="Los últimos siete días: llena si la cumpliste, punteada si no tocaba."
        >
          {reportes.rondas.length === 0 ? (
            <p className={estilos.nota}>{fraseDeRondas([])}</p>
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
                titulo="Cumplimiento de tus recurrentes en los últimos siete días"
                columnas={[
                  "Celda",
                  ...reportes.rondas[0].dias.map((dia) => diaConNombre(dia.dia)),
                  "Cumplimiento",
                ]}
                filas={reportes.rondas.map((ronda) => [
                  ronda.titulo,
                  ...ronda.dias.map((dia) =>
                    dia.llena ? "Llena" : dia.tocaba ? "Pendiente" : "No tocaba",
                  ),
                  cumplimiento(ronda),
                ])}
              />
            </>
          )}
        </Grafica>

        <Grafica titulo="Únicas y recurrentes" frase={fraseDeReparto(reportes.reparto)}>
          <Tarros tarros={reportes.reparto} descripcion={fraseDeReparto(reportes.reparto)} />
          <VerComoTabla
            titulo="Celdas llenas por tipo"
            columnas={["Tipo", "Celdas llenas"]}
            filas={reportes.reparto.map((tarro) => [tarro.nombre, tarro.cantidad])}
          />
        </Grafica>

        {reportes.colmenas.length > 0 && (
          <Grafica titulo="Tus colmenas" frase="Lo que aportó cada abeja en este periodo." ancha>
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
                  <p className="solo-lectores">{fraseDeColmena(colmena)}</p>
                  {colmena.total === 0 ? (
                    <p className={estilos.nota}>{fraseDeColmena(colmena)}</p>
                  ) : (
                    <ul className={estilos.aportes} role="list" aria-hidden="true">
                      {colmena.aportes.map((abeja) => (
                        <li key={abeja.id} style={{ "--color-abeja": abeja.color }}>
                          <span className={estilos.avatar}>
                            {abeja.nombre.charAt(0).toUpperCase()}
                          </span>
                          <span className={estilos.nombre}>{abeja.nombre}</span>
                          <BarraDeAvance avance={abeja.parte} />
                          <span className={estilos.cantidad}>{abeja.celdas}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </Grafica>
        )}
      </div>

      <aside className={estilos.zum}>
        <Zum estado="animando" tamanos="72px" className={estilos.retrato} />
        <p>Mirar atrás también es avanzar: aquí se ve cada gota que juntaste.</p>
      </aside>
    </Pagina>
  );
}

/** Una gráfica en su tarjeta: título, la frase que la resume y su tabla. */
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
