import { Boton } from "../../componentes/Controles.jsx";
import { RejillaDeColmena } from "../../componentes/RejillaDeColmena.jsx";
import { Tarjeta } from "../../componentes/Tarjeta.jsx";
import estilos from "./Hoy.module.css";
import { plural } from "./textos.js";

/** Resumen de la colmena con actividad más reciente: avance, rejilla y aporte de cada abeja. */
export function ResumenDeColmena({ colmena }) {
  if (!colmena) {
    return (
      <Tarjeta titulo="Colmena">
        <div className={estilos.vacio}>
          <p>Todavía no tienes colmena. Funda una e invita a tu enjambre.</p>
          <Boton a="/colmenas">Fundar una colmena</Boton>
        </div>
      </Tarjeta>
    );
  }

  const abejas = colmena.integrantes.length;
  const avance =
    `${colmena.llenas} de ${colmena.total} celdas llenas ` +
    `entre ${abejas} ${plural(abejas, "abeja", "abejas")}`;

  return (
    <Tarjeta
      titulo={`Colmena: ${colmena.nombre}`}
      dato={`${colmena.porcentaje} %`}
      nota={avance}
      a={`/colmenas/${colmena.id}`}
    >
      <RejillaDeColmena
        celdas={colmena.celdas}
        descripcion={`Panal de la colmena: ${avance}. Cada celda llena lleva el color de quien la completó.`}
      />
      <ul className={estilos.enjambre} role="list">
        {colmena.integrantes.map((abeja) => (
          <li key={abeja.id} className={estilos.abeja}>
            <span
              className={estilos.muestra}
              style={{ background: abeja.color }}
              aria-hidden="true"
            />
            <span className={estilos.nombre}>{abeja.nombre}</span>
            <span className={estilos.aporte}>
              {abeja.celdas} {plural(abeja.celdas, "celda", "celdas")}
            </span>
          </li>
        ))}
      </ul>
    </Tarjeta>
  );
}
