-- Enable RLS on user_achievements_stats view
ALTER VIEW user_achievements_stats SET (security_invoker = on);

-- Create RLS policies for user_badges table (ensure proper access)
DROP POLICY IF EXISTS "Users can view their own badges" ON user_badges;
CREATE POLICY "Users can view their own badges" ON user_badges
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view all user badges" ON user_badges;

DROP POLICY IF EXISTS "Users can view badges of community members" ON user_badges;
CREATE POLICY "Users can view badges of community members" ON user_badges
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM community_members cm1
    JOIN community_members cm2 ON cm1.community_id = cm2.community_id
    WHERE cm1.user_id = auth.uid() 
    AND cm2.user_id = user_badges.user_id
  )
);

-- Ensure badges table is publicly readable
DROP POLICY IF EXISTS "Everyone can view badges" ON badges;
CREATE POLICY "Everyone can view badges" ON badges
FOR SELECT USING (true);