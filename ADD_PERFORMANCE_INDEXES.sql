-- ==========================================
-- PERFORMANCE INDEXES - Week 1 Optimization
-- ==========================================
-- Execute este SQL no Supabase Dashboard
-- Vai tornar as queries 5-10x mais rápidas! 🚀
-- ==========================================

-- 1. Index on scripts.profile (most important - used in every query)
CREATE INDEX IF NOT EXISTS idx_scripts_profile
ON scripts(profile);

-- 2. Index on scripts.category (for category filtering)
CREATE INDEX IF NOT EXISTS idx_scripts_category
ON scripts(category);

-- 3. Composite index for profile + created_at (covers ORDER BY)
CREATE INDEX IF NOT EXISTS idx_scripts_profile_created
ON scripts(profile, created_at DESC);

-- 4. Index on script_usage for "used today" queries
CREATE INDEX IF NOT EXISTS idx_script_usage_user_date
ON script_usage(user_id, used_at DESC);

-- 5. Index on script_feedback for history queries
CREATE INDEX IF NOT EXISTS idx_script_feedback_child_script
ON script_feedback(child_id, script_id, created_at DESC);

-- 6. Index on favorites
CREATE INDEX IF NOT EXISTS idx_favorite_scripts_user
ON favorite_scripts(user_id);

-- Update statistics (important!)
ANALYZE scripts;
ANALYZE script_usage;
ANALYZE script_feedback;

-- ✅ Verify indexes were created
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('scripts', 'script_usage', 'script_feedback', 'favorite_scripts')
ORDER BY tablename, indexname;

-- You should see all the indexes listed above ✅
