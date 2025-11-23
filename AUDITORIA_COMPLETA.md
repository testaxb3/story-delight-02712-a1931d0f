# 📊 PARTE 04: FRONTEND - PERFORMANCE & UX

## 📅 Data da Auditoria
23 de Novembro de 2025

## 🎯 Resumo Executivo

A auditoria de performance e UX do **NEP System** revelou uma aplicação PWA bem estruturada com **boas práticas de otimização já implementadas**, mas com **oportunidades significativas de melhoria** em áreas críticas para a experiência mobile.

**Destaques Positivos:**
- ✅ Code splitting bem implementado (17 páginas lazy-loaded)
- ✅ React Query configurado com caching otimizado (10min staleTime, 60min gcTime)
- ✅ Service Worker robusto com estratégias de cache diferenciadas
- ✅ Safe areas (notch) implementadas corretamente em 14 arquivos
- ✅ Error Boundaries em múltiplas camadas (Sentry + custom)
- ✅ Memoization amplamente utilizada (195 ocorrências em 50 arquivos)

**Problemas Críticos Identificados:**
- 🔴 **Bundle size não monitorado** (sem build analytics no dev)
- 🔴 **Assets não otimizados** (PNG 601KB, sem WebP/AVIF)
- 🔴 **Listas longas sem virtualização** (Scripts, Bonuses, Feed)
- 🔴 **Dashboard com queries sequenciais** (useEffect + fetch manual ao invés de React Query)
- 🔴 **100vh usado ao invés de dvh** (problemas em mobile Safari)

---

## ✅ Pontos Fortes

### 1. **Code Splitting & Lazy Loading - Excelente**
- **17 páginas lazy-loaded** usando `React.lazy()` + `Suspense`
- Páginas críticas (Auth, Dashboard, NotFound) carregadas eagerly
- Fallback de loading limpo e consistente (`PageLoader`)
- Manual chunks configurados no Vite para `react-player`

**Evidência (src/App.tsx:24-49):**
```tsx
const PWAOnboarding = lazy(() => import("./pages/PWAOnboarding"));
const RefundRequest = lazy(() => import("./pages/RefundRequest"));
const Scripts = lazy(() => import("./pages/Scripts"));
const Quiz = lazy(() => import("./pages/Quiz"));
// ... 13+ páginas lazy loaded
```

### 2. **React Query Otimizado - Muito Bom**
- `staleTime: 10min` - reduz refetches desnecessários
- `gcTime: 60min` - mantém cache por 1 hora
- `refetchOnWindowFocus: false` - evita refetches agressivos
- `networkMode: 'offlineFirst'` - suporte offline nativo

**Evidência (src/App.tsx:62-77):**
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 60 * 60 * 1000, // 60 minutes
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst',
    }
  }
});
```

### 3. **Service Worker & Cache Strategy - Robusto**
- Cache diferenciado por tipo de conteúdo:
  - **Supabase API**: NetworkFirst (5min cache, 10s timeout)
  - **Supabase Storage**: CacheFirst (7 dias)
  - **Imagens estáticas**: CacheFirst (30 dias)
  - **Google Fonts**: CacheFirst (1 ano)
  - **YouTube**: NetworkFirst (thumbnails CacheFirst 30 dias)
- `cleanupOutdatedCaches: true`
- `skipWaiting: true` + `clientsClaim: true` - atualizações rápidas

**Evidência (vite.config.ts:74-168):**
```tsx
runtimeCaching: [
  {
    urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/i,
    handler: "NetworkFirst",
    options: {
      networkTimeoutSeconds: 10,
      expiration: { maxAgeSeconds: 5 * 60 }
    }
  },
  // ... estratégias bem pensadas
]
```

### 4. **Safe Areas (Notch) - Muito Bem Implementado**
- **32 ocorrências** de `env(safe-area-inset-*)` em 14 arquivos
- Aplicado no CSS global + componentes individuais
- Respeita status bar, notch, bottom bar

**Evidência (src/index.css:48-50):**
```css
body {
  padding-top: env(safe-area-inset-top, 0) !important;
  padding-bottom: env(safe-area-inset-bottom, 0) !important;
  padding-left: env(safe-area-inset-left, 0) !important;
}
```

**Evidência (src/pages/DashboardCalAI.tsx:78-81):**
```tsx
<div className="fixed top-0 left-0 right-0 z-40
  h-[calc(env(safe-area-inset-top)+80px)]
  bg-gradient-to-b from-background via-background to-transparent"
/>
```

### 5. **Error Handling - Multicamadas**
- ✅ **Sentry.ErrorBoundary** no root (main.tsx:48)
- ✅ **ErrorBoundary customizado** (src/components/common/ErrorBoundary.tsx)
- ✅ Fallbacks user-friendly (não técnicos)
- ✅ Detalhes técnicos apenas em dev mode
- ✅ Botões "Try Again" + "Go to Home"
- ✅ ErrorBoundary wrapping em páginas críticas (Bonuses, Scripts, Tracker)

### 6. **Memoization - Amplamente Utilizado**
- **195 ocorrências** de `useMemo`, `useCallback`, `React.memo` em **50 arquivos**
- Componentes críticos otimizados:
  - `OptimizedYouTubePlayer` (src/components/VideoPlayer/OptimizedYouTubePlayer.tsx)
  - `QuickActionsOptimized` (src/components/Dashboard/QuickActionsOptimized.tsx)
  - `AnimatedMetricCardOptimized` (src/components/Dashboard/AnimatedMetricCardOptimized.tsx)

### 7. **Forms com Validação Zod - Padrão Correto**
- ✅ `react-hook-form` + `zod` + `@hookform/resolvers`
- ✅ Validação client-side imediata
- ✅ Schemas bem definidos (src/lib/validations.ts)
- ✅ Exemplo: RequestScriptModal com schema robusto

**Evidência (src/components/Scripts/RequestScriptModal.tsx:35-43):**
```tsx
const requestSchema = z.object({
  situation_description: z.string().min(20, 'Descreva a situação com pelo menos 20 caracteres'),
  child_brain_profile: z.string().optional(),
  child_age: z.coerce.number().min(1).max(18).optional(),
  urgency_level: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});
```

### 8. **Font Loading Otimizado**
- ✅ `font-display: swap` em todas as fontes (src/index.css:9, 17, 25)
- ✅ Evita FOIT (Flash of Invisible Text)
- ✅ Fontes locais (não depende de CDN externo além do Google Fonts cacheado)

### 9. **Loading States - Bem Distribuídos**
- **79 ocorrências** de `isLoading`, `isPending`, `Skeleton`, `LoadingSpinner` em **20 arquivos**
- Skeletons específicos: `ScriptCardSkeletonList`, `LoadingDashboard`
- Feedback visual durante transições

### 10. **Touch Targets Adequados**
- **26 ocorrências** de botões/links com tamanhos mínimos adequados:
  - `w-10 h-10` (40x40px)
  - `w-12 h-12` (48x48px)
  - `min-h-[44px] min-w-[44px]`
- Segue guidelines de acessibilidade mobile (mínimo 44x44px)

---

## 🔴 Problemas Críticos (bloqueiam experiência do usuário)

### 1. **Bundle Size Não Monitorado em Desenvolvimento**
- **Severidade**: Crítica
- **Local**: `vite.config.ts:197-204`
- **Impacto**: Desenvolvedores não conseguem ver o impacto de novas dependências no bundle size durante desenvolvimento. Apenas em produção o `rollup-plugin-visualizer` é habilitado.
- **Evidência:**
```tsx
// PERFORMANCE: Bundle analyzer plugin
plugins: mode === 'production' ? [
  visualizer({
    filename: './dist/stats.html',
    open: false,
  }),
] : [],
```
- **Problema**: Se o bundle está crescendo durante desenvolvimento, só descobriremos no build de produção.
- **Solução recomendada**:
  1. Habilitar visualizer também em modo `development`
  2. Adicionar script `npm run analyze` que roda build + abre stats.html automaticamente
  3. Adicionar limite de budget no Vite (ex: 500KB para main chunk)

  ```tsx
  // vite.config.ts
  plugins: [
    // ... outros plugins
    visualizer({
      filename: './dist/stats.html',
      open: mode === 'development', // Abre automaticamente em dev
      gzipSize: true,
      brotliSize: true,
    }),
  ]

  // package.json
  "scripts": {
    "analyze": "vite build && open dist/stats.html"
  }

  // vite.config.ts - budget de performance
  build: {
    chunkSizeWarningLimit: 500, // KB
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', ...],
          'charts': ['recharts'],
          'pdf': ['@react-pdf/renderer'],
          'animations': ['framer-motion', 'lottie-react'],
          'react-player': ['react-player/youtube'],
        }
      }
    }
  }
  ```

### 2. **Assets Não Otimizados (Imagens PNG Gigantes)**
- **Severidade**: Crítica
- **Local**: `public/` directory
- **Impacto**:
  - **ebook-cover.png = 601KB** (!!!!) - Demora 2-6 segundos para carregar em 3G
  - **icon-512.png = 276KB** - Muito pesado para um ícone PWA
  - **ebook-screen-strategies-cover-new.jpg = 50KB** - Aceitável mas poderia ser menor
  - Ausência de formatos modernos (WebP, AVIF)
  - Ausência de responsive images (srcset)
  - Impacta LCP (Largest Contentful Paint) negativamente
- **Evidência:**
```bash
$ du -sh public/*
601K  public/ebook-cover.png
276K  public/icon-512.png
50K   public/ebook-screen-strategies-cover-new.jpg
```
- **Solução recomendada**:
  1. **Converter todas as imagens para WebP/AVIF** com fallback PNG
  2. **Comprimir icon-512.png** (target: <100KB)
  3. **Comprimir ebook-cover.png** (target: <150KB)
  4. Implementar `<picture>` com srcset para responsive images
  5. Adicionar lazy loading (`loading="lazy"`) em todas as imagens não-críticas

  ```tsx
  // Exemplo de implementação
  <picture>
    <source
      srcSet="/ebook-cover.avif 1x, /ebook-cover@2x.avif 2x"
      type="image/avif"
    />
    <source
      srcSet="/ebook-cover.webp 1x, /ebook-cover@2x.webp 2x"
      type="image/webp"
    />
    <img
      src="/ebook-cover.png"
      alt="Ebook cover"
      loading="lazy"
      width="600"
      height="800"
    />
  </picture>
  ```

  **Scripts de otimização:**
  ```bash
  # Instalar ferramentas
  npm install -D sharp

  # Script de conversão (scripts/optimize-images.js)
  const sharp = require('sharp');
  const fs = require('fs');

  const images = ['ebook-cover.png', 'icon-512.png'];

  images.forEach(img => {
    sharp(`public/${img}`)
      .resize(512, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(`public/${img.replace('.png', '.webp')}`);

    sharp(`public/${img}`)
      .resize(512, null, { withoutEnlargement: true })
      .avif({ quality: 75 })
      .toFile(`public/${img.replace('.png', '.avif')}`);
  });
  ```

### 3. **Listas Longas Sem Virtualização**
- **Severidade**: Crítica
- **Local**:
  - `src/pages/Scripts.tsx` (pode ter 100+ scripts)
  - `src/pages/Bonuses.tsx` (paginação existe mas ainda renderiza 12 cards por página)
  - `src/pages/Community/CommunityFeed.tsx` (feed infinito)
- **Impacto**:
  - Renderização de 100+ cards/items causa lag perceptível em mobile
  - Scroll performance ruim (janky scrolling)
  - Memória excessiva consumida
  - CLS (Cumulative Layout Shift) alto
- **Evidência**: Não encontrado `react-window`, `react-virtuoso`, ou `virtualized` no código
- **Solução recomendada**:
  1. Instalar `react-virtuoso` (mais moderno e fácil que react-window)
  2. Implementar virtualização em listas com >20 items

  ```tsx
  // Instalar
  npm install react-virtuoso

  // Implementação em Scripts.tsx
  import { Virtuoso } from 'react-virtuoso';

  <Virtuoso
    data={filteredScripts}
    itemContent={(index, script) => (
      <EnhancedScriptCard
        key={script.id}
        script={script}
        // ... props
      />
    )}
    style={{ height: 'calc(100vh - 200px)' }}
    overscan={5} // Pre-renderizar 5 items acima/abaixo
  />
  ```

### 4. **Dashboard com Queries Sequenciais (Anti-Pattern)**
- **Severidade**: Crítica
- **Local**: `src/pages/DashboardCalAI.tsx:28-53`
- **Impacto**:
  - Busca "recent scripts" e "latest video" sequencialmente com `useEffect` + `fetch` manual
  - Não aproveita React Query (que já está configurado no app!)
  - Sem loading states visíveis para o usuário
  - Sem error handling
  - Sem cache (refetch toda vez que usuário volta pra dashboard)
  - Time to Interactive (TTI) aumenta ~1-2 segundos
- **Evidência:**
```tsx
// ❌ ANTI-PATTERN
useEffect(() => {
  const fetchData = async () => {
    // Recent scripts for profile
    const { data: scripts } = await supabase
      .from('scripts')
      .select('*')
      .eq('profile', activeChild?.brain_profile || 'INTENSE')
      .order('created_at', { ascending: false })
      .limit(3);

    if (scripts) setRecentScripts(scripts);

    // Latest video (bonus) - SEQUENCIAL!
    const { data: videos } = await supabase
      .from('bonuses')
      .select('*')
      .eq('category', 'video')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (videos) setLatestVideo(videos);
  };

  if (activeChild) fetchData();
}, [activeChild]);
```
- **Solução recomendada**:
  1. Mover queries para custom hooks usando React Query
  2. Executar queries em paralelo (React Query faz isso automaticamente)
  3. Adicionar loading skeletons
  4. Adicionar error boundaries específicos

  ```tsx
  // ✅ SOLUÇÃO - criar hooks separados

  // hooks/useRecentScripts.ts
  export function useRecentScripts(profile: string, limit = 3) {
    return useQuery({
      queryKey: ['scripts', 'recent', profile, limit],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('scripts')
          .select('*')
          .eq('profile', profile)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data;
      },
      enabled: !!profile,
      staleTime: 5 * 60 * 1000, // 5min cache
    });
  }

  // hooks/useLatestVideo.ts
  export function useLatestVideo() {
    return useQuery({
      queryKey: ['bonuses', 'latest-video'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('bonuses')
          .select('*')
          .eq('category', 'video')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        return data;
      },
      staleTime: 10 * 60 * 1000, // 10min cache
    });
  }

  // src/pages/DashboardCalAI.tsx - USO
  const { data: recentScripts, isLoading: loadingScripts } = useRecentScripts(
    activeChild?.brain_profile || 'INTENSE',
    3
  );
  const { data: latestVideo, isLoading: loadingVideo } = useLatestVideo();

  // React Query executa queries em PARALELO automaticamente!
  // Também provê cache, retry, error handling, etc.

  // Adicionar loading skeletons
  {loadingScripts ? (
    <ScriptCardSkeletonList count={3} />
  ) : (
    recentScripts?.map(script => ...)
  )}
  ```

### 5. **100vh Usado ao Invés de dvh (Problema Mobile Safari)**
- **Severidade**: Alta
- **Local**: 7 arquivos (src/components/ebook/NotesPanel.tsx, TableOfContents.tsx, etc.)
- **Impacto**:
  - Em mobile Safari, `100vh` inclui a barra de endereço (mesmo quando escondida)
  - Resulta em conteúdo cortado na parte inferior
  - Scroll "quebrado" em algumas telas
  - UX ruim em iOS (maioria dos usuários)
- **Evidência**: Encontrado uso de `100vh` em componentes de ebook, sidebar, video player
- **Solução recomendada**:
  1. Substituir `100vh` por `100dvh` (dynamic viewport height)
  2. Fallback para navegadores antigos

  ```css
  /* ❌ ANTES */
  .container {
    height: 100vh;
  }

  /* ✅ DEPOIS */
  .container {
    height: 100vh; /* Fallback */
    height: 100dvh; /* Moderno - ajusta conforme barra de endereço */
  }

  /* Ou via Tailwind (se tiver plugin) */
  <div className="h-screen supports-[height:100dvh]:h-dvh">
  ```

---

## 🟡 Problemas Médios (degradam experiência)

### 1. **Framer Motion Não Otimizado para Redução de Movimento**
- **Severidade**: Média
- **Local**: 20 arquivos usando Framer Motion (125 ocorrências de `motion.*`, `AnimatePresence`, `variants`)
- **Impacto**: Usuários com `prefers-reduced-motion` ainda veem animações completas (pode causar náusea/desconforto)
- **Solução recomendada**:
  ```tsx
  // utils/motion.ts
  import { Variants } from 'framer-motion';

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  export const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: 'easeOut' };

  export const fadeIn: Variants = {
    initial: { opacity: prefersReducedMotion ? 1 : 0 },
    animate: { opacity: 1 },
    exit: { opacity: prefersReducedMotion ? 1 : 0 },
  };

  // Uso em componentes
  <motion.div
    variants={fadeIn}
    transition={transition}
  >
  ```

### 2. **Muitos Componentes Radix UI Não Tree-Shaken**
- **Severidade**: Média
- **Local**: `package.json:16-42` - 27 pacotes `@radix-ui/react-*`
- **Impacto**:
  - Bundle size inflado (cada pacote Radix tem ~5-15KB)
  - Se nem todos são usados, estamos importando código desnecessário
  - Estimativa: ~150-300KB de Radix UI no bundle
- **Solução recomendada**:
  1. Auditar quais componentes Radix estão sendo usados de fato
  2. Remover pacotes não utilizados
  3. Considerar migrar componentes simples para implementação custom (ex: Separator, Label)

  ```bash
  # Script de auditoria
  npx depcheck --ignores="@radix-ui/*"

  # Ver quais Radix components estão realmente importados
  grep -r "from '@radix-ui/" src/ | sort | uniq
  ```

### 3. **Lottie Files Não Lazy-Loaded**
- **Severidade**: Média
- **Local**: `public/lotties/*.json` - 5 arquivos (total ~72KB)
- **Impacto**:
  - Lottie animations carregadas upfront (mesmo que não sejam usadas)
  - 72KB podem parecer pequenos, mas em mobile 3G isso é ~0.5-1s de loading
- **Solução recomendada**:
  ```tsx
  // src/components/LottieIcon.tsx - adicionar lazy loading
  import { lazy, Suspense } from 'react';

  const Lottie = lazy(() => import('lottie-react'));

  export function LazyLottieIcon({ animationPath, ...props }) {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
      // Lazy load animation JSON
      import(`../lotties/${animationPath}.json`)
        .then(module => setAnimationData(module.default));
    }, [animationPath]);

    if (!animationData) return <div className="w-6 h-6" />; // Placeholder

    return (
      <Suspense fallback={<div className="w-6 h-6" />}>
        <Lottie animationData={animationData} {...props} />
      </Suspense>
    );
  }
  ```

### 4. **Forms Sem Validação Inline (Alguns)**
- **Severidade**: Média
- **Local**: Vários forms fora de `RequestScriptModal`
- **Impacto**:
  - Usuários só descobrem erros ao clicar "Submit"
  - UX frustrante (especialmente em forms longos)
  - Encontrado apenas 6 arquivos usando react-hook-form + zod
- **Solução recomendada**:
  1. Auditar todos os forms do app
  2. Migrar forms sem validação para react-hook-form + zod
  3. Adicionar validação inline com `mode: 'onChange'`

  ```tsx
  // Padrão a seguir (RequestScriptModal já faz isso)
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange', // Valida enquanto digita
  });
  ```

### 5. **Service Worker Update Check Agressivo (30min)**
- **Severidade**: Média
- **Local**: `src/main.tsx:29-32`
- **Impacto**:
  - Check de atualização a cada 30 minutos pode drenar bateria mobile
  - Usuários podem não precisar de atualizações tão frequentes
- **Evidência:**
```tsx
setInterval(() => {
  console.log('🔍 Checking for Service Worker updates...');
  registration.update();
}, 30 * 60 * 1000); // 30 minutos
```
- **Solução recomendada**:
  ```tsx
  // Aumentar para 2-4 horas
  setInterval(() => {
    registration.update();
  }, 2 * 60 * 60 * 1000); // 2 horas

  // Ou usar visibilitychange (só checa quando usuário volta ao app)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      registration.update();
    }
  });
  ```

### 6. **Ausência de Scroll Restoration em Navegação**
- **Severidade**: Média
- **Local**: Navegação entre páginas (React Router)
- **Impacto**:
  - Usuário navega de Scripts → Dashboard → volta pra Scripts
  - Perde a posição do scroll (volta pro topo)
  - UX ruim para listas longas
- **Solução recomendada**:
  ```tsx
  // src/App.tsx - adicionar ScrollRestoration
  import { BrowserRouter, ScrollRestoration } from "react-router-dom";

  <BrowserRouter>
    <ScrollRestoration /> {/* Adicionar isso */}
    {/* ... resto do app */}
  </BrowserRouter>

  // Ou custom hook para páginas específicas
  // hooks/useScrollRestoration.ts
  import { useEffect } from 'react';
  import { useLocation } from 'react-router-dom';

  const scrollPositions = new Map<string, number>();

  export function useScrollRestoration() {
    const location = useLocation();

    useEffect(() => {
      // Restaurar posição salva
      const savedPosition = scrollPositions.get(location.pathname);
      if (savedPosition !== undefined) {
        window.scrollTo(0, savedPosition);
      }

      // Salvar posição ao sair
      return () => {
        scrollPositions.set(location.pathname, window.scrollY);
      };
    }, [location.pathname]);
  }
  ```

### 7. **Console.logs em Produção Removidos (Bom, mas...)**
- **Severidade**: Baixa
- **Local**: `vite.config.ts:183-185`
- **Impacto**:
  - Remove console.logs e debuggers em produção (✅ BOM)
  - Mas pode dificultar debugging de issues reportados por usuários
- **Evidência:**
```tsx
esbuild: {
  drop: mode === 'production' ? ['console', 'debugger'] : [],
},
```
- **Solução recomendada**:
  ```tsx
  // Manter apenas console.error e console.warn em produção
  esbuild: {
    drop: mode === 'production' ? ['debugger'] : [],
    pure: mode === 'production' ? ['console.log', 'console.info'] : [],
    // console.error e console.warn são mantidos
  },
  ```

---

## 💡 Melhorias Sugeridas (otimizações)

### 1. **Implementar Prefetching de Rotas Prováveis**
**Por quê**: Reduz tempo de navegação percebido
**Como**:
```tsx
// src/hooks/usePrefetch.ts
import { useEffect } from 'react';

export function usePrefetch(routes: string[]) {
  useEffect(() => {
    routes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }, [routes]);
}

// Uso: Dashboard prefetch Scripts, Bonuses
function Dashboard() {
  usePrefetch(['/scripts', '/bonuses', '/tracker']);
  // ...
}
```

### 2. **Optimistic UI Updates em Ações Críticas**
**Por quê**: Usuário percebe app como "instantâneo"
**Como**:
```tsx
// Exemplo: Favoritar script
const { mutate: toggleFavorite } = useMutation({
  mutationFn: (scriptId) => supabase.from('favorites').insert({ script_id: scriptId }),
  onMutate: async (scriptId) => {
    // Cancelar queries em andamento
    await queryClient.cancelQueries(['favorites']);

    // Snapshot do estado anterior
    const previousFavorites = queryClient.getQueryData(['favorites']);

    // Update otimista
    queryClient.setQueryData(['favorites'], (old) => [...old, scriptId]);

    return { previousFavorites };
  },
  onError: (err, scriptId, context) => {
    // Rollback em caso de erro
    queryClient.setQueryData(['favorites'], context.previousFavorites);
  },
  onSettled: () => {
    // Refetch pra garantir sincronização
    queryClient.invalidateQueries(['favorites']);
  },
});
```

### 3. **Implementar Pull-to-Refresh Nativo em Feeds**
**Por quê**: UX mobile esperada (especialmente em Community Feed)
**Como**:
```tsx
// src/hooks/usePullToRefresh.ts
import { useEffect, useState } from 'react';

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY === 0) return;
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      if (diff > 100 && !refreshing) {
        setRefreshing(true);
        onRefresh().finally(() => setRefreshing(false));
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onRefresh, refreshing]);

  return { refreshing };
}
```

### 4. **Skeleton Screens Mais Consistentes**
**Por quê**: Reduz percepção de loading time, menos CLS
**Onde aplicar**:
- Dashboard cards
- Scripts list
- Bonuses grid
- Community feed

**Como**:
```tsx
// Criar skeleton que corresponde EXATAMENTE ao layout final
<div className="space-y-4">
  {[1, 2, 3].map(i => (
    <div key={i} className="bg-[#1C1C1E] border border-[#333] rounded-2xl p-4 flex gap-4 animate-pulse">
      <div className="w-14 h-14 rounded-xl bg-[#2C2C2E]" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-[#2C2C2E] rounded w-3/4" />
        <div className="h-3 bg-[#2C2C2E] rounded w-1/2" />
      </div>
    </div>
  ))}
</div>
```

### 5. **Debouncing em Search Inputs**
**Por quê**: Reduz queries desnecessárias, melhora performance
**Onde**: Scripts search, Bonuses search
**Como**:
```tsx
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Uso em Scripts.tsx
const [searchQuery, setSearchQuery] = useState('');
const debouncedSearch = useDebounce(searchQuery, 300);

const { data: scripts } = useQuery({
  queryKey: ['scripts', debouncedSearch],
  queryFn: () => fetchScripts(debouncedSearch),
});
```

### 6. **Compression para Responses (Brotli/Gzip)**
**Por quê**: Reduz tamanho de download em 60-80%
**Como**: Configurar no servidor (Vercel/Netlify já fazem automaticamente, mas validar)
```bash
# Verificar se Brotli está habilitado
curl -H "Accept-Encoding: br" https://seu-app.com -I | grep "Content-Encoding"
```

### 7. **Image Lazy Loading Nativo em Todas as Imagens**
**Por quê**: Reduz initial payload, melhora LCP
**Como**:
```tsx
// Criar componente Image wrapper
export function Image({ src, alt, priority = false, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
    />
  );
}
```

### 8. **Preconnect para Domínios Externos**
**Por quê**: Reduz latência de DNS/TLS para Supabase, YouTube
**Como**:
```html
<!-- index.html -->
<head>
  <link rel="preconnect" href="https://your-project.supabase.co">
  <link rel="preconnect" href="https://www.youtube.com">
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
</head>
```

### 9. **Resource Hints para Assets Críticos**
**Por quê**: Carrega assets críticos mais rápido
**Como**:
```html
<!-- index.html -->
<head>
  <link rel="preload" href="/fonts/Relative-Bold.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="preload" href="/icon-192.png" as="image">
</head>
```

### 10. **Implementar Error Retry com Exponential Backoff**
**Por quê**: Melhora UX em conexões instáveis
**Como**:
```tsx
// src/lib/queryClient.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Não tentar retry em erros 4xx (client errors)
        if (error?.status >= 400 && error?.status < 500) return false;
        // Max 3 retries
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff: 1s, 2s, 4s, max 30s
    },
  },
});
```

---

## 📈 Métricas Observadas

| Métrica | Valor Atual | Target | Status |
|---------|-------------|--------|--------|
| **Páginas lazy-loaded** | 17/20 (85%) | 80%+ | ✅ Excelente |
| **Componentes com memoization** | 50 arquivos (195 ocorrências) | N/A | ✅ Muito bom |
| **Loading states implementados** | 79 ocorrências em 20 arquivos | N/A | ✅ Bom |
| **Error boundaries** | 6 arquivos (multicamadas) | N/A | ✅ Excelente |
| **Safe area insets** | 32 ocorrências em 14 arquivos | N/A | ✅ Muito bom |
| **Touch targets adequados** | 26 componentes (>44px) | 100% | ✅ Bom |
| **Forms com validação** | 6 arquivos | N/A | ⚠️ Precisa auditoria |
| **Bundle size** | ❓ Não monitorado | <500KB main chunk | 🔴 Crítico |
| **Assets otimizados (WebP/AVIF)** | 0 | 100% imagens críticas | 🔴 Crítico |
| **Virtualization em listas** | 0 listas | 3+ listas longas | 🔴 Crítico |
| **100vh → dvh** | 7 arquivos com 100vh | 0 | 🟡 Médio |
| **Lottie files size** | ~72KB (5 arquivos) | <50KB | 🟡 Médio |
| **React Query cache time** | 10min staleTime, 60min gcTime | 5-15min | ✅ Excelente |
| **Service Worker cache** | ✅ Multi-layer estratégias | N/A | ✅ Excelente |
| **Framer Motion otimizado** | ❌ Sem prefers-reduced-motion | 100% | 🟡 Médio |

---

## 🎯 Recomendações Prioritárias

| # | Ação | Impacto | Esforço | Prioridade | Arquivo(s) Afetado(s) |
|---|------|---------|---------|------------|-----------------------|
| **1** | **Otimizar assets (PNG → WebP/AVIF)** | 🔥 ALTO<br/>Reduz LCP em 50-70%<br/>Economiza 400KB+ | 🟢 BAIXO<br/>2-4 horas<br/>Script automatizado | **P0** | `public/ebook-cover.png`, `public/icon-512.png`, etc. |
| **2** | **Implementar virtualização em listas** | 🔥 ALTO<br/>Elimina lag em listas longas<br/>Reduz memória 60-80% | 🟡 MÉDIO<br/>4-8 horas<br/>react-virtuoso | **P0** | `src/pages/Scripts.tsx`, `src/pages/Bonuses.tsx`, `src/pages/Community/CommunityFeed.tsx` |
| **3** | **Migrar Dashboard queries para React Query** | 🔥 ALTO<br/>Reduz TTI em 1-2s<br/>Adiciona cache + retry | 🟢 BAIXO<br/>2-3 horas | **P0** | `src/pages/DashboardCalAI.tsx` |
| **4** | **Habilitar bundle analyzer em dev** | 🔥 ALTO<br/>Previne bundle bloat<br/>Visibilidade contínua | 🟢 BAIXO<br/>30 min | **P1** | `vite.config.ts`, `package.json` |
| **5** | **Substituir 100vh por dvh** | 🟡 MÉDIO<br/>Corrige scroll em iOS<br/>UX crítico mobile | 🟢 BAIXO<br/>1-2 horas<br/>Find & replace | **P1** | 7 arquivos (ebook, sidebar, video player) |
| **6** | **Adicionar prefers-reduced-motion** | 🟡 MÉDIO<br/>Acessibilidade<br/>Evita náusea | 🟡 MÉDIO<br/>3-4 horas | **P2** | 20 arquivos com Framer Motion |
| **7** | **Implementar scroll restoration** | 🟡 MÉDIO<br/>Melhora UX navegação<br/>Reduz frustração | 🟢 BAIXO<br/>1-2 horas | **P2** | `src/App.tsx`, hook custom |
| **8** | **Auditar e remover Radix UI não usado** | 🟡 MÉDIO<br/>Reduz bundle ~50-100KB | 🟡 MÉDIO<br/>2-3 horas | **P2** | `package.json`, múltiplos componentes |
| **9** | **Lazy load Lottie animations** | 🟢 BAIXO<br/>Economiza 72KB initial load | 🟢 BAIXO<br/>1-2 horas | **P3** | `src/components/LottieIcon.tsx` |
| **10** | **Implementar prefetching rotas** | 🟢 BAIXO<br/>Melhora percepção speed | 🟢 BAIXO<br/>1 hora | **P3** | `src/pages/DashboardCalAI.tsx`, outros |

---

## 📊 Estimativa de Impacto nas Core Web Vitals

Assumindo implementação das recomendações P0 e P1:

| Métrica | Antes (estimado) | Depois (estimado) | Melhoria |
|---------|------------------|-------------------|----------|
| **LCP** (Largest Contentful Paint) | ~3.5s (mobile 3G) | ~1.8s | **-48%** ⬇️ |
| **FID** (First Input Delay) | ~150ms | ~80ms | **-46%** ⬇️ |
| **CLS** (Cumulative Layout Shift) | 0.15 | 0.05 | **-66%** ⬇️ |
| **TTI** (Time to Interactive) | ~4.2s | ~2.5s | **-40%** ⬇️ |
| **TBT** (Total Blocking Time) | ~400ms | ~200ms | **-50%** ⬇️ |
| **Speed Index** | ~3.8s | ~2.2s | **-42%** ⬇️ |

**Lighthouse Score estimado:**
- **Antes**: ~72/100 (Performance)
- **Depois**: ~90/100 (Performance)

---

## 🔍 Quick Wins (Alto Impacto, Baixo Esforço)

1. **✅ Comprimir ebook-cover.png** (601KB → 150KB) - **30 minutos**
2. **✅ Substituir 100vh por dvh** - **1 hora**
3. **✅ Habilitar bundle analyzer** - **30 minutos**
4. **✅ Migrar Dashboard queries para React Query** - **2-3 horas**
5. **✅ Adicionar preconnect para Supabase/YouTube** - **15 minutos**
6. **✅ Aumentar SW update interval (30min → 2h)** - **5 minutos**
7. **✅ Adicionar lazy loading em imagens** - **1 hora**

**Total Quick Wins**: ~6-8 horas de trabalho para **~40-50% de melhoria em performance percebida**.

---

## 📝 Notas Finais

### Pontos Positivos Gerais
- A equipe já tem consciência de performance (lazy loading, memoization, cache strategy)
- Service Worker muito bem configurado (melhor que 90% dos PWAs)
- React Query bem configurado (staleTime, gcTime, offlineFirst)
- Error handling robusto (Sentry + custom boundaries)
- Safe areas bem implementadas (importante para notch/status bar)

### Áreas de Atenção
- **Assets não otimizados** é o problema mais crítico (fácil de resolver, alto impacto)
- **Listas sem virtualização** prejudica UX em casos reais (100+ scripts)
- **Dashboard com queries manuais** é anti-pattern (já tem React Query configurado!)
- **100vh em mobile Safari** é bug conhecido que afeta milhões de usuários iOS

### Próximos Passos Recomendados
1. Implementar **Quick Wins** (6-8 horas) → **impacto imediato**
2. Rodar **Lighthouse CI** no pipeline (prevenir regressões)
3. Configurar **performance budgets** no Vite
4. Criar **dashboard de métricas** (PostHog/Sentry Performance)
5. Testar em **dispositivos reais** (não só emulador)

---

**Auditoria realizada em**: 23 de Novembro de 2025
**Próxima auditoria recomendada**: Após implementação das recomendações P0/P1 (em 2-4 semanas)
