-- Verifica quantos scripts de Morning_Routines existem por brain profile
SELECT 
  profile as brain_type,
  COUNT(*) as total_scripts
FROM scripts 
WHERE category = 'Morning_Routines'
GROUP BY profile
ORDER BY profile;

-- Lista todos os scripts de Morning_Routines
SELECT 
  id,
  title,
  category,
  profile,
  created_at
FROM scripts 
WHERE category = 'Morning_Routines'
ORDER BY profile, title;
