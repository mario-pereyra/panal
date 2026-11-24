import { useState } from "react";
import { RankLadder } from "../../components/domain/RankLadder.jsx";
import { WaxSeal } from "../../components/domain/WaxSeal.jsx";
import { ZumMascot } from "../../components/domain/ZumMascot.jsx";
import { Dialog } from "../../components/ui/Dialog.jsx";
import { LoadError, Skeleton } from "../../components/ui/FeedbackStates.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { ProgressBar } from "../../components/ui/ProgressBar.jsx";
import { formatCount, formatDays, formatDrops, formatShortDate } from "../../lib/formatters.js";
import styles from "./ProfilePage.module.css";
import { ProfileSettings } from "./ProfileSettings.jsx";
import { useProfile } from "./useProfile.js";

function formatProfileTotals({ drops, streak }) {
  const streakLabel =
    streak.current === 0 ? "Tu racha empieza hoy" : `Racha de vuelo: ${formatDays(streak.current)}`;
  const reservesLabel =
    streak.reserves === 0
      ? "Sin reservas de miel"
      : `${formatCount(streak.reserves, "reserva", "reservas")} de miel`;
  return [`${formatDrops(drops.total)} de miel`, streakLabel, reservesLabel].join(" · ");
}

function formatNextRankMessage(rank) {
  if (!rank.nextName) {
    return "Llegaste al último oficio. Cada gota sigue sumando.";
  }
  const verb = rank.remainingDrops === 1 ? "Falta" : "Faltan";
  return `${verb} ${formatDrops(rank.remainingDrops)} para ${rank.nextName}`;
}

function formatBadgeDisplayName(badge) {
  return badge.isHidden ? "Sello secreto" : badge.name;
}

function formatBadgeAriaLabel(badge) {
  return `${formatBadgeDisplayName(badge)}${badge.earned ? ", ganado" : ""}${badge.isNext ? ", el siguiente" : ""}`;
}

function formatBadgeStatusText(badge) {
  if (!badge.available) return "Llega con la próxima versión de Panal.";
  if (badge.earned) {
    return badge.earnedOn ? `Lo ganaste el ${formatShortDate(badge.earnedOn)}.` : "Ya es tuyo.";
  }
  if (badge.secret) return "Es un sello secreto: se revela al ganarlo.";
  if (badge.goal > 1) return `Llevas ${badge.current} de ${badge.goal}.`;
  return "Todavía no.";
}

export function ProfilePage() {
  const profile = useProfile();
  const [selectedBadgeId, setSelectedBadgeId] = useState(null);

  if (profile.isLoading) return <Skeleton lines={5} />;
  if (profile.isError) {
    return (
      <Page title="Mi vuelo">
        <LoadError message="No pudimos traer tu vuelo" onRetry={profile.retry} />
      </Page>
    );
  }

  const { rank, totals, badges } = profile;
  const selectedBadge = selectedBadgeId
    ? (badges.list.find((badge) => badge.id === selectedBadgeId) ?? null)
    : null;

  return (
    <Page title="Mi vuelo">
      <section className={styles.perfil} aria-label="Tu oficio">
        <ZumMascot
          mood="feliz"
          withBackground
          priority
          sizes="(max-width: 699px) 120px, 160px"
          className={styles.retrato}
        />
        <div className={styles.datos}>
          <p className={styles.nombre}>{profile.user?.name}</p>
          {rank && <p className={styles.nivel}>{`Nivel ${rank.level} · ${rank.name}`}</p>}
          {totals && <p className={styles.totales}>{formatProfileTotals(totals)}</p>}
        </div>
      </section>

      {rank && (
        <section className={styles.tarjeta} aria-labelledby="titulo-oficios">
          <h2 id="titulo-oficios" className={styles.titulo}>
            Escalera de oficios
          </h2>
          <RankLadder currentLevel={rank.level} currentDrops={rank.drops} />
          <div className={styles.siguiente}>
            <ProgressBar value={Math.round(rank.progress * 100)} max={100} />
            <p>{formatNextRankMessage(rank)}</p>
          </div>
        </section>
      )}

      <section className={styles.tarjeta} aria-labelledby="titulo-sellos">
        <header className={styles.cabeza}>
          <h2 id="titulo-sellos" className={styles.titulo}>
            Sellos de cera
          </h2>
          <span className={styles.conteo}>{`${badges.earnedCount} de ${badges.totalCount}`}</span>
        </header>
        {badges.earnedCount === 0 && (
          <p className={styles.nota}>
            Tu primer sello está a una celda de distancia. El resaltado es el siguiente.
          </p>
        )}
        <ul className={styles.sellos} role="list">
          {badges.list.map((badge) => (
            <li key={badge.id}>
              <button
                type="button"
                className={styles.sello}
                data-siguiente={badge.isNext ? "" : undefined}
                aria-label={formatBadgeAriaLabel(badge)}
                onClick={() => setSelectedBadgeId(badge.id)}
              >
                <WaxSeal id={badge.id} earned={badge.earned} secret={badge.secret} size={64} />
                <span className={styles.nombreDeSello} aria-hidden="true">
                  {formatBadgeDisplayName(badge)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <ProfileSettings profile={profile} />

      {selectedBadge && (
        <Dialog
          title={formatBadgeDisplayName(selectedBadge)}
          onClose={() => setSelectedBadgeId(null)}
          closeOnBackdrop
        >
          <div className={styles.detalleDeSello}>
            <WaxSeal
              id={selectedBadge.id}
              earned={selectedBadge.earned}
              secret={selectedBadge.secret}
              size={120}
            />
            {!selectedBadge.isHidden && <p className={styles.criterio}>{selectedBadge.criteria}</p>}
            <p>{formatBadgeStatusText(selectedBadge)}</p>
            {selectedBadge.progressRatio !== null && (
              <ProgressBar value={Math.round(selectedBadge.progressRatio * 100)} max={100} />
            )}
          </div>
        </Dialog>
      )}
    </Page>
  );
}
