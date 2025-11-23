-- Add is_official column to communities table
ALTER TABLE communities 
ADD COLUMN is_official BOOLEAN DEFAULT false;

-- Mark the 3 default communities as official
UPDATE communities 
SET is_official = true 
WHERE invite_code IN ('INTENSE2024', 'DEFIANT2024', 'DISTRACTED2024');

-- Add index for better query performance
CREATE INDEX idx_communities_is_official ON communities(is_official);