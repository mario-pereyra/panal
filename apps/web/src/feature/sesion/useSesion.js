import { useEffect, useState } from "react";
import {
  useCrearCuentaMutation,
  useEntrarMutation,
  useVerInvitacionQuery,
} from "../../store/api.js";
import { leerError, mensajeGeneral } from "../../store/errores.js";
import { useConexion } from "../../nucleo/conexion/useConexion.js";
import { useInvitacionPendiente } from "../../nucleo/cuenta/useCuenta.js";
import { zonaDelDispositivo } from "../../lib/dispositivo.js";
import { mensajeAlEntrar } from "./textos.js";

/** Entrar al panal. Al responder bien, el perfil queda en caché y la ruta de acceso redirige sola. */
export function useEntrar() {
  const [entrar, estado] = useEntrarMutation();
  const { enLinea } = useConexion();
  const error = leerError(estado.error);
  // Solo `demasiados_intentos` trae `reintentarEn`: los segundos hasta poder probar otra vez.
  const espera = useCuentaAtras(error?.reintentarEn ?? 0);
  return {
    entrar,
    enviando: estado.isLoading,
    mensaje: mensajeAlEntrar(error, espera),
    espera,
    enLinea,
  };
}

/** Crear un panal nuevo, con la zona horaria de este dispositivo y la invitación pendiente, si la hay. */
export function useCrearCuenta() {
  const [crear, estado] = useCrearCuentaMutation();
  const { enLinea } = useConexion();
  const { invitacion } = useInvitacionPendiente();
  const { data: vista } = useVerInvitacionQuery(invitacion, { skip: !invitacion });
  const zonaHoraria = zonaDelDispositivo();
  const error = leerError(estado.error);
  return {
    crearCuenta: (datos) => crear({ ...datos, zonaHoraria }),
    enviando: estado.isLoading,
    mensaje: mensajeGeneral(error),
    correoEnUso: error?.codigo === "correo_en_uso",
    enLinea,
    invitacion: vista,
  };
}

/** Segundos que faltan, contando hacia atrás desde `inicio` cada vez que cambia. */
function useCuentaAtras(inicio) {
  const [restantes, setRestantes] = useState(inicio);
  useEffect(() => {
    setRestantes(inicio);
    if (inicio <= 0) return undefined;
    const intervalo = setInterval(() => setRestantes((antes) => Math.max(0, antes - 1)), 1000);
    return () => clearInterval(intervalo);
  }, [inicio]);
  return restantes;
}
