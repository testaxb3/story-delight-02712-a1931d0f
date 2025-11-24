import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from 'rollup-plugin-visualizer';

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
      registerType: "prompt",
      injectRegister: null,
      devOptions: {
        enabled: false
      },
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "logo-nep-ai.svg",
        "OneSignalSDKWorker.js", // Service Worker principal do OneSignal
        "OneSignalSDK.sw.js", // Service Worker alternativo do OneSignal
        "browser-polyfill-pwa.js" // Polyfill para compatibilidade com extensões
      ],
      manifest: {
        name: "NEP System",
        short_name: "NEP System",
        description: "Neurological Emotional Personalization - Neuroscience-based parenting app",
        theme_color: "#8B5CF6",
        background_color: "#8B5CF6",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
        icons: [
          {
            src: "/logo-nep-ai.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable"
          },
          {
            src: "/logo-nep-ai.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        // Aumentar limite para aceitar logo grande
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        
        // Configuração para coexistir com OneSignal
        cleanupOutdatedCaches: true,
        skipWaiting: true,  // ✅ Permite novo SW assumir controle imediatamente
        clientsClaim: true, // ✅ Novo SW controla clientes existentes imediatamente

        // Não gerenciar navegação - deixar OneSignal fazer isso
        navigateFallback: undefined,
        navigateFallbackDenylist: [/^\/OneSignalSDK/],

        // Excluir arquivos OneSignal do cache
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,json}"],
        globIgnores: ['**/OneSignalSDK*.js', '**/OneSignal*.js'],

        // Estratégias de cache otimizadas
        runtimeCaching: [
          // Supabase API - NetworkFirst with short cache
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api",
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60 // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Supabase Storage - CacheFirst for images
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-storage',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Static Images - CacheFirst with long expiration
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
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
          // Google Fonts - CacheFirst with long expiration
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
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
  // PERFORMANCE: Remove console.logs in production
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
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
      // PERFORMANCE: Bundle analyzer plugin
      plugins: mode === 'production' ? [
        visualizer({
          filename: './dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
      ] : [],
    },
  },
}));
