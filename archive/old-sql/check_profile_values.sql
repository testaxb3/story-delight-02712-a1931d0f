-- Verifica valores EXATOS do campo profile
SELECT 
  DISTINCT profile,
  LENGTH(profile) as length,
  COUNT(*) as total_scripts
FROM scripts 
GROUP BY profile
ORDER BY profile;

-- Verifica especificamente Morning_Routines
SELECT 
  title,
  category,
  profile,
  CASE 
    WHEN profile = 'DEFIANT' THEN '✅ MATCH'
    WHEN profile = 'Defiant' THEN '❌ Capitalized'
    WHEN profile = 'defiant' THEN '❌ Lowercase'
    ELSE '❌ Other: ' || profile
  END as profile_check
FROM scripts 
WHERE category = 'Morning_Routines'
LIMIT 5;
