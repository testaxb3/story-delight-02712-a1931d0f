# 🔧 FIX IMEDIATO - Erro GROUP BY

## Problema Identificado
```
column "bs.unlocked_count" must appear in the GROUP BY clause
```

## Solução (2 minutos)

### **Opção 1: Via Supabase CLI (Recomendado)**

```bash
cd "C:\Users\gabri\OneDrive\Área de Trabalho\APP OFICIAL\story-delight-02712-a1931d0f"
npx supabase db push
```

Isso aplicará a migration `20251126000001_fix_achievements_rpc.sql`.

---

### **Opção 2: Via SQL Editor (Mais Rápido)**

1. Abra **Supabase Dashboard** → **SQL Editor**
2. **Copie e execute** este SQL:

```sql
-- FIX ACHIEVEMENTS RPC
CREATE OR REPLACE FUNCTION get_user_achievements_enriched(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_stats JSONB;
  v_badges JSONB;
  v_unlocked_count INTEGER;
  v_total_count INTEGER;
BEGIN
  -- Get user stats as JSON
  SELECT to_jsonb(uas.*) INTO v_stats
  FROM user_achievements_stats uas
  WHERE uas.user_id = p_user_id;

  -- If no stats exist, return empty structure
  IF v_stats IS NULL THEN
    RETURN jsonb_build_object(
      'badges', '[]'::JSONB,
      'stats', jsonb_build_object(
        'unlockedCount', 0,
        'totalCount', 0,
        'percentage', 0,
        'currentStreak', 0,
        'longestStreak', 0
      )
    );
  END IF;

  -- Build enriched badges array
  WITH enriched_badges AS (
    SELECT
      b.id,
      b.name,
      b.description,
      b.icon,
      b.category,
      b.rarity,
      b.requirement,
      CASE WHEN ub.user_id IS NOT NULL THEN TRUE ELSE FALSE END as unlocked,
      ub.unlocked_at,
      CASE WHEN ub.user_id IS NULL THEN calculate_badge_progress(b.requirement, v_stats) ELSE NULL END as progress
    FROM badges b
    LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = p_user_id
    ORDER BY b.category, b.name
  )
  SELECT
    COALESCE(jsonb_agg(to_jsonb(eb.*)), '[]'::JSONB),
    COUNT(*) FILTER (WHERE unlocked),
    COUNT(*)
  INTO v_badges, v_unlocked_count, v_total_count
  FROM enriched_badges eb;

  -- Build final result
  v_result := jsonb_build_object(
    'badges', v_badges,
    'stats', jsonb_build_object(
      'unlockedCount', v_unlocked_count,
      'totalCount', v_total_count,
      'percentage', CASE WHEN v_total_count > 0 THEN ROUND((v_unlocked_count::NUMERIC / v_total_count::NUMERIC) * 100) ELSE 0 END,
      'currentStreak', (v_stats->>'current_streak')::INTEGER,
      'longestStreak', (v_stats->>'longest_streak')::INTEGER
    )
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_user_achievements_enriched(UUID) TO authenticated;
```

3. Clique em **Run**

---

### **Verificar se Funcionou**

Execute este teste no SQL Editor (substitua o UUID pelo seu):

```sql
-- 1. Pegar seu user_id
SELECT id, email FROM auth.users LIMIT 1;

-- 2. Testar a função (use o id do resultado acima)
SELECT get_user_achievements_enriched('SEU_USER_ID_AQUI');
```

**Resultado esperado:**
```json
{
  "badges": [...],
  "stats": {
    "unlockedCount": 0,
    "totalCount": 12,
    "percentage": 0,
    "currentStreak": 0,
    "longestStreak": 0
  }
}
```

Se retornar JSON sem erro → **FUNCIONOU! ✅**

---

### **Refresh do App**

1. Volte para o navegador
2. Pressione **Ctrl + Shift + R** (hard refresh)
3. Vá para `/achievements`

Agora deve carregar os badges!

---

## O Que Foi Corrigido

### **Problema:**
A query original tinha:
```sql
SELECT jsonb_build_object(...)
FROM enriched_badges eb, badge_stats bs;
```

Estava misturando `jsonb_agg()` (agregação) com `bs.unlocked_count` (não-agregado) na mesma query, causando erro de GROUP BY.

### **Solução:**
Separei em duas etapas:
1. **SELECT INTO variables:** Agrega os badges e conta stats
2. **jsonb_build_object:** Monta o JSON usando as variáveis

Agora não há conflito de agregação.

---

## Próximo Passo

**Execute a Opção 2** (copiar SQL no editor) → é mais rápido.

Depois me confirme se funcionou! 🚀
