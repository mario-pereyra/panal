import "@fontsource-variable/fredoka";
import "@fontsource-variable/nunito";
import "./estilos/tokens.css";
import "./estilos/base.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { App } from "./app/App.jsx";
import { store } from "./store/index.js";

const rootElement = document.getElementById("raiz") ?? document.getElementById("root");

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
