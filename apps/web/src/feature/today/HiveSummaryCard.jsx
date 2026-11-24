import { Link } from "react-router";
import { HiveGrid } from "../../components/domain/HiveGrid.jsx";
import { MemberAvatar } from "../../components/domain/MemberAvatar.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { formatCells, formatCount } from "../../lib/formatters.js";
import styles from "./HiveSummaryCard.module.css";
import todayStyles from "./TodayPage.module.css";

export function HiveSummaryCard({ hive }) {
  if (!hive) {
    return (
      <Card>
        <header className={todayStyles.cabezaDeTarjeta}>
          <h2 className={todayStyles.tituloDeTarjeta}>Colmena</h2>
        </header>
        <div className={todayStyles.vacio}>
          <p>Todavía no tienes colmena. Funda una e invita a tu enjambre.</p>
          <Button to="/colmenas">Fundar una colmena</Button>
        </div>
      </Card>
    );
  }

  const progress = hive.progress ?? { filled: 0, total: 0, percentage: 0 };
  const members = hive.members ?? [];
  const summaryText = `${progress.filled} de ${progress.total} celdas llenas entre ${formatCount(members.length, "abeja", "abejas")}`;

  return (
    <Card>
      <header className={todayStyles.cabezaDeTarjeta}>
        <h2 className={todayStyles.tituloDeTarjeta}>
          <Link to={`/colmenas/${hive.id}`}>{`Colmena: ${hive.name}`}</Link>
        </h2>
        <span className={todayStyles.datoDeTarjeta}>{`${progress.percentage} %`}</span>
      </header>
      <p className={todayStyles.notaDeTarjeta}>{summaryText}</p>
      <HiveGrid activities={hive.activities ?? hive.cells ?? []} members={members} />
      <ul className={styles.enjambre} role="list">
        {members.map((member) => (
          <li key={member.id} className={styles.abeja}>
            <MemberAvatar
              name={member.name}
              color={member.color}
              isOwner={member.isOwner}
              size="sm"
            />
            <span className={styles.nombre}>{member.name}</span>
            <span className={styles.aporte}>
              {formatCells(member.cellsFilled ?? member.cells ?? 0)}
            </span>
          </li>
        ))}
      </ul>
      <Link className={styles.verTodas} to="/colmenas">
        Ver todas tus colmenas
      </Link>
    </Card>
  );
}
