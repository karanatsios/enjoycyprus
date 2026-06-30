create table if not exists public.menu_config (
  id text primary key,
  visible boolean not null default true,
  updated_at timestamptz default now()
);

alter table public.menu_config enable row level security;

-- All users can read visibility settings
create policy "menu_config_select" on public.menu_config
  for select using (true);

-- Anyone authenticated (or anon via service role) can upsert
-- In production the admin screen is gated by ADMIN_EMAILS check
create policy "menu_config_upsert" on public.menu_config
  for all using (true) with check (true);

-- Seed with all items visible (no rows = visible by default, hidden items get explicit false rows)
