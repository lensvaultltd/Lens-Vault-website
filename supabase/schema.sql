-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table
create table if not exists users (
  id text primary key, -- Firebase UID is text
  email text unique not null,
  name text not null,
  wallet_address text unique,
  plan text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create payments table
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  user_id text references users(id) on delete cascade, -- Changed to text
  plan_name text not null,
  amount integer not null,
  payment_type text not null check (payment_type in ('setup', 'retainer')),
  reference text unique not null,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- Create contact_messages table
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

-- Create indexes for better query performance
create index if not exists idx_users_email on users(email);
create index if not exists idx_users_wallet on users(wallet_address);
create index if not exists idx_payments_user_id on payments(user_id);
create index if not exists idx_payments_reference on payments(reference);
create index if not exists idx_contact_messages_created_at on contact_messages(created_at desc);

-- Enable Row Level Security (RLS)
alter table users enable row level security;
alter table payments enable row level security;
alter table contact_messages enable row level security;

-- RLS Policies for users table
-- Note: We cannot use auth.uid() directly for RLS if we are using Firebase Auth 
-- UNLESS we are using Supabase Custom Auth or if we just allow public reads/writes for now 
-- and handle security in the backend/API. 
-- BUT since we are doing client-side inserts, we need a policy.
-- For strict separation without Supabase Auth, we might need to use a Service Key on the server 
-- OR allow public insert/select for now (NOT SECURE for production but works for dev).
-- A better approach for production: Use Firebase ID Token verification in a Supabase Edge Function.
-- For this "MVP" stage with client-side logic:
-- We will allow public insert (for signup).
-- We will allow public select (so users can fetch their profile).
-- Ideally, we'd filter by ID, but without Supabase Auth context, we can't enforce "my own profile" easily in RLS.

create policy "Enable read access for all users"
  on users for select
  using (true);

create policy "Enable insert for all users"
  on users for insert
  with check (true);

create policy "Enable update for all users"
  on users for update
  using (true);

-- RLS Policies for payments table
create policy "Enable read access for all users"
  on payments for select
  using (true);

create policy "Enable insert for all users"
  on payments for insert
  with check (true);

-- RLS Policies for contact_messages table
create policy "Anyone can insert contact messages"
  on contact_messages for insert
  with check (true);

-- Only authenticated users can view contact messages (admin feature)
create policy "Authenticated users can view contact messages"
  on contact_messages for select
  using (auth.role() = 'authenticated');

-- Create a function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_users_updated_at
  before update on users
  for each row
  execute function update_updated_at_column();

-- Create feedback table
create table if not exists feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id text references users(id) on delete set null,
  message text not null,
  rating integer,
  created_at timestamp with time zone default now()
);

-- RLS Policies for feedback table
create policy "Anyone can insert feedback"
  on feedback for insert
  with check (true);

create policy "Authenticated users can view feedback"
  on feedback for select
  using (auth.role() = 'authenticated');

create index if not exists idx_feedback_created_at on feedback(created_at desc);
