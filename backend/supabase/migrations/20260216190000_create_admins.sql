-- Admin credential table
create table if not exists admins (
  id bigserial primary key,
  username text not null unique,
  password text not null,
  created_at timestamp with time zone not null default now()
);

alter table admins enable row level security;

create policy "Service role full access to admins"
  on admins
  for all
  to service_role
  using (true)
  with check (true);

insert into admins (username, password)
values ('frankie', 'password0714')
on conflict (username) do update set password = excluded.password;
