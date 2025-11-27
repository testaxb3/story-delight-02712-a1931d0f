# Achievements Troubleshooting Guide

## Problema: Página mostra apenas título "Achievements"

### **PASSO 1: Verificar Console do Browser**

1. Abra DevTools (F12)
2. Vá para a aba **Console**
3. Procure por logs iniciando com `[Achievements]`

**Logs esperados:**
```
[Achievements Page] User: [uuid-do-usuário]
[Achievements Page] Loading: true
[Achievements] Fetching data for user: [uuid]
[Achievements] RPC response: { badges: [...], stats: {...} }
[Achievements Page] Data: { badges: [...], stats: {...} }
```

**Se aparecer erro:**
- ❌ `function get_user_achievements_enriched does not exist` → Migration não aplicada
- ❌ `permission denied` → Problema de RLS/permissões
- ❌ `relation "user_achievements_stats" does not exist` → Tabela faltando

---

### **PASSO 2: Verificar se Migration Foi Aplicada**

Execute no **Supabase SQL Editor**:

```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_name = 'get_user_achievements_enriched';
```

**Resultado esperado:** 1 linha com `get_user_achievements_enriched`

**Se vazio:**
```bash
# Aplicar migration manualmente
cd "C:\Users\gabri\OneDrive\Área de Trabalho\APP OFICIAL\story-delight-02712-a1931d0f"
npx supabase db push
```

---

### **PASSO 3: Verificar se Tabela `user_achievements_stats` Existe**

Execute no SQL Editor:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'user_achievements_stats';
```

**Resultado esperado:** 1 linha

**Se vazio,** execute esta migration:

```sql
CREATE TABLE IF NOT EXISTS user_achievements_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  days_completed INTEGER NOT NULL DEFAULT 0,
  scripts_used INTEGER NOT NULL DEFAULT 0,
  videos_watched INTEGER NOT NULL DEFAULT 0,
  posts_created INTEGER NOT NULL DEFAULT 0,
  reactions_received INTEGER NOT NULL DEFAULT 0,
  badges_unlocked INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_achievements_stats_user_id ON user_achievements_stats(user_id);

ALTER TABLE user_achievements_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats"
  ON user_achievements_stats FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_achievements_stats FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
```

---

### **PASSO 4: Criar Stats para Seu Usuário**

1. Pegue seu `user_id`:
```sql
SELECT id FROM auth.users WHERE email = 'SEU_EMAIL@example.com';
```

2. Crie stats:
```sql
INSERT INTO user_achievements_stats (user_id)
VALUES ('SEU_USER_ID_AQUI')
ON CONFLICT (user_id) DO NOTHING;
```

---

### **PASSO 5: Testar RPC Diretamente**

Execute no SQL Editor (substitua o UUID):

```sql
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

**Se retornar erro:**
- Copie a mensagem de erro completa
- Verifique se há badges cadastrados: `SELECT COUNT(*) FROM badges;`

---

### **PASSO 6: Verificar Permissões RLS**

Execute:

```sql
SELECT * FROM user_achievements_stats
WHERE user_id = (SELECT auth.uid());
```

**Se retornar vazio mas você já criou stats:**
- Problema de RLS policy
- Execute novamente as policies do PASSO 3

---

### **PASSO 7: Hard Refresh do Frontend**

1. Feche o navegador completamente
2. Abra novamente
3. Navegue para `/achievements`
4. Verifique console novamente

---

## **Soluções Rápidas**

### **Migration Completa Manual**

Se nada funcionar, execute este SQL completo:

```sql
-- 1. Criar função
CREATE OR REPLACE FUNCTION calculate_badge_progress(
  p_requirement TEXT,
  p_stats JSONB
) RETURNS JSONB AS $$
DECLARE
  v_type TEXT;
  v_required INTEGER;
  v_current INTEGER;
  v_label TEXT;
BEGIN
  v_type := split_part(p_requirement, ':', 1);
  v_required := COALESCE(split_part(p_requirement, ':', 2)::INTEGER, 0);

  v_current := CASE v_type
    WHEN 'streak_days' THEN (p_stats->>'current_streak')::INTEGER
    WHEN 'scripts_used' THEN (p_stats->>'scripts_used')::INTEGER
    WHEN 'videos_watched' THEN (p_stats->>'videos_watched')::INTEGER
    WHEN 'days_completed' THEN (p_stats->>'days_completed')::INTEGER
    WHEN 'posts_created' THEN (p_stats->>'posts_created')::INTEGER
    ELSE 0
  END;

  v_label := CASE v_type
    WHEN 'streak_days' THEN 'days'
    WHEN 'scripts_used' THEN 'scripts'
    WHEN 'videos_watched' THEN 'videos'
    WHEN 'days_completed' THEN 'days'
    WHEN 'posts_created' THEN 'posts'
    ELSE 'items'
  END;

  RETURN jsonb_build_object(
    'current', v_current,
    'required', v_required,
    'label', v_label,
    'percentage', CASE
      WHEN v_required > 0 THEN ROUND((v_current::NUMERIC / v_required::NUMERIC) * 100, 2)
      ELSE 0
    END
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Criar RPC
CREATE OR REPLACE FUNCTION get_user_achievements_enriched(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_stats JSONB;
BEGIN
  SELECT to_jsonb(uas.*) INTO v_stats
  FROM user_achievements_stats uas
  WHERE uas.user_id = p_user_id;

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
  ),
  badge_stats AS (
    SELECT
      COUNT(*) FILTER (WHERE unlocked) as unlocked_count,
      COUNT(*) as total_count
    FROM enriched_badges
  )
  SELECT jsonb_build_object(
    'badges', COALESCE(jsonb_agg(to_jsonb(eb.*)), '[]'::JSONB),
    'stats', jsonb_build_object(
      'unlockedCount', bs.unlocked_count,
      'totalCount', bs.total_count,
      'percentage', CASE WHEN bs.total_count > 0 THEN ROUND((bs.unlocked_count::NUMERIC / bs.total_count::NUMERIC) * 100) ELSE 0 END,
      'currentStreak', (v_stats->>'current_streak')::INTEGER,
      'longestStreak', (v_stats->>'longest_streak')::INTEGER
    )
  ) INTO v_result
  FROM enriched_badges eb, badge_stats bs;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_user_achievements_enriched(UUID) TO authenticated;
```

---

## **Próximos Passos**

Após seguir os passos acima:

1. **Abra o browser console** (F12 → Console)
2. **Navegue para `/achievements`**
3. **Copie TODOS os logs** que aparecem
4. **Me envie** para eu debugar mais

Se ainda não funcionar, me passe:
- ✅ Os logs do console
- ✅ O erro (se houver)
- ✅ Resultado do `SELECT get_user_achievements_enriched('seu-uuid')`
