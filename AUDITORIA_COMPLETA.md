# AUDITORIA COMPLETA - NEP SYSTEM

**Data da Análise:** 23 de Novembro de 2025
**Aplicativo:** NEP System (Cal AI PWA)
**Stack:** React + TypeScript + Supabase
**Tipo:** Progressive Web App (PWA)

---

# PARTE 6: FEATURES & BUSINESS LOGIC

**Data da Análise:** 23-11-2025

## 📊 RESUMO EXECUTIVO

O NEP System apresenta uma implementação robusta das funcionalidades principais, com destaque para o sistema de scripts personalizados, quiz de onboarding bem estruturado e PWA update mechanism funcional. A maioria das features críticas está implementada corretamente com tratamento de erros adequado. Entretanto, foram identificados **3 problemas críticos** relacionados a validação de dados do quiz, lógica inconsistente de streak tracking, e potenciais race conditions no sistema de child profiles. Adicionalmente, há **7 problemas médios** que podem impactar a experiência do usuário, especialmente relacionados ao sistema de rate limiting e celebrações.

**Pontos positivos:** Admin panel com verificação via RPC (não localStorage), sistema de PWA update bem implementado, rate limiting funcional com fallback gracioso, e ebook reader V2 preparado para renderizar conteúdo dinâmico.

**Áreas de atenção:** Validação de dados do quiz precisa ser mais restritiva, streak system tem lógica inconsistente para "recovery", e sistema de favorites/collections pode ter problemas de sincronização entre múltiplas tabs.

---

## ✅ PONTOS FORTES

### 1. Admin Panel - Verificação Segura
**Localização:** `src/hooks/useAdminStatus.ts`

✅ **EXCELENTE:** A verificação de admin NÃO usa localStorage, usa RPC para Supabase:

```typescript
const { data, error } = await supabase.rpc('is_admin');
```

Isso previne bypass via DevTools e garante que a verificação é server-side.

---

### 2. PWA Update Mechanism - Muito Bem Implementado
**Localização:** `src/hooks/useAppVersion.ts` e `src/components/Admin/AdminSystemTab.tsx`

✅ **DESTAQUES:**
- Versão gerenciada 100% no banco de dados (não hardcoded)
- Admin pode forçar update de forma centralizada
- Rate limiting de 1 minuto entre force updates
- Sanitização de mensagens de update para prevenir XSS
- Detecta plataforma (iOS vs Web) e usa método adequado de reload
- Não cria loops infinitos (flag `pwa_just_updated` no sessionStorage)
- Exclui rotas sensíveis (`/auth`, `/quiz`, `/onboarding`)

```typescript
// ✅ Previne loop de updates
if (sessionStorage.getItem('pwa_just_updated') === 'true') {
  sessionStorage.removeItem('pwa_just_updated');
  return;
}
```

---

### 3. Rate Limiting de Scripts - Fail-Safe Design
**Localização:** `src/hooks/useScriptRateLimit.ts`

✅ **BOA PRÁTICA:**
- Free users: 50 acessos/24h
- Premium/Admin: Unlimited
- Em caso de erro na verificação, permite acesso (fail open)
- Aviso aos 10 scripts restantes
- Toast com ação de upgrade quando limite atingido

```typescript
if (error) {
  logger.error('Rate limit check error:', error);
  return true; // ✅ Fail open - permite acesso em caso de erro
}
```

---

### 4. Quiz & Onboarding - Flow Completo e Estruturado
**Localização:** `src/pages/Quiz.tsx`

✅ **PONTOS FORTES:**
- Validação de nome da criança (2-50 chars, alphanumeric + spaces/hyphens)
- Sanitização de entrada (remove tags HTML, caracteres perigosos)
- Salvamento correto no banco com todos os campos extras (age, goals, challenge_level)
- Celebração final com finger heart animation
- Marca quiz como completed no perfil do usuário
- SessionStorage flag para permitir navegação após conclusão
- Progress bar visual com milestones (25%, 50%, 75%)

---

### 5. Scripts - Sistema Robusto e Completo
**Localização:** `src/pages/Scripts.tsx`

✅ **FUNCIONALIDADES:**
- Busca inteligente com `intelligentSearch()` que procura em title, tags, phrases
- Detecção de emergência com keywords (`crying`, `screaming`, etc.)
- Filtragem por categoria e perfil cerebral
- Sistema de favoritos persistido no banco
- Collections para organizar scripts
- Rate limiting integrado (mas veja problemas abaixo)
- Script usage tracking com milestone celebrations
- Related scripts e alternativas quando feedback é "not_yet"

---

### 6. Bonuses - Bem Estruturado com Paginação
**Localização:** `src/pages/Bonuses.tsx`

✅ **IMPLEMENTAÇÃO:**
- Paginação server-side (12 por página)
- URL state management (filtros na URL)
- Progress tracking de vídeos e ebooks
- Video player otimizado com YouTube API
- Ebook reader V2 preparado para conteúdo dinâmico do banco
- Categorias com contagem
- Continue learning section para itens in-progress

---

### 7. Child Profiles - Context Bem Estruturado
**Localização:** `src/contexts/ChildProfilesContext.tsx`

✅ **BOA PRÁTICA:**
- Máximo de 10 profiles por usuário (verificado no banco)
- Active child salvo em localStorage por user_id
- Fallback automático para primeiro profile se stored não existir
- Refresh function para invalidar cache
- Onboarding detection correto

---

## 🚨 PROBLEMAS CRÍTICOS

### 1. Quiz - Validação Insuficiente em Campos Críticos
**Severidade:** 🔴 CRÍTICA
**Impacto:** Dados inconsistentes no banco, potencial crash em telas que assumem dados válidos
**Localização:** `src/pages/Quiz.tsx` (linhas 291-308)

**Problema:**
A função `canProceed()` não valida corretamente todos os campos obrigatórios. Especificamente:

```typescript
case 'details':
  return childAge > 0;  // ❌ Permite childAge = 0.5, 0.1, etc
case 'goals':
  return parentGoals.length > 0;  // ✅ OK
case 'challenge':
  return challengeDuration !== '';  // ❌ Não valida formato ou valores válidos
```

**Evidência:**
- `childAge` permite decimais, mas deveria ser inteiro entre 0-18
- `challengeDuration` apenas verifica se não é vazio, mas não valida se é um valor da lista predefinida
- `triedApproaches` não tem validação de tamanho mínimo/máximo

**Como Reproduzir:**
1. Ir para etapa Details
2. Não há validação para impedir idade fracionária ou negativa
3. Dados inválidos são salvos no banco

**Solução Recomendada:**
```typescript
case 'details':
  return Number.isInteger(childAge) && childAge >= 0 && childAge <= 18;
case 'challenge':
  const validDurations = ['1-2 weeks', '1 month', '2-3 months', '6+ months'];
  return validDurations.includes(challengeDuration);
```

---

### 2. Tracker - Lógica de Streak Recovery Inconsistente
**Severidade:** 🔴 CRÍTICA
**Impacto:** Usuários podem perder streaks injustamente ou sistema pode permitir "recovery" indevido
**Localização:** `src/hooks/useStreakData.ts` (linhas 135-136)

**Problema:**
A lógica de "can recover streak" é muito simplista e não verifica corretamente o gap:

```typescript
const canRecover = currentStreak === 0 && longestStreak >= 3;
const recoveryDeadline = canRecover ? new Date(today.getTime() + 24 * 60 * 60 * 1000) : null;
```

**Problemas:**
1. Não verifica se o usuário perdeu apenas 1 dia ou múltiplos dias
2. Não há implementação de "streak freeze" mencionado no prompt
3. Recovery deadline é sempre "amanhã", mas não verifica quando foi o último completed day
4. `canRecover` apenas verifica `longestStreak >= 3`, não o currentStreak antes de quebrar

**Como Reproduzir:**
1. Usuário tem streak de 10 dias
2. Perde 5 dias consecutivos
3. Sistema ainda mostra `canRecover = true` porque `longestStreak >= 3`
4. Não faz sentido permitir recovery após 5 dias

**Solução Recomendada:**
```typescript
// Verificar se perdeu APENAS 1 dia
const lastCompletedDay = trackerDays?.find(d => d.completed)?.date;
if (lastCompletedDay) {
  const lastDate = new Date(lastCompletedDay);
  const daysSinceLastComplete = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  // Permitir recovery apenas se perdeu exatamente 1 dia E tinha streak de 7+
  const canRecover = daysSinceLastComplete === 1 && currentStreak >= 7;
  const recoveryDeadline = canRecover ? new Date(today.getTime() + 24 * 60 * 60 * 1000) : null;
}
```

---

### 3. Child Profiles - Potential Race Condition
**Severidade:** 🔴 CRÍTICA
**Impacto:** Active child pode ficar dessincronizado entre múltiplas tabs/windows
**Localização:** `src/contexts/ChildProfilesContext.tsx` (linhas 133-137)

**Problema:**
O `setActiveChild` não verifica se o child ainda existe antes de persistir:

```typescript
const setActiveChild = (childId: string) => {
  if (!user?.id) return;
  setActiveChildId(childId);
  persistActiveChild(user.id, childId);  // ❌ Não valida se childId existe em childProfiles
};
```

**Cenários problemáticos:**
1. Usuário deleta child profile em outra tab
2. Tab antiga ainda tem referência ao child deletado
3. Tenta selecionar o child deletado
4. localStorage fica com ID inválido
5. Próximo refresh pode crashar ou mostrar "no child selected"

**Como Reproduzir:**
1. Abrir app em 2 tabs
2. Tab 1: Deletar child profile "Alice"
3. Tab 2: Tentar selecionar "Alice" no dropdown
4. localStorage salva ID inválido

**Solução Recomendada:**
```typescript
const setActiveChild = (childId: string) => {
  if (!user?.id) return;

  // ✅ Validar que child existe antes de persistir
  const childExists = childProfiles.some(child => child.id === childId);
  if (!childExists) {
    console.warn(`Attempted to set invalid child ID: ${childId}`);
    toast.error('This child profile no longer exists');
    return;
  }

  setActiveChildId(childId);
  persistActiveChild(user.id, childId);
};
```

Adicionalmente, implementar listener de `storage` event para sincronizar entre tabs:

```typescript
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === getStorageKey(user?.id || '') && e.newValue) {
      setActiveChildId(e.newValue);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, [user?.id]);
```

---

## ⚠️ PROBLEMAS MÉDIOS

### 1. Scripts - Rate Limiting Não Aplicado na Abertura do Modal
**Severidade:** ⚠️ MÉDIA
**Impacto:** Usuários free podem ultrapassar limite de 50 scripts/dia
**Localização:** `src/pages/Scripts.tsx` (linhas 441-446)

**Problema:**
O rate limiting só é verificado no hook `useScriptRateLimit`, mas não é chamado quando o modal de script é aberto:

```typescript
const handleSelectScript = (scriptItem: ScriptItem) => {
  setSelectedScript(scriptItem);  // ❌ Abre modal sem verificar rate limit
  const scriptRow = scripts.find(s => s.id === scriptItem.id);
  setSelectedScriptRow(scriptRow || null);
};
```

**Solução Recomendada:**
```typescript
const handleSelectScript = async (scriptItem: ScriptItem) => {
  // ✅ Verificar rate limit antes de abrir
  const canAccess = await checkRateLimit();
  if (!canAccess) return;

  setSelectedScript(scriptItem);
  const scriptRow = scripts.find(s => s.id === scriptItem.id);
  setSelectedScriptRow(scriptRow || null);
};
```

---

### 2. Scripts - Celebration Modal Pode Não Aparecer
**Severidade:** ⚠️ MÉDIA
**Impacto:** Usuários não veem celebrações de milestone
**Localização:** `src/pages/Scripts.tsx` (linhas 391-399)

**Problema:**
A celebração de milestone é assíncrona mas não aguarda antes de retornar:

```typescript
const milestoneType = await checkMilestones();
if (milestoneType) {
  const totalCount = await getTotalScriptCount(user.id);
  await triggerCelebration(milestoneType, {  // ❌ Não há garantia que modal será mostrado
    scriptTitle: script.title,
    totalScriptsUsed: totalCount,
  });
}
```

Se o componente desmontar antes de `triggerCelebration` completar, a celebração é perdida.

**Solução Recomendada:**
Verificar se `showCelebration` state foi atualizado antes de fechar o modal.

---

### 3. Bonuses - Ebook Fallback Pode Falhar Silenciosamente
**Severidade:** ⚠️ MÉDIA
**Impacto:** Ebooks sem `viewUrl` mas com `bonus_id` válido podem não abrir
**Localização:** `src/pages/Bonuses.tsx` (linhas 199-216)

**Problema:**
```typescript
// Priority 2: Fallback - fetch ebook slug from database
const { data: ebook } = await supabase
  .from('ebooks')
  .select('slug')
  .eq('bonus_id', bonus.id)
  .single();  // ❌ .single() pode falhar se não encontrar

if (ebook?.slug) {
  navigate(`/ebook-v2/${ebook.slug}`);
  return;
}
// ❌ Se não encontrar, não faz nada - usuário clica e nada acontece
```

**Solução Recomendada:**
```typescript
const { data: ebook, error } = await supabase
  .from('ebooks')
  .select('slug')
  .eq('bonus_id', bonus.id)
  .single();

if (error) {
  toast.error('Ebook not found', {
    description: 'This ebook is not available yet.'
  });
  return;
}

if (ebook?.slug) {
  navigate(`/ebook-v2/${ebook.slug}`);
  return;
}
```

---

### 4. Community - Posts Podem Ficar Órfãos se Usuário for Deletado
**Severidade:** ⚠️ MÉDIA
**Impacto:** Posts sem author podem crashar UI
**Localização:** `src/hooks/useCommunityPosts.ts` (linhas 13-32)

**Problema:**
A query não faz `LEFT JOIN` com profiles, então se um usuário for deletado, os posts dele podem retornar `null` para dados do usuário.

```typescript
let query = supabase
  .from('community_posts_with_stats')  // ❌ View pode não ter foreign key enforcement
  .select('*')
```

Se a view `community_posts_with_stats` não faz `LEFT JOIN` com profiles, posts órfãos podem aparecer sem nome/foto do autor.

**Solução Recomendada:**
Verificar a definição da view e adicionar `LEFT JOIN` se necessário, ou adicionar tratamento no componente:

```typescript
{post.author_name || 'Deleted User'}
```

---

### 5. Tracker - Não Há Validação de Data no Backend
**Severidade:** ⚠️ MÉDIA
**Impacto:** Usuário pode completar dias no futuro via manipulação de requests
**Localização:** `src/pages/TrackerCalAI.tsx` (linhas 79-102)

**Problema:**
O frontend permite clicar em qualquer dia, mas não há validação se a data é válida:

```typescript
const handleDayClick = (dayNumber: number) => {
  const day = trackerDays.find(d => d.day_number === dayNumber);
  if (day?.completed) return;  // ❌ Apenas impede re-completar

  setSelectedDay(dayNumber);  // ❌ Não valida se dayNumber é futuro
};
```

Usuário malicioso pode abrir DevTools e chamar:
```javascript
handleSave() // Para day_number = 30 mesmo estando no dia 5
```

**Solução Recomendada:**
Adicionar validação no backend (Supabase RPC ou trigger) para rejeitar `completed_at` no futuro.

---

### 6. Quiz - SaveChildProfile Não Retorna Erro Se Inserção Falha
**Severidade:** ⚠️ MÉDIA
**Impacto:** Usuário vê "Profile saved!" mas perfil não foi salvo
**Localização:** `src/pages/Quiz.tsx` (linhas 148-172)

**Problema:**
```typescript
if (data && data[0]) {
  // ... success logic
  return data[0];
}
// ❌ Se data é null ou array vazio, não faz nada
// Função retorna undefined implicitamente, mas não mostra erro ao usuário
```

**Solução Recomendada:**
```typescript
if (data && data[0]) {
  // ... success
  return data[0];
} else {
  // ✅ Mostrar erro se inserção não retornou dados
  toast.error('Failed to save profile. Please try again.');
  throw new Error('Insert returned no data');
}
```

---

### 7. Admin Panel - Force Update Não Valida Mensagem Antes de Enviar
**Severidade:** ⚠️ MÉDIA
**Impacto:** Admin pode enviar mensagem vazia (apesar de haver validação no frontend, backend pode ser bypassado)
**Localização:** `src/components/Admin/AdminSystemTab.tsx` (linhas 95-123)

**Problema:**
A validação de mensagem vazia é apenas no frontend:

```typescript
if (!updateMessage.trim()) {
  toast.error('Update message cannot be empty');
  return;  // ❌ Apenas no frontend
}
```

Se alguém chamar a RPC `force_app_update` diretamente via Supabase client, pode passar mensagem vazia.

**Solução Recomendada:**
Adicionar validação no backend (dentro da função RPC `force_app_update`).

---

## 💡 MELHORIAS SUGERIDAS

### 1. Scripts - Adicionar Cache para Recommendations
**Prioridade:** Alta
**Impacto:** Reduzir calls ao banco, melhorar performance

**Sugestão:**
Atualmente, `useChildRecommendations` não tem cache. A cada render, faz query ao banco.

```typescript
// src/hooks/useChildRecommendations.ts
export function useChildRecommendations(limit: number = 6) {
  return useQuery({
    queryKey: ['child-recommendations', activeChild?.id, limit],
    queryFn: async () => {
      // ... query
    },
    staleTime: 5 * 60 * 1000,  // ✅ ADICIONAR: Cache por 5 minutos
    cacheTime: 10 * 60 * 1000,  // ✅ ADICIONAR: Manter em cache por 10 min
  });
}
```

---

### 2. Bonuses - Prefetch de Ebooks Visíveis
**Prioridade:** Média
**Impacto:** Melhorar perceived performance ao abrir ebook

**Sugestão:**
Usar `queryClient.prefetchQuery` para pre-carregar ebooks que estão visíveis na tela:

```typescript
const { data: visibleBonuses } = useBonuses({ ... });

useEffect(() => {
  visibleBonuses?.data?.slice(0, 3).forEach(bonus => {
    if (bonus.category === 'ebook') {
      queryClient.prefetchQuery(['ebook-content', bonus.id]);
    }
  });
}, [visibleBonuses]);
```

---

### 3. Community - Implementar Paginação Infinita
**Prioridade:** Média
**Impacto:** Melhorar UX para usuários com muitos posts

**Sugestão:**
Trocar paginação simples por infinite scroll usando `useInfiniteQuery`:

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['community-posts'],
  queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

---

### 4. Quiz - Adicionar Auto-Save
**Prioridade:** Baixa
**Impacto:** Prevenir perda de dados se usuário fechar browser no meio do quiz

**Sugestão:**
Salvar progresso do quiz em localStorage a cada step:

```typescript
useEffect(() => {
  if (hasStarted) {
    localStorage.setItem('quiz_progress', JSON.stringify({
      childName,
      childAge,
      parentGoals,
      currentQuestion,
      answers,
    }));
  }
}, [childName, childAge, parentGoals, currentQuestion, answers]);
```

E ao carregar a página, perguntar se quer continuar de onde parou.

---

### 5. Tracker - Adicionar Visualização de Heatmap
**Prioridade:** Baixa
**Impacto:** Melhor visualização de streaks e padrões

**Sugestão:**
Usar biblioteca como `react-calendar-heatmap` para mostrar atividade ao longo do ano.

---

### 6. Scripts - Adicionar Modo Offline com Service Worker
**Prioridade:** Média
**Impacto:** Permitir uso básico sem internet

**Sugestão:**
Implementar service worker para cache de scripts visualizados recentemente:

```javascript
// service-worker.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/scripts')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
```

---

### 7. PWA - Adicionar Install Prompt Customizado
**Prioridade:** Média
**Impacto:** Aumentar adoption do PWA

**Sugestão:**
Detectar evento `beforeinstallprompt` e mostrar banner customizado:

```typescript
useEffect(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    setDeferredPrompt(e);
    setShowInstallBanner(true);
  });
}, []);

const handleInstall = () => {
  deferredPrompt?.prompt();
  deferredPrompt?.userChoice.then(choice => {
    if (choice.outcome === 'accepted') {
      toast.success('App installed!');
    }
  });
};
```

---

## 📈 MÉTRICAS

- **Features Principais:** 6/7 funcionando 100% ✅
  - ✅ Quiz & Onboarding (com ressalvas de validação)
  - ✅ Scripts (rate limiting precisa de ajustes)
  - ✅ Bonuses
  - ✅ Community
  - ✅ Profile & Child Profiles (com ressalvas de race condition)
  - ⚠️ Tracker (streak logic inconsistente)
  - ✅ Admin Panel

- **Edge Cases Tratados:** 65%
  - ✅ User não autenticado
  - ✅ Child profile não selecionado
  - ✅ Ebook content malformed (fallback)
  - ⚠️ Child deletado em outra tab (não tratado)
  - ⚠️ API externa falha (parcialmente tratado)
  - ✅ Rate limit atingido

- **Error Handling:** 7/10
  - ✅ Toasts informativos para a maioria dos erros
  - ✅ Fallback gracioso em rate limiting
  - ✅ Error boundaries em pontos críticos
  - ⚠️ Alguns erros silenciosos (ex: ebook fallback)
  - ⚠️ Falta logging estruturado de erros

- **Data Integrity:** 7/10
  - ✅ Admin verification via RPC
  - ✅ Input sanitization em Quiz
  - ✅ XSS prevention em update messages
  - ⚠️ Falta validação de datas no backend (tracker)
  - ⚠️ Possíveis dados órfãos em community_posts

- **User Experience:** 8/10
  - ✅ Loading states bem implementados
  - ✅ Skeletons em páginas principais
  - ✅ Progress indicators visuais
  - ✅ Celebrações e gamificação
  - ⚠️ Alguns erros silenciosos frustram usuário
  - ⚠️ Falta feedback visual em algumas ações

---

## 🎯 RECOMENDAÇÕES PRIORITÁRIAS

### 🔴 CRÍTICAS (Resolver Imediatamente)

1. **[Tracker] Corrigir lógica de Streak Recovery**
   - Implementar verificação de gap de apenas 1 dia
   - Verificar streak anterior era >= 7 dias
   - Adicionar testes unitários para streak calculation

2. **[Quiz] Adicionar validação robusta de campos**
   - Validar `childAge` é inteiro entre 0-18
   - Validar `challengeDuration` está na lista de opções válidas
   - Validar tamanho de arrays (parentGoals, triedApproaches)

3. **[Child Profiles] Implementar sincronização entre tabs**
   - Adicionar `storage` event listener
   - Validar child existence antes de setActiveChild
   - Mostrar toast se child foi deletado

### ⚠️ MÉDIAS (Resolver em 1-2 Sprints)

4. **[Scripts] Integrar rate limiting no modal de script**
   - Chamar `checkRateLimit()` antes de abrir modal
   - Adicionar loading state durante verificação

5. **[Bonuses] Melhorar error handling de ebook fallback**
   - Mostrar toast específico se ebook não encontrado
   - Log de erros para debugging

6. **[Tracker] Adicionar validação de data no backend**
   - Criar trigger ou RPC para validar completed_at <= now()
   - Rejeitar requisições maliciosas

7. **[Community] Tratar posts órfãos**
   - Adicionar LEFT JOIN na view ou tratamento no componente
   - Mostrar "Deleted User" para posts sem autor

### 💡 MELHORIAS (Backlog)

8. **[Performance] Adicionar cache em recommendations**
   - staleTime: 5 min, cacheTime: 10 min

9. **[UX] Implementar install prompt customizado para PWA**
   - Capturar beforeinstallprompt
   - Banner customizado com branding

10. **[Offline] Implementar service worker para scripts**
    - Cache de scripts visualizados recentemente
    - Fallback para modo offline

---

## 🧪 EDGE CASES & ERROR HANDLING

### ✅ Bem Tratados

1. **User não autenticado**
   - Redirect para /auth em todas as páginas protegidas
   - Verificado via `useAuth()` hook

2. **Child profile não selecionado**
   - Fallback para primeiro profile automaticamente
   - UI mostra prompt para criar profile se não houver nenhum

3. **Rate limit API error**
   - Fail open (permite acesso em caso de erro)
   - Log de erro para debugging

4. **PWA update em rotas específicas**
   - Exclui `/auth`, `/quiz`, `/onboarding`
   - Não mostra update logo após atualizar (flag `pwa_just_updated`)

### ⚠️ Parcialmente Tratados

5. **Ebook content malformed**
   - Fallback para hardcoded content
   - Mas não há validação de estrutura de JSON

6. **API externa falha (YouTube)**
   - OptimizedYouTubePlayer tem error state
   - Mas não há retry automático

### ❌ Não Tratados

7. **Child deletado em outra tab**
   - localStorage pode ficar com ID inválido
   - Precisa de storage event listener

8. **Network timeout em queries longas**
   - React Query tem timeout padrão, mas não customizado

9. **Concurrent updates em favorites/collections**
   - Múltiplas tabs podem ter estado inconsistente

---

## 📝 NOTAS FINAIS

### Arquitetura Geral
O aplicativo segue boas práticas de React com separação clara de concerns (hooks, contexts, components, pages). A maioria dos problemas identificados são de lógica de negócio e validação, não de arquitetura.

### Segurança
Admin panel tem verificação server-side correta (RPC). Input sanitization está presente em pontos críticos (quiz, update messages). Maior risco é CSRF/XSS em community posts se não houver sanitization no backend.

### Performance
Uso adequado de React Query para caching. Alguns pontos podem se beneficiar de `staleTime` maior. Skeletons bem implementados melhoram perceived performance.

### Manutenibilidade
Código bem organizado e comentado. Uso de TypeScript ajuda a prevenir erros. Falta documentação de funções complexas (ex: streak calculation).

---

**FIM DA AUDITORIA - PARTE 6/6**

