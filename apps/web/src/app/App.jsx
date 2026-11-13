import { Route, Routes } from "react-router";
import { Hoy } from "../feature/hoy/Hoy.jsx";
import { EnConstruccion, NoEncontrada } from "../feature/pendiente/Pendiente.jsx";
import { Estructura } from "./Estructura.jsx";

/**
 * Las rutas de Panal (docs/proyecto/03-pantallas.md, sección 2).
 * Las pantallas que aún no existen muestran un aviso en lugar de un error.
 */
export function App() {
  return (
    <Routes>
      <Route element={<Estructura />}>
        <Route index element={<Hoy />} />
        <Route path="celdas" element={<EnConstruccion titulo="Celdas" />} />
        <Route path="celdas/nueva" element={<EnConstruccion titulo="Nueva actividad" />} />
        <Route path="colmenas" element={<EnConstruccion titulo="Colmenas" />} />
        <Route path="colmenas/:id" element={<EnConstruccion titulo="Colmena" />} />
        <Route path="reportes" element={<EnConstruccion titulo="Reportes" />} />
        <Route path="mi-vuelo" element={<EnConstruccion titulo="Mi vuelo" />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}
