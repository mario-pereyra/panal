import { Link } from "react-router";
import { ConsistencyGrid } from "../../components/domain/ConsistencyGrid.jsx";
import { Card } from "../../components/ui/Card.jsx";
import todayStyles from "./TodayPage.module.css";

export function ConsistencyCard({ weeks }) {
  const safeWeeks = Array.isArray(weeks) ? weeks : (weeks?.weeks ?? []);

  return (
    <Card>
      <header className={todayStyles.cabezaDeTarjeta}>
        <h2 className={todayStyles.tituloDeTarjeta}>
          <Link to="/reportes">Constancia</Link>
        </h2>
      </header>
      <p className={todayStyles.notaDeTarjeta}>
        {`Últimas ${safeWeeks.length || 5} semanas, un día por celda`}
      </p>
      <ConsistencyGrid weeks={safeWeeks} />
    </Card>
  );
}
