# ✅ CHECKLIST DE AÇÕES PRIORITÁRIAS - NEP SYSTEM

## 🔴 P0 - CRÍTICO (FEITO ✅)

### 1. PWA Update Loop ✅ CORRIGIDO
- [x] Criar `src/config/version.ts` com versão atual
- [x] Atualizar `src/hooks/useAppVersion.ts` para comparar com versão real
- [x] Testar fluxo de atualização
- [x] Documentar processo de atualização de versão

**Próximo Deploy:**
```bash
# 1. Atualizar versão ANTES de fazer deploy
# src/config/version.ts
export const APP_VERSION = '1.0.5';  # ← Incrementar aqui
export const APP_BUILD = 5;          # ← Incrementar aqui

# 2. Fazer deploy normalmente
npm run build
git add .
git commit -m "chore: bump version to 1.0.5"
git push

# 3. Admin força update via painel
# (ir em Admin → System → Force PWA Update)
```

---

## 🔴 P0 - CRÍTICO (PENDENTE)

### 2. Adicionar Políticas RLS Faltantes
**Responsável:** Dev Backend  
**Prazo:** Próxima Sprint  
**Arquivo:** Nova migration

```sql
-- user_bonuses: permitir INSERT para users
CREATE POLICY "Users can insert their own bonus progress"
ON user_bonuses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- notifications: permitir DELETE para users
CREATE POLICY "Users can delete their own notifications"
ON notifications FOR DELETE 
USING (auth.uid() = user_id);

-- post_likes: permitir UPDATE (mudar tipo de reação)
CREATE POLICY "Users can update their own likes"
ON post_likes FOR UPDATE 
USING (auth.uid() = user_id);
```

**Como testar:**
```typescript
// Test INSERT user_bonuses
const { data, error } = await supabase
  .from('user_bonuses')
  .insert({ user_id: myUserId, bonus_id: someBonusId, progress: 0 });
console.log(error ? '❌ FAILED' : '✅ PASSED');

// Test DELETE notifications
const { error: delError } = await supabase
  .from('notifications')
  .delete()
  .eq('id', myNotificationId)
  .eq('user_id', myUserId);
console.log(delError ? '❌ FAILED' : '✅ PASSED');
```

---

### 3. Error Boundaries
**Responsável:** Dev Frontend  
**Prazo:** Próxima Sprint  
**Arquivos:** `src/components/ErrorBoundary.tsx` + páginas críticas

```typescript
// 1. Criar Error Boundary genérico
// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Sentry já captura automaticamente
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 2. Aplicar em páginas críticas
// src/pages/Bonuses.tsx
export default function Bonuses() {
  return (
    <ErrorBoundary>
      <BonusesContent />
    </ErrorBoundary>
  );
}

// src/pages/Scripts.tsx
export default function Scripts() {
  return (
    <ErrorBoundary>
      <ScriptsContent />
    </ErrorBoundary>
  );
}

// src/pages/Community.tsx
export default function Community() {
  return (
    <ErrorBoundary>
      <CommunityContent />
    </ErrorBoundary>
  );
}
```

**Checklist:**
- [ ] Criar `ErrorBoundary.tsx`
- [ ] Aplicar em `Bonuses.tsx`
- [ ] Aplicar em `Scripts.tsx`
- [ ] Aplicar em `Community.tsx`
- [ ] Aplicar em `Tracker.tsx`
- [ ] Testar (forçar erro e verificar fallback)

---

## ⚠️ P1 - ALTO (2 Semanas)

### 4. Revisar Security Definer Views
**Responsável:** Dev Backend + Security Review  
**Prazo:** Sprint 2

**Processo:**
```sql
-- 1. Listar todas as views com SECURITY DEFINER
SELECT 
  viewname,
  definition
FROM pg_views
WHERE schemaname = 'public'
  AND definition LIKE '%SECURITY DEFINER%';

-- 2. Para cada view, perguntar:
-- a) Ela PRECISA de SECURITY DEFINER? (bypass RLS)
-- b) Ou pode ser view normal?

-- 3. Converter views que NÃO precisam:
DROP VIEW IF EXISTS view_name;
CREATE VIEW view_name AS
  SELECT ... -- mesma query
;
-- (sem SECURITY DEFINER)

-- 4. Documentar views que PRECISAM:
-- Criar docs/SECURITY_DEFINER_JUSTIFICATIONS.md
```

**Views Prioritárias para Revisar:**
- [ ] `bonuses_with_user_progress` - Alto uso
- [ ] `community_posts_with_stats` - Alto uso
- [ ] `scripts_with_full_stats` - Alto uso
- [ ] `leaderboard` - Público
- [ ] `public_profiles` - Público

**Prazo:** 2 semanas

---

### 5. Setup de Testes Automatizados
**Responsável:** Tech Lead + Devs  
**Prazo:** Sprint 2-3

**Fase 1: Unit Tests (Vitest)**
```bash
# 1. Instalar Vitest
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom

# 2. Configurar vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});

# 3. Criar src/test/setup.ts
import '@testing-library/jest-dom';

# 4. Adicionar script em package.json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
}
```

**Testes Iniciais:**
- [ ] `src/lib/quizQuestions.test.ts` - Cálculo de perfil cerebral
- [ ] `src/lib/validations.test.ts` - Validações de email/password
- [ ] `src/hooks/useRateLimit.test.ts` - Rate limiting
- [ ] `src/components/Quiz.test.tsx` - Validação de nome

**Fase 2: Integration Tests**
- [ ] `src/pages/Auth.test.tsx` - Fluxo de login/signup
- [ ] `src/pages/Quiz.test.tsx` - Fluxo completo do quiz
- [ ] `src/contexts/AuthContext.test.tsx` - Autenticação

**Fase 3: E2E Tests (Playwright)**
```bash
# 1. Instalar Playwright
npm install -D @playwright/test

# 2. Criar e2e/signup-quiz-flow.spec.ts
test('complete user journey', async ({ page }) => {
  // Signup → Onboarding → Quiz → Dashboard
});
```

**Target Coverage:**
- Crítico (auth, quiz): 80%+
- Utils: 70%+
- Components: 50%+

---

### 6. Integrar Analytics
**Responsável:** Dev Frontend + Product  
**Prazo:** Sprint 2-3

**Opção 1: Google Analytics 4**
```bash
npm install react-ga4
```

```typescript
// src/lib/analytics.ts
import ReactGA from 'react-ga4';

export const initAnalytics = () => {
  ReactGA.initialize('G-XXXXXXXXXX');
};

export const trackEvent = (eventName: string, params?: object) => {
  ReactGA.event(eventName, params);
};

export const trackPage = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

// Usar em componentes:
useEffect(() => {
  trackPage(location.pathname);
}, [location]);

trackEvent('quiz_completed', { brain_profile: result.type });
```

**Opção 2: Posthog (Recomendado para features avançadas)**
```bash
npm install posthog-js
```

```typescript
// src/lib/posthog.ts
import posthog from 'posthog-js';

export const initPosthog = () => {
  posthog.init('phc_xxxxxx', {
    api_host: 'https://app.posthog.com',
    autocapture: true,
    capture_pageview: true,
  });
};

export const trackEvent = (eventName: string, properties?: object) => {
  posthog.capture(eventName, properties);
};

export const identifyUser = (userId: string, traits?: object) => {
  posthog.identify(userId, traits);
};
```

**Eventos para Rastrear:**
- [ ] `user_signup` - Email signup
- [ ] `quiz_started` - Início do quiz
- [ ] `quiz_completed` - Quiz finalizado com perfil
- [ ] `child_added` - Perfil de filho criado
- [ ] `script_viewed` - Script aberto
- [ ] `script_used` - Script marcado como usado
- [ ] `video_started` - Vídeo começou
- [ ] `video_completed` - Vídeo assistido até o fim
- [ ] `bonus_unlocked` - Bonus desbloqueado
- [ ] `bonus_completed` - Bonus completado
- [ ] `pwa_installed` - PWA adicionado ao home screen
- [ ] `update_prompted` - Prompt de atualização mostrado
- [ ] `update_accepted` - Usuário aceitou atualizar

---

## 🟡 P2 - MÉDIO (1 Mês)

### 7. Otimizações de Performance
**Responsável:** Dev Frontend  
**Prazo:** Sprint 4-5

**A. Otimizar Imagens**
```typescript
// Usar componente otimizado
// src/components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function OptimizedImage({ src, alt, width, height, className }: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  
  // Gerar srcset automaticamente
  const srcset = `
    ${src}?w=300&fm=webp 300w,
    ${src}?w=600&fm=webp 600w,
    ${src}?w=900&fm=webp 900w
  `;
  
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={`${src}?w=${width || 600}&fm=webp`}
        srcSet={srcset}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn('transition-opacity', loaded ? 'opacity-100' : 'opacity-0')}
      />
    </div>
  );
}

// Usar em BonusCard, ScriptCard, etc.
<OptimizedImage 
  src={bonus.thumbnail} 
  alt={bonus.title}
  width={300}
  height={200}
/>
```

**B. Reduzir Bundle Size**
```typescript
// ❌ Antes
import * as Icons from 'lucide-react';  // 500kb+

// ✅ Depois
import { Heart, Share, Download } from 'lucide-react';  // 10kb

// Auditar com:
npm run build
npx vite-bundle-visualizer
```

**C. Eliminar Re-renders**
```typescript
// Adicionar React DevTools Profiler
// Identificar componentes que re-renderizam muito

// Usar memo e useMemo corretamente:
const filteredBonuses = useMemo(() => {
  return bonuses.filter(b => 
    b.category === selectedCategory &&
    b.title.includes(searchQuery)
  );
}, [bonuses, selectedCategory, searchQuery]);  // ✅ Todas dependências

// Usar useCallback para funções passadas como props:
const handleDelete = useCallback(async (id: string) => {
  await deleteBonus(id);
}, []);  // ✅ Função estável
```

**Targets:**
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Bundle size < 500kb (gzipped)

---

### 8. Melhorias de UX
**Responsável:** Designer + Dev Frontend  
**Prazo:** Sprint 5-6

**A. Empty States Melhores**
```typescript
// src/components/EmptyState.tsx
interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Icon className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Usar em:
{bonuses.length === 0 && (
  <EmptyState
    icon={Package}
    title="No bonuses yet"
    description="Complete scripts and watch videos to unlock exclusive bonuses"
    action={{
      label: "Explore Scripts",
      onClick: () => navigate('/scripts')
    }}
  />
)}
```

**B. Loading States Consistentes**
```typescript
// src/components/LoadingState.tsx
export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Usar:
{loading ? (
  <CardSkeleton />
) : (
  <BonusCard bonus={bonus} />
)}
```

**C. Feedback Visual**
```typescript
// Sempre mostrar loading + toast
const [deleting, setDeleting] = useState<string | null>(null);

const handleDelete = async (id: string) => {
  setDeleting(id);
  
  try {
    await deleteBonus(id);
    toast.success('Bonus deleted successfully');
  } catch (error) {
    toast.error('Failed to delete bonus');
  } finally {
    setDeleting(null);
  }
};

// No botão:
<Button 
  onClick={() => handleDelete(bonus.id)}
  disabled={deleting === bonus.id}
>
  {deleting === bonus.id ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : (
    <Trash className="w-4 h-4" />
  )}
</Button>
```

---

### 9. Admin Panel Hardening
**Responsável:** Dev Backend + Frontend  
**Prazo:** Sprint 6

**A. Confirmação de Ações Destrutivas**
```typescript
// src/hooks/useConfirm.tsx
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title: string;
    description: string;
    actionText: string;
    onConfirm: () => void;
  } | null>(null);

  const confirm = (opts: typeof config) => {
    return new Promise<boolean>((resolve) => {
      setConfig({
        ...opts,
        onConfirm: () => {
          opts.onConfirm();
          resolve(true);
          setIsOpen(false);
        },
      });
      setIsOpen(true);
    });
  };

  const ConfirmDialog = () => (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config?.title}</AlertDialogTitle>
          <AlertDialogDescription>{config?.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={config?.onConfirm}>
            {config?.actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, ConfirmDialog };
}

// Usar:
const { confirm, ConfirmDialog } = useConfirm();

const handleDeleteMultiple = async () => {
  const confirmed = await confirm({
    title: 'Delete multiple bonuses?',
    description: `This will permanently delete ${selectedIds.length} bonuses.`,
    actionText: 'Delete',
    onConfirm: async () => {
      // ... delete logic
    }
  });
};

return (
  <>
    <AdminBonusesTab />
    <ConfirmDialog />
  </>
);
```

**B. Rate Limiting Admin Actions**
```typescript
// Em AdminSystemTab:
const updateRateLimit = useRateLimit(5, 60000);  // 5 updates/min

const handleForceUpdate = async () => {
  if (!updateRateLimit.canMakeCall()) {
    const remaining = Math.ceil(updateRateLimit.getRemainingTime() / 1000);
    toast.error(`Too many update requests. Wait ${remaining}s`);
    return;
  }
  
  // ... proceed with update
};
```

---

## 🟢 P3 - BAIXO (Backlog)

### 10. Documentation
- [ ] README.md atualizado
- [ ] CONTRIBUTING.md
- [ ] docs/ARCHITECTURE.md
- [ ] docs/API.md
- [ ] Storybook para componentes

### 11. Accessibility (A11y)
- [ ] Lighthouse accessibility audit
- [ ] ARIA labels em botões/links
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast check

### 12. Internacionalização (i18n)
- [ ] Setup react-i18next
- [ ] Extrair strings para arquivos de tradução
- [ ] Português (pt-BR)
- [ ] Inglês (en-US)
- [ ] Date/number formatting por locale

---

## 📅 CRONOGRAMA SUGERIDO

### Sprint 1 (Semana 1-2)
- ✅ P0: PWA Update Loop (FEITO)
- [ ] P0: RLS Policies
- [ ] P0: Error Boundaries

### Sprint 2 (Semana 3-4)
- [ ] P1: Revisar Security Definer Views (início)
- [ ] P1: Setup Vitest + primeiros testes
- [ ] P1: Integrar Analytics

### Sprint 3 (Semana 5-6)
- [ ] P1: Security Definer Views (conclusão)
- [ ] P1: Testes (continuação - 50% coverage)
- [ ] P2: Performance audit

### Sprint 4 (Semana 7-8)
- [ ] P2: Otimizações de performance
- [ ] P2: UX improvements
- [ ] P1: Testes (conclusão - 70% coverage)

### Sprint 5 (Semana 9-10)
- [ ] P2: Admin panel hardening
- [ ] P3: Documentation (início)
- [ ] E2E tests

### Sprint 6+ (Semana 11+)
- [ ] P3: A11y
- [ ] P3: i18n
- [ ] P3: Storybook

---

## 🎯 MÉTRICAS DE SUCESSO

### Qualidade de Código
- [ ] TypeScript strict mode sem erros
- [ ] ESLint sem warnings
- [ ] 70%+ test coverage
- [ ] 0 security vulnerabilities (npm audit)

### Performance
- [ ] Lighthouse score > 90
- [ ] Bundle size < 500kb
- [ ] FCP < 1.5s
- [ ] TTI < 3s

### Segurança
- [ ] Todas políticas RLS configuradas
- [ ] Security Definer Views justificadas
- [ ] Rate limiting em ações críticas
- [ ] Input sanitization em 100% dos forms

### UX
- [ ] 0 bugs críticos em produção
- [ ] < 5% error rate (Sentry)
- [ ] > 90% positive feedback (se aplicável)
- [ ] PWA install rate > 30%

---

## 📞 RESPONSABILIDADES

### Tech Lead
- Revisar Security Definer Views
- Aprovar arquitetura de testes
- Code review de PRs críticos

### Backend Dev
- Implementar RLS policies
- Revisar funções de banco
- Migrations

### Frontend Dev
- Error Boundaries
- Testes unitários/integração
- Performance optimizations
- UX improvements

### DevOps
- CI/CD para testes
- Monitoring setup
- Analytics integration

### QA (se aplicável)
- E2E tests
- Manual testing de fluxos críticos
- Regression testing

---

**Última Atualização:** 15/11/2025  
**Próxima Revisão:** 01/12/2025
