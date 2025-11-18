-- Remove the 2 buggy scripts that were just created
DELETE FROM scripts 
WHERE id IN (
  'a6f613b3-36c6-4297-8167-d8ef2055279c',
  '92a9f4ca-52f2-466d-bd7e-1c595d70f39f'
);