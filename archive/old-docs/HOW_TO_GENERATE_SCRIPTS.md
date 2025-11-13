# 🚀 Como Gerar Scripts Completos

## Passo 1: Preparar Template

✅ **Arquivo criado**: `scripts_template.csv`

Este arquivo tem:
- ✅ Header com todos os campos
- ✅ 1 exemplo completo (Hair Brushing Battle)
- ✅ Todos os novos campos de guidance

---

## Passo 2: Enviar para IA

### Arquivos para enviar:
1. **scripts_template.csv** - Template com exemplo
2. **CSV_GENERATION_INSTRUCTIONS.md** - Instruções completas

### Prompt sugerido:

```
Olá! Preciso que você gere scripts de parenting no formato CSV.

Anexei 2 arquivos:
1. scripts_template.csv - Template com 1 exemplo
2. CSV_GENERATION_INSTRUCTIONS.md - Instruções detalhadas

Por favor:
- Leia as instruções COMPLETAMENTE
- Siga o formato EXATO do template
- Gere [X QUANTIDADE] scripts variando:
  * Categorias: Bedtime, Screens, Mealtime, Transitions, Tantrums, Morning_Routines, Social, Hygiene
  * Perfis: INTENSE, DISTRACTED, DEFIANT
  * Dificuldades: Easy, Moderate, Hard

IMPORTANTE:
- Mantenha o sistema NEP de 3 frases (Connection → Validation → Neurological Command)
- Inclua guidance positivo e negativo para CADA step
- What to Expect deve ser realista, não promessa de milagre
- Neurological Tip deve ter base científica
- Tom natural, como pais reais falam

Retorne apenas o CSV completo, pronto para importar.
```

---

## Passo 3: Receber e Salvar

Quando a IA retornar:

1. Copie o CSV completo
2. Salve como: `scripts_bulk_upload.csv`
3. Verifique se tem:
   - Header na primeira linha
   - Todos os campos entre aspas
   - Sem quebras de linha dentro dos campos

---

## Passo 4: Limpar Scripts Antigos

**No Supabase SQL Editor**, execute:

```sql
BEGIN;

DELETE FROM script_feedback;
DELETE FROM script_usage;
DELETE FROM favorite_scripts;
DELETE FROM scripts;

COMMIT;
```

⚠️ **ATENÇÃO**: Isso DELETA TUDO! Faça backup se necessário.

---

## Passo 5: Importar Novo CSV

### Opção A: Via Supabase Dashboard (Recomendado)

1. Abra Supabase Dashboard
2. Vá para a tabela `scripts`
3. Clique **Insert** → **Import data from CSV**
4. Upload do `scripts_bulk_upload.csv`
5. Mapeie as colunas (deve mapear automaticamente)
6. Clique **Import**

### Opção B: Via SQL (Se preferir)

Use o arquivo: `supabase-migrations/bulk-import-scripts-helper.sql`

---

## Passo 6: Popular Related Scripts

Depois da importação, execute no SQL Editor:

```sql
-- Relaciona automaticamente scripts da mesma categoria/perfil
UPDATE scripts s1
SET related_script_ids = (
  SELECT ARRAY_AGG(s2.id)
  FROM (
    SELECT id
    FROM scripts s2
    WHERE s2.category = s1.category
      AND s2.id != s1.id
      AND s2.profile = s1.profile
    LIMIT 3
  ) s2
)
WHERE related_script_ids = ARRAY[]::text[] OR related_script_ids IS NULL;
```

---

## Passo 7: Verificar

Execute no SQL Editor:

```sql
-- Contar scripts por categoria
SELECT
  category,
  profile,
  difficulty_level,
  COUNT(*) as total
FROM scripts
GROUP BY category, profile, difficulty_level
ORDER BY category;

-- Ver scripts sem guidance
SELECT title, category
FROM scripts
WHERE
  say_it_like_this_step1 IS NULL
  OR avoid_step1 IS NULL;
```

---

## Passo 8: Regenerar TypeScript Types

```bash
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

---

## Passo 9: Testar

```bash
npm run dev
```

1. Vá para Scripts page
2. Abra qualquer script
3. Verifique:
   - ✅ Quick Context aparece
   - ✅ Step guidance (Say it like this / Avoid)
   - ✅ What to Expect
   - ✅ Related Scripts (se populado)

---

## ✅ Checklist Final

- [ ] Template enviado para IA
- [ ] CSV gerado recebido
- [ ] Scripts antigos deletados
- [ ] Novo CSV importado
- [ ] Related scripts populados
- [ ] Types regenerados
- [ ] App testado
- [ ] Tudo funcionando!

---

## 📁 Arquivos Úteis

- `scripts_template.csv` - Template base
- `CSV_GENERATION_INSTRUCTIONS.md` - Instruções completas
- `bulk-import-scripts-helper.sql` - SQL helpers
- `QUICK_START.md` - Guia rápido das melhorias

---

**Pronto! 🎉 Scripts completos com toda a guidance implementada!**
