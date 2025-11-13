create table if not exists public.script_usage (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  script_id uuid not null references public.scripts(id) on delete cascade,
  used_at timestamptz not null default timezone('utc', now())
);

create index if not exists script_usage_user_id_used_at_idx
  on public.script_usage (user_id, used_at desc);

alter table public.script_usage enable row level security;

drop policy if exists "Users can view their usage" on public.script_usage;
create policy "Users can view their usage"
  on public.script_usage
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can log their usage" on public.script_usage;
create policy "Users can log their usage"
  on public.script_usage
  for insert
  with check (auth.uid() = user_id);
