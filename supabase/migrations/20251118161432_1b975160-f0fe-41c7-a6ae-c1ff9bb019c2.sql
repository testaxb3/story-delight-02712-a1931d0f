-- Clean up duplicate ebooks, keeping only the most recent versions
UPDATE ebooks 
SET deleted_at = NOW() 
WHERE id IN (
  '51366f17-30b7-404c-a1bb-48506815fdad',  -- The Calm Mom Code V2 (old version)
  '6c209e97-1b7c-4795-a1a3-bd81e844f9f1',  -- THE CALM MOM CODE (old version)
  '5aacf6a2-118f-4800-869e-93fb51598db8',  -- THE CALM MOM CODE (old version)
  '3924df9c-8c94-4f97-8e1c-0cc49e1c38ee'   -- THE CALM MOM CODE (old version)
);