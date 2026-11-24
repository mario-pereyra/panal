import { diaDeLaSemana } from "@panal/motor";
import { useId } from "react";
import { puntosDeHexagono } from "../../componentes/ui/hexagono.js";
import { INICIALES_DE_LA_SEMANA } from "../../lib/formato.js";
import estilos from "./Graficas.module.css";
import { VER_COMO_TABLA } from "./textos.js";

/**
 * Las gráficas de Reportes. Todas están hechas de celdas y todas se describen
 * en texto: el dibujo es para quien ve; la tabla de "Ver como tabla" y la
 * descripción, para todas las personas.
 */

const inicialDelDia = (dia) => INICIALES_DE_LA_SEMANA[diaDeLaSemana(dia)];

/**
 * Celdas por día: una columna por día. Con pocos días cada columna es una pila
 * de celdas; con muchos, una barra.
 *
 * @param {object} props
 * @param {Array<{ dia: string, llenas: number, futuro?: boolean }>} props.dias Un día `futuro` se rotula, apagado, y no tiene celdas.
 * @param {number} props.meta La meta diaria: una línea punteada la marca.
 */
export function Columnas({ dias, meta, descripcion }) {
  const pocos = dias.length <= 14;
  const maximo = Math.max(meta, ...dias.map((dia) => dia.llenas), 1);
  const paso = pocos ? 44 : 14;
  const alto = 160;
  const base = alto - 22;
  const escala = (base - 14) / maximo;
  const ancho = paso * dias.length + 12;
  const radio = Math.min(14, (escala * 1.15) / 2);
  const puntos = puntosDeHexagono(radio, "plano");

  return (
    <svg
      className={estilos.columnas}
      role="img"
      aria-label={descripcion}
      viewBox={`0 0 ${ancho} ${alto}`}
    >
      <line
        className={estilos.lineaDeMeta}
        x1="4"
        x2={ancho - 4}
        y1={base - meta * escala}
        y2={base - meta * escala}
      />
      {dias.map((dia, indice) => {
        const x = 6 + paso * indice + paso / 2;
        return (
          <g key={dia.dia}>
            {pocos ? (
              Array.from({ length: dia.llenas }, (_, celda) => (
                <polygon
                  key={celda}
                  className={estilos.celdaDeColumna}
                  data-cerrada={dia.llenas >= meta ? "" : undefined}
                  points={puntos}
                  transform={`translate(${x + (celda % 2 === 0 ? -radio * 0.45 : radio * 0.45)} ${base - escala * (celda + 0.5)})`}
                />
              ))
            ) : (
              <rect
                className={estilos.barra}
                data-cerrada={dia.llenas >= meta ? "" : undefined}
                x={x - paso * 0.32}
                y={base - dia.llenas * escala}
                width={paso * 0.64}
                height={Math.max(0, dia.llenas * escala)}
                rx="3"
              />
            )}
            {(pocos || indice % 7 === 0) && (
              <text
                className={estilos.rotulo}
                data-futuro={dia.futuro ? "" : undefined}
                x={x}
                y={alto - 6}
              >
                {pocos ? inicialDelDia(dia.dia) : dia.dia.slice(8)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * La tira de una ronda: una celda por día. Llena si se cumplió, vacía si
 * tocaba y no, punteada si ese día no tocaba.
 */
export function TiraDeCeldas({ dias }) {
  const radio = 11;
  const paso = 25;
  const puntos = puntosDeHexagono(radio);
  const ancho = paso * dias.length + 4;
  // El ancho sale de la cantidad de días: cada celda mide lo mismo en todas las tiras.
  return (
    <svg
      className={estilos.tira}
      viewBox={`0 0 ${ancho} 28`}
      width={ancho}
      height="28"
      aria-hidden="true"
    >
      {dias.map((dia, indice) => (
        <polygon
          key={dia.dia}
          className={estilos.celdaDeTira}
          data-estado={dia.llena ? "llena" : dia.tocaba ? "pendiente" : "libre"}
          points={puntos}
          transform={`translate(${2 + paso * indice + paso / 2} 14)`}
        />
      ))}
    </svg>
  );
}

/** Dos tarros que se llenan en proporción: únicas y recurrentes. */
export function Tarros({ tarros, descripcion }) {
  const prefijo = useId();
  const total = tarros.reduce((suma, tarro) => suma + tarro.cantidad, 0) || 1;
  return (
    <svg className={estilos.tarros} role="img" aria-label={descripcion} viewBox="0 0 240 150">
      {tarros.map((tarro, indice) => {
        const x = 30 + indice * 110;
        const nivel = (tarro.cantidad / total) * 82;
        const idDelRecorte = `${prefijo}-tarro-${indice}`;
        const vidrio = `M${x + 6} 34 h58 c8 4 12 11 12 20 v50 a12 12 0 0 1 -12 12 h-58 a12 12 0 0 1 -12 -12 v-50 c0 -9 4 -16 12 -20 Z`;
        return (
          <g key={tarro.nombre}>
            <clipPath id={idDelRecorte}>
              <path d={vidrio} />
            </clipPath>
            <rect
              className={estilos.mielDeTarro}
              x={x - 6}
              y={116 - nivel}
              width="82"
              height={nivel}
              clipPath={`url(#${idDelRecorte})`}
            />
            <path className={estilos.tarro} d={vidrio} />
            <rect className={estilos.tapa} x={x + 2} y="20" width="66" height="14" rx="5" />
            <text className={estilos.cifraDeTarro} x={x + 35} y="82">
              {tarro.cantidad}
            </text>
            <text className={estilos.rotulo} x={x + 35} y="140">
              {tarro.nombre}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Una tabla con los datos de una gráfica, plegada bajo "Ver como tabla".
 * La primera columna de cada fila es su encabezado.
 */
export function VerComoTabla({ titulo, columnas, filas }) {
  return (
    <details className={estilos.comoTabla}>
      <summary>{VER_COMO_TABLA}</summary>
      <div className={estilos.desplazable}>
        <table>
          <caption className="solo-lectores">{titulo}</caption>
          <thead>
            <tr>
              {columnas.map((columna) => (
                <th key={columna} scope="col">
                  {columna}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={String(fila[0])}>
                {fila.map((valor, indice) =>
                  indice === 0 ? (
                    <th key={indice} scope="row">
                      {valor}
                    </th>
                  ) : (
                    <td key={indice}>{valor}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
