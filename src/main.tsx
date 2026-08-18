import { hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register service worker for caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        void registration;
      })
      .catch((registrationError) => {
        void registrationError;
      });
  });
}

const rootEl = document.getElementById("root")!;

// Remove splash screen before React hydrates
const splash = document.getElementById("splash");
if (splash) splash.remove();

// Remove the inline fallback <style> only after the external main CSS has loaded,
// so the pre-rendered content is never left unstyled.
const splashStyle = rootEl.querySelector("style");
const removeFallbackStyles = () => {
  if (splashStyle) splashStyle.remove();
};

const mainCss = document.getElementById("main-css") as HTMLLinkElement | null;
if (mainCss && mainCss.rel !== "stylesheet") {
  mainCss.addEventListener("load", removeFallbackStyles, { once: true });
} else {
  removeFallbackStyles();
}

// Hydrate the SSG pre-rendered HTML
hydrateRoot(rootEl, <App />, {
  onRecoverableError(error) {
    // Suppress hydration mismatch warnings in production
    if (import.meta.env.DEV) console.warn('Hydration error:', error);
  },
});
