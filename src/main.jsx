import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import DemoProvider from "./contexts/DemoProvider";
import AppProvider from "./contexts/AppProvider";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DemoProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </DemoProvider>
    </BrowserRouter>
  </React.StrictMode>
);
