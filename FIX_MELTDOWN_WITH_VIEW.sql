-- ==========================================
-- FIX: Remove constraint e recria view
-- ==========================================

-- PASSO 1: Remover a view temporariamente
DROP VIEW IF EXISTS dashboard_stats;

-- PASSO 2: Remover a constraint
ALTER TABLE tracker_days DROP CONSTRAINT IF EXISTS tracker_days_meltdown_count_check;

-- PASSO 3: Alterar tipo da coluna para TEXT
ALTER TABLE tracker_days ALTER COLUMN meltdown_count TYPE TEXT;

-- PASSO 4: Recriar a view dashboard_stats
CREATE OR REPLACE VIEW dashboard_stats AS
WITH user_data AS (
  SELECT p.id AS user_id,
    p.premium,
    p.brain_profile
  FROM profiles p
),
tracker_summary AS (
  SELECT tracker_days.user_id,
    avg(tracker_days.stress_level) AS avg_stress,
    count(*) FILTER (WHERE (tracker_days.completed = true)) AS total_entries,
    count(*) FILTER (WHERE ((tracker_days.meltdown_count = ANY (ARRAY['1'::text, '2'::text, '3+'::text])) AND (tracker_days.day_number <= 7))) AS meltdowns_before,
    count(*) FILTER (WHERE ((tracker_days.meltdown_count = ANY (ARRAY['1'::text, '2'::text, '3+'::text])) AND (tracker_days.day_number > 7))) AS meltdowns_after
  FROM tracker_days
  WHERE (tracker_days.completed = true)
  GROUP BY tracker_days.user_id
),
scripts_usage_count AS (
  SELECT script_usage.user_id,
    count(DISTINCT script_usage.script_id) AS unique_scripts_used,
    count(*) AS total_script_uses
  FROM script_usage
  GROUP BY script_usage.user_id
),
content_totals AS (
  SELECT
    (SELECT count(*) FROM scripts) AS total_scripts,
    (SELECT count(*) FROM bonuses WHERE category = 'video') AS total_videos,
    (SELECT count(*) FROM pdfs) AS total_pdfs
),
today_stats AS (
  SELECT count(DISTINCT su.user_id) AS scripts_today_count,
    count(*) AS script_uses_today
  FROM script_usage su
  WHERE (su.used_at >= CURRENT_DATE)
),
week_stats AS (
  SELECT count(DISTINCT su.user_id) AS active_users_week,
    count(*) AS script_uses_week
  FROM script_usage su
  WHERE (su.used_at >= (CURRENT_DATE - '7 days'::interval))
),
community_stats AS (
  SELECT count(*) AS posts_this_week
  FROM community_posts
  WHERE (community_posts.created_at >= (CURRENT_DATE - '7 days'::interval))
)
SELECT ud.user_id,
  COALESCE(ts.avg_stress, 0::numeric) AS average_stress,
  COALESCE(ts.total_entries, 0::bigint) AS total_tracker_entries,
  COALESCE(ts.meltdowns_before, 0::bigint) AS meltdowns_before_day_7,
  COALESCE(ts.meltdowns_after, 0::bigint) AS meltdowns_after_day_7,
  COALESCE(suc.unique_scripts_used, 0::bigint) AS unique_scripts_used,
  COALESCE(suc.total_script_uses, 0::bigint) AS total_script_uses,
  ct.total_scripts,
  ct.total_videos,
  ct.total_pdfs,
  tds.scripts_today_count,
  tds.script_uses_today,
  ws.active_users_week,
  ws.script_uses_week,
  cs.posts_this_week
FROM user_data ud
CROSS JOIN content_totals ct
CROSS JOIN today_stats tds
CROSS JOIN week_stats ws
CROSS JOIN community_stats cs
LEFT JOIN tracker_summary ts ON (ud.user_id = ts.user_id)
LEFT JOIN scripts_usage_count suc ON (ud.user_id = suc.user_id);

-- PASSO 5: Verificar se a constraint foi removida (deve retornar 0 linhas)
SELECT
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'tracker_days'::regclass
  AND conname LIKE '%meltdown%';

-- ✅ Pronto! Se não aparecer nenhuma linha acima, está corrigido!
