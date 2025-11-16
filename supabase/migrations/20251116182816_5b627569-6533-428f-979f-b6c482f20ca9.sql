-- Enable RLS on dashboard_stats view
ALTER VIEW dashboard_stats SET (security_invoker = true);

-- Since views don't support RLS policies directly, we ensure the underlying tables have proper RLS
-- The view will inherit permissions from the base tables (profiles, tracker_days, scripts_usage, etc.)

-- Verify profiles RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own dashboard stats
-- This is handled through the underlying table policies already in place