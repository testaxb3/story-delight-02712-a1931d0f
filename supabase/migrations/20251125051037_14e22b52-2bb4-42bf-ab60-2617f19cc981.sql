-- Add rarity field to badges table
ALTER TABLE badges ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'common';

COMMENT ON COLUMN badges.rarity IS 'Badge rarity level: common, rare, epic, legendary';

-- Update existing badges with appropriate rarity
UPDATE badges SET rarity = 'rare' WHERE category = 'streak';
UPDATE badges SET rarity = 'epic' WHERE category = 'special';
UPDATE badges SET rarity = 'legendary' WHERE name ILIKE '%master%' OR name ILIKE '%legend%';