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
      registerType: "autoUpdate", // Atualiza automaticamente o service worker
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
      },
      workbox: {
        // Force service worker to take control immediately
        skipWaiting: true,
        clientsClaim: true,
        // Arquivos a serem incluídos no cache do service worker
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,json}"],
        // Exclude OneSignal files from being cached by Workbox
        globIgnores: ['**/OneSignalSDK*.js'],
        // Don't try to cache YouTube API scripts or OneSignal - they should be loaded fresh
        navigateFallbackDenylist: [/^\/OneSignalSDK/, /youtube\.com\/iframe_api/, /youtube\.com\/s\/player/],
        // Estratégia de cache para chamadas à API do Supabase
        runtimeCaching: [
          {
            // Regex para URLs do Supabase (ajuste se necessário)
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            // Tenta a rede primeiro, se falhar, usa o cache
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-cache", // Nome do cache
              expiration: {
                maxEntries: 50, // Limite de entradas no cache
                maxAgeSeconds: 60 * 60 * 24 * 7 // Cache por 7 dias
              },
              cacheableResponse: {
                statuses: [0, 200], // Cacheia respostas OK ou opacas (CORS)
              },
            },
          },
          // YouTube player iframes (CRITICAL for PWA)
          // Note: Don't cache iframe_api or widget API - they need to be fresh
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
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 10
            }
          },
          // YouTube thumbnails
          {
            urlPattern: /^https:\/\/img\.youtube\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'youtube-thumbnails',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Google Fonts
           {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
            }
          }
        ],
      },
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
