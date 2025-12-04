-- Create security_stats table
create table if not exists public.security_stats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  security_score integer default 0,
  scans_run integer default 0,
  threats_found integer default 0,
  last_scan_date timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.security_stats enable row level security;

-- Create policies
create policy "Users can view their own security stats"
  on public.security_stats for select
  using (auth.uid() = user_id);

create policy "Users can update their own security stats"
  on public.security_stats for update
  using (auth.uid() = user_id);

create policy "Users can insert their own security stats"
  on public.security_stats for insert
  with check (auth.uid() = user_id);

-- Create a trigger to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_security_stats_updated
  before update on public.security_stats
  for each row execute procedure public.handle_updated_at();
