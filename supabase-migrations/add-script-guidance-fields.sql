-- Migration: Add guidance fields to scripts table
-- Created: 2025-11-08
-- Description: Adds difficulty level, age range, duration, step guidance, expectations, and related scripts

-- Add difficulty_level enum type
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level') THEN
    CREATE TYPE difficulty_level AS ENUM ('Easy', 'Moderate', 'Hard');
  END IF;
END $$;

-- Add new columns to scripts table
ALTER TABLE scripts
  ADD COLUMN IF NOT EXISTS difficulty_level difficulty_level DEFAULT 'Moderate',
  ADD COLUMN IF NOT EXISTS age_range text,
  ADD COLUMN IF NOT EXISTS duration_minutes integer DEFAULT 5,

  -- Step 1 guidance
  ADD COLUMN IF NOT EXISTS say_it_like_this_step1 text,
  ADD COLUMN IF NOT EXISTS avoid_step1 text,

  -- Step 2 guidance
  ADD COLUMN IF NOT EXISTS say_it_like_this_step2 text,
  ADD COLUMN IF NOT EXISTS avoid_step2 text,

  -- Step 3 guidance
  ADD COLUMN IF NOT EXISTS say_it_like_this_step3 text,
  ADD COLUMN IF NOT EXISTS avoid_step3 text,

  -- What to expect section (array of 3 expectations)
  ADD COLUMN IF NOT EXISTS what_to_expect text[] DEFAULT ARRAY[]::text[],

  -- Related scripts (array of script IDs)
  ADD COLUMN IF NOT EXISTS related_script_ids text[] DEFAULT ARRAY[]::text[];

-- Add constraint (using DO block for idempotency)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'duration_minutes_positive'
  ) THEN
    ALTER TABLE scripts
      ADD CONSTRAINT duration_minutes_positive CHECK (duration_minutes > 0 AND duration_minutes <= 60);
  END IF;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN scripts.difficulty_level IS 'Difficulty level: Easy (1 star), Moderate (2 stars), Hard (3 stars)';
COMMENT ON COLUMN scripts.age_range IS 'Recommended age range, e.g., "3-7", "2-5", "5-10"';
COMMENT ON COLUMN scripts.duration_minutes IS 'Estimated duration in minutes (typically 5, 10, or 15)';
COMMENT ON COLUMN scripts.what_to_expect IS 'Array of 3 expectations for parents using this script';
COMMENT ON COLUMN scripts.related_script_ids IS 'Array of 2-3 related script IDs to suggest as alternatives';
