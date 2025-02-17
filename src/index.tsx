import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { ThemeProvider } from "@mui/material";
import theme from "./assets/themes/theme.js";

const el = document.getElementById("root");
const root = createRoot(el);

root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
