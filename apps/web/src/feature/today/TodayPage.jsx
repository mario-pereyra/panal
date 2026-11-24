import { useEffect } from "react";
import { ReserveJarIcon } from "../../components/domain/domainIcons.jsx";
import { LoadError, Skeleton } from "../../components/ui/FeedbackStates.jsx";
import { CloseIcon } from "../../components/ui/icons.jsx";
import { ConsistencyCard } from "./ConsistencyCard.jsx";
import { HeroCard } from "./HeroCard.jsx";
import { HiveSummaryCard } from "./HiveSummaryCard.jsx";
import { TodayCells } from "./TodayCells.jsx";
import styles from "./TodayPage.module.css";
import { useToday } from "./useToday.js";

export function TodayPage() {
  const todayState = useToday();

  useEffect(() => {
    document.title = "Hoy · Panal";
  }, []);

  if (todayState.isLoading || todayState.isError) {
    return (
      <div className={styles.hoy}>
        {todayState.isLoading ? (
          <Skeleton lines={5} />
        ) : (
          <LoadError message="No pudimos traer tus celdas" onRetry={todayState.retry} />
        )}
      </div>
    );
  }

  return (
    <div className={styles.hoy}>
      {todayState.banner && (
        <div className={styles.franja} data-tono={todayState.banner.tone} role="status">
          <span className={styles.franjaTexto}>
            <ReserveJarIcon />
            {todayState.banner.text}
          </span>
          <button
            type="button"
            className={styles.cerrarFranja}
            aria-label="Cerrar aviso"
            onClick={todayState.dismissBanner}
          >
            <CloseIcon />
          </button>
        </div>
      )}
      <HeroCard
        today={todayState.today}
        userName={todayState.user?.name ?? ""}
        zumMood={todayState.zumMood}
        summary={todayState.summary}
        streak={todayState.streak}
      />
      <div className={styles.tarjetas}>
        <TodayCells
          cells={todayState.cells}
          summary={todayState.summary}
          isOnline={todayState.isOnline}
          onToggle={todayState.toggleCell}
        />
        <HiveSummaryCard hive={todayState.activeHive} />
        <ConsistencyCard weeks={todayState.consistencyWeeks} />
      </div>
    </div>
  );
}
