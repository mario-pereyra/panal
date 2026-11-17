import estilos from "./Zum.module.css";
import { DESCRIPCIONES_DE_ZUM } from "./textos.js";

/**
 * Zum, la abeja de Panal, en uno de sus seis estados.
 * Las ilustraciones salen de assets-fuente/listos/zum (ver docs/proyecto/06-assets.md).
 */

const archivos = import.meta.glob("../assets/zum/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const ruta = (estado, ancho) => archivos[`../assets/zum/${estado}-${ancho}.webp`];

/**
 * @param {object} props
 * @param {"esperando" | "animando" | "feliz" | "celebrando" | "preocupada" | "descansando"} [props.estado]
 * @param {boolean} [props.conFondo] Dibuja el círculo de cera detrás.
 * @param {boolean} [props.principal] Es la imagen más importante de la pantalla: se carga primero.
 * @param {string} [props.tamanos] Atributo `sizes`: el ancho con que se verá en cada pantalla.
 * @param {string} [props.className]
 */
export function Zum({
  estado = "esperando",
  conFondo = false,
  principal = false,
  tamanos = "240px",
  className,
}) {
  return (
    <span
      className={[estilos.zum, className].filter(Boolean).join(" ")}
      data-estado={estado}
      data-fondo={conFondo ? "" : undefined}
    >
      <img
        // Al cambiar de estado la imagen se monta de nuevo y repite su entrada.
        key={estado}
        className={estilos.dibujo}
        src={ruta(estado, 360)}
        srcSet={`${ruta(estado, 128)} 128w, ${ruta(estado, 360)} 360w, ${ruta(estado, 720)} 720w`}
        sizes={tamanos}
        width="360"
        height="360"
        alt={DESCRIPCIONES_DE_ZUM[estado]}
        fetchPriority={principal ? "high" : undefined}
        decoding="async"
      />
    </span>
  );
}
