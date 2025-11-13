create or replace function public.save_child_profile(
  child_name text default null,
  child_profile text default null,
  quiz_completed boolean default false,
  parent_name text default null,
  email text default null
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  sanitized_child_name text := nullif(trim(child_name), '');
  sanitized_parent_name text := nullif(trim(parent_name), '');
  sanitized_child_profile text := nullif(child_profile, '');
  sanitized_email text := nullif(lower(email), '');
  result public.profiles;
begin
  if current_user_id is null then
    raise exception 'Missing authenticated user.';
  end if;

  insert into public.profiles as p (
    id,
    child_name,
    child_profile,
    quiz_completed,
    name,
    email,
    premium
  )
  values (
    current_user_id,
    sanitized_child_name,
    sanitized_child_profile,
    coalesce(quiz_completed, false),
    sanitized_parent_name,
    sanitized_email,
    true
  )
  on conflict (id) do update
    set child_name = coalesce(excluded.child_name, p.child_name),
        child_profile = coalesce(excluded.child_profile, p.child_profile),
        quiz_completed = excluded.quiz_completed,
        name = coalesce(excluded.name, p.name),
        email = coalesce(excluded.email, p.email),
        updated_at = timezone('utc', now())
  returning * into result;

  insert into public.user_progress as up (
    user_id,
    quiz_completed,
    child_profile
  )
  values (
    current_user_id,
    coalesce(quiz_completed, false),
    sanitized_child_profile
  )
  on conflict (user_id) do update
    set quiz_completed = excluded.quiz_completed,
        child_profile = coalesce(excluded.child_profile, up.child_profile),
        updated_at = timezone('utc', now());

  return result;
end;
$$;

grant execute on function public.save_child_profile(text, text, boolean, text, text) to authenticated;
revoke execute on function public.save_child_profile(text, text, boolean, text, text) from anon;
