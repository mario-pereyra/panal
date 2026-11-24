import { useState } from "react";
import { useParams } from "react-router";
import { CellRow } from "../../components/domain/CellRow.jsx";
import { EmptyState } from "../../components/domain/EmptyState.jsx";
import { WaxSeal } from "../../components/domain/WaxSeal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { LoadError, Skeleton } from "../../components/ui/FeedbackStates.jsx";
import { RadioCardGroup } from "../../components/ui/Form.jsx";
import { MoreIcon } from "../../components/ui/icons.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { formatCells, formatCount, formatRelativeDue } from "../../lib/formatters.js";
import { HiveFramesChart } from "./HiveCharts.jsx";
import styles from "./HiveDetailPage.module.css";
import { HiveMemberItem, HiveMembers } from "./HiveMembers.jsx";
import { HiveModals } from "./HiveModals.jsx";
import { formatFrameProgress } from "./hivesSelectors.js";
import { useHiveDetail } from "./useHiveDetail.js";

const HIVE_CELL_TABS = [
  { value: "pending", title: "Pendientes" },
  { value: "mine", title: "Mías" },
  { value: "unassigned", title: "Libres" },
  { value: "filled", title: "Llenas" },
];

const EMPTY_TAB_MESSAGES = {
  pending: "No queda nada pendiente. ¡Qué enjambre!",
  mine: "No tienes celdas asignadas en esta colmena.",
  unassigned: "No hay celdas libres ahora.",
  filled: "Todavía no hay celdas llenas. La primera está cerca.",
};

function formatMemberContribution(member) {
  const filledCount = member.cellsFilled ?? member.cells ?? 0;
  const base = formatCells(filledCount);
  return member.pendingCount > 0 ? `${base} · ${member.pendingCount} por hacer` : base;
}

function formatHiveSubtitle(hive) {
  return (
    [hive.dueDate && hive.today && formatRelativeDue(hive.dueDate, hive.today), hive.description]
      .filter(Boolean)
      .join(" · ") || undefined
  );
}

export function HiveDetailPage() {
  const { id } = useParams();
  const detailState = useHiveDetail(id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);

  if (detailState.isLoading) return <Skeleton lines={5} />;

  if (detailState.loadError) {
    return (
      <Page title="Colmena" backTo="/colmenas" backLabel="Colmenas">
        <LoadError message={detailState.loadError.title} onRetry={detailState.loadError.retry} />
        {detailState.loadError.description && (
          <p className={styles.nota}>{detailState.loadError.description}</p>
        )}
      </Page>
    );
  }

  const { hive } = detailState;
  if (!hive) return null;
  const progress = hive.progress ?? {
    total: 0,
    filled: 0,
    percentage: 0,
    frame: 0,
    remainingForNextFrame: 0,
    closed: false,
  };
  const summaryText = `${progress.filled} de ${progress.total} celdas llenas entre ${formatCount(hive.members.length, "abeja", "abejas")}`;

  return (
    <Page
      title={hive.name}
      subtitle={formatHiveSubtitle(hive)}
      backTo="/colmenas"
      backLabel="Colmenas"
      action={
        <>
          {!hive.isClosed && (
            <>
              <Button to={`/colmenas/${hive.id}/invitar`} modal variant="secondary">
                Invitar al enjambre
              </Button>
              <Button to={`/celdas/nueva?colmena=${hive.id}`} modal>
                Nueva celda
              </Button>
            </>
          )}
          <button
            type="button"
            className={styles.masAcciones}
            aria-label={`Más acciones de ${hive.name}`}
            onClick={() => setMenuOpen(true)}
          >
            <MoreIcon />
          </button>
        </>
      }
    >
      <div className={styles.detalle}>
        <section className={styles.panelColmena} aria-labelledby="titulo-colmena">
          <header className={styles.cabezaDePanel}>
            <h2 id="titulo-colmena" className={styles.tituloDeSeccion}>
              La colmena
            </h2>
            <span className={styles.porcentaje}>{`${progress.percentage} %`}</span>
          </header>
          {hive.isClosed && (
            <p className={styles.cerrada}>
              <WaxSeal id="enjambrazon" earned size={48} />
              Colmena cerrada: queda para el recuerdo, en solo lectura.
            </p>
          )}
          {progress.total === 0 ? (
            <EmptyState
              description="Esta colmena está vacía. Crea su primera celda."
              action={
                !hive.isClosed ? (
                  <Button to={`/celdas/nueva?colmena=${hive.id}`} modal>
                    Nueva celda
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <HiveFramesChart
                frames={hive.frames}
                description={`${summaryText}. Cada celda llena lleva el color y la inicial de quien la completó.`}
              />
              <p className={styles.cuadro}>{formatFrameProgress(progress)}</p>
            </>
          )}
        </section>

        <section className={styles.panelEnjambre} aria-labelledby="titulo-enjambre">
          <h2 id="titulo-enjambre" className={styles.tituloDeSeccion}>
            El enjambre
          </h2>
          <HiveMembers>
            {hive.members.map((member) => (
              <HiveMemberItem
                key={member.id}
                member={member}
                detail={formatMemberContribution(member)}
                action={
                  hive.permissions.canRemoveMember &&
                  member.id !== hive.myUserId && (
                    <Button
                      variant="secondary"
                      size="sm"
                      aria-label={`Quitar a ${member.name}`}
                      disabled={!detailState.isOnline}
                      onClick={() => {
                        setMemberToRemove(member);
                        setActiveAction("remove");
                      }}
                    >
                      Quitar
                    </Button>
                  )
                }
              >
                {member.id === hive.myUserId && " (tú)"}
                {(member.isOwner || member.id === hive.ownerId) && (
                  <span className={styles.rol}>Fundadora</span>
                )}
              </HiveMemberItem>
            ))}
          </HiveMembers>
          {hive.needsMembers && (
            <div className={styles.invitar}>
              <p>Por ahora eres la única abeja. Invita a tu enjambre: el avance se reparte.</p>
              <Button to={`/colmenas/${hive.id}/invitar`} modal variant="secondary" size="sm">
                Invitar al enjambre
              </Button>
            </div>
          )}
        </section>

        {progress.total > 0 && (
          <section className={styles.panelCeldas} aria-labelledby="titulo-celdas-colmena">
            <h2 id="titulo-celdas-colmena" className={styles.tituloDeSeccion}>
              Celdas de la colmena
            </h2>
            <RadioCardGroup
              label="Mostrar"
              name="hive-cell-tab"
              options={HIVE_CELL_TABS}
              value={detailState.activeTab}
              onChange={detailState.setActiveTab}
            />
            {detailState.cells.length === 0 ? (
              <p className={styles.nota}>{EMPTY_TAB_MESSAGES[detailState.activeTab]}</p>
            ) : (
              <ul className={styles.filas} role="list">
                {detailState.cells.map((row) => (
                  <CellRow
                    key={row.id}
                    row={row}
                    disabled={!detailState.isOnline}
                    onToggle={row.canToggle ? () => detailState.toggleCell(row) : undefined}
                    editLink={
                      row.permissions?.canEdit ? `/celdas/${row.id}?colmena=${hive.id}` : undefined
                    }
                  />
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      <HiveModals
        hive={hive}
        detailState={detailState}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        activeAction={activeAction}
        setActiveAction={setActiveAction}
        memberToRemove={memberToRemove}
      />
    </Page>
  );
}
