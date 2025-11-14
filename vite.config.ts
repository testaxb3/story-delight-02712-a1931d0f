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
      injectRegister: 'auto',
      devOptions: {
        enabled: false
      },
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
        "OneSignalSDKWorker.js", // Service Worker principal do OneSignal
        "OneSignalSDK.sw.js", // Service Worker alternativo do OneSignal
        "browser-polyfill-pwa.js" // Polyfill para compatibilidade com extensões
      ],
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
      },
      workbox: {
        // Configuração para coexistir com OneSignal
        cleanupOutdatedCaches: true,

        // Não gerenciar navegação - deixar OneSignal fazer isso
        navigateFallback: undefined,
        navigateFallbackDenylist: [/^\/OneSignalSDK/],

        // Excluir arquivos OneSignal do cache
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,json}"],
        globIgnores: ['**/OneSignalSDK*.js', '**/OneSignal*.js'],

        // Estratégias de cache otimizadas
        runtimeCaching: [
          // Supabase API
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 horas
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // YouTube player
          {
            urlPattern: ({ url }) => {
              return (
                (url.hostname === 'www.youtube.com' || url.hostname === 'www.youtube-nocookie.com') &&
                !url.pathname.includes('iframe_api') &&
                !url.pathname.includes('www-widgetapi')
              );
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'youtube-player',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 dias
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // YouTube thumbnails
          {
            urlPattern: /^https:\/\/(i\.ytimg\.com|img\.youtube\.com)\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'youtube-thumbnails',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
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
