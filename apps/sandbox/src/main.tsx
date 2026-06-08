import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@northwind/ui/theme";
import App from "./App";
// Self-hosted Inter (variable) — registers the `Inter Variable` family that --font-sans leads with.
import "@fontsource-variable/inter";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element "#root" not found in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
