# 🐛 Bug Analysis: Quiz Loop After Completion

## Descrição do Problema
O usuário completa o quiz mas continua sendo redirecionado para `/quiz` mesmo após conclusão.

## Causa Raiz Identificada

### 1. Race Condition no Cache do React Query

**Arquivo**: `src/hooks/useUserProfile.ts:95-99`
```typescript
staleTime: 30 * 1000, // 30 seconds
gcTime: 5 * 60 * 1000, // 5 minutes cache
retry: 1,
refetchOnMount: true,
refetchOnWindowFocus: true,
```

**Problema**: O cache tem `staleTime` de 30 segundos. Se o usuário completar o quiz e for redirecionado em menos de 30 segundos, o React Query pode usar os dados em cache (que ainda mostram `quiz_completed: false`) ao invés de buscar dados frescos do banco.

### 2. RefreshUser Não Aguarda Refetch Completar

**Arquivo**: `src/hooks/useUserProfile.ts:107-122`
```typescript
export function useRefreshProfile() {
  const queryClient = useQueryClient();

  return async (userId: string) => {
    // Invalidate and force refetch, including inactive queries
    await queryClient.invalidateQueries({
      queryKey: ['user-profile', userId],
      exact: true,
    });
    await queryClient.refetchQueries({
      queryKey: ['user-profile', userId],
      type: 'all',
      exact: true,
    });
  };
}
```

**Problema**: O `refetchQueries()` retorna uma Promise, mas não há garantia de que os dados já foram atualizados no cache quando ela resolve. A navegação acontece imediatamente após.

### 3. Delay Insuficiente para Propagação

**Arquivo**: `src/pages/Quiz.tsx:254-255`
```typescript
// ✅ FIX: Step 7 - Small delay to ensure state propagation
await new Promise(resolve => setTimeout(resolve, 100));
```

**Problema**: 100ms pode não ser suficiente para:
- React Query refetchar os dados
- Supabase processar a query
- O componente ProtectedRoute re-renderizar com novos dados

### 4. Múltiplas Fontes de Verdade

O sistema verifica `quiz_completed` em 3 lugares diferentes:
1. **Banco de dados** (Supabase `profiles` table) - Fonte primária
2. **React Query cache** (`useUserProfile`) - Pode estar desatualizado
3. **sessionStorage** (`quizJustCompletedAt`) - Bypass temporário de 2 minutos

Se o cache do React Query não for atualizado a tempo, o ProtectedRoute lê `quiz_completed: false` do cache e redireciona para `/quiz`.

## Fluxo do Bug

```
1. Usuário completa quiz
   ↓
2. Quiz.tsx atualiza DB: quiz_completed = true ✅
   ↓
3. Quiz.tsx invalida cache do React Query
   ↓
4. Quiz.tsx chama refreshUser() (inicia refetch)
   ↓
5. Quiz.tsx espera 100ms
   ↓
6. Quiz.tsx navega para "/"
   ↓
7. ProtectedRoute renderiza
   ↓
8. ProtectedRoute lê user.quiz_completed
   ↓
9. React Query ainda tem dados antigos em cache! ❌
   (refetch não completou a tempo)
   ↓
10. ProtectedRoute vê quiz_completed: false
    ↓
11. Redireciona para /quiz ❌
```

## Por Que o SessionStorage Nem Sempre Funciona

**Arquivo**: `src/components/ProtectedRoute.tsx:29-35`
```typescript
const quizCompletedAt = Number(sessionStorage.getItem('quizJustCompletedAt') || 0);
const withinTTL = quizCompletedAt > 0 && (Date.now() - quizCompletedAt) < 120000; // 2 minutes

// ✅ FIX: Clear sessionStorage if quiz is confirmed completed in database
if (user.quiz_completed && quizCompletedAt > 0) {
  sessionStorage.removeItem('quizJustCompletedAt');
}
```

**Problema**: Se o cache do React Query retornar `quiz_completed: false` (dados antigos), a linha 33 nunca executa e o sessionStorage não é limpo. Na próxima navegação (após 2 minutos), o bypass expira e o loop recomeça.

## Evidências de Tentativas de Correção

O código mostra várias tentativas anteriores de corrigir este bug:

1. ✅ Comentários "FIX" no Quiz.tsx (linhas 211, 236, 248, 254, 260)
2. ✅ staleTime reduzido de 5min para 30s no useUserProfile.ts
3. ✅ Delay de 100ms antes da navegação
4. ✅ SessionStorage como bypass temporário
5. ✅ Invalidação e refetch explícitos

Mas nenhuma corrigiu completamente porque a race condition persiste.

## Soluções Propostas

### Solução 1: Aguardar Refetch Completar (RECOMENDADA)
```typescript
// Em useUserProfile.ts
export function useRefreshProfile() {
  const queryClient = useQueryClient();

  return async (userId: string) => {
    // Invalidate primeiro
    queryClient.invalidateQueries({
      queryKey: ['user-profile', userId],
      exact: true,
    });

    // Aguardar refetch completar E os dados estarem atualizados
    await queryClient.refetchQueries({
      queryKey: ['user-profile', userId],
      type: 'active',
      exact: true,
    });

    // ✅ NOVO: Garantir que os dados frescos estão no cache
    await new Promise(resolve => setTimeout(resolve, 300));
  };
}
```

### Solução 2: Usar Optimistic Update Mais Agressivo
```typescript
// Em Quiz.tsx, após atualizar o banco
queryClient.setQueryData(['user-profile', user.profileId], (old: any) => {
  if (!old) return old;
  return {
    ...old,
    quiz_completed: true,
    quiz_in_progress: false
  };
});

// Não esperar refetch, usar dados otimistas
navigate('/', { replace: true });
```

### Solução 3: Reduzir staleTime para 0 em Situações Críticas
```typescript
// Em useUserProfile.ts
export function useUserProfile(userId: string | undefined, email: string | undefined, forceRefresh = false) {
  return useQuery<User | null>({
    queryKey: ['user-profile', userId],
    queryFn: async () => { /* ... */ },
    enabled: !!userId && !!email,
    staleTime: forceRefresh ? 0 : 30 * 1000, // ✅ Forçar refetch se necessário
    // ...
  });
}
```

### Solução 4: Usar Suspense Boundary
```typescript
// Em App.tsx, envolver ProtectedRoute com Suspense
<Suspense fallback={<LoadingScreen />}>
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
</Suspense>
```

## Solução IMEDIATA (Quick Fix)

**Aumentar delay de 100ms para 500ms e estender sessionStorage TTL:**

```typescript
// Em Quiz.tsx:254-255
await new Promise(resolve => setTimeout(resolve, 500)); // Era 100ms
```

```typescript
// Em ProtectedRoute.tsx:30
const withinTTL = quizCompletedAt > 0 && (Date.now() - quizCompletedAt) < 300000; // 5 minutos (era 2min)
```

Isso dá mais tempo para:
- React Query refetchar os dados
- Cache ser atualizado
- Bypass durar o suficiente para múltiplas navegações

## Recomendação Final

**Implementar Solução 1 + Solução 2 combinadas:**
1. Melhorar useRefreshProfile para aguardar completamente
2. Usar optimistic update mais agressivo
3. Aumentar delay para 500ms como fallback
4. Estender sessionStorage TTL para 5 minutos

Isso garante múltiplas camadas de proteção contra a race condition.
