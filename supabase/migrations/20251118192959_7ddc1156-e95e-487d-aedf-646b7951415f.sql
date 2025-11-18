-- Add School Success Strategies bonus entry
INSERT INTO public.bonuses (
  title,
  description,
  category,
  thumbnail,
  view_url,
  locked,
  tags
) VALUES (
  'School Success Strategies',
  'Complete guide to morning preparation and homework management for neurodivergent children. Learn science-backed strategies to address executive function challenges, time blindness, and task initiation difficulties.',
  'ebook',
  '/ebook-screen-strategies-cover-new.jpg',
  '/bonuses?ebook=school-success-strategies-universal-v2',
  false,
  ARRAY['school', 'routines', 'homework', 'executive-function', 'universal']
);

-- Link the ebook to the bonus
UPDATE public.ebooks
SET bonus_id = (
  SELECT id FROM public.bonuses 
  WHERE title = 'School Success Strategies'
  LIMIT 1
)
WHERE slug = 'school-success-strategies-universal-v2';