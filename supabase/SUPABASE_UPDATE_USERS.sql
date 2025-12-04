-- Add email_notifications column to users table
alter table public.users 
add column if not exists email_notifications boolean default false;
