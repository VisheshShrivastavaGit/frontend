import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import GoogleAuthProvider from "./contexts/GoogleAuthProvider";
import ThemeProvider from "./contexts/ThemeProvider";
import DataProvider from "./contexts/DataProvider";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <GoogleAuthProvider>
          <DataProvider>
            <App />
          </DataProvider>
        </GoogleAuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
