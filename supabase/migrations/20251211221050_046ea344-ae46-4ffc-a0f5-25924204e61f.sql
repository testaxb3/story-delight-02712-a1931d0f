UPDATE child_profiles 
SET brain_profile = 'DEFIANT', updated_at = NOW()
WHERE name ILIKE '%amir%' AND brain_profile = 'DISTRACTED'