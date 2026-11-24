import { CellRow } from "../../components/domain/CellRow.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import styles from "./TodayPage.module.css";

export function TodayCells({ cells, summary, isOnline, onToggle }) {
  if (!cells || cells.length === 0) {
    return (
      <Card>
        <header className={styles.cabezaDeTarjeta}>
          <h2 className={styles.tituloDeTarjeta}>Celdas de hoy</h2>
        </header>
        <div className={styles.vacio}>
          <p>Tu panal de hoy está por estrenar. Crea tu primera celda.</p>
          <Button to="/celdas/nueva" modal>
            Nueva actividad
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <header className={styles.cabezaDeTarjeta}>
        <h2 className={styles.tituloDeTarjeta}>Celdas de hoy</h2>
        {summary && (
          <span
            className={styles.datoDeTarjeta}
          >{`${summary.filled} de ${summary.scheduled}`}</span>
        )}
      </header>
      <ul className={styles.filas} role="list">
        {cells.map((row) => (
          <CellRow
            key={row.id}
            row={row}
            onToggle={() => onToggle(row)}
            disabled={!isOnline}
            editLink={row.permissions?.canEdit ? `/celdas/${row.id}` : undefined}
          />
        ))}
      </ul>
    </Card>
  );
}
