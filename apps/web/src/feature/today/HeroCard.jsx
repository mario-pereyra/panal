import { DailyHoneycomb } from "../../components/domain/DailyHoneycomb.jsx";
import { HoneyDropIcon, ReserveJarIcon } from "../../components/domain/domainIcons.jsx";
import { ZumMascot } from "../../components/domain/ZumMascot.jsx";
import { Button } from "../../components/ui/Button.jsx";
import {
  formatCount,
  formatDays,
  formatLongDate,
  formatStreakMessage,
} from "../../lib/formatters.js";
import styles from "./HeroCard.module.css";

function getGreeting(mood, name) {
  if (mood === "celebrando") return `¡Panal cerrado, ${name}!`;
  if (mood === "descansando") return `Buen descanso, ${name}`;
  return `¡Buen vuelo, ${name}!`;
}

export function HeroCard({ today, userName, zumMood, summary, streak }) {
  if (!summary || !streak) return null;

  const streakLabel =
    streak.current === 0 ? "Tu racha empieza hoy" : `Racha de vuelo: ${formatDays(streak.current)}`;
  const reservesLabel =
    streak.reserves === 0
      ? "Sin reservas de miel"
      : `${formatCount(streak.reserves, "reserva", "reservas")} de miel`;

  return (
    <section
      className={styles.principal}
      data-tono={zumMood === "descansando" ? "ala" : "miel"}
      aria-labelledby="saludo-de-hoy"
    >
      <div className={styles.interior}>
        <ZumMascot
          className={styles.zum}
          mood={zumMood}
          withBackground
          priority
          sizes="(min-width: 1009px) 240px, 128px"
        />
        <div className={styles.saludo}>
          <p className={styles.fecha}>
            <time dateTime={today}>{formatLongDate(today)}</time>
          </p>
          <h1 id="saludo-de-hoy" className={styles.titulo}>
            {getGreeting(zumMood, userName)}
          </h1>
        </div>
        <p className={styles.frase} role="status">
          {formatStreakMessage(streak, summary)}
        </p>
        <DailyHoneycomb
          className={styles.panal}
          filled={summary.filled}
          goal={summary.goal}
          closed={summary.closed}
          rest={summary.rest}
        />
        <div className={styles.acciones}>
          <Button to="/celdas/nueva" modal className={styles.crear}>
            Nueva actividad
          </Button>
          <div className={styles.fichas}>
            <span className={styles.ficha}>
              <HoneyDropIcon />
              {streakLabel}
            </span>
            <span className={styles.ficha}>
              <ReserveJarIcon />
              {reservesLabel}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
