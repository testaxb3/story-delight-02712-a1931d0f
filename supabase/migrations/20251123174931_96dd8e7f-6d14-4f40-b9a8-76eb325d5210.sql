-- Drop the existing policy
DROP POLICY IF EXISTS "Users can view their communities" ON communities;

-- Create new policy that allows viewing official communities AND user's own communities
CREATE POLICY "Users can view communities" 
ON communities 
FOR SELECT 
TO authenticated
USING (
  is_official = true OR 
  auth.uid() = created_by OR 
  is_community_member(auth.uid(), id)
);