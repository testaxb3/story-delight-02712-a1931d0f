-- ============================================================
-- FIX: Dashboard Stats View - Personal Stats Instead of Global
-- ============================================================
--
-- PROBLEMA: O Quick Stats estava mostrando:
-- - "Scripts Today": Número de USUÁRIOS que usaram scripts hoje (global)
-- - "This Week": Número total de usos (global)
--
-- SOLUÇÃO: Mostrar stats PESSOAIS do usuário logado:
-- - "Scripts Today": Número de scripts únicos que VOCÊ usou hoje
-- - "This Week": Número de vezes que VOCÊ usou scripts esta semana
--
-- Como aplicar:
-- 1. Vá para Supabase Dashboard
-- 2. SQL Editor
-- 3. Cole este código
-- 4. Execute
-- ============================================================

-- Drop existing view
DROP VIEW IF EXISTS dashboard_stats CASCADE;

-- Create improved view with PERSONAL stats
CREATE VIEW dashboard_stats AS
WITH user_data AS (
  SELECT
    p.id AS user_id,
    p.premium,
    p.brain_profile
  FROM profiles p
),
tracker_summary AS (
  SELECT
    tracker_days.user_id,
    avg(tracker_days.stress_level) AS avg_stress,
    count(*) FILTER (WHERE (tracker_days.completed = true)) AS total_entries,
    count(*) FILTER (WHERE ((tracker_days.meltdown_count = ANY (ARRAY['1'::text, '2'::text, '3+'::text])) AND (tracker_days.day_number <= 7))) AS meltdowns_before,
    count(*) FILTER (WHERE ((tracker_days.meltdown_count = ANY (ARRAY['1'::text, '2'::text, '3+'::text])) AND (tracker_days.day_number > 7))) AS meltdowns_after
  FROM tracker_days
  WHERE (tracker_days.completed = true)
  GROUP BY tracker_days.user_id
),
scripts_usage_count AS (
  SELECT
    script_usage.user_id,
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
-- ✅ NEW: Personal today stats (per user)
personal_today_stats AS (
  SELECT
    su.user_id,
    count(DISTINCT su.script_id) AS scripts_today_count,
    count(*) AS script_uses_today
  FROM script_usage su
  WHERE su.used_at >= CURRENT_DATE
  GROUP BY su.user_id
),
-- ✅ NEW: Personal week stats (per user)
personal_week_stats AS (
  SELECT
    su.user_id,
    count(*) AS script_uses_week
  FROM script_usage su
  WHERE su.used_at >= (CURRENT_DATE - INTERVAL '7 days')
  GROUP BY su.user_id
),
-- Global stats (for community info)
global_week_stats AS (
  SELECT
    count(DISTINCT su.user_id) AS active_users_week
  FROM script_usage su
  WHERE su.used_at >= (CURRENT_DATE - INTERVAL '7 days')
),
community_stats AS (
  SELECT count(*) AS posts_this_week
  FROM community_posts
  WHERE community_posts.created_at >= (CURRENT_DATE - INTERVAL '7 days')
)
SELECT
  ud.user_id,
  COALESCE(ts.avg_stress, 0::numeric) AS average_stress,
  COALESCE(ts.total_entries, 0::bigint) AS total_tracker_entries,
  COALESCE(ts.meltdowns_before, 0::bigint) AS meltdowns_before_day_7,
  COALESCE(ts.meltdowns_after, 0::bigint) AS meltdowns_after_day_7,
  COALESCE(suc.unique_scripts_used, 0::bigint) AS unique_scripts_used,
  COALESCE(suc.total_script_uses, 0::bigint) AS total_script_uses,
  ct.total_scripts,
  ct.total_videos,
  ct.total_pdfs,
  -- ✅ FIXED: Personal stats instead of global
  COALESCE(pts.scripts_today_count, 0::bigint) AS scripts_today_count,
  COALESCE(pts.script_uses_today, 0::bigint) AS script_uses_today,
  gws.active_users_week,
  COALESCE(pws.script_uses_week, 0::bigint) AS script_uses_week,
  cs.posts_this_week
FROM user_data ud
CROSS JOIN content_totals ct
CROSS JOIN global_week_stats gws
CROSS JOIN community_stats cs
LEFT JOIN tracker_summary ts ON ud.user_id = ts.user_id
LEFT JOIN scripts_usage_count suc ON ud.user_id = suc.user_id
LEFT JOIN personal_today_stats pts ON ud.user_id = pts.user_id
LEFT JOIN personal_week_stats pws ON ud.user_id = pws.user_id;

-- Test query (optional - para verificar se está funcionando)
-- SELECT user_id, scripts_today_count, script_uses_today, script_uses_week
-- FROM dashboard_stats
-- WHERE user_id = auth.uid();
