import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { LimiteDeError } from "../componentes/ui/Estados.jsx";
import { useFondo } from "../componentes/ui/useFondo.js";
import { useVigilarConexion } from "../nucleo/conexion/useConexion.js";
import { NoEncontrada } from "../feature/errores/Errores.jsx";
import { Hoy } from "../feature/hoy/Hoy.jsx";
import { useAplicarMovimiento } from "../nucleo/preferencias/usePreferencias.js";
import { Arranque, ConSesion, SinSesion, SoloConSesion } from "../feature/sesion/Guardias.jsx";
import { Estructura } from "./Estructura.jsx";

/**
 * Una pantalla que se descarga la primera vez que se visita. Hoy, la puerta de
 * entrada, va en el archivo principal; el resto, aparte. Los formularios traen
 * Zod consigo. El service worker guarda todas al instalarse, así que también
 * abren sin red. `nombre` es la exportación del módulo.
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
const Unirme = perezosa(() => import("../feature/unirme/Unirme.jsx"), "Unirme");
const Reportes = perezosa(() => import("../feature/reportes/Reportes.jsx"), "Reportes");
const MiVuelo = perezosa(() => import("../feature/miVuelo/MiVuelo.jsx"), "MiVuelo");
const VentanaDeActividad = perezosa(
  () => import("../feature/actividad/VentanaDeActividad.jsx"),
  "VentanaDeActividad",
);

/**
 * Las ventanas con ruta propia (P06 y P09) se dibujan sobre la pantalla desde
 * la que se abrieron: esa ubicación viaja en `state.fondo`. El primer
 * `Routes` dibuja el fondo; el segundo, la ventana. Con un enlace directo no
 * hay fondo y debajo queda la pantalla madre.
 */
const VENTANAS = [
  { ruta: "celdas/nueva", madre: <Celdas />, ventana: <VentanaDeActividad /> },
  { ruta: "celdas/:id", madre: <Celdas />, ventana: <VentanaDeActividad /> },
  { ruta: "colmenas/:id/invitar", madre: <Colmena />, ventana: <Invitar /> },
];

/** Las rutas de Panal (docs/proyecto/03-pantallas.md, sección 2). */
export function App() {
  useVigilarConexion();
  useAplicarMovimiento();
  const { fondo } = useFondo();

  return (
    <LimiteDeError>
      <Suspense fallback={<Arranque />}>
        <Routes location={fondo}>
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
              <Route path="colmenas" element={<Colmenas />} />
              <Route path="colmenas/:id" element={<Colmena />} />
              {VENTANAS.map(({ ruta, madre }) => (
                <Route key={ruta} path={ruta} element={madre} />
              ))}
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
            {VENTANAS.map(({ ruta, ventana }) => (
              <Route key={ruta} path={ruta} element={ventana} />
            ))}
          </Route>
          <Route path="*" element={null} />
        </Routes>
      </Suspense>
    </LimiteDeError>
  );
}
