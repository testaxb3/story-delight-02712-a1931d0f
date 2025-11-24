# 📊 Análise Sistemática Fullstack - Fluxo de Onboarding
## NEP AI - Do Registro ao Dashboard

**Data da Análise:** 2025-11-24
**Analista:** Claude (Sonnet 4.5)

---

## 🗺️ Mapa Completo do Fluxo

```
┌─────────────┐
│   /auth     │ ← Ponto de entrada
│  (Sign Up)  │
└──────┬──────┘
       │
       ↓ [User created in Supabase Auth]
       │
┌──────┴──────────┐
│  /pwa-install   │ (Opcional - detecta device)
└──────┬──────────┘
       │
       ↓
┌──────┴────────────┐
│  /theme-selection │ (Escolher Light/Dark)
└──────┬────────────┘
       │
       ↓
┌──────┴──────┐
│   /quiz     │ (Multi-step: Name → Details → Goals → Speed → Challenge → Questions)
└──────┬──────┘
       │
       ↓ [Child Profile Created + quiz_completed=true]
       │
┌──────┴──────────┐
│   /dashboard    │ ← Destino final
│   (Dashboard)   │
└─────────────────┘
```

---

## 1️⃣ FASE 1: Autenticação (/auth)

### 📄 **Arquivo:** `src/pages/Auth.tsx`

### ✅ **Funcionalidades:**
- **Sign Up / Sign In** toggle
- Rate limiting (5 tentativas por minuto)
- Validação com Zod (`loginSchema`)
- Feedback visual durante carregamento
- Haptic feedback

### 🔄 **Fluxo:**
1. Usuário preenche email/senha
2. Validação client-side com Zod
3. Chamada: `signUp(email, password)` ou `signIn(email, password)`
4. **Se Sign Up:**
   - Usuário criado no Supabase Auth
   - Profile criado automaticamente via trigger `on_auth_user_created`
   - Redirect para `/onboarding` após 600ms
5. **Se Sign In:**
   - Redirect para `/` após 600ms

### 🗄️ **Database Operations:**
```sql
-- Trigger automático no Supabase
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Cria entrada em profiles table
INSERT INTO profiles (id, email, created_at)
VALUES (NEW.id, NEW.email, NOW());
```

### ⚠️ **Issues Identificadas:**
1. ❌ **PWA Onboarding obsoleto**: Rota `/onboarding` (PWAOnboarding.tsx) não é mais usada
2. ❌ **Delay hardcoded**: 600ms pode não ser suficiente em conexões lentas
3. ⚠️ **Toast em português**: "Você precisa estar logado" está em PT-BR

---

## 2️⃣ FASE 2: PWA Installation (/pwa-install)

### 📄 **Arquivo:** `src/pages/PWAInstall.tsx` (provavelmente)

### ✅ **Funcionalidades:**
- Detecta tipo de device (iOS/Android/Desktop)
- Mostra vídeo tutorial específico para cada plataforma
- YouTube player otimizado

### 🔄 **Fluxo:**
1. User lands here se `pwa_flow_completed !== 'true'`
2. Vê vídeo de instalação
3. Clica "Continue" → `localStorage.setItem('pwa_flow_completed', 'true')`
4. Redirect para `/theme-selection`

### ⚠️ **Issues Identificadas:**
1. ⚠️ **Pode ser pulado**: Não há validação se PWA foi realmente instalado
2. ⚠️ **LocalStorage não sincronizado**: Se user troca de device, precisa refazer
3. ❓ **Necessidade questionável**: Muitos apps não fazem onboarding PWA obrigatório

---

## 3️⃣ FASE 3: Theme Selection (/theme-selection)

### 📄 **Arquivo:** `src/pages/ThemeSelection.tsx` (provavelmente)

### ✅ **Funcionalidades:**
- Escolha entre Light/Dark theme
- Preview visual
- Salva no `localStorage` e `ThemeContext`

### 🔄 **Fluxo:**
1. User seleciona tema
2. `setTheme(selectedTheme)` → salva no localStorage
3. `localStorage.setItem('theme_selected', 'true')`
4. Redirect para `/quiz`

### ⚠️ **Issues Identificadas:**
1. ⚠️ **Não sincronizado com database**: Preferência não é salva no perfil do usuário
2. ⚠️ **Pode perder preferência**: Se limpar localStorage, perde a escolha

---

## 4️⃣ FASE 4: Quiz (/quiz) - **CRÍTICO**

### 📄 **Arquivos Principais:**
- `src/pages/Quiz.tsx`
- `src/hooks/useQuizSubmission.ts`
- `src/hooks/useQuizState.ts`
- `src/hooks/useQuizValidation.ts`
- `src/lib/quizQuestions.ts`

### 📝 **Steps do Quiz:**

#### **Step 1: Name** (`QuizNameStep`)
- Input: Nome da criança
- Validação: Nome não vazio, sanitização

#### **Step 2: Details** (`QuizDetailsStep`)
- Input: Idade da criança
- Validação: Idade entre limites permitidos

#### **Step 3: Goals** (`QuizGoalsStep`)
- Input: Objetivos dos pais (múltipla escolha)
- Ex: "Reduce tantrums", "Improve sleep", etc.

#### **Step 4: Speed** (`QuizSpeedSlider`)
- Input: Velocidade do resultado (slow/balanced/intensive)
- Afeta quão rápido o programa avança

#### **Step 5: Challenge** (`QuizChallengeStep`)
- Input:
  - Challenge Level (1-10)
  - Challenge Duration (tempo do desafio)
  - Tried Approaches (o que já tentou)

#### **Step 6: Questions** (`QuizQuestionStep`)
- **20 perguntas** sobre comportamento da criança
- Opções: A/B/C/D
- Cada resposta tem peso para calcular Brain Profile

### 🧮 **Cálculo do Brain Profile:**

```typescript
// Simplified logic from quizQuestions.ts
calculateResult(answers) {
  const scores = {
    INTENSE: 0,
    DISTRACTED: 0,
    DEFIANT: 0,
  };

  answers.forEach((answer, index) => {
    const question = quizQuestions[index];
    const weights = question.options[answer].weights;

    scores.INTENSE += weights.INTENSE;
    scores.DISTRACTED += weights.DISTRACTED;
    scores.DEFIANT += weights.DEFIANT;
  });

  // Retorna o tipo com maior pontuação
  return Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );
}
```

### 🗄️ **Database Operations:**

#### **1. Criar Child Profile**
```sql
INSERT INTO child_profiles (
  name,
  brain_profile,
  parent_id,
  age,
  parent_goals,
  challenge_level,
  challenge_duration,
  tried_approaches,
  result_speed
) VALUES (...);
```

#### **2. Marcar Quiz como Completo**
```sql
UPDATE profiles
SET
  quiz_completed = true,
  quiz_in_progress = false
WHERE id = user_id;
```

### 🔄 **Fluxo de Submissão (useQuizSubmission):**

```typescript
completeQuiz(data) {
  // 1. Optimistic update (cache)
  queryClient.setQueryData(['user-profile', user.id], {
    quiz_completed: true,
    quiz_in_progress: false
  });

  // 2. Salvar Child Profile
  const profile = await saveChildProfile(data);

  // 3. Marcar quiz como completo
  await markQuizCompleted();

  // 4. Set grace period (10 minutos)
  sessionStorage.setItem('quizJustCompletedAt', Date.now());

  // 5. Refresh user data
  await refreshUser();

  // 6. Set active child
  setActiveChild(profile);
}
```

### ⚠️ **Issues Identificadas:**

#### 🔴 **CRÍTICAS:**

1. **Race Condition no Quiz Completion:**
   - `handleCompleteQuiz()` pode ser chamado múltiplas vezes pelo countdown
   - **Fix aplicado**: Guard no useEffect (linha 90-104)

2. **Grace Period Inconsistente:**
   - SessionStorage não sincroniza entre tabs
   - Se user abre nova tab, perde o grace period
   - **Solução**: Usar `quiz_completed` do DB como source of truth

3. **Validação de Nome Duplicado:**
   - Permite criar múltiplos perfis com mesmo nome
   - Mostra erro mas não previne UX ruim
   - **Recomendação**: Adicionar validação em tempo real

4. **Toast Messages em Português:**
   ```typescript
   toast.error('Você precisa estar logado para salvar o perfil.');
   toast.error('Erro ao salvar conclusão do quiz.');
   ```
   **Fix**: Internacionalização (i18n)

#### ⚠️ **MODERADAS:**

5. **Logs de Debug em Produção:**
   - Múltiplos `console.log` no código
   - **Recomendação**: Usar `logger.debug()` e remover em build production

6. **Timeout Hardcoded:**
   ```typescript
   setTimeout(() => navigate('/onboarding'), 600);
   ```
   **Problema**: Se network está lenta, pode navegar antes de propagar

7. **Falta Rollback em Erro:**
   - Se `markQuizCompleted()` falha mas profile foi criado
   - User fica com child profile mas quiz não marcado completo
   - **Recomendação**: Transaction ou rollback manual

#### ℹ️ **MENORES:**

8. **Animações Desnecessárias:**
   - Quiz tem muitas telas motivacionais intermediárias
   - User pode querer pular direto
   - **Sugestão**: Botão "Skip" mais visível

9. **Validação de Idade:**
   - Não há limite superior claro
   - Permitir idade negativa?

---

## 5️⃣ FASE 5: Protected Route Logic

### 📄 **Arquivo:** `src/components/ProtectedRoute.tsx`

### 🔒 **Lógica de Proteção:**

```typescript
// Ordem de verificação:
1. Loading? → Mostrar spinner
2. No user? → Redirect /auth
3. PWA flow não completo? → Redirect /pwa-install
4. Tema não selecionado? → Redirect /theme-selection
5. Quiz completo no DB? → ✅ Permitir acesso
6. Dentro do grace period? → ✅ Permitir acesso
7. Não completou quiz E não está em rota de quiz? → Redirect /quiz
8. Default → Permitir acesso
```

### ⚠️ **Issues Identificadas:**

1. **Múltiplas Checagens de LocalStorage:**
   - `pwa_flow_completed`
   - `theme_selected`
   - `quizJustCompletedAt` (sessionStorage)
   - **Problema**: Não sincroniza com database, pode causar bugs

2. **Grace Period de 10 Minutos:**
   - Muito tempo! User pode recarregar várias vezes
   - **Recomendação**: Reduzir para 2-3 minutos

3. **Auto-set PWA Flags após Quiz:**
   ```typescript
   if (!localStorage.getItem('pwa_flow_completed')) {
     localStorage.setItem('pwa_flow_completed', 'true');
   }
   ```
   **Problema**: Contorna validação PWA, tornando-a inútil

4. **Logs de Debug:**
   - Múltiplos console.log em produção
   - Expõe informações sensíveis (userId, email)

---

## 6️⃣ FASE 6: Dashboard (/dashboard)

### 📄 **Arquivo:** `src/pages/DashboardCalAI.tsx`

### ✅ **O que acontece:**
1. User lands no dashboard pela primeira vez
2. `useChildProfiles()` carrega o active child
3. `useDashboardStats()` busca estatísticas
4. Mostra WelcomeGiftModal (se aplicável)
5. Renderiza UI

### 🗄️ **Database Queries:**

```sql
-- 1. Buscar child profiles
SELECT * FROM child_profiles
WHERE parent_id = user_id;

-- 2. Buscar dashboard stats (view)
SELECT * FROM dashboard_stats
WHERE user_id = user_id;

-- 3. Buscar scripts para o brain profile
SELECT * FROM scripts
WHERE profile = brain_profile;

-- 4. Buscar recent script usage
SELECT * FROM script_usage
WHERE user_id = user_id
ORDER BY used_at DESC
LIMIT 3;
```

### ⚠️ **Issues Identificadas:**

1. **Welcome Modal Overlap:**
   - OneSignal initialization pode sobrepor modal
   - **Fix aplicado**: Delay de 3 segundos no OneSignal

2. **Múltiplas Queries:**
   - Dashboard faz 4+ queries simultâneas
   - **Recomendação**: Considerar GraphQL ou query consolidada

---

## 🏗️ ARQUITETURA DO BANCO DE DADOS

### **Tabelas Principais:**

#### **1. profiles** (via Supabase Auth)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  quiz_completed BOOLEAN DEFAULT FALSE,
  quiz_in_progress BOOLEAN DEFAULT FALSE,
  premium BOOLEAN DEFAULT FALSE,
  brain_profile TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **2. child_profiles**
```sql
CREATE TABLE child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brain_profile TEXT NOT NULL, -- INTENSE, DISTRACTED, DEFIANT
  parent_id UUID REFERENCES profiles(id),
  age INTEGER,
  parent_goals TEXT[],
  challenge_level INTEGER,
  challenge_duration TEXT,
  tried_approaches TEXT[],
  result_speed TEXT, -- slow, balanced, intensive
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **3. scripts**
```sql
CREATE TABLE scripts (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  profile TEXT, -- INTENSE, DISTRACTED, DEFIANT
  duration_minutes INTEGER,
  content JSONB, -- estrutura do script
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **4. script_usage**
```sql
CREATE TABLE script_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  script_id UUID REFERENCES scripts(id),
  child_profile_id UUID REFERENCES child_profiles(id),
  used_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **5. tracker_days**
```sql
CREATE TABLE tracker_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  child_profile_id UUID REFERENCES child_profiles(id),
  date DATE,
  day_number INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
  meltdown_count TEXT, -- '0', '1', '2', '3+'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **6. dashboard_stats** (View)
```sql
CREATE VIEW dashboard_stats AS
SELECT
  p.id AS user_id,
  -- agregações de tracker_days, script_usage, etc
  ...
FROM profiles p
LEFT JOIN tracker_days td ON ...
LEFT JOIN script_usage su ON ...;
```

### 🔗 **Relationships:**

```
profiles (1) ←→ (N) child_profiles
profiles (1) ←→ (N) script_usage
child_profiles (1) ←→ (N) script_usage
child_profiles (1) ←→ (N) tracker_days
scripts (1) ←→ (N) script_usage
```

---

## 📊 RESUMO DE PROBLEMAS E RECOMENDAÇÕES

### 🔴 **CRÍTICOS (Resolver Imediatamente):**

1. **Internacionalização:**
   - Toast messages em português
   - **Fix**: Implementar i18n com react-i18next

2. **Race Conditions no Quiz:**
   - Múltiplas chamadas a `handleCompleteQuiz`
   - **Fix**: Guard já aplicado, testar edge cases

3. **LocalStorage vs Database:**
   - PWA/Theme flags não sincronizados
   - **Fix**: Migrar para profiles table

4. **Grace Period Excessivo:**
   - 10 minutos é muito tempo
   - **Fix**: Reduzir para 2-3 minutos

### ⚠️ **IMPORTANTES (Próxima Sprint):**

5. **Logs de Debug:**
   - Remover console.log em produção
   - **Fix**: Usar logger.debug() + env check

6. **Onboarding Redundante:**
   - PWA flow é desnecessário?
   - **Fix**: Considerar remover ou tornar opcional

7. **Validação de Nome:**
   - Permitir duplicatas é confuso
   - **Fix**: Validação em tempo real

8. **Rollback em Erro:**
   - Child profile criado mas quiz não marcado
   - **Fix**: Transaction ou cleanup

### ℹ️ **MELHORIAS (Backlog):**

9. **Performance:**
   - Consolidar queries do dashboard
   - **Fix**: GraphQL ou view otimizada

10. **UX:**
    - Quiz muito longo
    - **Fix**: Progress bar mais claro, skip buttons

11. **Segurança:**
    - Rate limiting só no client
    - **Fix**: Implementar no backend também

---

## 🎯 AÇÕES RECOMENDADAS

### **Sprint 1: Critical Fixes**
- [ ] Implementar i18n (react-i18next)
- [ ] Migrar PWA/Theme flags para database
- [ ] Reduzir grace period para 2 minutos
- [ ] Remover console.log com env check

### **Sprint 2: Stability**
- [ ] Adicionar rollback em erro de quiz
- [ ] Validação de nome duplicado em tempo real
- [ ] Otimizar queries do dashboard
- [ ] Melhorar error handling

### **Sprint 3: UX**
- [ ] Revisar fluxo PWA (remover?)
- [ ] Simplificar quiz (menos telas)
- [ ] Progress indicators mais claros
- [ ] Testes E2E do fluxo completo

---

## 📈 MÉTRICAS DE SUCESSO

### **Conversão do Funil:**
```
100% → Sign Up
  ↓
 ?% → Complete PWA Flow
  ↓
 ?% → Select Theme
  ↓
 ?% → Start Quiz
  ↓
 ?% → Complete Quiz
  ↓
 ?% → Reach Dashboard
```

**Recomendação:** Implementar analytics para rastrear cada step

### **Performance:**
- Time to Dashboard (first visit): < 30s
- Quiz completion time: < 5 min
- Database queries: < 1s combined

---

## 🔍 CONCLUSÃO

O fluxo de onboarding está **funcionalmente completo** mas tem **várias áreas de melhoria**:

✅ **Pontos Fortes:**
- Fluxo bem estruturado
- Validações client-side robustas
- Animações e UX polidos
- Database schema bem normalizado

❌ **Pontos Fracos:**
- LocalStorage não sincronizado com DB
- Mensagens em português
- Grace period muito longo
- Onboarding PWA questionável
- Logs de debug em produção

**Prioridade:** Focar nos fixes críticos primeiro (i18n, localStorage → DB, grace period)

---

**Análise realizada por:** Claude (Sonnet 4.5)
**Revisão necessária:** Backend engineer + Product owner
