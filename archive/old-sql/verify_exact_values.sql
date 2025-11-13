-- Verifica valores EXATOS (com espaços, caracteres invisíveis, etc)
SELECT 
  DISTINCT category,
  LENGTH(category) as length,
  profile,
  COUNT(*) as count
FROM scripts 
WHERE category LIKE '%Morning%' OR category LIKE '%Routine%'
GROUP BY category, profile
ORDER BY category, profile;

-- Verifica se tem espaços extras
SELECT 
  id,
  title,
  category,
  profile,
  CASE 
    WHEN category = 'Morning_Routines' THEN 'EXACT MATCH'
    ELSE 'NO MATCH: ' || category
  END as match_status
FROM scripts 
WHERE category LIKE '%Morning%' OR category LIKE '%Routine%'
LIMIT 10;
