-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
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
  user_id uuid references users(id) on delete cascade,
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
create policy "Users can view their own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on users for update
  using (auth.uid() = id);

create policy "Anyone can insert users (for signup)"
  on users for insert
  with check (true);

-- RLS Policies for payments table
create policy "Users can view their own payments"
  on payments for select
  using (auth.uid() = user_id);

create policy "Users can insert their own payments"
  on payments for insert
  with check (auth.uid() = user_id);

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
