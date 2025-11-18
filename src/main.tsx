// @ts-nocheck
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";
import { initSentry } from "./lib/sentry";
import { registerSW } from 'virtual:pwa-register';

// Initialize Sentry error tracking
initSentry();

// Register Service Worker with proper update handling
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      // This will be handled by useAppVersion hook
      window.dispatchEvent(new CustomEvent('sw-update-available'));
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
    onRegisteredSW(swScriptUrl, registration) {
      // Check for updates every 60 minutes
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
  });
  
  // Make updateSW available globally for update process
  (window as any).__updateSW = updateSW;
}

createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary
    fallback={({ error, resetError }) => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 mb-4">
            We've been notified and are working on a fix.
          </p>
          {import.meta.env.DEV && (
            <details className="text-left mb-4">
              <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                Error details (dev only)
              </summary>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                {error.message}
              </pre>
            </details>
          )}
          <button
            onClick={resetError}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    )}
  >
    <App />
  </Sentry.ErrorBoundary>
);
