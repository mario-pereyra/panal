import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import {
  FlightWingIcon,
  HexCellIcon,
  HiveIcon,
  HoneyDropIcon,
  ReportChartIcon,
} from "../components/domain/domainIcons.jsx";
import { ModalLink } from "../components/ui/Button.jsx";
import { ErrorBoundary, Skeleton } from "../components/ui/FeedbackStates.jsx";
import { PlusIcon } from "../components/ui/icons.jsx";
import { useModalRoute } from "../components/ui/useModalRoute.js";
import { CelebrationModal } from "../core/celebrations/CelebrationModal.jsx";
import { useClockSync } from "../core/clock/useClock.js";
import { OfflineBanner } from "../core/connection/OfflineBanner.jsx";
import { UpdateBanner } from "../core/connection/UpdateBanner.jsx";
import { selectTodayDrops, selectTodayRank } from "../core/dashboard/dashboardSelectors.js";
import { useTodayDashboard } from "../core/dashboard/useDashboard.js";
import { ToastList } from "../core/toasts/ToastList.jsx";
import { selectMe } from "../store/api.js";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  useClockSync();
  const dashboardState = useTodayDashboard();
  const me = useSelector(selectMe);
  const rank = useSelector(selectTodayRank) ?? dashboardState?.rank;
  const todayDrops = useSelector(selectTodayDrops) ?? dashboardState?.todayDrops ?? 0;
  const user = me ?? dashboardState?.user;
  const location = useLocation();
  const { backgroundLocation } = useModalRoute();
  const activeLocation = backgroundLocation ?? location;

  return (
    <div className={styles.estructura}>
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>

      <header className={styles.cabecera}>
        <Link to="/" className={styles.marca} aria-label="Panal, ir a Hoy">
          <HexCellIcon />
          <span>Panal</span>
        </Link>

        <nav className={styles.secciones} aria-label="Secciones">
          <ul className={styles.lista} role="list">
            <NavSection to="/" end Icon={FlightWingIcon} label="Hoy" />
            <NavSection to="/celdas" Icon={HexCellIcon} label="Celdas" />
            <li className={styles.itemCrear}>
              <ModalLink to="/celdas/nueva" className={styles.crear} aria-label="Nueva actividad">
                <PlusIcon className={styles.icono} />
              </ModalLink>
            </li>
            <NavSection to="/colmenas" Icon={HiveIcon} label="Colmenas" />
            <NavSection to="/reportes" Icon={ReportChartIcon} label="Reportes" />
          </ul>
        </nav>

        {user && rank && (
          <div className={styles.perfil}>
            <span className={styles.oficio}>{`Nivel ${rank.level} · ${rank.name}`}</span>
            <span className={styles.gotasDeHoy}>
              <HoneyDropIcon />
              {todayDrops}
              <span className="solo-lectores"> gotas hoy</span>
            </span>
            <Link
              to="/mi-vuelo"
              className={styles.avatar}
              aria-label={`Mi vuelo: el perfil de ${user.name}`}
            >
              {user.name.charAt(0).toUpperCase()}
            </Link>
          </div>
        )}
      </header>

      <div className={styles.franjas}>
        <OfflineBanner />
        <UpdateBanner />
      </div>

      <main id="contenido" className={styles.contenido} tabIndex={-1}>
        <ErrorBoundary key={activeLocation.pathname}>
          <Suspense fallback={<Skeleton lines={4} />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      <ToastList />
      <CelebrationModal />
    </div>
  );
}

function NavSection({ to, end = false, Icon, label }) {
  return (
    <li>
      <NavLink to={to} end={end} className={styles.seccion}>
        <Icon className={styles.icono} />
        {label}
      </NavLink>
    </li>
  );
}
