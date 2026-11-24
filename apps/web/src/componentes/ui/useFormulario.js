import { erroresPorCampo } from "@panal/contratos";
import { useRef, useState } from "react";
import { anunciar } from "../../lib/anunciar.js";

/**
 * Estado de un formulario validado con un esquema de `@panal/contratos`, el
 * mismo que usa el servidor.
 *
 * - Un campo muestra su error al salir de él, no mientras se escribe.
 * - Al corregirlo, el error desaparece en cuanto el valor es válido.
 * - Si el envío falla, el foco va al primer campo con error, y el lector de
 *   pantalla lee el mensaje al llegar ahí.
 * - Los errores del servidor (`campos`) se muestran igual que los propios.
 *
 * @template T
 * @param {import("zod").ZodType<T>} esquema
 * @param {Record<string, any>} valoresIniciales
 * @param {{ convertir?: (valores: Record<string, any>) => unknown }} [opciones]
 *   Si los campos no tienen la forma del esquema, `convertir` arma los datos a validar.
 */
export function useFormulario(
  esquema,
  valoresIniciales,
  { convertir = (valores) => valores } = {},
) {
  // Se compara con lo que había al abrir: quien llama puede pasar un borrador
  // que se actualiza con cada tecla.
  const [inicial] = useState(valoresIniciales);
  const [valores, setValores] = useState(inicial);
  const [errores, setErrores] = useState(/** @type {Record<string, string>} */ ({}));
  const tocados = useRef(new Set());
  const formulario = useRef(/** @type {HTMLFormElement | null} */ (null));

  const validar = (datos) => {
    const resultado = esquema.safeParse(convertir(datos));
    return resultado.success
      ? { datos: resultado.data, errores: {} }
      : { datos: null, errores: erroresPorCampo(resultado.error) };
  };

  const cambiar = (cambios) => {
    const siguientes = { ...valores, ...cambios };
    setValores(siguientes);
    if (Object.keys(errores).length === 0) return;
    // Solo se quitan errores: uno nuevo espera a que se salga del campo o se envíe.
    const vigentes = validar(siguientes).errores;
    setErrores(
      Object.fromEntries(
        Object.keys(errores)
          .filter((nombre) => nombre in vigentes)
          .map((nombre) => [nombre, vigentes[nombre]]),
      ),
    );
  };

  const campo = (nombre) => ({
    name: nombre,
    value: valores[nombre] ?? "",
    onChange: (evento) => cambiar({ [nombre]: evento.target.value }),
    onBlur: (evento) => {
      if (!tocados.current.has(nombre) && valores[nombre] === inicial[nombre]) return;
      tocados.current.add(nombre);
      const error = validar(valores).errores[nombre];
      setErrores((actuales) => {
        if (actuales[nombre] === error) return actuales;
        const siguientes = { ...actuales };
        if (error) siguientes[nombre] = error;
        else delete siguientes[nombre];
        return siguientes;
      });
      // El foco ya está en el campo siguiente y el lector de pantalla lo está
      // nombrando: el error del que se dejó se anuncia medio segundo después,
      // con la etiqueta del campo para que se sepa de cuál es.
      if (error && !errores[nombre]) {
        const etiqueta = evento.target.labels?.[0]?.textContent ?? "";
        anunciar(`${etiqueta}: ${error}`, { demora: 500 });
      }
    },
    error: errores[nombre],
  });

  const enfocarPrimerError = (conError) => {
    const elementos = formulario.current?.elements;
    if (!elementos) return;
    const primero = [...elementos].find((elemento) => elemento.name && elemento.name in conError);
    primero?.focus();
  };

  /**
   * Para `onSubmit`: valida y, si todo está bien, llama a `accion` con los datos
   * ya normalizados por el esquema.
   * @param {(datos: T) => unknown} accion
   */
  const alEnviar = (accion) => (evento) => {
    evento.preventDefault();
    const { datos, errores: nuevos } = validar(valores);
    setErrores(nuevos);
    if (datos) accion(datos);
    else enfocarPrimerError(nuevos);
  };

  const mostrarErroresDelServidor = (campos) => {
    if (!campos || Object.keys(campos).length === 0) return;
    setErrores(campos);
    enfocarPrimerError(campos);
  };

  const sinCambios = Object.keys(inicial).every((clave) =>
    Object.is(inicial[clave], valores[clave]),
  );

  return {
    valores,
    errores,
    cambiar,
    campo,
    alEnviar,
    mostrarErroresDelServidor,
    formulario,
    sinCambios,
  };
}
