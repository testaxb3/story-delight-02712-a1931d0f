-- Restore quiz completion for affected user after scaffolding bug
update profiles
set quiz_completed = true,
    quiz_in_progress = false,
    updated_at = now()
where id = '89f7b0fe-5da1-4931-ad5c-12ac95b9150f';

update user_progress
set quiz_completed = true,
    updated_at = now()
where user_id = '89f7b0fe-5da1-4931-ad5c-12ac95b9150f';