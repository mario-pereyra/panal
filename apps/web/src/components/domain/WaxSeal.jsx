import { cn } from "../../lib/classNames.js";
import { getHexagonPoints } from "../ui/hexagon.js";
import styles from "./WaxSeal.module.css";

export function WaxSeal({ id, earned = false, secret = false, size = 64, className }) {
  return (
    <svg
      className={cn(styles.seal, className)}
      data-earned={earned ? "" : undefined}
      width={size}
      height={size}
      viewBox="-30 -30 60 60"
      aria-hidden="true"
    >
      <path className={styles.wax} d={SCALLOPED_BORDER} />
      <polygon className={styles.cell} points={getHexagonPoints(17)} />
      <g className={styles.drawing}>{secret && !earned ? <QuestionMark /> : SEAL_DRAWINGS[id]}</g>
    </svg>
  );
}

const SCALLOPED_BORDER = (() => {
  const points = [];
  for (let step = 0; step <= 48; step += 1) {
    const angle = (step / 48) * Math.PI * 2;
    const radius = 26 + (step % 4 === 0 ? 1.6 : step % 2 === 0 ? -1.2 : 0.4);
    points.push(
      `${(radius * Math.cos(angle)).toFixed(1)} ${(radius * Math.sin(angle)).toFixed(1)}`,
    );
  }
  return `M${points.join(" L")} Z`;
})();

const miniHex = getHexagonPoints(4.6);

function CheckDrawing() {
  return <path d="M-6 0 l4 4.5 l8 -9" />;
}

function QuestionMark() {
  return (
    <>
      <path d="M-4 -4 a4.2 4.2 0 1 1 5.6 4 c-1.4 0.6 -1.6 1.4 -1.6 3" />
      <circle cx="0" cy="7" r="0.6" />
    </>
  );
}

function FlowerDrawing({ x = 0, y = 0, radius = 3.2 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((rotation) => (
        <ellipse
          key={rotation}
          cx="0"
          cy={-radius}
          rx={radius * 0.62}
          ry={radius}
          transform={`rotate(${rotation})`}
        />
      ))}
      <circle r={radius * 0.55} className={styles.fill} />
    </g>
  );
}

const SEAL_DRAWINGS = {
  "primera-celda": <CheckDrawing />,
  "panal-cerrado": (
    <g className={styles.fill}>
      <polygon points={miniHex} transform="translate(-4.6 -3.4)" />
      <polygon points={miniHex} transform="translate(4.6 -3.4)" />
      <polygon points={miniHex} transform="translate(0 4.6)" />
    </g>
  ),
  "semana-de-vuelo": (
    <>
      <path d="M-8 6 C-8 -4 0 -9 8 -8 C7 0 1 6 -8 6 Z" />
      <path d="M-8 6 L2 -3" />
    </>
  ),
  "luna-de-miel": (
    <>
      <path d="M2 -9 A9 9 0 1 0 8 4 A7 7 0 1 1 2 -9 Z" />
      <path
        className={styles.fill}
        d="M-1 -2 C-1 -2 -4 1.5 -4 3.4 A3 3 0 0 0 2 3.4 C2 1.5 -1 -2 -1 -2 Z"
      />
    </>
  ),
  "cien-flores": <FlowerDrawing radius={4.6} />,
  "vuelta-al-panal": (
    <>
      <path d="M-8 4 A8 8 0 1 1 0 8" />
      <path d="M-9 -1 L-8 4 L-3 3" />
    </>
  ),
  "nectar-fresco": (
    <>
      <path
        className={styles.fill}
        d="M-2 -9 C-2 -9 -8 -1 -8 2.6 A6 6 0 0 0 4 2.6 C4 -1 -2 -9 -2 -9 Z"
      />
      <path d="M4 -2 C8 -6 10 -2 9 1 C6 2 4 1 4 -2 Z" />
    </>
  ),
  "ronda-firme": (
    <g className={styles.fill}>
      {[-9.6, -3.2, 3.2, 9.6].map((x) => (
        <polygon key={x} points={getHexagonPoints(3.2)} transform={`translate(${x} 0)`} />
      ))}
    </g>
  ),
  "panal-limpio": (
    <>
      <polygon points={getHexagonPoints(6)} />
      <path d="M8 -9 v4 M6 -7 h4 M-9 6 v3 M-10.5 7.5 h3" />
    </>
  ),
  "colmena-fundada": (
    <>
      <rect x="-4.5" y="-9" width="9" height="5" rx="2.5" />
      <rect x="-8" y="-4" width="16" height="6" rx="3" />
      <rect x="-6.5" y="2" width="13" height="6.5" rx="3" />
    </>
  ),
  "entrada-abierta": (
    <>
      <path d="M-7 7 V1 A7 7 0 0 1 7 1 V7" />
      <circle className={styles.fill} cx="-6" cy="-7" r="1.6" />
      <circle className={styles.fill} cx="0" cy="-9" r="1.6" />
      <circle className={styles.fill} cx="6" cy="-7" r="1.6" />
    </>
  ),
  "primer-cuadro": (
    <>
      <g className={styles.fill}>
        {[-6.4, 0, 6.4].map((x) => (
          <polygon key={x} points={getHexagonPoints(3.4)} transform={`translate(${x} -3)`} />
        ))}
      </g>
      {[-3.2, 3.2].map((x) => (
        <polygon key={x} points={getHexagonPoints(3.4)} transform={`translate(${x} 3.6)`} />
      ))}
    </>
  ),
  enjambrazon: (
    <g className={styles.fill}>
      <ellipse cx="-7" cy="3" rx="3" ry="2" />
      <ellipse cx="0" cy="-3" rx="3" ry="2" />
      <ellipse cx="7" cy="3" rx="3" ry="2" />
      <path d="M-7 -1 C-4 -6 4 -6 7 -1" fill="none" strokeDasharray="1.5 2" />
    </g>
  ),
  "ala-amiga": (
    <>
      <path d="M0 6 C-2 -2 -8 -7 -10 -4 C-11 1 -6 5 0 6 Z" />
      <path d="M0 6 C2 -2 8 -7 10 -4 C11 1 6 5 0 6 Z" />
    </>
  ),
  madrugadora: (
    <>
      <path d="M-10 5 H10" />
      <path d="M-6 5 A6 6 0 0 1 6 5" className={styles.fill} />
      <path d="M0 -8 v3 M-7 -5 l2 2 M7 -5 l-2 2" />
    </>
  ),
  "flor-de-siete": (
    <g className={styles.fill}>
      <polygon points={getHexagonPoints(3)} />
      {[0, 60, 120, 180, 240, 300].map((rotation) => (
        <polygon
          key={rotation}
          points={getHexagonPoints(3)}
          transform={`rotate(${rotation}) translate(0 -6.2) rotate(${-rotation})`}
        />
      ))}
    </g>
  ),
  polinizadora: (
    <>
      <FlowerDrawing x={-2} y={3} radius={3.4} />
      <ellipse className={styles.fill} cx="6" cy="-6" rx="3" ry="2" />
    </>
  ),
};
