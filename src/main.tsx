import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n"; // Initialize i18n
import { Toaster } from "sonner";
import { App } from "./App";
import { LanguageProvider } from "./contexts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <Toaster
        richColors
        position="top-center"
        closeButton
        expand={false}
        duration={4000}
      />
      <App />
    </LanguageProvider>
  </StrictMode>
);
