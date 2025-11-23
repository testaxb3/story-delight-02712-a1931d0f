-- Fix script_feedback RLS policy - replace role column with is_admin
DROP POLICY IF EXISTS "Admins can view all feedback" ON script_feedback;

CREATE POLICY "Admins can view all feedback" 
ON script_feedback 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);