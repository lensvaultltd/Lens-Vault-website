-- ==============================================================================
-- LENS VAULT - FINAL FIX SCHEMA
-- ==============================================================================
-- This script FIXES the "operator does not exist: uuid = text" error.
-- It recreates the secondary tables to ensure they match the main 'users' table.
-- DATA WARNING: This will reset bookings, payments, and stats to ensure a clean slate.
-- USERS DATA IS ACCURATE AND SAFE.

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. CLEANUP MISMATCHED TABLES
-- We drop these to guarantee they are created with the correct TEXT columns
drop table if exists public.bookings;
drop table if exists public.payments;
drop table if exists public.security_stats;
drop table if exists public.contact_messages;
drop table if exists public.feedback;

-- 3. USERS TABLE (Preserve Data)
create table if not exists public.users (
  id text primary key,
  email text unique not null,
  name text not null,
  wallet_address text unique,
  plan text default 'Free',
  email_notifications boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Safely add auth_id if missing
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'auth_id') then
    alter table public.users add column auth_id uuid references auth.users(id) on delete cascade;
  end if;
end $$;

-- Safely add unique constraint
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'unique_auth_id') then
    alter table public.users add constraint unique_auth_id unique (auth_id);
  end if;
end $$;

create index if not exists idx_users_auth_id on public.users(auth_id);
create index if not exists idx_users_email on public.users(email);

-- 4. BOOKINGS TABLE (Recreated Correctly)
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.users(id) on delete cascade not null, -- TEXT to match users.id
  plan_name text not null,
  booking_date timestamp with time zone not null,
  status text check (status in ('confirmed', 'cancelled', 'rescheduled')) default 'confirmed',
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index idx_bookings_user_id on public.bookings(user_id);
create index idx_bookings_date on public.bookings(booking_date desc);

-- 5. PAYMENTS TABLE (Recreated Correctly)
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.users(id) on delete cascade not null, -- TEXT to match users.id
  plan_name text not null,
  amount integer not null,
  payment_type text not null check (payment_type in ('setup', 'retainer')),
  reference text unique not null,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

create index idx_payments_user_id on public.payments(user_id);
create index idx_payments_reference on public.payments(reference);

-- 6. SECURITY STATS TABLE (Recreated Correctly)
create table public.security_stats (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.users(id) on delete cascade not null, -- TEXT to match users.id
  security_score integer default 0,
  scans_run integer default 0,
  threats_found integer default 0,
  last_scan_date timestamp with time zone,
  updated_at timestamp with time zone default now() not null,
  constraint unique_user_stats unique (user_id)
);

-- 7. PUBLIC FORM TABLES
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.users(id) on delete set null,
  message text not null,
  rating integer,
  created_at timestamp with time zone default now()
);

-- 8. ENABLE RLS
alter table public.users enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.security_stats enable row level security;
alter table public.contact_messages enable row level security;
alter table public.feedback enable row level security;

-- 9. RESET POLICIES
-- Clean sweep of old policies
drop policy if exists "Users can view own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Enable insert for signup" on public.users;
drop policy if exists "Users can view own profile via auth_id" on public.users;

drop policy if exists "Users can view own bookings" on public.bookings;
drop policy if exists "Users can insert own bookings" on public.bookings;
drop policy if exists "Users can update own bookings" on public.bookings;
drop policy if exists "Users can delete own bookings" on public.bookings;

drop policy if exists "Users can view own payments" on public.payments;
drop policy if exists "Users can insert own payments" on public.payments;

drop policy if exists "Users can view own stats" on public.security_stats;
drop policy if exists "Users can update own stats" on public.security_stats;
drop policy if exists "Users can insert own stats" on public.security_stats;

drop policy if exists "Anyone can submit contact message" on public.contact_messages;
drop policy if exists "Anyone can submit feedback" on public.feedback;

-- 10. REAPPLY POLICIES (With Safe Casts just in case)

-- USERS
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = auth_id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = auth_id);

create policy "Enable insert for signup" on public.users
  for insert with check (auth.uid() = auth_id);

-- BOOKINGS
create policy "Users can view own bookings" on public.bookings
  for select using (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can insert own bookings" on public.bookings
  for insert with check (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can update own bookings" on public.bookings
  for update using (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can delete own bookings" on public.bookings
  for delete using (user_id in (select id from public.users where auth_id = auth.uid()));

-- PAYMENTS
create policy "Users can view own payments" on public.payments
  for select using (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can insert own payments" on public.payments
  for insert with check (user_id in (select id from public.users where auth_id = auth.uid()));

-- SECURITY STATS
create policy "Users can view own stats" on public.security_stats
  for select using (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can update own stats" on public.security_stats
  for update using (user_id in (select id from public.users where auth_id = auth.uid()));

create policy "Users can insert own stats" on public.security_stats
  for insert with check (user_id in (select id from public.users where auth_id = auth.uid()));

-- PUBLIC FORMS
create policy "Anyone can submit contact message" on public.contact_messages
  for insert with check (true);

create policy "Anyone can submit feedback" on public.feedback
  for insert with check (true);

-- 11. AUTOMATION (Triggers)
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_users_updated_at on public.users;
create trigger update_users_updated_at before update on public.users
  for each row execute function update_updated_at_column();

drop trigger if exists update_bookings_updated_at on public.bookings;
create trigger update_bookings_updated_at before update on public.bookings
  for each row execute function update_updated_at_column();

drop trigger if exists update_security_stats_updated_at on public.security_stats;
create trigger update_security_stats_updated_at before update on public.security_stats
  for each row execute function update_updated_at_column();

-- 12. REAL-TIME REPLICATION (Robust)
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'users') then
    alter publication supabase_realtime add table public.users;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'bookings') then
    alter publication supabase_realtime add table public.bookings;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'payments') then
    alter publication supabase_realtime add table public.payments;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'security_stats') then
    alter publication supabase_realtime add table public.security_stats;
  end if;
end $$;

-- 13. HANDLE NEW USER CREATION (Trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, auth_id, email, name, plan)
  values (
    new.id::text, 
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    'Free'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- SUCCESS
