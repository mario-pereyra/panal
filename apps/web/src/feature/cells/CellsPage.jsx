import { useState } from "react";
import { Link } from "react-router";
import { CellRow } from "../../components/domain/CellRow.jsx";
import { EmptyState } from "../../components/domain/EmptyState.jsx";
import { HexStrip } from "../../components/domain/HexStrip.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { LoadError, Skeleton } from "../../components/ui/FeedbackStates.jsx";
import { MoreIcon } from "../../components/ui/icons.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { CellActionsMenu } from "./CellActionsMenu.jsx";
import styles from "./CellsPage.module.css";
import { useCells } from "./useCells.js";

const TAB_LABELS = {
  hoy: "Hoy",
  proximas: "Próximas",
  recurrentes: "Recurrentes",
  hechas: "Hechas",
  archivadas: "Archivadas",
};

const EMPTY_MESSAGES = {
  hoy: "Tu panal de hoy está por estrenar. Crea tu primera celda.",
  proximas: "No hay nada en el horizonte. Buen momento para planear la semana.",
  recurrentes: "Todavía no tienes celdas recurrentes. Son las que se repiten.",
  hechas: "Lo que llenes queda aquí siete días, por si necesitas deshacerlo.",
  archivadas: "Aquí guardas lo que ya no necesitas ver.",
};

export function CellsPage() {
  const cells = useCells();
  const [activeRowMenu, setActiveRowMenu] = useState(null);

  return (
    <Page
      title="Celdas"
      action={
        <Button to="/celdas/nueva" modal>
          Nueva actividad
        </Button>
      }
    >
      <nav className={styles.pestanas} aria-label="Listas de celdas">
        <ul role="list">
          {Object.entries(TAB_LABELS).map(([tabKey, label]) => (
            <li key={tabKey}>
              <Link
                to={tabKey === "hoy" ? "/celdas" : `/celdas?ver=${tabKey}`}
                className={styles.pestana}
                aria-current={cells.activeTab === tabKey ? "page" : undefined}
                replace
              >
                {label}
                {cells.counts[tabKey] != null && (
                  <span className={styles.conteo}>{cells.counts[tabKey]}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <CellFilters cells={cells} />

      <section className={styles.lista} aria-label={TAB_LABELS[cells.activeTab]}>
        <CellsContent cells={cells} onOpenMenu={setActiveRowMenu} />
      </section>

      {activeRowMenu && (
        <CellActionsMenu row={activeRowMenu} cells={cells} onClose={() => setActiveRowMenu(null)} />
      )}
    </Page>
  );
}

function CellFilters({ cells }) {
  return (
    <div className={styles.filtros} role="group" aria-label="Filtros">
      {cells.hives.length > 0 && (
        <label className={styles.filtro}>
          <span className="solo-lectores">Colmena</span>
          <select
            value={cells.hiveFilter}
            onChange={(event) => cells.setHiveFilter(event.target.value)}
          >
            <option value="all">Todas las celdas</option>
            <option value="personal">Solo personales</option>
            {cells.hives.map((hive) => (
              <option key={hive.id} value={hive.id}>
                {hive.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <label
        className={styles.filtro}
        data-activo={cells.priorityFilter === "high" ? "" : undefined}
      >
        <input
          type="checkbox"
          checked={cells.priorityFilter === "high"}
          onChange={(event) => cells.setPriorityFilter(event.target.checked ? "high" : "all")}
        />
        Prioridad alta
      </label>
    </div>
  );
}

function CellsContent({ cells, onOpenMenu }) {
  if (cells.isLoading) return <Skeleton lines={4} />;
  if (cells.isError) {
    return <LoadError message="No pudimos traer tus celdas" onRetry={cells.retry} />;
  }

  const { activeTab } = cells;

  if (!cells.counts[activeTab]) {
    if (cells.hasFilters) {
      return (
        <EmptyState
          description="Ninguna celda coincide con los filtros."
          action={
            <Button variant="secondary" onClick={cells.clearFilters}>
              Quitar filtros
            </Button>
          }
        />
      );
    }
    return (
      <EmptyState
        description={EMPTY_MESSAGES[activeTab]}
        action={
          !["hechas", "archivadas"].includes(activeTab) ? (
            <Button to="/celdas/nueva" modal>
              Nueva actividad
            </Button>
          ) : undefined
        }
      />
    );
  }

  const renderRow = (row) => {
    const canEdit = row.permissions?.canEdit;
    const canArchive = row.permissions?.canArchive;
    const canToggle = ["hoy", "hechas"].includes(activeTab);

    return (
      <CellRow
        key={`${row.id}-${row.cellId ?? "pending"}`}
        row={row}
        disabled={!cells.isOnline}
        onToggle={canToggle ? () => cells.toggleCell(row) : undefined}
        editLink={canEdit && !row.archived ? `/celdas/${row.id}` : undefined}
        menu={
          <>
            {row.weeklyProgress && (
              <span className={styles.semana}>
                <HexStrip
                  count={row.weeklyProgress.goal}
                  filledCount={row.weeklyProgress.done}
                  size={14}
                />
                {`${row.weeklyProgress.done} de ${row.weeklyProgress.goal} esta semana`}
              </span>
            )}
            {(canEdit || canArchive) && (
              <button
                type="button"
                className={styles.menu}
                aria-label={`Acciones de ${row.title}`}
                onClick={() => onOpenMenu(row)}
              >
                <MoreIcon />
              </button>
            )}
          </>
        }
      />
    );
  };

  return cells.groups.map((group) =>
    group.title ? (
      <section key={group.day} className={styles.grupo} aria-labelledby={`grupo-${group.day}`}>
        <h2 id={`grupo-${group.day}`} className={styles.tituloDeGrupo}>
          {group.title}
        </h2>
        <ul className={styles.filas} role="list">
          {group.rows.map(renderRow)}
        </ul>
      </section>
    ) : (
      <ul key={activeTab} className={styles.filas} role="list">
        {group.rows.map(renderRow)}
      </ul>
    ),
  );
}
