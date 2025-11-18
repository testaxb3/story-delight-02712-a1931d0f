-- Fix category naming to match the standard format
UPDATE scripts 
SET category = 'Morning Routines'
WHERE category = 'morning_routines';

UPDATE scripts 
SET category = 'Mealtime'
WHERE category = 'mealtime' AND category != 'Mealtime';

UPDATE scripts 
SET category = 'Social'
WHERE category = 'social' AND category != 'Social';