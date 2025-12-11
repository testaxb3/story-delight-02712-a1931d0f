-- Rename program to Picky Eating Challenge
UPDATE programs 
SET title = 'Picky Eating Challenge',
    slug = 'picky-eating-challenge',
    updated_at = now()
WHERE slug = 'calm-parent-challenge';