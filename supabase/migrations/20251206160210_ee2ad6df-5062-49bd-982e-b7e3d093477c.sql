-- Delete Kathryn's auth account so she can recreate it
-- Her approved_users entry remains active
DELETE FROM auth.users WHERE id = '143aa24a-f924-4982-8129-61329e73b7b3';

-- Also reset account_created flag in approved_users so it shows as pending again
UPDATE approved_users 
SET account_created = false, 
    account_created_at = NULL,
    user_id = NULL
WHERE email = 'steffankathryn@yahoo.com';