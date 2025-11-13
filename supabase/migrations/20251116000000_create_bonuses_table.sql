-- Create bonuses table
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
  view_url text,
  download_url text,
  unlock_requirement text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies for bonuses
alter table bonuses enable row level security;

-- Allow all users to read bonuses
create policy "Bonuses are viewable by everyone"
  on bonuses for select
  using (true);

-- Only admins can insert bonuses
create policy "Admins can insert bonuses"
  on bonuses for insert
  with check (
    exists (
      select 1 from user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- Only admins can update bonuses
create policy "Admins can update bonuses"
  on bonuses for update
  using (
    exists (
      select 1 from user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- Only admins can delete bonuses
create policy "Admins can delete bonuses"
  on bonuses for delete
  using (
    exists (
      select 1 from user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- Create updated_at trigger
create or replace function update_bonuses_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_bonuses_updated_at
  before update on bonuses
  for each row
  execute function update_bonuses_updated_at();

-- Create index for faster queries
create index if not exists bonuses_category_idx on bonuses(category);
create index if not exists bonuses_locked_idx on bonuses(locked);
create index if not exists bonuses_is_new_idx on bonuses(is_new);
create index if not exists bonuses_created_at_idx on bonuses(created_at desc);
