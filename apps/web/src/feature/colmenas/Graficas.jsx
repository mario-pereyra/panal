import { CeldaDeAbeja } from "../../componentes/panal/RejillaDeColmena.jsx";
import { puntosDeHexagono } from "../../componentes/ui/hexagono.js";
import estilos from "./Graficas.module.css";
import { rotuloDeCuadro } from "./textos.js";

const AVATARES_VISIBLES = 5;

export function ColmenaGrande({ cuadros: filas, descripcion }) {
  const radio = 17;
  const paso = 36;
  const salto = 40;
  const izquierda = 92;
  const mayor = Math.max(1, ...filas.map((fila) => fila.length));
  const ancho = izquierda + paso * mayor + paso / 2 + 8;
  const alto = salto * filas.length + 8;
  const puntos = puntosDeHexagono(radio);

  return (
    <div className={estilos.desplazable}>
      <svg
        className={estilos.colmenaGrande}
        role="img"
        aria-label={descripcion}
        viewBox={`0 0 ${ancho} ${alto}`}
        style={{ minInlineSize: mayor > 8 ? `${mayor * 30 + 100}px` : undefined }}
      >
        {filas.map((fila, numero) => (
          <g key={numero} transform={`translate(0 ${24 + salto * numero})`}>
            <text className={estilos.rotuloDeCuadro} x="4" y="5">
              {rotuloDeCuadro(numero + 1)}
            </text>
            {fila.map((celda, indice) => (
              <g
                key={celda.id}
                transform={`translate(${izquierda + paso * indice + (numero % 2 === 1 ? paso / 2 : 0)} 0)`}
              >
                <CeldaDeAbeja color={celda.color} points={puntos} />
                {celda.inicial && (
                  <text className={estilos.inicialEnCelda} y="5">
                    {celda.inicial}
                  </text>
                )}
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function Avatares({ integrantes }) {
  const visibles = integrantes.slice(0, AVATARES_VISIBLES);
  const resto = integrantes.length - visibles.length;
  return (
    <span className={estilos.avatares} aria-hidden="true">
      {visibles.map((abeja) => (
        <span key={abeja.id} className={estilos.avatar} style={{ background: abeja.color }}>
          {abeja.inicial}
        </span>
      ))}
      {resto > 0 && <span className={estilos.avatar}>+{resto}</span>}
    </span>
  );
}
