# 🔒 Security Definer Functions - Analysis & Justifications

**Data da Análise:** 15/11/2025  
**Responsável:** Dev Team  
**Status:** Em Revisão

## 📋 Executive Summary

Todas as tabelas do banco têm RLS habilitado ✅  
Total de funções SECURITY DEFINER identificadas: ~40+  
Classificação: 
- ✅ **Necessário (Keep)**: Funções que PRECISAM bypass RLS
- ⚠️ **Revisar**: Funções que podem não precisar
- ❌ **Remover**: Funções que NÃO precisam de SECURITY DEFINER

---

## ✅ SECURITY DEFINER NECESSÁRIO (Keep)

### 1. Funções de Admin/Authorization

#### `is_admin()`
**Status:** ✅ KEEP  
**Justificativa:** Precisa verificar permissões sem expor lógica de auth ao cliente.  
**Risco:** Baixo - apenas retorna boolean  
**Uso:** Várias funções dependem desta

#### `has_role(_user_id uuid, _role app_role)`
**Status:** ✅ KEEP  
**Justificativa:** Precisa consultar user_roles sem que usuário veja outros roles  
**Risco:** Baixo - apenas verifica se role existe

#### `require_admin()`
**Status:** ✅ KEEP  
**Justificativa:** Gate-keeper de funções admin - precisa SECURITY DEFINER para funcionar corretamente

### 2. Funções de Notificações

#### `send_notification(...)`
**Status:** ✅ KEEP  
**Justificativa:** 
- Precisa inserir notificações para outros usuários
- Usuário A curtindo post de B precisa criar notificação para B
- RLS não permite inserir notificação para outro user_id
**Risco:** Médio - validação de que não há spam/abuse
**Mitigação:** Já tem checks para evitar self-notifications

#### `notify_on_post_like()`, `notify_on_comment()`, `notify_on_follow()`
**Status:** ✅ KEEP  
**Justificativa:** Triggers que criam notificações cross-user
**Dependência:** Usa `send_notification()`

### 3. Funções de Stats/Counters

#### `update_user_stats()`
**Status:** ✅ KEEP  
**Justificativa:**
- Trigger que atualiza contadores em profiles (posts_count, comments_count, likes_received)
- Precisa atualizar profile de outro usuário quando recebe like
**Risco:** Baixo - apenas incrementa/decrementa contadores

#### `update_follower_counts()`
**Status:** ✅ KEEP  
**Justificativa:** Atualiza counters de followers/following em ambos profiles

#### `update_comment_replies_count()`
**Status:** ✅ KEEP  
**Justificativa:** Atualiza contador de replies em comentário pai

### 4. Funções de Profile Access

#### `get_profile_data(profile_user_id uuid)`
**Status:** ⚠️ REVISAR  
**Justificativa:** 
- Retorna dados de perfil com regras de privacidade
- Email/premium status só para owner ou admin
**Preocupação:** Poderia ser feito com RLS policies mais elaboradas?
**Decisão:** KEEP por enquanto - complexidade das regras justifica

#### `save_child_profile(...)`
**Status:** ✅ KEEP  
**Justificativa:**
- Upsert em profiles E user_progress de forma transacional
- Precisa garantir consistência entre tabelas
**Risco:** Médio - aceita dados do usuário
**Mitigação:** Usa COALESCE e sanitização

### 5. Funções Admin

#### `archive_bonus()`, `restore_bonus()`
**Status:** ✅ KEEP  
**Justificativa:** Apenas admins podem arquivar/restaurar bonuses
**Segurança:** Usa `is_admin()` check

#### `force_app_update()`, `get_update_statistics()`, `clear_force_update_flag()`
**Status:** ✅ KEEP  
**Justificativa:** Funções admin para gerenciar updates do app
**Segurança:** Todas verificam `is_admin()`

#### `admin_delete_script()`
**Status:** ✅ KEEP  
**Justificativa:** Apenas admins podem deletar scripts
**Segurança:** Usa `require_admin()`

### 6. Funções de Access Control

#### `can_access_script()`
**Status:** ✅ KEEP  
**Justificativa:**
- Verifica rate limiting de scripts para free users
- Precisa consultar script_usage e profiles de forma segura
**Risco:** Baixo - apenas leitura

#### `get_remaining_script_accesses()`
**Status:** ✅ KEEP  
**Justificativa:** Similar a `can_access_script()` - retorna info de rate limit
**Risco:** Baixo - apenas leitura

---

## ⚠️ REVISAR (Needs Evaluation)

### 1. Funções de Leitura Agregada

#### `get_user_collection_counts()`
**Status:** ⚠️ REVISAR  
**Análise:**
- Retorna contadores de child_profiles, feedback, posts, comments
- Todos são dados do próprio usuário
- **Pergunta:** Por que precisa SECURITY DEFINER se RLS já restringe a auth.uid()?
**Recomendação:** Testar se funciona SEM SECURITY DEFINER

#### `verify_schema_fixes()`
**Status:** ⚠️ REVISAR  
**Análise:**
- Apenas verifica schema/metadados do banco
- Não acessa dados sensíveis de usuários
**Recomendação:** Remover SECURITY DEFINER - pode ser view pública

#### `get_app_version()`, `acknowledge_app_update()`, `check_user_needs_update()`
**Status:** ⚠️ REVISAR  
**Análise:**
- `get_app_version()`: Apenas lê app_config (público)
- `acknowledge_app_update()`: Atualiza apenas próprio user_id
- `check_user_needs_update()`: Lê próprio user_id
**Recomendação:** Testar sem SECURITY DEFINER

### 2. Funções de Busca/Query

#### `search_scripts_natural()`
**Status:** ⚠️ REVISAR  
**Análise:**
- Apenas busca scripts (tabela pública)
- Não acessa dados sensíveis
**Recomendação:** Remover SECURITY DEFINER

#### `get_sos_script()`
**Status:** ⚠️ REVISAR  
**Análise:**
- Retorna script para situação de emergência
- Usa dados próprios do usuário (script_feedback, script_usage)
**Recomendação:** Testar sem SECURITY DEFINER (RLS deve bastar)

---

## 🔧 PLANO DE AÇÃO

### Fase 1: Testes de Segurança (Esta Semana)

1. **Identificar funções candidatas à remoção**
   ```sql
   -- Funções que APENAS leem dados do próprio user
   - get_user_collection_counts()
   - acknowledge_app_update()
   - check_user_needs_update()
   
   -- Funções que leem dados públicos
   - get_app_version()
   - search_scripts_natural()
   - verify_schema_fixes()
   ```

2. **Processo de teste para cada função:**
   ```sql
   -- 1. Criar versão sem SECURITY DEFINER
   CREATE OR REPLACE FUNCTION public.function_name_v2()
   RETURNS ... -- mesmo tipo
   LANGUAGE plpgsql
   -- SEM SECURITY DEFINER
   AS $function$
   -- mesma implementação
   $function$;
   
   -- 2. Testar com usuário não-admin
   SET ROLE authenticated_user;
   SELECT function_name_v2();
   
   -- 3. Verificar se funciona e se RLS está funcionando corretamente
   
   -- 4. Se OK, substituir função original
   -- 5. Se FALHAR, documentar por que precisa SECURITY DEFINER
   ```

### Fase 2: Documentação (Próxima Semana)

1. Criar `SECURITY_DEFINER_JUSTIFICATIONS.md` final
2. Adicionar comments em cada função justificando SECURITY DEFINER
3. Adicionar tests de segurança automatizados

### Fase 3: Monitoring (Contínuo)

1. Alertas para novas funções SECURITY DEFINER criadas
2. Review obrigatório em PRs que adicionam SECURITY DEFINER
3. Audit anual de funções SECURITY DEFINER

---

## 📊 RESUMO POR PRIORIDADE

### 🚀 Prioridade Alta (Testar Esta Semana)
- [ ] `get_user_collection_counts()` - Provavelmente não precisa
- [ ] `get_app_version()` - Lê config público
- [ ] `verify_schema_fixes()` - Apenas metadados

### 🔄 Prioridade Média (Próximas 2 Semanas)  
- [ ] `search_scripts_natural()` - Busca em tabela pública
- [ ] `get_sos_script()` - Usa apenas dados próprios
- [ ] `acknowledge_app_update()` - Atualiza apenas próprio registro
- [ ] `check_user_needs_update()` - Lê apenas próprios dados

### ⏳ Prioridade Baixa (Manter monitoramento)
- Funções de notificação (KEEP)
- Funções de stats/counters (KEEP)
- Funções admin (KEEP)
- Funções de access control (KEEP)

---

## ⚠️ RISCOS IDENTIFICADOS

### Risco 1: Funções que Aceitam Inputs do Usuário
**Funções afetadas:**
- `save_child_profile()` - Aceita name, email, etc
- `send_notification()` - Aceita message, title

**Mitigação:**
- ✅ Input sanitization já implementado
- ⚠️ Adicionar rate limiting
- ⚠️ Adicionar validation de tamanho de strings

### Risco 2: Funções de Contadores
**Funções afetadas:**
- `update_user_stats()`
- `update_follower_counts()`

**Preocupação:** Race conditions em alto tráfego

**Mitigação:**
- ✅ Usa `GREATEST(0, count - 1)` para evitar negativos
- ⚠️ Considerar usar `pg_advisory_lock` para alto tráfego

### Risco 3: Funções Admin sem Rate Limit
**Funções afetadas:**
- `force_app_update()`
- `archive_bonus()`

**Mitigação:**
- ⚠️ Adicionar rate limiting no nível da aplicação
- ⚠️ Adicionar logging de todas ações admin

---

## 📝 NOTAS

1. **Todas as tabelas têm RLS habilitado ✅** - Excelente fundação de segurança
2. **Maioria das funções SECURITY DEFINER é justificada** - Cross-user operations
3. **~7 funções candidatas à remoção** - Funções que podem não precisar
4. **Zero high-risk findings** - Nenhuma função obviamente insegura encontrada

---

## ✅ PRÓXIMOS PASSOS

1. [ ] Testar remoção de SECURITY DEFINER das 7 funções candidatas
2. [ ] Documentar resultados dos testes
3. [ ] Criar migration para remover SECURITY DEFINER onde não é necessário
4. [ ] Adicionar comments SQL justificando SECURITY DEFINER nas funções que precisam
5. [ ] Setup de monitoring/alerting para novas funções SECURITY DEFINER
6. [ ] Adicionar ao CI/CD: check que bloqueia SECURITY DEFINER sem justificativa

