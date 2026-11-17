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

/**
 * Escucha la red, la oferta de instalación y las versiones nuevas, y lo deja en
 * el slice. Se usa una sola vez, en la raíz de la aplicación. Lo propio de la
 * PWA vive en `pwa/registro.js`.
 */
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

/** Para las pantallas: si hay red, cómo instalar Panal y cómo pasar a la versión nueva. */
export function useConexion() {
  const dispatch = useDispatch();
  const enLinea = useSelector(selectEnLinea);
  const puedeInstalar = useSelector(selectPuedeInstalar);
  const instalada = useSelector(selectInstalada);
  const versionNueva = useSelector(selectVersionNueva);

  /** Se llama directo desde el clic: el navegador exige ese gesto para instalar. */
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
