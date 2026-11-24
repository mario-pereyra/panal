import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { ErrorBoundary } from "../components/ui/FeedbackStates.jsx";
import { useModalRoute } from "../components/ui/useModalRoute.js";
import { useConnection } from "../core/connection/useConnection.js";
import { useReducedMotion } from "../core/preferences/usePreferences.js";
import {
  AuthBootstrap,
  GuestOnly,
  OnboardedOnly,
  ProtectedRoutes,
} from "../feature/auth/AuthGuards.jsx";
import { NotFoundPage } from "../feature/errors/NotFoundPage.jsx";
import { TodayPage } from "../feature/today/TodayPage.jsx";
import { AppLayout } from "./AppLayout.jsx";

const lazyNamed = (loader, exportName) =>
  lazy(() => loader().then((module) => ({ default: module[exportName] ?? module.default })));

const LoginPage = lazyNamed(() => import("../feature/auth/LoginPage.jsx"), "LoginPage");
const RegisterPage = lazyNamed(() => import("../feature/auth/RegisterPage.jsx"), "RegisterPage");
const OnboardingPage = lazyNamed(
  () => import("../feature/onboarding/OnboardingPage.jsx"),
  "OnboardingPage",
);
const CellsPage = lazyNamed(() => import("../feature/cells/CellsPage.jsx"), "CellsPage");
const HivesPage = lazyNamed(() => import("../feature/hives/HivesPage.jsx"), "HivesPage");
const HiveDetailPage = lazyNamed(
  () => import("../feature/hives/HiveDetailPage.jsx"),
  "HiveDetailPage",
);
const InviteModal = lazyNamed(() => import("../feature/hives/InviteModal.jsx"), "InviteModal");
const JoinHivePage = lazyNamed(
  () => import("../feature/joinHive/JoinHivePage.jsx"),
  "JoinHivePage",
);
const ReportsPage = lazyNamed(() => import("../feature/reports/ReportsPage.jsx"), "ReportsPage");
const ProfilePage = lazyNamed(() => import("../feature/profile/ProfilePage.jsx"), "ProfilePage");
const ActivityModal = lazyNamed(
  () => import("../feature/activity/ActivityModal.jsx"),
  "ActivityModal",
);

const MODAL_ROUTES = [
  { path: "celdas/nueva", parentElement: <CellsPage />, modalElement: <ActivityModal /> },
  { path: "celdas/:id", parentElement: <CellsPage />, modalElement: <ActivityModal /> },
  {
    path: "colmenas/:id/invitar",
    parentElement: <HiveDetailPage />,
    modalElement: <InviteModal />,
  },
];

export function App() {
  useConnection();
  useReducedMotion();
  const { backgroundLocation } = useModalRoute();

  return (
    <ErrorBoundary>
      <Suspense fallback={<AuthBootstrap />}>
        <Routes location={backgroundLocation}>
          <Route element={<GuestOnly />}>
            <Route path="entrar" element={<LoginPage />} />
            <Route path="crear" element={<RegisterPage />} />
          </Route>
          <Route path="unirme/:codigo" element={<JoinHivePage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="primer-vuelo" element={<OnboardingPage />} />
            <Route element={<AppLayout />}>
              <Route index element={<TodayPage />} />
              <Route path="celdas" element={<CellsPage />} />
              <Route path="colmenas" element={<HivesPage />} />
              <Route path="colmenas/:id" element={<HiveDetailPage />} />
              {MODAL_ROUTES.map(({ path, parentElement }) => (
                <Route key={path} path={path} element={parentElement} />
              ))}
              <Route path="reportes" element={<ReportsPage />} />
              <Route path="mi-vuelo" element={<ProfilePage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <Suspense fallback={null}>
        <Routes>
          <Route element={<OnboardedOnly />}>
            {MODAL_ROUTES.map(({ path, modalElement }) => (
              <Route key={path} path={path} element={modalElement} />
            ))}
          </Route>
          <Route path="*" element={null} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
