import { useState } from "react";
import { Link } from "react-router";
import { EmptyState } from "../../components/domain/EmptyState.jsx";
import { HiveGrid } from "../../components/domain/HiveGrid.jsx";
import { HoneyJar } from "../../components/domain/HoneyJar.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { LoadError, Skeleton } from "../../components/ui/FeedbackStates.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { formatCount, formatRelativeDue } from "../../lib/formatters.js";
import { CreateHiveModal } from "./CreateHiveModal.jsx";
import { HiveAvatarGroup } from "./HiveCharts.jsx";
import { formatFrameProgress } from "./hivesSelectors.js";
import styles from "./HivesPage.module.css";
import { useHives } from "./useHives.js";

export function HivesPage() {
  const hivesState = useHives();
  const [creatingHive, setCreatingHive] = useState(false);

  return (
    <Page
      title="Colmenas"
      action={<Button onClick={() => setCreatingHive(true)}>Fundar una colmena</Button>}
    >
      {hivesState.isLoading ? (
        <Skeleton lines={5} />
      ) : hivesState.isError ? (
        <LoadError message="No pudimos traer tus colmenas" onRetry={hivesState.retry} />
      ) : hivesState.activeHives.length === 0 &&
        hivesState.closedHives.length === 0 &&
        hivesState.archivedHives.length === 0 ? (
        <section className={styles.vacia}>
          <EmptyState
            description="Todavía no tienes colmena. Funda una e invita a tu enjambre."
            action={<Button onClick={() => setCreatingHive(true)}>Fundar una colmena</Button>}
          />
        </section>
      ) : (
        <>
          {hivesState.activeHives.length > 0 ? (
            <div className={styles.rejilla}>
              {hivesState.activeHives.map((hive) => (
                <HiveSummaryCardItem key={hive.id} hive={hive} today={hivesState.today} />
              ))}
            </div>
          ) : (
            <p className={styles.nota}>Ninguna colmena en marcha. Funda otra cuando quieras.</p>
          )}
          {hivesState.closedHives.length > 0 && (
            <ClosedHivesSection hives={hivesState.closedHives} />
          )}
          {hivesState.archivedHives.length > 0 && (
            <ArchivedHivesSection hives={hivesState.archivedHives} />
          )}
        </>
      )}

      {creatingHive && <CreateHiveModal onClose={() => setCreatingHive(false)} />}
    </Page>
  );
}

function HiveSummaryCardItem({ hive, today }) {
  const progress = hive.progress ?? {
    filled: 0,
    total: 0,
    percentage: 0,
    frame: 0,
    remainingForNextFrame: 0,
    closed: false,
  };
  const members = hive.members ?? [];
  const summaryText = `${progress.filled} de ${progress.total} celdas llenas entre ${formatCount(members.length, "abeja", "abejas")}`;

  return (
    <Card>
      <header className={styles.cabezaDeTarjeta}>
        <h2 className={styles.tituloDeTarjeta}>
          <Link to={`/colmenas/${hive.id}`}>{hive.name}</Link>
        </h2>
        <span className={styles.datoDeTarjeta}>{`${progress.percentage} %`}</span>
      </header>
      <p className={styles.notaDeTarjeta}>{summaryText}</p>
      <HiveGrid activities={hive.activities ?? hive.cells ?? []} members={members} />
      <p className={styles.cuadro}>{formatFrameProgress(progress)}</p>
      <div className={styles.pieDeTarjeta}>
        <HiveAvatarGroup members={members} />
        <span className="solo-lectores">
          {`Enjambre: ${members.map((member) => member.name).join(", ")}.`}
        </span>
        {hive.dueDate && today && (
          <span className={styles.entrega}>{formatRelativeDue(hive.dueDate, today)}</span>
        )}
      </div>
    </Card>
  );
}

function ArchivedHivesSection({ hives }) {
  return (
    <section className={styles.colmenar} aria-labelledby="titulo-archivadas">
      <h2 id="titulo-archivadas" className={styles.tituloDeSeccion}>
        Archivadas
      </h2>
      <p className={styles.nota}>
        Fuera de la vista del enjambre. Quien la fundó puede recuperarla.
      </p>
      <ul className={styles.archivadas} role="list">
        {hives.map((hive) => (
          <li key={hive.id}>
            <Link to={`/colmenas/${hive.id}`} className={styles.archivada}>
              {hive.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ClosedHivesSection({ hives }) {
  return (
    <section className={styles.colmenar} aria-labelledby="titulo-colmenar">
      <h2 id="titulo-colmenar" className={styles.tituloDeSeccion}>
        El colmenar
      </h2>
      <p className={styles.nota}>Las colmenas que tu enjambre llenó al cien por cien.</p>
      <ul className={styles.tarros} role="list">
        {hives.map((hive) => (
          <li key={hive.id}>
            <Link to={`/colmenas/${hive.id}`} className={styles.tarro}>
              <HoneyJar percentage={100} closed size={64} />
              <span>{hive.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
