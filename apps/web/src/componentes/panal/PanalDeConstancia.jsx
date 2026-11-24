import { INICIALES_DE_LA_SEMANA } from "../../lib/formato.js";
import { puntosDeHexagono } from "../ui/hexagono.js";
import estilos from "./PanalDeConstancia.module.css";
import { HOY, LEYENDA, NIVELES_DE_CONSTANCIA } from "./textos.js";

const RADIO = 13;
const PASO = 23; // de una columna a la siguiente
const SALTO = 26; // de una semana a la siguiente
const MARGEN_X = 18;
const PRIMERA_FILA = 34;
const PUNTOS = puntosDeHexagono(RADIO, "plano");

/**
 * El panal de constancia: una celda por día, una columna por día de la semana,
 * con su leyenda. Más oscuro significa más celdas llenas ese día.
 *
 * @param {object} props
 * @param {Array<Array<{ dia: string, nivel: 0 | 1 | 2 | 3, esHoy: boolean, futuro: boolean }>>} props.semanas
 * @param {string} props.descripcion Lo que oye quien no ve el dibujo.
 */
export function PanalDeConstancia({ semanas, descripcion }) {
  const ancho = MARGEN_X * 2 + PASO * 6;
  const alto = PRIMERA_FILA + SALTO * (semanas.length - 1) + RADIO * 2 + 4;

  return (
    <>
      <svg
        className={estilos.panalDeConstancia}
        role="img"
        aria-label={descripcion}
        viewBox={`0 0 ${ancho} ${alto}`}
      >
        {INICIALES_DE_LA_SEMANA.map((inicial, columna) => (
          <text key={inicial} className={estilos.inicialDeDia} x={MARGEN_X + PASO * columna} y="12">
            {inicial}
          </text>
        ))}
        {semanas.flatMap((semana, fila) =>
          semana.map((dia, columna) => (
            <polygon
              key={dia.dia}
              className={estilos.diaDeConstancia}
              data-nivel={dia.futuro ? undefined : dia.nivel}
              data-hoy={dia.esHoy ? "" : undefined}
              data-futuro={dia.futuro ? "" : undefined}
              points={PUNTOS}
              // Las columnas impares bajan media celda: así encajan como un panal.
              transform={`translate(${MARGEN_X + PASO * columna} ${
                PRIMERA_FILA + SALTO * fila + (columna % 2 === 1 ? RADIO : 0)
              })`}
            />
          )),
        )}
      </svg>
      {/* Las muestras usan las mismas reglas de color que el dibujo: no pueden separarse. */}
      <ul className={estilos.leyenda} role="list" aria-label={LEYENDA}>
        {NIVELES_DE_CONSTANCIA.map((nombre, nivel) => (
          <li key={nombre}>
            <Muestra nivel={nivel} />
            {nombre}
          </li>
        ))}
        <li>
          <Muestra nivel={0} hoy />
          {HOY}
        </li>
      </ul>
    </>
  );
}

function Muestra({ nivel, hoy = false }) {
  return (
    <svg className={estilos.muestra} viewBox="-15 -13 30 26" aria-hidden="true">
      <polygon
        className={estilos.diaDeConstancia}
        data-nivel={nivel}
        data-hoy={hoy ? "" : undefined}
        points={PUNTOS}
      />
    </svg>
  );
}
