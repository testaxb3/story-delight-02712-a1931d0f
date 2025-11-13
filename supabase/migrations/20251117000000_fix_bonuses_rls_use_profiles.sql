-- Fix bonuses RLS policies to use profiles.is_admin instead of user_roles

-- Drop existing policies
drop policy if exists "Admins can insert bonuses" on bonuses;
drop policy if exists "Admins can update bonuses" on bonuses;
drop policy if exists "Admins can delete bonuses" on bonuses;

-- Recreate policies using profiles.is_admin
create policy "Admins can insert bonuses"
  on bonuses for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and is_admin = true
    )
  );

create policy "Admins can update bonuses"
  on bonuses for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and is_admin = true
    )
  );

create policy "Admins can delete bonuses"
  on bonuses for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and is_admin = true
    )
  );
