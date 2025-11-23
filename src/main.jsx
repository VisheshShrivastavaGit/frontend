import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import DemoProvider from "./contexts/DemoProvider";
import GoogleAuthProvider from "./contexts/GoogleAuthProvider";
import ThemeProvider from "./contexts/ThemeProvider";
import DataProvider from "./contexts/DataProvider";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DemoProvider>
        <ThemeProvider>
          <GoogleAuthProvider>
            <DataProvider>
              <App />
            </DataProvider>
          </GoogleAuthProvider>
        </ThemeProvider>
      </DemoProvider>
    </BrowserRouter>
  </React.StrictMode>
);
