import { Boton } from "../../componentes/Controles.jsx";
import { Zum } from "../../componentes/Zum.jsx";
import estilos from "./Pendiente.module.css";

/** Una pantalla que todavía no existe. Se reemplaza cuando llegue la de verdad. */
export function EnConstruccion({ titulo }) {
  return (
    <section className={estilos.aviso}>
      <title>{`${titulo} · Panal`}</title>
      <Zum className={estilos.zum} estado="animando" tamanos="160px" />
      <h1 className={estilos.titulo}>{titulo}</h1>
      <p className={estilos.texto}>
        Esta parte del panal todavía se está construyendo. Por ahora, todo lo de hoy está en un solo
        lugar.
      </p>
      <Boton a="/">Volver a Hoy</Boton>
    </section>
  );
}

/** P14. La dirección no lleva a ninguna parte. */
export function NoEncontrada() {
  return (
    <section className={estilos.aviso}>
      <title>No encontrada · Panal</title>
      <Zum className={estilos.zum} estado="preocupada" tamanos="160px" />
      <h1 className={estilos.titulo}>Esta celda no existe</h1>
      <p className={estilos.texto}>
        La dirección que abriste no lleva a ninguna parte del panal. Puede que el enlace esté
        incompleto.
      </p>
      <Boton a="/">Volver a Hoy</Boton>
    </section>
  );
}
