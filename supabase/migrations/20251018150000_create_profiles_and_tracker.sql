-- Ensure UUID generation functions are available
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Create rich profile metadata table for parents
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  child_profile text,
  premium boolean not null default false,
  quiz_completed boolean not null default false,
  role text,
  is_admin boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile"
  on public.profiles
  for delete
  using (auth.uid() = id);

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- Create 30-day transformation tracker table
create table if not exists public.tracker_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day_number smallint not null check (day_number between 1 and 30),
  completed boolean not null default false,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now()),
  unique (user_id, day_number)
);

alter table public.tracker_days enable row level security;

drop policy if exists "Users can view tracker days" on public.tracker_days;
create policy "Users can view tracker days"
  on public.tracker_days
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert tracker days" on public.tracker_days;
create policy "Users can insert tracker days"
  on public.tracker_days
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update tracker days" on public.tracker_days;
create policy "Users can update tracker days"
  on public.tracker_days
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete tracker days" on public.tracker_days;
create policy "Users can delete tracker days"
  on public.tracker_days
  for delete
  using (auth.uid() = user_id);

drop trigger if exists update_tracker_days_updated_at on public.tracker_days;
create trigger update_tracker_days_updated_at
  before update on public.tracker_days
  for each row execute function public.update_updated_at_column();

-- Store watched lesson history as UUID references instead of integers
alter table public.user_progress
  alter column videos_watched drop default;

alter table public.user_progress
  alter column videos_watched type uuid[]
  using (
    case
      when videos_watched is null then null
      else array[]::uuid[]
    end
  );

alter table public.user_progress
  alter column videos_watched set default array[]::uuid[];

update public.user_progress
set videos_watched = array[]::uuid[]
where videos_watched is null;

create index if not exists tracker_days_user_day_idx
  on public.tracker_days (user_id, day_number);
