import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Permite acesso externo na rede local
    port: 8080,
    hmr: true,
  },
  plugins: [
    react(),
    // Só adiciona o tagger em desenvolvimento
    mode === "development" && componentTagger(),
    // Configuração PWA
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null, // Disable auto-registration - let OneSignal handle SW
      devOptions: {
        enabled: false
      },
      // Disable service worker generation - only use manifest
      disable: false,
      workbox: false, // Disable workbox - OneSignal will manage push notifications
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
        "OneSignalSDKWorker.js", // Service Worker principal do OneSignal
        "OneSignalSDK.sw.js", // Service Worker alternativo do OneSignal
        "browser-polyfill-pwa.js" // Polyfill para compatibilidade com extensões
      ], // Inclui assets estáticos importantes
      manifest: {
        name: "NEP System",
        short_name: "NEP System",
        description: "Neurological Emotional Personalization - Neuroscience-based parenting app",
        version: "2.0.0",
        theme_color: "#8B5CF6",
        background_color: "#8B5CF6",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ].filter(Boolean), // Remove plugins nulos (como o tagger em produção)
  resolve: {
    alias: {
      // Alias para facilitar importações (ex: '@/components/...')
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react-player/youtube'],
  },
  build: {
    commonjsOptions: {
      include: [/react-player/, /node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-player': ['react-player/youtube'],
        },
      },
    },
  },
}));
