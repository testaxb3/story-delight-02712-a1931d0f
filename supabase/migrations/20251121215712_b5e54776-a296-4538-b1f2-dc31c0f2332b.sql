-- Add new fields to child_profiles table for enhanced quiz data
ALTER TABLE child_profiles
ADD COLUMN IF NOT EXISTS age_exact INTEGER,
ADD COLUMN IF NOT EXISTS development_phase TEXT CHECK (development_phase IN ('baby', 'toddler', 'child', 'preteen', 'teen')),
ADD COLUMN IF NOT EXISTS family_context TEXT[],
ADD COLUMN IF NOT EXISTS parent_goals TEXT[],
ADD COLUMN IF NOT EXISTS challenge_level INTEGER CHECK (challenge_level BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS challenge_duration TEXT,
ADD COLUMN IF NOT EXISTS tried_approaches TEXT[];

COMMENT ON COLUMN child_profiles.age_exact IS 'Exact age of child in years';
COMMENT ON COLUMN child_profiles.development_phase IS 'Development phase: baby, toddler, child, preteen, teen';
COMMENT ON COLUMN child_profiles.family_context IS 'Family context factors: siblings, single_parent, blended_family, etc.';
COMMENT ON COLUMN child_profiles.parent_goals IS 'Parent goals: tantrums, sleep, eating, focus, family_relationship';
COMMENT ON COLUMN child_profiles.challenge_level IS 'Challenge difficulty level from 1-10';
COMMENT ON COLUMN child_profiles.challenge_duration IS 'How long facing this challenge: weeks, months, years';
COMMENT ON COLUMN child_profiles.tried_approaches IS 'Previous approaches tried: time_out, rewards, consequences, etc.';