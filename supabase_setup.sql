-- Einmal im Supabase SQL Editor ausführen: https://supabase.com/dashboard/project/jewactcyhvzrceoiajau/sql

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  company_name text not null,
  category text,
  location_type text default 'local',
  region_group text,
  region text,
  street text,
  plz text,
  city text,
  maps_link text,
  phone text,
  whatsapp text,
  email text,
  website text,
  opening_hours text,
  languages text[],
  short_desc text,
  description text,
  plan text default 'free',
  status text default 'pending',
  created_at timestamptz default now()
);

-- Jeder kann Einträge lesen (öffentliches Verzeichnis)
alter table businesses enable row level security;
create policy "Öffentlich lesbar" on businesses for select using (status = 'approved');
create policy "Eigene Einträge lesbar" on businesses for select using (auth.uid() = user_id);
create policy "Eintrag erstellen" on businesses for insert with check (true);
create policy "Eigene Einträge bearbeiten" on businesses for update using (auth.uid() = user_id);
