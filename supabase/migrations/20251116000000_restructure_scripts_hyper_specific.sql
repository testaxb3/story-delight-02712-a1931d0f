-- Restructure Scripts Table for Hyper-Specific, Natural Language System
-- Transforms from generic 3-phrase memorization to rich strategy framework

-- Add new content structure columns
ALTER TABLE scripts
ADD COLUMN IF NOT EXISTS the_situation TEXT,
ADD COLUMN IF NOT EXISTS what_doesnt_work TEXT,
ADD COLUMN IF NOT EXISTS strategy_steps JSONB,
ADD COLUMN IF NOT EXISTS why_this_works TEXT,
ADD COLUMN IF NOT EXISTS what_to_expect JSONB,
ADD COLUMN IF NOT EXISTS common_variations JSONB,
ADD COLUMN IF NOT EXISTS parent_state_needed TEXT,
ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('Easy', 'Moderate', 'Hard')),
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 5;

-- Add comments for new fields
COMMENT ON COLUMN scripts.the_situation IS 'Rich description of the specific situation (2-3 paragraphs, 150 words max). Vivid, relatable, parent thinks "YES this is exactly what happens"';
COMMENT ON COLUMN scripts.what_doesnt_work IS 'Bullet list of common phrases parents say that don''t work, plus consequences. No judgment, educational tone.';
COMMENT ON COLUMN scripts.strategy_steps IS 'JSONB array of step objects: [{step_number: 1, step_title: "ACKNOWLEDGE IT''S REAL", step_explanation: "Don''t argue...", what_to_say_examples: ["Yeah, it doesn''t feel right", "I know it feels wrong"]}]';
COMMENT ON COLUMN scripts.why_this_works IS 'Accessible neuroscience explanation (3-4 paragraphs, 200 words max). Collapsed by default in UI. Uses analogies, avoids excessive jargon.';
COMMENT ON COLUMN scripts.what_to_expect IS 'JSONB timeline object: {first_30_seconds: "Still resistant...", by_2_minutes: "Usually complying...", dont_expect: ["Instant cooperation", "No complaints"], this_is_success: "They cooperate without full meltdown"}';
COMMENT ON COLUMN scripts.common_variations IS 'JSONB array: [{variation_scenario: "If they keep adding cold water forever", variation_response: "You get 2 adjustments, then we''re bathing"}]';
COMMENT ON COLUMN scripts.parent_state_needed IS 'Single sentence about parent emotional state needed (e.g., "Calm, patient, non-reactive")';
COMMENT ON COLUMN scripts.difficulty IS 'Easy (⭐), Moderate (⭐⭐), Hard (⭐⭐⭐)';
COMMENT ON COLUMN scripts.duration_minutes IS 'Expected duration in minutes (easier to read than seconds)';

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_scripts_difficulty ON scripts (difficulty);
CREATE INDEX IF NOT EXISTS idx_scripts_duration_minutes ON scripts (duration_minutes);
CREATE INDEX IF NOT EXISTS idx_scripts_strategy_steps ON scripts USING GIN (strategy_steps);
CREATE INDEX IF NOT EXISTS idx_scripts_common_variations ON scripts USING GIN (common_variations);

-- Create view for script cards (list view) with new structure
CREATE OR REPLACE VIEW scripts_card_view AS
SELECT
  s.id,
  s.title,
  s.category,
  s.profile,
  s.difficulty,
  s.duration_minutes,
  s.emergency_suitable,
  s.tags,
  s.age_min,
  s.age_max,
  -- For backward compatibility during transition
  COALESCE(s.the_situation, s.situation_trigger) as preview_text,
  -- Success metrics
  COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked') as worked_count,
  COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'progress') as progress_count,
  COUNT(DISTINCT sf.id) as total_feedback_count,
  CASE
    WHEN COUNT(DISTINCT sf.id) > 0 THEN
      ROUND(
        (COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked') * 1.0 +
         COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'progress') * 0.5) /
        COUNT(DISTINCT sf.id) * 100
      )
    ELSE NULL
  END as success_rate_percent
FROM scripts s
LEFT JOIN script_feedback sf ON s.id = sf.script_id
GROUP BY s.id;

COMMENT ON VIEW scripts_card_view IS 'Optimized view for script cards in list/grid view with success metrics';

-- Create function to validate strategy_steps JSONB structure
CREATE OR REPLACE FUNCTION validate_strategy_steps()
RETURNS TRIGGER AS $$
BEGIN
  -- If strategy_steps is provided, validate structure
  IF NEW.strategy_steps IS NOT NULL THEN
    -- Check it's an array
    IF jsonb_typeof(NEW.strategy_steps) != 'array' THEN
      RAISE EXCEPTION 'strategy_steps must be a JSONB array';
    END IF;

    -- Validate each step has required fields
    -- This is a simplified check - you can add more validation as needed
    IF NOT (
      SELECT bool_and(
        step ? 'step_number' AND
        step ? 'step_title' AND
        step ? 'step_explanation' AND
        step ? 'what_to_say_examples' AND
        jsonb_typeof(step->'what_to_say_examples') = 'array'
      )
      FROM jsonb_array_elements(NEW.strategy_steps) AS step
    ) THEN
      RAISE EXCEPTION 'Each strategy step must have: step_number, step_title, step_explanation, and what_to_say_examples (array)';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for strategy_steps validation
DROP TRIGGER IF EXISTS validate_strategy_steps_trigger ON scripts;
CREATE TRIGGER validate_strategy_steps_trigger
  BEFORE INSERT OR UPDATE ON scripts
  FOR EACH ROW
  EXECUTE FUNCTION validate_strategy_steps();

-- Create function to validate what_to_expect JSONB structure
CREATE OR REPLACE FUNCTION validate_what_to_expect()
RETURNS TRIGGER AS $$
BEGIN
  -- If what_to_expect is provided, validate structure
  IF NEW.what_to_expect IS NOT NULL THEN
    -- Check it's an object
    IF jsonb_typeof(NEW.what_to_expect) != 'object' THEN
      RAISE EXCEPTION 'what_to_expect must be a JSONB object';
    END IF;

    -- Validate required fields exist
    IF NOT (
      NEW.what_to_expect ? 'first_30_seconds' AND
      NEW.what_to_expect ? 'by_2_minutes' AND
      NEW.what_to_expect ? 'dont_expect' AND
      NEW.what_to_expect ? 'this_is_success'
    ) THEN
      RAISE EXCEPTION 'what_to_expect must have: first_30_seconds, by_2_minutes, dont_expect, this_is_success';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for what_to_expect validation
DROP TRIGGER IF EXISTS validate_what_to_expect_trigger ON scripts;
CREATE TRIGGER validate_what_to_expect_trigger
  BEFORE INSERT OR UPDATE ON scripts
  FOR EACH ROW
  EXECUTE FUNCTION validate_what_to_expect();

-- Create helper function to search scripts by natural language
CREATE OR REPLACE FUNCTION search_scripts_natural(
  search_query TEXT,
  user_brain_profile TEXT DEFAULT NULL,
  user_age_min INTEGER DEFAULT NULL,
  user_age_max INTEGER DEFAULT NULL
)
RETURNS TABLE (
  script_id UUID,
  title TEXT,
  category TEXT,
  profile TEXT,
  difficulty TEXT,
  relevance_score INTEGER,
  match_context TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id as script_id,
    s.title,
    s.category,
    s.profile,
    s.difficulty,
    (
      -- Exact title match
      CASE WHEN s.title ILIKE '%' || search_query || '%' THEN 50 ELSE 0 END +
      -- Situation match
      CASE WHEN s.the_situation ILIKE '%' || search_query || '%' THEN 40 ELSE 0 END +
      -- Tag match
      CASE WHEN EXISTS (
        SELECT 1 FROM unnest(s.tags) tag WHERE tag ILIKE '%' || search_query || '%'
      ) THEN 30 ELSE 0 END +
      -- Old situation_trigger fallback
      CASE WHEN s.situation_trigger ILIKE '%' || search_query || '%' THEN 35 ELSE 0 END +
      -- Brain profile match bonus
      CASE WHEN user_brain_profile IS NOT NULL AND s.profile = user_brain_profile THEN 20 ELSE 0 END +
      -- Age range match bonus
      CASE WHEN user_age_min IS NOT NULL AND user_age_max IS NOT NULL
        AND s.age_min <= user_age_max AND s.age_max >= user_age_min
      THEN 15 ELSE 0 END
    ) as relevance_score,
    CASE
      WHEN s.title ILIKE '%' || search_query || '%' THEN 'Title'
      WHEN s.the_situation ILIKE '%' || search_query || '%' THEN 'Situation'
      WHEN EXISTS (SELECT 1 FROM unnest(s.tags) tag WHERE tag ILIKE '%' || search_query || '%') THEN 'Tags'
      ELSE 'General'
    END as match_context
  FROM scripts s
  WHERE
    s.title ILIKE '%' || search_query || '%' OR
    s.the_situation ILIKE '%' || search_query || '%' OR
    s.situation_trigger ILIKE '%' || search_query || '%' OR
    EXISTS (SELECT 1 FROM unnest(s.tags) tag WHERE tag ILIKE '%' || search_query || '%')
  ORDER BY relevance_score DESC, s.title
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION search_scripts_natural IS 'Natural language search for scripts with relevance scoring. Searches title, situation, tags with context-aware ranking.';

-- Create view for emergency/SOS scripts using new structure
CREATE OR REPLACE VIEW emergency_scripts_new AS
SELECT
  s.id,
  s.title,
  s.category,
  s.profile,
  s.difficulty,
  s.duration_minutes,
  COALESCE(s.the_situation, s.situation_trigger) as situation,
  s.strategy_steps,
  s.what_to_expect,
  -- Success metrics
  COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked') as worked_count,
  COUNT(DISTINCT sf.id) as total_uses,
  CASE
    WHEN COUNT(DISTINCT sf.id) > 0 THEN
      ROUND(
        (COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'worked') * 1.0 +
         COUNT(DISTINCT sf.id) FILTER (WHERE sf.outcome = 'progress') * 0.5) /
        COUNT(DISTINCT sf.id) * 100
      )
    ELSE NULL
  END as success_rate_percent
FROM scripts s
LEFT JOIN script_feedback sf ON s.id = sf.script_id
WHERE s.emergency_suitable = true
  AND s.works_in_public = true
  AND s.duration_minutes <= 5
GROUP BY s.id
ORDER BY success_rate_percent DESC NULLS LAST, worked_count DESC;

COMMENT ON VIEW emergency_scripts_new IS 'Pre-filtered emergency/SOS scripts optimized for crisis situations (≤5 min, public-suitable) with success metrics';
