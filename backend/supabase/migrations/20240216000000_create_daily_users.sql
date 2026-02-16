-- Create table to track daily usage by IP
create table if not exists daily_users (
  ip_address text not null,
  visit_date date not null default current_date,
  request_count int default 1,
  last_seen timestamp with time zone default now(),
  primary key (ip_address, visit_date)
);

-- Enable RLS
alter table daily_users enable row level security;

-- Policy: Only service role can do anything (Backend Worker)
-- Anon/Authenticated users cannot access this table directly
create policy "Service role full access"
  on daily_users
  for all
  to service_role
  using (true)
  with check (true);
