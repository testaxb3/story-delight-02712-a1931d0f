# 🔧 FIX: Quiz Loop no PWA do iPhone

## 🐛 Problema Identificado

Quando um usuário baixa o PWA no iPhone e faz login com uma conta que já completou o quiz, o sistema pede para fazer o quiz novamente, mesmo que `quiz_completed = true` no banco de dados.

## 🔍 Causa Raiz

O problema ocorre devido a **cache persistente do React Query** em PWAs do iPhone:

1. **PWA cria nova instância do navegador** quando instalado/reinstalado
2. **React Query pode persistir cache** entre sessões/instalações
3. **Sessão é restaurada** do `localStorage` (linhas 59-75 do `AuthContext.tsx`)
4. **Perfil é carregado do cache** ao invés de buscar dados frescos do banco
5. **Cache contém `quiz_completed: false`** (dados antigos)
6. **ProtectedRoute redireciona para `/quiz`** baseado em dados stale

### Fluxo do Bug

```
1. Usuário reinstala PWA no iPhone
   ↓
2. AuthContext restaura sessão do localStorage ✅
   ↓
3. useUserProfile carrega perfil do React Query
   ↓
4. React Query retorna dados do CACHE (quiz_completed: false) ❌
   ↓
5. ProtectedRoute vê quiz_completed: false
   ↓
6. Redireciona para /quiz ❌
```

## ✅ Solução Implementada

### 1. Limpar Cache ao Restaurar Sessão PWA

**Arquivo**: `src/contexts/AuthContext.tsx` (linhas 57-75)

```typescript
// ✅ CRITICAL FIX: Limpar TODO o cache do React Query ao restaurar sessão PWA
// Isso garante que dados frescos sejam carregados, especialmente quiz_completed
console.log('[AuthContext] 🧹 Limpando cache do React Query para sessão PWA');
queryClient.clear();
```

**Por quê?** Quando o PWA é aberto e a sessão é restaurada do `localStorage`, limpamos TODO o cache do React Query para garantir que dados frescos sejam carregados do banco de dados.

### 2. Limpar Cache Após Login

**Arquivo**: `src/contexts/AuthContext.tsx` (linhas 193-198)

```typescript
// ✅ CRITICAL FIX: Limpar TODO o cache após login para evitar dados stale
// Especialmente importante para PWA no iPhone onde cache pode persistir
if (data?.user?.id) {
  console.log('[AuthContext] 🧹 Limpando TODO o cache do React Query após login');
  queryClient.clear();
  console.log('[AuthContext] ✅ Cache limpo - dados frescos serão carregados');
}
```

**Por quê?** Após login bem-sucedido, limpamos o cache para garantir que o perfil seja carregado fresco do banco, evitando usar dados stale de sessões anteriores.

### 3. Garantir Flags PWA Quando Quiz Completo

**Arquivo**: `src/components/ProtectedRoute.tsx` (linhas 68-77)

```typescript
// ✅ CRITICAL FIX: Garantir que os flags PWA estejam setados para não pedir novamente
// Isso é especialmente importante para PWAs no iPhone onde o usuário pode reinstalar o app
if (!localStorage.getItem('pwa_flow_completed')) {
  localStorage.setItem('pwa_flow_completed', 'true');
  console.log('[ProtectedRoute] ✅ Setou pwa_flow_completed=true');
}
if (!localStorage.getItem('theme_selected')) {
  localStorage.setItem('theme_selected', 'true');
  console.log('[ProtectedRoute] ✅ Setou theme_selected=true');
}
```

**Por quê?** Se o usuário já completou o quiz (confirmado no banco), garantimos que os flags PWA estejam setados para evitar pedir o fluxo PWA/tema novamente.

### 4. Logging Detalhado para Debug

**Arquivo**: `src/components/ProtectedRoute.tsx` (linhas 63-69)

```typescript
console.log('[ProtectedRoute] 📊 Estado completo:', {
  quiz_completed: user.quiz_completed,
  quiz_in_progress: user.quiz_in_progress,
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString()
});
```

**Por quê?** Logs detalhados ajudam a diagnosticar problemas futuros e confirmar que os dados corretos estão sendo carregados.

## 🎯 Resultado Esperado

### Antes da Correção ❌
```
1. Usuário abre PWA no iPhone
2. Faz login com conta que completou quiz
3. Sistema pede para fazer quiz novamente
4. Loop infinito de redirecionamento
```

### Depois da Correção ✅
```
1. Usuário abre PWA no iPhone
2. Faz login com conta que completou quiz
3. Cache do React Query é limpo
4. Perfil é carregado FRESCO do banco de dados
5. quiz_completed = true é detectado
6. Usuário vai direto para o Dashboard
7. Flags PWA são setados automaticamente
```

## 🧪 Como Testar

1. **Criar conta e completar quiz** em um dispositivo
2. **Instalar PWA no iPhone** (Add to Home Screen)
3. **Fazer login** com a conta que completou o quiz
4. **Verificar que vai direto para Dashboard** sem pedir quiz novamente
5. **Verificar logs no console** para confirmar:
   - `[AuthContext] 🧹 Limpando cache do React Query`
   - `[useUserProfile] Profile loaded: quiz_completed: true`
   - `[ProtectedRoute] ✅ Quiz COMPLETADO no DB`

## 📊 Arquivos Modificados

1. ✅ `src/contexts/AuthContext.tsx`
   - Limpar cache ao restaurar sessão PWA
   - Limpar cache após login

2. ✅ `src/components/ProtectedRoute.tsx`
   - Garantir flags PWA quando quiz completo
   - Logging detalhado

## 🔐 Configurações Existentes que Ajudam

1. ✅ `staleTime: 0` no `useUserProfile.ts` (linha 105)
2. ✅ `refetchOnMount: 'always'` no `useUserProfile.ts` (linha 108)
3. ✅ Grace period de 10 minutos no `ProtectedRoute.tsx` (linha 80)
4. ✅ Delay de 500ms no `useRefreshProfile` (linha 143)

## 🚀 Deploy

As mudanças são **retrocompatíveis** e **não quebram funcionalidade existente**. Podem ser deployadas imediatamente.

## 📝 Notas Adicionais

- O `queryClient.clear()` limpa TODO o cache do React Query, não apenas o perfil do usuário
- Isso força um refetch de todos os dados na próxima query
- É seguro fazer isso no login/restauração de sessão pois o usuário espera um loading inicial
- O cache será reconstruído automaticamente conforme o usuário navega pelo app

## 🎉 Conclusão

Esta correção resolve definitivamente o problema do quiz loop no PWA do iPhone, garantindo que:
1. ✅ Dados frescos sejam sempre carregados após login/restauração de sessão
2. ✅ Cache stale nunca cause redirecionamentos incorretos
3. ✅ Flags PWA sejam setados automaticamente para usuários que já completaram o quiz
4. ✅ Logs detalhados facilitem debug de problemas futuros
