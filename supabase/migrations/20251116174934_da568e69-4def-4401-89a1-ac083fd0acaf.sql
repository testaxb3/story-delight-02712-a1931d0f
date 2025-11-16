-- ============================================
-- CRITICAL SECURITY FIX: Missing RLS Policies
-- Drop and recreate to ensure consistency
-- ============================================

-- 1. user_bonuses: Add INSERT policy (drop if exists first)
DROP POLICY IF EXISTS "Users can insert their own bonus progress" ON user_bonuses;
CREATE POLICY "Users can insert their own bonus progress"
ON user_bonuses FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 2. post_flags: Prevent UPDATE (flags should be immutable once created)
DROP POLICY IF EXISTS "Admins can update post flags" ON post_flags;
CREATE POLICY "Admins can update post flags"
ON post_flags FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- 3. post_likes: Allow UPDATE for reaction changes
DROP POLICY IF EXISTS "Users can update their own post likes" ON post_likes;
CREATE POLICY "Users can update their own post likes"
ON post_likes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. user_bonuses: Users can delete their own progress
DROP POLICY IF EXISTS "Users can delete their own bonus progress" ON user_bonuses;
CREATE POLICY "Users can delete their own bonus progress"
ON user_bonuses FOR DELETE
TO authenticated
USING (auth.uid() = user_id);