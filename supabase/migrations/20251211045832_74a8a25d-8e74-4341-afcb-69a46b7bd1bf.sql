-- Add image_url column to program_badges
ALTER TABLE program_badges ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update badges with picky eating images
UPDATE program_badges SET name = 'New Food Explorer', image_url = '/program-images/picky-eating/achievement-new-food-explorer.png' WHERE id = '23fff7cb-128b-482c-8693-f84eba3de992';
UPDATE program_badges SET name = 'Taste Adventurer', image_url = '/program-images/picky-eating/achievement-taste-adventurer.png' WHERE id = '856eac49-f7f9-40c2-8c25-4b9dcd13bb83';
UPDATE program_badges SET name = 'Food Detective', image_url = '/program-images/picky-eating/achievement-food-detective.png' WHERE id = 'c2a79203-60df-45e5-99fa-9c0b725656e2';
UPDATE program_badges SET name = 'Mealtime Maestro', image_url = '/program-images/picky-eating/achievement-fun-mealtime-maestro.png' WHERE id = 'b050fc9d-2dab-4236-99d1-7768baaa4e82';
UPDATE program_badges SET name = 'Healthy Eating Champion', image_url = '/program-images/picky-eating/achievement-healthy-eating-champion.png' WHERE id = 'd0a25215-b15f-45b2-bd53-01b178acb81d';

-- Update lesson 1 with thumbnail
UPDATE lessons 
SET image_url = '/program-images/picky-eating/lesson-01-thumbnail.webp'
WHERE program_id = '0e0d35ab-a781-43d8-80a1-fff741386917' AND day_number = 1;