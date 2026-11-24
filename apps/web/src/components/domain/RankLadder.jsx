import { RANKS } from "@panal/motor";
import { cn } from "../../lib/classNames.js";
import { getHexagonPoints } from "../ui/hexagon.js";
import styles from "./RankLadder.module.css";

export function RankLadder({ currentLevel = 1, currentDrops = 0, level, description, className }) {
  const activeLevel = level ?? currentLevel ?? 1;
  const radius = 17;
  const stepWidth = 34;
  const points = getHexagonPoints(radius);
  const rankName = RANKS.find((item) => item.level === activeLevel)?.name ?? "";
  const ariaLabel =
    description ??
    `Escalera de oficios: nivel ${activeLevel} de ${RANKS.length}${rankName ? `, ${rankName}` : ""}${currentDrops ? ` (${currentDrops} gotas)` : ""}`;

  return (
    <svg
      className={cn(styles.ladder, className)}
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${stepWidth * RANKS.length + 8} 66`}
    >
      {Array.from({ length: RANKS.length }, (_, index) => {
        const stepNumber = index + 1;
        const x = 4 + stepWidth * index + stepWidth / 2;
        const y = 46 - index * 2.4;
        const state =
          stepNumber < activeLevel ? "filled" : stepNumber === activeLevel ? "current" : "pending";
        return (
          <g key={stepNumber} transform={`translate(${x} ${y})`}>
            <polygon className={styles.step} data-state={state} points={points} />
            <text className={styles.stepNumber} y="4.5">
              {stepNumber}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
