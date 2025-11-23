-- Fix script_feedback RLS policies - ensure all policies exist

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own feedback" ON script_feedback;
DROP POLICY IF EXISTS "Users can insert their own feedback" ON script_feedback;
DROP POLICY IF EXISTS "Users can update their own feedback" ON script_feedback;
DROP POLICY IF EXISTS "Users can delete their own feedback" ON script_feedback;

-- Recreate policies for users to manage their own feedback
CREATE POLICY "Users can view their own feedback"
ON script_feedback
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own feedback"
ON script_feedback
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own feedback"
ON script_feedback
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own feedback"
ON script_feedback
FOR DELETE
TO authenticated
USING (user_id = auth.uid());