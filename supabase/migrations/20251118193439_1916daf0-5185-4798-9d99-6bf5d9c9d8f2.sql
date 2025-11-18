-- Fix view_url for School Success Strategies ebook
UPDATE public.bonuses 
SET view_url = '/ebook-v2/school-success-strategies-universal-v2'
WHERE title = 'School Success Strategies';