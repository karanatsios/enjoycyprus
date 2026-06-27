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

-- ── Partner-Tabelle ───────────────────────────────────────────────
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  affiliate_code text unique not null,
  balance numeric default 0,
  paid_out numeric default 0,
  provisions integer default 0,
  created_at timestamptz default now()
);

alter table partners enable row level security;
create policy "Eigene Partner-Daten lesen" on partners for select using (auth.uid() = user_id);
create policy "Partner registrieren" on partners for insert with check (true);
create policy "Eigene Partner-Daten bearbeiten" on partners for update using (auth.uid() = user_id);

-- ── Stufen-System & Ablauf für businesses ────────────────────────
alter table businesses add column if not exists expires_at timestamptz;
alter table businesses add column if not exists plan_score integer default 0;

-- Plan-Scores: Free=0, Bronze=25, Silver=50, Gold=75, Platin=100
-- Automatische Delistung: Status auf 'expired' setzen wenn expires_at überschritten
create or replace function check_expired_businesses()
returns void language plpgsql as $$
begin
  update businesses
  set status = 'expired'
  where status = 'approved'
    and expires_at is not null
    and expires_at < now();
end;
$$;

-- ── Profile-Tabelle (Rollen: admin / user) ────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text default 'user',
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Eigenes Profil lesen" on profiles for select using (auth.uid() = id);
create policy "Admin alles lesen" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Profil anlegen" on profiles for insert with check (true);
create policy "Eigenes Profil bearbeiten" on profiles for update using (auth.uid() = id);

-- Admin-Policies für businesses (Admin kann alles)
create policy "Admin businesses lesen" on businesses for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin businesses bearbeiten" on businesses for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin businesses löschen" on businesses for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ── Admin-E-Mail eintragen (nach erster Registrierung ausführen) ──
-- update profiles set role = 'admin' where email = 'karanatsios@mailbox.org';
