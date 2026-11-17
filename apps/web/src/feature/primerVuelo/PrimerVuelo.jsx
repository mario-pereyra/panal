import { soloTitulo } from "@panal/contratos";
import { useEffect, useRef } from "react";
import { Boton, Ficha } from "../../componentes/Controles.jsx";
import { Campo, ErrorDelFormulario } from "../../componentes/Formulario.jsx";
import { puntosDeHexagono } from "../../componentes/hexagono.js";
import { IconoGota, IconoTarro } from "../../componentes/iconos.jsx";
import { PanalDeHoy } from "../../componentes/PanalDeHoy.jsx";
import { SelloDeCera } from "../../componentes/SelloDeCera.jsx";
import { textoDeGotas } from "../../componentes/textos.js";
import { useFormulario } from "../../componentes/useFormulario.js";
import { Zum } from "../../componentes/Zum.jsx";
import estilos from "./PrimerVuelo.module.css";
import { SUGERENCIAS, TAMANOS, TITULOS_DE_PASO } from "./textos.js";
import { usePrimerVuelo } from "./usePrimerVuelo.js";

/** P03. Primer vuelo: elegir la meta diaria y cumplir la primera actividad. */
export function PrimerVuelo() {
  const vuelo = usePrimerVuelo();
  const titulo = useRef(/** @type {HTMLHeadingElement | null} */ (null));

  // Al cambiar de paso, el foco va al título nuevo: así se anuncia y se sigue leyendo desde ahí.
  const pasoAnterior = useRef(vuelo.paso);
  useEffect(() => {
    if (pasoAnterior.current !== vuelo.paso) titulo.current?.focus();
    pasoAnterior.current = vuelo.paso;
  }, [vuelo.paso]);

  return (
    <main id="contenido" className={estilos.primerVuelo}>
      <title>{`${TITULOS_DE_PASO[vuelo.paso - 1]} · Panal`}</title>
      <header className={estilos.cabeza}>
        <Zum
          className={estilos.zum}
          estado={vuelo.celdaId ? "celebrando" : "animando"}
          tamanos="120px"
        />
        <div className={estilos.pasos}>
          <p className="solo-lectores">{`Paso ${vuelo.paso} de 3`}</p>
          <svg width="96" height="28" viewBox="0 0 96 28" aria-hidden="true">
            {[1, 2, 3].map((paso) => (
              <polygon
                key={paso}
                className={estilos.paso}
                data-hecho={paso <= vuelo.paso ? "" : undefined}
                points={puntosDeHexagono(12)}
                transform={`translate(${16 + (paso - 1) * 32} 14)`}
              />
            ))}
          </svg>
          <h1 ref={titulo} className={estilos.titulo} tabIndex={-1}>
            {TITULOS_DE_PASO[vuelo.paso - 1]}
          </h1>
        </div>
      </header>

      <ErrorDelFormulario>{vuelo.error?.mensaje}</ErrorDelFormulario>

      {vuelo.paso === 1 && <ElegirTamano vuelo={vuelo} />}
      {vuelo.paso === 2 && <PrimeraCelda vuelo={vuelo} />}
      {vuelo.paso === 3 && <Llenarla vuelo={vuelo} />}
    </main>
  );
}

function ElegirTamano({ vuelo }) {
  return (
    <form
      className={estilos.paso1}
      onSubmit={(evento) => {
        evento.preventDefault();
        vuelo.confirmarMeta();
      }}
    >
      <fieldset className={estilos.tamanos}>
        <legend className="solo-lectores">Tamaño del panal de cada día</legend>
        {TAMANOS.map((tamano) => (
          <label key={tamano.meta} className={estilos.tamano}>
            <input
              type="radio"
              name="meta"
              value={tamano.meta}
              checked={vuelo.meta === tamano.meta}
              onChange={() => vuelo.elegirMeta(tamano.meta)}
            />
            <PanalDeHoy
              className={estilos.miniatura}
              llenas={0}
              meta={tamano.meta}
              descripcion=""
            />
            <span className={estilos.nombreDeTamano}>{tamano.nombre}</span>
            <span className={estilos.detalleDeTamano}>{tamano.detalle}</span>
          </label>
        ))}
      </fieldset>
      <p className={estilos.nota}>Puedes cambiarlo cuando quieras desde Mi vuelo.</p>
      <Boton type="submit" className={estilos.seguir} disabled={vuelo.guardando}>
        {vuelo.guardando ? "Guardando…" : "Seguir"}
      </Boton>
    </form>
  );
}

function PrimeraCelda({ vuelo }) {
  const formulario = useFormulario(soloTitulo, { titulo: vuelo.titulo });
  return (
    <form
      ref={formulario.formulario}
      className={estilos.paso2}
      onSubmit={formulario.alEnviar(vuelo.crearPrimeraCelda)}
      noValidate
    >
      <Campo
        etiqueta="¿Qué vas a hacer cada día?"
        placeholder="Por ejemplo, tomar agua"
        autoComplete="off"
        required
        {...formulario.campo("titulo")}
      />
      <div className={estilos.sugerencias}>
        <p className={estilos.nota}>O elige una:</p>
        <ul role="list">
          {SUGERENCIAS.map((sugerencia) => (
            <li key={sugerencia}>
              <Boton
                tono="claro"
                tamano="chico"
                onClick={() => formulario.cambiar({ titulo: sugerencia })}
              >
                {sugerencia}
              </Boton>
            </li>
          ))}
        </ul>
      </div>
      <div className={estilos.acciones}>
        <Boton tono="sutil" onClick={vuelo.volver}>
          Volver
        </Boton>
        <Boton type="submit" disabled={vuelo.guardando}>
          {vuelo.guardando ? "Creando…" : "Crear celda"}
        </Boton>
      </div>
    </form>
  );
}

function Llenarla({ vuelo }) {
  const llena = Boolean(vuelo.celdaId);
  return (
    <div className={estilos.paso3}>
      <label className={estilos.celdaGrande} data-llena={llena ? "" : undefined}>
        <input
          type="checkbox"
          checked={llena}
          disabled={llena || vuelo.guardando}
          onChange={vuelo.llenarPrimeraCelda}
          aria-describedby="ayuda-primera-celda"
        />
        <svg viewBox="-60 -60 120 120" aria-hidden="true">
          <polygon points={puntosDeHexagono(54)} />
          <path d="M-20 0 l14 15 l28 -30" pathLength="1" />
        </svg>
        <span className={estilos.tituloDeCelda}>{vuelo.titulo}</span>
      </label>
      <p id="ayuda-primera-celda" className={estilos.nota}>
        {llena
          ? "¡Primera celda llena!"
          : "Tócala cuando la cumplas. Si ya lo hiciste hoy, también vale."}
      </p>

      {/* Lo ganado aparece al llenarla, y se anuncia. */}
      <div role="status" className={estilos.ganado}>
        {llena && (
          <>
            <Ficha icono={<IconoGota />}>{textoDeGotas(vuelo.gotas)}</Ficha>
            <div className={estilos.sello}>
              <SelloDeCera id="primera-celda" ganado tamano={64} />
              <p>Sello de cera: Primera celda</p>
            </div>
            <p className={estilos.regalo}>
              <IconoTarro /> Te regalamos una reserva de miel: protege tu racha un día.
            </p>
          </>
        )}
      </div>

      {llena && (
        <Boton onClick={vuelo.irAMiPanal} disabled={vuelo.guardando} className={estilos.seguir}>
          {vuelo.guardando ? "Abriendo tu panal…" : "Ir a mi panal"}
        </Boton>
      )}
    </div>
  );
}
