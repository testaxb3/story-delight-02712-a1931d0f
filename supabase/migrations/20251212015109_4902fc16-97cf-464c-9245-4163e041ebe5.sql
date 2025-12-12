-- Fix Lesson 2: change "variant": "activity" to "variant": "tip"
UPDATE lessons 
SET content = REPLACE(content::text, '"variant": "activity"', '"variant": "tip"')::jsonb
WHERE id = '8e80743d-8e5e-4012-bb98-481fd9c2fe1f';

-- Fix Lesson 5: change "type": "warning" and "type": "tip" to "variant": versions in callout data
UPDATE lessons 
SET content = REPLACE(
  REPLACE(content::text, '"type": "warning"', '"variant": "warning"'),
  '"type": "tip"', '"variant": "tip"'
)::jsonb
WHERE program_id = (SELECT id FROM programs WHERE slug = 'picky-eating-challenge')
AND day_number = 5;

-- Standardize image paths for all lessons
UPDATE lessons 
SET image_url = '/images/programs/picky-eating-challenge/lesson-01.webp'
WHERE program_id = (SELECT id FROM programs WHERE slug = 'picky-eating-challenge')
AND day_number = 1;

UPDATE lessons 
SET image_url = '/images/programs/picky-eating-challenge/lesson-02.webp'
WHERE program_id = (SELECT id FROM programs WHERE slug = 'picky-eating-challenge')
AND day_number = 2;

UPDATE lessons 
SET image_url = '/images/programs/picky-eating-challenge/lesson-03.webp'
WHERE program_id = (SELECT id FROM programs WHERE slug = 'picky-eating-challenge')
AND day_number = 3;

UPDATE lessons 
SET image_url = '/images/programs/picky-eating-challenge/lesson-04.webp'
WHERE program_id = (SELECT id FROM programs WHERE slug = 'picky-eating-challenge')
AND day_number = 4;

UPDATE lessons 
SET image_url = '/images/programs/picky-eating-challenge/lesson-05.webp'
WHERE program_id = (SELECT id FROM programs WHERE slug = 'picky-eating-challenge')
AND day_number = 5;