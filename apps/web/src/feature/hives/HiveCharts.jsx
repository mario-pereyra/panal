import { MemberAvatar } from "../../components/domain/MemberAvatar.jsx";
import { getHexagonPoints } from "../../components/ui/hexagon.js";
import styles from "./HiveCharts.module.css";

const MAX_VISIBLE_AVATARS = 5;

export function HiveFramesChart({ frames, description }) {
  const radius = 17;
  const stepX = 36;
  const stepY = 40;
  const leftOffset = 92;
  const maxRowLength = Math.max(1, ...frames.map((row) => row.length));
  const width = leftOffset + stepX * maxRowLength + stepX / 2 + 8;
  const height = stepY * frames.length + 8;
  const points = getHexagonPoints(radius);

  return (
    <div className={styles.desplazable}>
      <svg
        className={styles.colmenaGrande}
        role="img"
        aria-label={description}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          minInlineSize: maxRowLength > 8 ? `${maxRowLength * 30 + 100}px` : undefined,
        }}
      >
        {frames.map((frameRow, frameIndex) => (
          <g key={frameIndex} transform={`translate(0 ${24 + stepY * frameIndex})`}>
            <text className={styles.rotuloDeCuadro} x="4" y="5">
              {`Cuadro ${frameIndex + 1}`}
            </text>
            {frameRow.map((cell, cellIndex) => (
              <g
                key={cell.id}
                transform={`translate(${leftOffset + stepX * cellIndex + (frameIndex % 2 === 1 ? stepX / 2 : 0)} 0)`}
              >
                <polygon
                  points={points}
                  className={cell.color ? styles.celdaLlena : styles.celdaVacia}
                  style={cell.color ? { fill: cell.color } : undefined}
                />
                {cell.initial && (
                  <text className={styles.inicialEnCelda} y="5">
                    {cell.initial}
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

export function HiveAvatarGroup({ members = [] }) {
  const visible = members.slice(0, MAX_VISIBLE_AVATARS);
  const remaining = members.length - visible.length;

  return (
    <span className={styles.avatares} aria-hidden="true">
      {visible.map((member) => (
        <MemberAvatar
          key={member.id}
          name={member.name}
          color={member.colorIndex ?? member.color}
          isOwner={member.isOwner}
          size="sm"
        />
      ))}
      {remaining > 0 && <span className={styles.extra}>{`+${remaining}`}</span>}
    </span>
  );
}
