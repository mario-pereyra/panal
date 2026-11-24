import { useSelector } from "react-redux";
import { useObtenerPanalQuery } from "../../store/api.js";
import { selectGotasDeHoy, selectOficio, selectPersona } from "./panalSelector.js";

export function useResumenDelDia() {
  useObtenerPanalQuery();
  return {
    persona: useSelector(selectPersona),
    oficio: useSelector(selectOficio),
    gotasDeHoy: useSelector(selectGotasDeHoy),
  };
}
