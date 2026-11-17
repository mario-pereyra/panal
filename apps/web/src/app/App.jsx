import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router";
import { LimiteDeError } from "../componentes/Estados.jsx";
import { useVigilarConexion } from "../feature/conexion/useConexion.js";
import { NoEncontrada } from "../feature/errores/Errores.jsx";
import { Hoy } from "../feature/hoy/Hoy.jsx";
import { useAplicarMovimiento } from "../feature/miVuelo/useMiVuelo.js";
import { Arranque, ConSesion, SinSesion, SoloConSesion } from "../feature/sesion/Guardias.jsx";
import { Estructura } from "./Estructura.jsx";

/**
 * Una pantalla que se descarga la primera vez que se visita. Hoy, la puerta de
 * entrada, va en el archivo principal; el resto, aparte. Los formularios traen
 * Zod consigo. El service worker guarda todas al instalarse, así que también
 * abren sin red.
 *
 * @param {() => Promise<Record<string, import("react").ComponentType>>} cargar
 * @param {string} nombre La exportación del módulo.
 */
const perezosa = (cargar, nombre) =>
  lazy(() => cargar().then((modulo) => ({ default: modulo[nombre] })));

const Entrar = perezosa(() => import("../feature/sesion/Entrar.jsx"), "Entrar");
const CrearPanal = perezosa(() => import("../feature/sesion/CrearPanal.jsx"), "CrearPanal");
const PrimerVuelo = perezosa(() => import("../feature/primerVuelo/PrimerVuelo.jsx"), "PrimerVuelo");
const Celdas = perezosa(() => import("../feature/celdas/Celdas.jsx"), "Celdas");
const Colmenas = perezosa(() => import("../feature/colmenas/Colmenas.jsx"), "Colmenas");
const Colmena = perezosa(() => import("../feature/colmenas/Colmena.jsx"), "Colmena");
const Invitar = perezosa(() => import("../feature/colmenas/Invitar.jsx"), "Invitar");
const Unirme = perezosa(() => import("../feature/colmenas/Unirme.jsx"), "Unirme");
const Reportes = perezosa(() => import("../feature/reportes/Reportes.jsx"), "Reportes");
const MiVuelo = perezosa(() => import("../feature/miVuelo/MiVuelo.jsx"), "MiVuelo");
const VentanaDeActividad = perezosa(
  () => import("../feature/actividad/VentanaDeActividad.jsx"),
  "VentanaDeActividad",
);

/**
 * Las rutas de Panal (docs/proyecto/03-pantallas.md, sección 2).
 *
 * Las ventanas con ruta propia (P06 y P09) se dibujan sobre la pantalla desde
 * la que se abrieron: esa ubicación viaja en `state.fondo`. El primer
 * `Routes` dibuja el fondo; el segundo, la ventana. Con un enlace directo no
 * hay fondo y debajo queda la pantalla madre (Celdas o la colmena).
 */
export function App() {
  useVigilarConexion();
  useAplicarMovimiento();
  const ubicacion = useLocation();
  const fondo = ubicacion.state?.fondo;

  return (
    <LimiteDeError>
      <Suspense fallback={<Arranque />}>
        <Routes location={fondo ?? ubicacion}>
          <Route element={<SinSesion />}>
            <Route path="entrar" element={<Entrar />} />
            <Route path="crear" element={<CrearPanal />} />
          </Route>
          <Route path="unirme/:codigo" element={<Unirme />} />
          <Route element={<ConSesion />}>
            <Route path="primer-vuelo" element={<PrimerVuelo />} />
            <Route element={<Estructura />}>
              <Route index element={<Hoy />} />
              <Route path="celdas" element={<Celdas />} />
              <Route path="celdas/nueva" element={<Celdas />} />
              <Route path="celdas/:id" element={<Celdas />} />
              <Route path="colmenas" element={<Colmenas />} />
              <Route path="colmenas/:id" element={<Colmena />} />
              <Route path="colmenas/:id/invitar" element={<Colmena />} />
              <Route path="reportes" element={<Reportes />} />
              <Route path="mi-vuelo" element={<MiVuelo />} />
            </Route>
          </Route>
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </Suspense>

      {/* La ventana aparece cuando llega su código; el fondo sigue a la vista. */}
      <Suspense fallback={null}>
        <Routes>
          <Route element={<SoloConSesion />}>
            <Route path="celdas/nueva" element={<VentanaDeActividad />} />
            <Route path="celdas/:id" element={<VentanaDeActividad />} />
            <Route path="colmenas/:id/invitar" element={<Invitar />} />
          </Route>
          <Route path="*" element={null} />
        </Routes>
      </Suspense>
    </LimiteDeError>
  );
}
