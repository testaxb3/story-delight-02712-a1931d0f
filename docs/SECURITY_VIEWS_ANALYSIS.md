# 🔒 Security Definer Views Analysis

**Data da Análise:** 16/11/2024  
**Status:** Em revisão

---

## 📋 Views Analisadas

### ✅ Views que PODEM ser convertidas para Normal (com RLS)

#### 1. **children_profiles**
- **Tipo:** Alias simples de `child_profiles`
- **Decisão:** ❌ **REMOVER** - Redundante, usar `child_profiles` diretamente
- **Motivo:** View apenas renomeia colunas, não adiciona segurança
- **RLS:** Já existe na tabela base `child_profiles`

#### 2. **community_posts_with_profiles**
- **Tipo:** JOIN de posts com profiles
- **Decisão:** ✅ **CONVERTER** para view normal
- **Motivo:** Apenas JOIN de dados públicos, não precisa bypass de RLS
- **RLS:** Herda das tabelas base

#### 3. **community_posts_with_stats**
- **Tipo:** Posts com agregações (likes_count, comments_count)
- **Decisão:** ✅ **CONVERTER** para view normal
- **Motivo:** Agregações públicas, não sensível
- **RLS:** Herda das tabelas base

#### 4. **ebooks_with_stats**
- **Tipo:** Ebooks com estatísticas agregadas
- **Decisão:** ✅ **CONVERTER** para view normal
- **Motivo:** Estatísticas gerais, não específicas do usuário
- **RLS:** Herda da tabela `ebooks`

#### 5. **emergency_scripts_new**
- **Tipo:** Scripts de emergência com success_rate
- **Decisão:** ✅ **CONVERTER** para view normal
- **Motivo:** Dados agregados públicos
- **RLS:** Herda da tabela `scripts`

#### 6. **public_profiles**
- **Tipo:** Profiles públicos (subset de colunas)
- **Decisão:** ✅ **CONVERTER** para view normal
- **Motivo:** Apenas expõe dados não-sensíveis
- **RLS:** Herda da tabela `profiles`

---

### ⚠️ Views que DEVEM permanecer SECURITY DEFINER

#### 7. **bonuses_with_user_progress** ⚠️
- **Motivo:** Acessa `user_bonuses` filtrado por `auth.uid()`
- **Justificativa:** Precisa juntar dados do usuário atual (progress, completed_at, unlocked_at)
- **Alternativa:** ❌ Não tem alternativa viável - query client-side seria muito complexa
- **Risco:** BAIXO - Apenas expõe dados do próprio usuário
- **Action:** MANTER como SECURITY DEFINER

```sql
-- Exemplo de uso:
SELECT * FROM bonuses_with_user_progress;
-- Retorna bonuses com o progresso DO USUÁRIO LOGADO
```

#### 8. **scripts_card_view** ⚠️
- **Motivo:** Calcula `is_favorite` específico do usuário
- **Justificativa:** Precisa verificar se script está em `user_favorites` do usuário atual
- **Alternativa:** ✅ **PODE SER CONVERTIDA** - Remover campo `is_favorite` e calcular client-side
- **Action:** **CONVERTER** para normal e calcular `is_favorite` no frontend

#### 9. **scripts_with_full_stats** ⚠️
- **Motivo:** Calcula `is_favorite` específico do usuário
- **Justificativa:** Mesma situação que `scripts_card_view`
- **Alternativa:** ✅ **PODE SER CONVERTIDA** - Remover `is_favorite` e calcular client-side
- **Action:** **CONVERTER** para normal

#### 10. **user_recent_ebooks** ⚠️
- **Motivo:** Filtra por `auth.uid()` em `user_ebook_progress`
- **Justificativa:** Retorna apenas ebooks do usuário atual
- **Alternativa:** ❌ Não tem alternativa - precisa do filtro
- **Action:** MANTER como SECURITY DEFINER

---

## 🎯 Plano de Ação

### Fase 1: Conversões Seguras (6 views)
```sql
-- 1. DROP views que serão recriadas como normais
DROP VIEW IF EXISTS public.community_posts_with_profiles;
DROP VIEW IF EXISTS public.community_posts_with_stats;
DROP VIEW IF EXISTS public.ebooks_with_stats;
DROP VIEW IF EXISTS public.emergency_scripts_new;
DROP VIEW IF EXISTS public.public_profiles;
DROP VIEW IF EXISTS public.children_profiles; -- Esta será removida

-- 2. Recriar como views normais (sem SECURITY DEFINER)
-- Views serão recriadas com SECURITY INVOKER (padrão)
```

### Fase 2: Views com is_favorite (2 views)
```sql
-- Remover campo is_favorite das views
-- Calcular no frontend usando hook useFavoriteScripts
```

### Fase 3: Views que permanecem (2 views)
- ✅ `bonuses_with_user_progress` - JUSTIFICADO
- ✅ `user_recent_ebooks` - JUSTIFICADO

---

## 📊 Resultado Esperado

| Antes | Depois | Melhoria |
|-------|--------|----------|
| 10 Security Definer Views | 2 Security Definer Views | 80% redução |
| Alto risco de privilege escalation | Risco mínimo | ✅ Seguro |
| Difícil auditoria | Fácil auditoria | ✅ Rastreável |

---

## ✅ Validação Pós-Migration

```sql
-- Verificar views restantes com SECURITY DEFINER
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND view_definition ILIKE '%security definer%';

-- Deve retornar apenas:
-- - bonuses_with_user_progress
-- - user_recent_ebooks
```

---

## 🔐 Análise de Risco

### Risco ALTO (Antes): ⚠️
- 10 views bypassando RLS
- Difícil auditoria de acessos
- Potencial para privilege escalation

### Risco BAIXO (Depois): ✅
- Apenas 2 views com justificativa clara
- RLS enforced em 80% das views
- Fácil auditoria e manutenção

---

## 📝 Próximos Passos

1. ✅ Documentação criada
2. ⏳ Criar migration para conversão
3. ⏳ Testar em development
4. ⏳ Deploy em produção
5. ⏳ Validar com linter
6. ✅ Atualizar documentação do projeto
