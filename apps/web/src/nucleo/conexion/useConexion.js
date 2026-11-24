import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activarVersionNueva,
  escucharInstalacion,
  instalar as abrirInstalacion,
  registrarServiceWorker,
} from "../../../pwa/registro.js";
import {
  cambiarConexion,
  marcarInstalable,
  marcarInstalada,
  marcarVersionNueva,
} from "./conexionSlice.js";
import {
  selectEnLinea,
  selectInstalada,
  selectPuedeInstalar,
  selectVersionNueva,
} from "./conexionSelector.js";

// Una sola vez, en la raíz de la aplicación: registra el service worker.
export function useVigilarConexion() {
  const dispatch = useDispatch();

  useEffect(() => {
    registrarServiceWorker({ alHaberVersionNueva: () => dispatch(marcarVersionNueva()) });
    const dejarDeEscuchar = escucharInstalacion({
      alPoderInstalar: () => dispatch(marcarInstalable(true)),
      alInstalarse: () => dispatch(marcarInstalada()),
    });

    const conRed = () => dispatch(cambiarConexion(true));
    const sinRed = () => dispatch(cambiarConexion(false));
    window.addEventListener("online", conRed);
    window.addEventListener("offline", sinRed);
    return () => {
      dejarDeEscuchar();
      window.removeEventListener("online", conRed);
      window.removeEventListener("offline", sinRed);
    };
  }, [dispatch]);
}

export function useConexion() {
  const dispatch = useDispatch();
  const enLinea = useSelector(selectEnLinea);
  const puedeInstalar = useSelector(selectPuedeInstalar);
  const instalada = useSelector(selectInstalada);
  const versionNueva = useSelector(selectVersionNueva);

  const instalar = async () => {
    const lista = await abrirInstalacion({
      alSoltarLaOferta: () => dispatch(marcarInstalable(false)),
    });
    if (lista) dispatch(marcarInstalada());
  };

  return {
    enLinea,
    puedeInstalar,
    instalada,
    instalar,
    versionNueva,
    actualizar: activarVersionNueva,
  };
}
