-- Fix Lesson 2: Replace incorrect text sections with variant: "heading" to proper heading sections
-- First occurrence: "Why a Positive Mealtime Environment Matters"
UPDATE lessons 
SET content = REPLACE(
  content::text,
  '{"data": {"content": "Why a Positive Mealtime Environment Matters", "variant": "heading"}, "type": "text"}',
  '{"data": {"text": "Why a Positive Mealtime Environment Matters", "level": 2}, "type": "heading"}'
)::jsonb
WHERE id = '8e80743d-8e5e-4012-bb98-481fd9c2fe1f';

-- Second occurrence: "Mealtime Mood Chart"
UPDATE lessons 
SET content = REPLACE(
  content::text,
  '{"data": {"content": "Mealtime Mood Chart", "variant": "heading"}, "type": "text"}',
  '{"data": {"text": "Mealtime Mood Chart", "level": 2}, "type": "heading"}'
)::jsonb
WHERE id = '8e80743d-8e5e-4012-bb98-481fd9c2fe1f';