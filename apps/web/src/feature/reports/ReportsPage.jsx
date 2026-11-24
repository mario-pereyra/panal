import { useId } from "react";
import { ConsistencyGrid } from "../../components/domain/ConsistencyGrid.jsx";
import { EmptyState } from "../../components/domain/EmptyState.jsx";
import { HexStrip } from "../../components/domain/HexStrip.jsx";
import { MemberAvatar } from "../../components/domain/MemberAvatar.jsx";
import { ZumMascot } from "../../components/domain/ZumMascot.jsx";
import { LoadError, Skeleton } from "../../components/ui/FeedbackStates.jsx";
import { RadioCardGroup } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { ProgressBar } from "../../components/ui/ProgressBar.jsx";
import { formatCells, formatCount, formatDays } from "../../lib/formatters.js";
import { AccessibleDataTable, BreakdownJarsChart, DailyColumnsChart } from "./ReportCharts.jsx";
import styles from "./ReportsPage.module.css";
import { formatDailySeriesSummary } from "./reportsSelectors.js";
import { useReports } from "./useReports.js";

const PERIOD_OPTIONS = [
  { value: "week", title: "Esta semana" },
  { value: "month", title: "30 días" },
  { value: "quarter", title: "90 días" },
];

const PERIOD_METRIC_LABELS = {
  week: "Celdas de la semana",
  month: "Celdas del periodo",
  quarter: "Celdas del periodo",
};

const DAILY_TABLE_COLUMNS = ["Día", "Celdas llenas"];
const BREAKDOWN_TABLE_COLUMNS = ["Tipo", "Celdas llenas"];

function formatBreakdownSummary(jars) {
  if (!jars) return "";
  const [onceJar, recurringJar] = jars;
  if (onceJar.count + recurringJar.count === 0) {
    return "Sin celdas llenas en este periodo.";
  }
  return `${formatCount(onceJar.count, "única", "únicas")} y ${formatCount(recurringJar.count, "recurrente", "recurrentes")} en este periodo.`;
}

function formatHiveContributionsSummary(hive) {
  if (hive.totalContributed === 0) {
    return `Nadie llenó celdas de ${hive.name} en este periodo.`;
  }
  const parts = hive.contributions.map((member) => `${member.name}, ${formatCells(member.cells)}`);
  return `${hive.name}: ${parts.join("; ")}.`;
}

function formatRecurringScreenReaderSummary(series) {
  const parts = series.map((item) =>
    item.hasScheduledDays ? `${item.title}, ${item.complianceLabel}` : `${item.title}, no tocaba`,
  );
  return `Tus recurrentes en los últimos siete días: ${parts.join("; ")}.`;
}

export function ReportsPage() {
  const reports = useReports();

  if (reports.isLoading) return <Skeleton lines={5} />;

  if (reports.isError) {
    return (
      <Page title="Reportes">
        <LoadError message="No pudimos traer tus reportes" onRetry={reports.retry} />
      </Page>
    );
  }

  if (reports.isEmpty) {
    return (
      <Page title="Reportes">
        <section className={styles.vacio}>
          <EmptyState description="Aquí aparecerá tu panal de constancia cuando llenes tu primera celda." />
        </section>
      </Page>
    );
  }

  const {
    dailyView,
    consistency,
    streak,
    periodKey,
    breakdownJars,
    recurringSeries,
    recurringTable,
    hives,
  } = reports;
  const dailySummaryText = formatDailySeriesSummary(dailyView, periodKey);
  const breakdownSummaryText = formatBreakdownSummary(breakdownJars);

  return (
    <Page title="Reportes">
      <dl className={styles.cifras}>
        <div>
          <dt>{PERIOD_METRIC_LABELS[periodKey]}</dt>
          <dd>{dailyView?.total ?? "–"}</dd>
        </div>
        <div>
          <dt>Racha de vuelo</dt>
          <dd>{formatDays(streak?.current ?? 0)}</dd>
        </div>
        <div>
          <dt>Mejor racha</dt>
          <dd>{formatDays(streak?.best ?? 0)}</dd>
        </div>
      </dl>

      <div className={styles.rejilla}>
        <ReportCard title="Panal de constancia" description={consistency.description} wide>
          <div className={styles.constancia}>
            <ConsistencyGrid weeks={consistency.weeks} />
          </div>
          <AccessibleDataTable
            title="Celdas llenas por día en las últimas semanas"
            columns={DAILY_TABLE_COLUMNS}
            rows={consistency.tableRows}
          />
        </ReportCard>

        <ReportCard
          title="Celdas por día"
          description={dailySummaryText}
          busy={reports.isFetching}
          wide
          extra={
            <RadioCardGroup
              label="Periodo"
              name="report-period"
              options={PERIOD_OPTIONS}
              value={periodKey}
              onChange={reports.setPeriodKey}
            />
          }
        >
          {dailyView && (
            <>
              <DailyColumnsChart
                days={dailyView.chartDays}
                goal={reports.user?.dailyGoal ?? 5}
                description={dailySummaryText}
              />
              <AccessibleDataTable
                title="Celdas llenas por día"
                columns={DAILY_TABLE_COLUMNS}
                rows={dailyView.tableRows}
              />
            </>
          )}
        </ReportCard>

        <ReportCard
          title="Tus recurrentes"
          description="Los últimos siete días: llena si la cumpliste, punteada si no tocaba."
        >
          {recurringSeries.length === 0 ? (
            <p className={styles.nota}>Todavía no tienes celdas recurrentes.</p>
          ) : (
            <>
              <ul className={styles.rondas} role="list">
                {recurringSeries.map((item) => (
                  <li key={item.id} className={styles.ronda}>
                    <span className={styles.tituloDeRonda}>{item.title}</span>
                    <HexStrip items={item.strip} size={22} />
                    <span className={styles.porcentaje}>{item.complianceLabel}</span>
                  </li>
                ))}
              </ul>
              <p className="solo-lectores">{formatRecurringScreenReaderSummary(recurringSeries)}</p>
              <AccessibleDataTable
                title="Cumplimiento de tus recurrentes en los últimos siete días"
                columns={["Celda", ...recurringTable.dayHeaders, "Cumplimiento"]}
                rows={recurringTable.rows}
              />
            </>
          )}
        </ReportCard>

        <ReportCard title="Únicas y recurrentes" description={breakdownSummaryText}>
          {breakdownJars && (
            <>
              <BreakdownJarsChart jars={breakdownJars} description={breakdownSummaryText} />
              <AccessibleDataTable
                title="Celdas llenas por tipo"
                columns={BREAKDOWN_TABLE_COLUMNS}
                rows={breakdownJars.map((jar) => [jar.name, jar.count])}
              />
            </>
          )}
        </ReportCard>

        {hives.length > 0 && (
          <ReportCard
            title="Tus colmenas"
            description="Lo que aportó cada abeja en este periodo."
            wide
          >
            <div className={styles.colmenas}>
              {hives.map((hive) => (
                <section
                  key={hive.id}
                  className={styles.colmena}
                  aria-labelledby={`aporte-${hive.id}`}
                >
                  <h3 id={`aporte-${hive.id}`} className={styles.nombreDeColmena}>
                    {hive.name}
                  </h3>
                  {hive.totalContributed === 0 ? (
                    <p className={styles.nota}>{formatHiveContributionsSummary(hive)}</p>
                  ) : (
                    <>
                      <p className="solo-lectores">{formatHiveContributionsSummary(hive)}</p>
                      <ul className={styles.aportes} role="list" aria-hidden="true">
                        {hive.contributions.map((member) => (
                          <li key={member.userId}>
                            <MemberAvatar name={member.name} color={member.colorIndex} size="sm" />
                            <span className={styles.nombre}>{member.name}</span>
                            <ProgressBar value={member.percentage} max={100} />
                            <span className={styles.cantidad}>{member.cells}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </section>
              ))}
            </div>
          </ReportCard>
        )}
      </div>

      <aside className={styles.zum}>
        <ZumMascot mood="animando" sizes="72px" className={styles.retrato} />
        <p>Mirar atrás también es avanzar: aquí se ve cada gota que juntaste.</p>
      </aside>
    </Page>
  );
}

function ReportCard({ title, description, extra, wide = false, busy = false, children }) {
  const headingId = useId();
  return (
    <section
      className={styles.grafica}
      data-ancha={wide ? "" : undefined}
      aria-labelledby={headingId}
      aria-busy={busy || undefined}
    >
      <header className={styles.cabeza}>
        <h2 id={headingId} className={styles.titulo}>
          {title}
        </h2>
        {extra}
      </header>
      {description && (
        <p className={styles.frase} aria-hidden="true">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}
