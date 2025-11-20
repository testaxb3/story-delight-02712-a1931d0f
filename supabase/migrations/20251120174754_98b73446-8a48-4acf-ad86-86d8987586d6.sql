
-- Remove os 2 scripts bugados recém-criados
DELETE FROM scripts 
WHERE id IN (
  'c3d76b9e-9e2f-4ca4-8f51-7764a330d4a8',
  'ceed6f86-7cce-4824-8d21-c9483ef317c6'
);
