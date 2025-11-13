# FIX APLICADO: child_id Error

## ❌ Problema Original
```
Error: Failed to run sql query: ERROR: 42703: column "child_id" does not exist
```

## 🔍 Causa Raiz
A tabela `script_usage` (existente) **NÃO tem coluna `child_id`**.
Ela só tem: `id`, `user_id`, `script_id`, `used_at`

Mas o código estava tentando inserir `child_id` na tabela `script_feedback`, assumindo que sempre existiria.

## ✅ Solução Aplicada

### 1. Migration de Fix Criada
**Arquivo:** `supabase/migrations/20251113120001_fix_script_feedback_child_id.sql`

**Mudanças:**
- Tornou `child_id` **NULLABLE** (pode ser NULL)
- Atualizou índices para lidar com NULL
- Adicionou índice para queries sem child_id

### 2. Código Atualizado

**Arquivo:** `src/hooks/useFeedback.ts`
- `submitFeedback()`: Agora aceita `child_id` opcional (usa `|| null`)
- Todas as queries: Filtram por `child_id` apenas se disponível
- Não quebra mais se `activeChild` não existir

**Arquivo:** `src/hooks/useChildRecommendations.ts`
- Query de feedback: Filtro por `child_id` condicional
- Funciona com ou sem child_id

## 📋 Como Aplicar

### Opção 1: Via Supabase Dashboard (RECOMENDADO)
1. Acesse: https://supabase.com/dashboard
2. Vá em **Database → SQL Editor**
3. Cole os 2 arquivos na ordem:
   - `20251113120000_create_script_feedback_table.sql`
   - `20251113120001_fix_script_feedback_child_id.sql`
4. Execute cada um (botão "Run")

### Opção 2: Via Supabase CLI
```bash
cd "C:\Users\gabri\OneDrive\Área de Trabalho\app\brainy-child-guide"
npx supabase db push
```

## ✅ Verificação

Após aplicar as migrations, teste:

```sql
-- No SQL Editor do Supabase, rode:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'script_feedback';
```

**Resultado esperado:**
```
column_name    | data_type | is_nullable
---------------+-----------+-------------
id             | uuid      | NO
user_id        | uuid      | NO
child_id       | uuid      | YES  <-- DEVE SER YES
script_id      | uuid      | NO
outcome        | text      | NO
notes          | text      | YES
created_at     | timestamp | YES
```

## 🎯 O Que Mudou

**Antes:**
- `child_id NOT NULL` → Erro se não existisse
- Código exigia `activeChild.id` sempre

**Depois:**
- `child_id NULL` → Aceita NULL
- Código funciona com ou sem `activeChild`
- Backwards compatible com `script_usage` que não tem `child_id`

## 🚀 Status

- ✅ Migration criada
- ✅ Código atualizado
- ⏳ **PENDENTE:** Aplicar migrations no Supabase

**Próximo passo:** Aplicar as migrations via Dashboard ou CLI
