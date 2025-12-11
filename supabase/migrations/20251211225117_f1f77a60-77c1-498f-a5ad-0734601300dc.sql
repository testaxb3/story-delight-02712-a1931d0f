-- Update total_lessons to match actual lesson count
UPDATE programs 
SET total_lessons = (
  SELECT COUNT(*) FROM lessons WHERE program_id = programs.id
)
WHERE slug = 'picky-eating-challenge';