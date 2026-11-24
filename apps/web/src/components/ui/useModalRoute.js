import { useLocation, useNavigate } from "react-router";

export function useModalRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const savedBackground = location.state?.backgroundLocation ?? location.state?.fondo;
  return {
    backgroundLocation: savedBackground ?? location,
    closeModal: (fallbackPath = "/") =>
      savedBackground ? navigate(-1) : navigate(fallbackPath, { replace: true }),
  };
}
