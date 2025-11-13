-- ============================================================================
-- MIGRATION: Create Bonuses Table + Fix RLS Policies
-- ============================================================================
-- Este SQL cria a tabela bonuses e configura as RLS policies para usar
-- profiles.is_admin (ao invés de user_roles)
-- ============================================================================

-- 1. Create bonuses table
create table if not exists bonuses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null check (category in ('video', 'ebook', 'tool', 'pdf', 'session', 'template')),
  thumbnail text,
  duration text,
  file_size text,
  locked boolean default false,
  completed boolean default false,
  progress integer default 0 check (progress >= 0 and progress <= 100),
  is_new boolean default true,
  tags text[],
  video_url text,
  view_url text,
  download_url text,
  unlock_requirement text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table bonuses enable row level security;

-- 3. Drop existing policies (caso existam)
drop policy if exists "Bonuses are viewable by everyone" on bonuses;
drop policy if exists "Admins can insert bonuses" on bonuses;
drop policy if exists "Admins can update bonuses" on bonuses;
drop policy if exists "Admins can delete bonuses" on bonuses;

-- 4. Create new policies using profiles.is_admin
create policy "Bonuses are viewable by everyone"
  on bonuses for select
  using (true);

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

-- 5. Create updated_at trigger
create or replace function update_bonuses_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_bonuses_updated_at on bonuses;
create trigger update_bonuses_updated_at
  before update on bonuses
  for each row
  execute function update_bonuses_updated_at();

-- 6. Create indexes for faster queries
create index if not exists bonuses_category_idx on bonuses(category);
create index if not exists bonuses_locked_idx on bonuses(locked);
create index if not exists bonuses_is_new_idx on bonuses(is_new);
create index if not exists bonuses_created_at_idx on bonuses(created_at desc);

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================
