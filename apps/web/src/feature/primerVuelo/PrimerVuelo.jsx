import { soloTitulo } from "@panal/contratos";
import { useEffect, useRef } from "react";
import { Boton, Ficha } from "../../componentes/ui/Controles.jsx";
import { Campo, ErrorDelFormulario } from "../../componentes/ui/Formulario.jsx";
import { puntosDeHexagono } from "../../componentes/ui/hexagono.js";
import { IconoGota, IconoTarro } from "../../componentes/panal/iconos.jsx";
import { PanalDeHoy } from "../../componentes/panal/PanalDeHoy.jsx";
import { Principal, TituloDePestana } from "../../componentes/ui/Pagina.jsx";
import { SelloDeCera } from "../../componentes/panal/SelloDeCera.jsx";
import { textoDeGotas } from "../../nucleo/textos.js";
import { useFormulario } from "../../componentes/ui/useFormulario.js";
import { Zum } from "../../componentes/panal/Zum.jsx";
import estilos from "./PrimerVuelo.module.css";
import {
  ABRIENDO_TU_PANAL,
  CREANDO,
  CREAR_CELDA,
  EJEMPLO_DE_ACTIVIDAD,
  GUARDANDO,
  IR_A_MI_PANAL,
  O_ELIGE_UNA,
  pasoDe,
  PRIMERA_CELDA_LLENA,
  QUE_VAS_A_HACER,
  RESERVA_DE_REGALO,
  SE_PUEDE_CAMBIAR,
  SEGUIR,
  SELLO_PRIMERA_CELDA,
  SUGERENCIAS,
  TAMANO_DEL_PANAL,
  TAMANOS,
  TITULOS_DE_PASO,
  TOCALA_AL_CUMPLIRLA,
  VOLVER,
} from "./textos.js";
import { usePrimerVuelo } from "./usePrimerVuelo.js";

const ANCHO_DE_PASO = 32;

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
    <Principal className={estilos.primerVuelo}>
      <TituloDePestana>{TITULOS_DE_PASO[vuelo.paso - 1]}</TituloDePestana>
      <header className={estilos.cabeza}>
        {/* Zum guía el recorrido y celebra la primera celda: aquí no rigen los estados del día del motor. */}
        <Zum
          className={estilos.zum}
          estado={vuelo.celdaId ? "celebrando" : "animando"}
          tamanos="120px"
        />
        <div className={estilos.pasos}>
          <p className="solo-lectores">{pasoDe(vuelo.paso, TITULOS_DE_PASO.length)}</p>
          <svg
            width={ANCHO_DE_PASO * TITULOS_DE_PASO.length}
            height="28"
            viewBox={`0 0 ${ANCHO_DE_PASO * TITULOS_DE_PASO.length} 28`}
            aria-hidden="true"
          >
            {TITULOS_DE_PASO.map((_, indice) => (
              <polygon
                key={indice}
                className={estilos.paso}
                data-hecho={indice < vuelo.paso ? "" : undefined}
                points={puntosDeHexagono(12)}
                transform={`translate(${ANCHO_DE_PASO / 2 + indice * ANCHO_DE_PASO} 14)`}
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
    </Principal>
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
        <legend className="solo-lectores">{TAMANO_DEL_PANAL}</legend>
        {TAMANOS.map((tamano) => (
          <label key={tamano.meta} className={estilos.tamano}>
            <input
              type="radio"
              name="meta"
              value={tamano.meta}
              checked={vuelo.meta === tamano.meta}
              onChange={() => vuelo.elegirMeta(tamano.meta)}
            />
            <PanalDeHoy className={estilos.miniatura} llenas={0} meta={tamano.meta} />
            <span className={estilos.nombreDeTamano}>{tamano.nombre}</span>
            <span className={estilos.detalleDeTamano}>{tamano.detalle}</span>
          </label>
        ))}
      </fieldset>
      <p className={estilos.nota}>{SE_PUEDE_CAMBIAR}</p>
      <Boton type="submit" className={estilos.seguir} disabled={vuelo.guardando}>
        {vuelo.guardando ? GUARDANDO : SEGUIR}
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
        etiqueta={QUE_VAS_A_HACER}
        placeholder={EJEMPLO_DE_ACTIVIDAD}
        autoComplete="off"
        required
        {...formulario.campo("titulo")}
      />
      <div className={estilos.sugerencias}>
        <p className={estilos.nota}>{O_ELIGE_UNA}</p>
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
          {VOLVER}
        </Boton>
        <Boton type="submit" disabled={vuelo.guardando}>
          {vuelo.guardando ? CREANDO : CREAR_CELDA}
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
        {llena ? PRIMERA_CELDA_LLENA : TOCALA_AL_CUMPLIRLA}
      </p>

      {/* Lo ganado aparece al llenarla, y se anuncia. */}
      <div role="status" className={estilos.ganado}>
        {llena && (
          <>
            <Ficha icono={<IconoGota />}>{textoDeGotas(vuelo.gotas)}</Ficha>
            <div className={estilos.sello}>
              <SelloDeCera id="primera-celda" ganado tamano={64} />
              <p>{SELLO_PRIMERA_CELDA}</p>
            </div>
            <p className={estilos.regalo}>
              <IconoTarro /> {RESERVA_DE_REGALO}
            </p>
          </>
        )}
      </div>

      {llena && (
        <Boton onClick={vuelo.irAMiPanal} disabled={vuelo.guardando} className={estilos.seguir}>
          {vuelo.guardando ? ABRIENDO_TU_PANAL : IR_A_MI_PANAL}
        </Boton>
      )}
    </div>
  );
}
