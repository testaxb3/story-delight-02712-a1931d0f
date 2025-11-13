# ⚠️ MIGRAÇÃO NECESSÁRIA ANTES DE UPLOAD CSV

## O QUE ACONTECEU

O CSV que você tem usa a **nova estrutura hyper-specific**, mas o database ainda não tem as colunas necessárias.

Erro: `expected JSON array` significa que `what_to_expect` espera array (estrutura antiga) mas você está enviando object (estrutura nova).

---

## SOLUÇÃO: Aplicar Migração

###  **OPÇÃO 1: Via Supabase Dashboard (Recomendado)**

1. Abra: https://supabase.com/dashboard/project/iogceaotdodvugrmogpp/sql/new
2. Cole o SQL abaixo:

```sql
-- Add new hyper-specific columns
ALTER TABLE scripts
ADD COLUMN IF NOT EXISTS the_situation TEXT,
ADD COLUMN IF NOT EXISTS what_doesnt_work TEXT,
ADD COLUMN IF NOT EXISTS strategy_steps JSONB,
ADD COLUMN IF NOT EXISTS why_this_works TEXT,
ADD COLUMN IF NOT EXISTS what_to_expect JSONB,
ADD COLUMN IF NOT EXISTS common_variations JSONB,
ADD COLUMN IF NOT EXISTS parent_state_needed TEXT,
ADD COLUMN IF NOT EXISTS difficulty TEXT,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;
```

3. Clique em "Run"
4. Depois rode: `node upload-hygiene-csv.mjs`

---

### **OPÇÃO 2: Usar Migração Completa**

Se quiser aplicar a migração completa (com indexes, triggers, views):

1. Abra: https://supabase.com/dashboard/project/iogceaotdodvugrmogpp/sql/new
2. Cole o conteúdo do arquivo: `supabase/migrations/20251116000000_restructure_scripts_hyper_specific.sql`
3. Clique em "Run"
4. Depois rode: `node upload-hygiene-csv.mjs`

---

## DEPOIS DA MIGRAÇÃO

Rode o upload:
```bash
node upload-hygiene-csv.mjs
```

Os 3 scripts do CSV serão inseridos com a nova estrutura hyper-specific!

---

## STATUS ATUAL

- ❌ Database: Estrutura antiga (sem colunas novas)
- ✅ CSV: Estrutura nova (hyper-specific)
- ✅ UI: Pronta para nova estrutura (HyperSpecificScriptView.tsx)
- ✅ Types: Atualizados
- ⏳ **Falta:** Aplicar migração no banco

---

**Aplique a migração e me avise!**
