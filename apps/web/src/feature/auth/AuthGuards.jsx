import { Navigate, Outlet, useLocation } from "react-router";
import { ZumScreen } from "../../components/domain/ZumScreen.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Skeleton } from "../../components/ui/FeedbackStates.jsx";
import { useMe, usePendingInvite } from "../../core/auth/useAuth.js";
import { useIsOnline } from "../../core/connection/useConnection.js";
import { useGetMeQuery } from "../../store/api.js";
import styles from "./AuthGuards.module.css";

export function AuthBootstrap() {
  return (
    <main className={styles.arranque}>
      <Skeleton lines={4} />
    </main>
  );
}

export function ProtectedRoutes() {
  const { user, isLoading, isError, isOnboarded } = useMe();
  const isOnline = useIsOnline();
  const { refetch } = useGetMeQuery();
  const location = useLocation();

  if (isLoading) return <AuthBootstrap />;
  if (isError && !isOnline && !user) {
    return (
      <ZumScreen
        mood="descansando"
        title="Sin conexión"
        description="Panal necesita conexión la primera vez. Vuelve a intentarlo cuando tengas señal."
        action={<Button onClick={refetch}>Reintentar</Button>}
      />
    );
  }
  if (!user) return <Navigate to="/entrar" replace state={{ from: location }} />;

  const onOnboardingPage = location.pathname === "/primer-vuelo";
  const completedOnboarding = Boolean(isOnboarded ?? user.onboardedAt);
  if (!completedOnboarding && !onOnboardingPage) {
    return <Navigate to="/primer-vuelo" replace />;
  }
  if (completedOnboarding && onOnboardingPage) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export function GuestOnly() {
  const { user, isLoading } = useMe();
  const { pendingInvite } = usePendingInvite();
  const location = useLocation();

  if (isLoading) return <AuthBootstrap />;
  if (user) {
    const previousLocation = location.state?.from;
    let destination = "/";
    if (pendingInvite) destination = `/unirme/${pendingInvite}`;
    else if (previousLocation) {
      destination = `${previousLocation.pathname}${previousLocation.search ?? ""}`;
    }
    return <Navigate to={destination} replace />;
  }
  return <Outlet />;
}

export function OnboardedOnly() {
  const { user, isOnboarded } = useMe();
  return (isOnboarded ?? user?.onboardedAt) ? <Outlet /> : null;
}
