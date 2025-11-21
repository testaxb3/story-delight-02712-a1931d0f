# Analytics & Loading States System

## 📊 Analytics System

### Overview
Sistema completo de analytics com Posthog + Sentry para rastreamento robusto de comportamento do usuário e erros.

### Setup

#### 1. Configurar variáveis de ambiente

```env
# Posthog Analytics
VITE_POSTHOG_KEY=your_posthog_key
VITE_POSTHOG_HOST=https://app.posthog.com

# Sentry Error Tracking
VITE_SENTRY_DSN=your_sentry_dsn
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
```

#### 2. Sistema é inicializado automaticamente
- Analytics iniciado em `src/App.tsx`
- Page tracking automático via `usePageTracking()`
- Error tracking global via `useErrorTracking()`

### 🎯 Eventos Rastreados

#### User Lifecycle
```typescript
import { initializeUserTracking, clearUserTracking } from '@/lib/analytics-integration';

// No login
initializeUserTracking({
  id: user.id,
  email: user.email,
  name: user.name,
  isPremium: user.premium,
});

// No logout
clearUserTracking();
```

#### Content Engagement
```typescript
import { trackScript, trackVideo, trackEbook, trackBonus } from '@/lib/analytics-integration';

// Scripts
trackScript.view(scriptId, scriptTitle, category);
trackScript.use(scriptId, scriptTitle, category);
trackScript.favorite(scriptId, 'add' | 'remove');

// Vídeos
trackVideo.watch(videoId, videoTitle, watchDuration, totalDuration);

// Ebooks
trackEbook.open(ebookId, ebookTitle);
trackEbook.progress(ebookId, chapterIndex, progressPercent);

// Bonuses
trackBonus.view(bonusId, bonusTitle, category);
```

#### Navigation & Search
```typescript
import { trackNavigation } from '@/lib/analytics-integration';

trackNavigation.search(query, resultsCount, filters);
trackNavigation.filter(filterType, filterValue);
```

#### Child Profiles
```typescript
import { trackChild } from '@/lib/analytics-integration';

trackChild.create(brainProfile, age);
trackChild.switch(fromProfile, toProfile);
```

#### Community
```typescript
import { trackCommunity } from '@/lib/analytics-integration';

trackCommunity.post(postType, hasImage);
trackCommunity.react(postId, reactionType);
trackCommunity.comment(postId, commentLength);
```

#### Feature Discovery
```typescript
import { trackFeature } from '@/lib/analytics-integration';

trackFeature.discover('feature_name');
```

### 🐛 Error Tracking

#### Automático
- Todos os erros JavaScript são capturados automaticamente
- Unhandled Promise rejections são rastreados
- Contexto do usuário é anexado a todos os erros

#### Manual
```typescript
import { trackError } from '@/lib/analytics-advanced';

try {
  // código
} catch (error) {
  trackError(error, {
    context: 'additional_info',
    user_action: 'what_user_was_doing',
  });
}
```

### 📈 Performance Monitoring

```typescript
import { trackPageLoad, trackApiCall } from '@/lib/analytics-advanced';

// Page loads são rastreados automaticamente
// API calls podem ser rastreados manualmente
trackApiCall(endpoint, duration, success);
```

---

## 🎨 Loading Skeletons System

### Overview
Sistema completo de loading states premium com shimmer effects e staggered animations.

### Available Skeletons

#### 1. Dashboard
```typescript
import { DashboardSkeletonV2 } from '@/components/Skeletons/DashboardSkeletonV2';

<DashboardSkeletonV2 />
```

#### 2. Scripts Page
```typescript
import { ScriptsPageSkeleton } from '@/components/Skeletons/ScriptsPageSkeleton';

<ScriptsPageSkeleton />
```

#### 3. Videos Page
```typescript
import { VideosPageSkeleton } from '@/components/Skeletons/VideosPageSkeleton';

<VideosPageSkeleton />
```

#### 4. Bonuses Page
```typescript
import { BonusesPageSkeleton } from '@/components/Skeletons/BonusesPageSkeleton';

<BonusesPageSkeleton />
```

#### 5. Profile Page
```typescript
import { ProfilePageSkeleton } from '@/components/Skeletons/ProfilePageSkeleton';

<ProfilePageSkeleton />
```

### Base Skeleton Component

```typescript
import { ImprovedSkeleton } from '@/components/common/ImprovedSkeleton';

// Variants
<ImprovedSkeleton variant="default" />
<ImprovedSkeleton variant="card" />
<ImprovedSkeleton variant="text" />
<ImprovedSkeleton variant="avatar" />
<ImprovedSkeleton variant="button" />

// Custom sizing
<ImprovedSkeleton className="h-32 w-64 rounded-xl" />
```

### Preset Components

```typescript
import { CardSkeleton, TextBlockSkeleton, ListSkeleton } from '@/components/common/ImprovedSkeleton';

// Card layout
<CardSkeleton />

// Text blocks
<TextBlockSkeleton />

// Lists
<ListSkeleton items={5} />
```

### Usage Pattern

```typescript
const MyComponent = () => {
  const { data, isLoading } = useQuery();

  if (isLoading) {
    return <MyComponentSkeleton />;
  }

  return <div>{/* actual content */}</div>;
};
```

---

## 🎯 Best Practices

### Analytics
1. **Rastreie ações importantes**: Foco em eventos que ajudam a entender comportamento do usuário
2. **Adicione contexto**: Sempre inclua informações relevantes nos eventos
3. **Proteja dados sensíveis**: Nunca rastreie senhas, tokens ou informações pessoais
4. **Use nomenclatura consistente**: Mantenha nomes de eventos padronizados

### Loading States
1. **Use skeleton matching**: Skeleton deve imitar o layout real do conteúdo
2. **Adicione delays**: Use `animationDelay` para stagger animations
3. **Mantenha consistência**: Use os mesmos skeletons em contextos similares
4. **Otimize performance**: Skeletons devem ser leves e renderizar rapidamente

---

## 📊 Dashboards & Monitoring

### Posthog
- Acesse [https://app.posthog.com](https://app.posthog.com)
- Visualize funnels, cohorts, session replays
- Configure feature flags e A/B tests

### Sentry
- Acesse [https://sentry.io](https://sentry.io)
- Monitore erros em tempo real
- Configure alertas para issues críticos
- Analise performance traces

---

## 🚀 Quick Start Checklist

### Analytics Setup
- [ ] Criar conta Posthog
- [ ] Criar conta Sentry
- [ ] Configurar variáveis de ambiente
- [ ] Testar tracking em dev
- [ ] Verificar eventos no dashboard Posthog
- [ ] Verificar erros no dashboard Sentry

### Skeletons Implementation
- [ ] Identificar páginas que precisam de skeletons
- [ ] Criar skeleton component para cada página
- [ ] Adicionar skeleton ao loading state
- [ ] Testar animações e timing
- [ ] Validar experiência em mobile

---

## 🔧 Troubleshooting

### Analytics não está rastreando
1. Verificar se variáveis de ambiente estão configuradas
2. Abrir console do navegador e procurar logs "[Analytics]"
3. Verificar se Posthog está carregado: `window.posthog`
4. Confirmar que eventos estão sendo enviados no Network tab

### Sentry não está capturando erros
1. Verificar VITE_SENTRY_DSN está configurado
2. Em dev, habilitar VITE_SENTRY_DEBUG=true
3. Verificar console para logs "[Sentry]"
4. Testar com erro forçado para confirmar integração

### Skeletons não aparecem
1. Verificar se estado de loading está sendo gerenciado corretamente
2. Confirmar que skeleton está importado
3. Validar que condição de loading está correta
4. Verificar console para erros de importação
