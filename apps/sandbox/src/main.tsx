import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@madison/ui/theme";
import App from "./App";
// Self-hosted brand fonts. Their variable family names lead the design tokens,
// keeping the sandbox visually identical to the published site.
import "@fontsource-variable/inter";
import "@fontsource-variable/lora";
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
