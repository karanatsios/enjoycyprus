-- Vollständige beaches-Tabelle: alle Strand-Daten zentral in Supabase
-- Neue Strände können direkt hier eingetragen werden ohne Code-Deploy

create table if not exists public.beaches (
  id          text primary key,
  name        text not null,
  location    text not null,
  region      text not null,
  lat         float not null,
  lng         float not null,
  image_url   text not null default '',
  updated_at  timestamptz default now()
);

alter table public.beaches enable row level security;

create policy "beaches_select" on public.beaches for select using (true);
create policy "beaches_admin"  on public.beaches for all using (true) with check (true);

-- Seed: alle 36 Blaue-Flagge-Strände Zypern 2026
insert into public.beaches (id, name, location, region, lat, lng, image_url) values
  -- FAMAGUSTA
  ('f1',  'Nissi Beach',              'Ayia Napa',   'Famagusta', 34.9889, 34.0019, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Nissi%20Beach.webp'),
  ('f2',  'Fig Tree Bay',             'Protaras',    'Famagusta', 35.0125, 34.0572, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Fig%20Tree%20Bay.jpg'),
  ('f3',  'Sandy Bay',                'Ayia Napa',   'Famagusta', 34.9944, 34.0197, 'https://picsum.photos/seed/sandy-bay-cy/800/534'),
  ('f4',  'Makronissos Beach',        'Ayia Napa',   'Famagusta', 34.9803, 33.9878, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Makronissos%20Beach.jpg'),
  ('f5',  'Pantachou Beach',          'Ayia Napa',   'Famagusta', 34.9844, 34.0022, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Pantachou%20Beach.jpg'),
  ('f6',  'Louma Beach',              'Ayia Napa',   'Famagusta', 34.9900, 34.0100, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Louma%20Beach.jpg'),
  ('f7',  'Protaras Beach',           'Protaras',    'Famagusta', 35.0094, 34.0547, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Protaras%20Beach.jpg'),
  ('f8',  'Sunrise Beach',            'Protaras',    'Famagusta', 35.0178, 34.0594, 'https://picsum.photos/seed/sunrise-protaras/800/534'),
  ('f9',  'Konnos Bay',               'Cape Greco',  'Famagusta', 34.9736, 34.0722, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Konnos%20Bay.jpg'),
  ('f10', 'Agia Thekla Beach',        'Ayia Napa',   'Famagusta', 34.9833, 33.9667, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Agia%20Thekla%20Beach.jpg'),
  ('f11', 'Ziatzi Beach',             'Ayia Napa',   'Famagusta', 34.9872, 34.0056, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Ziatzi%20Beach.webp'),
  ('f12', 'Landa Beach',              'Ayia Napa',   'Famagusta', 34.9847, 34.0003, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Landa%20Beach.jpg'),
  ('f13', 'Nissi Bay',               'Ayia Napa',   'Famagusta', 34.9889, 34.0019, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Nissi%20Bay.jpg'),
  ('f14', 'Vathia Gonia Beach',      'Protaras',    'Famagusta', 35.0156, 34.0567, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Vathia%20Gonia%20Beach.jpeg'),
  ('f15', 'Pernera Beach',           'Protaras',    'Famagusta', 35.0172, 34.0528, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Pernera%20Beach.jpg'),
  ('f16', 'Katsarka Beach',          'Ayia Napa',   'Famagusta', 34.9917, 34.0256, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Katsarka%20Beach.jpeg'),
  ('f17', 'Loukkos tou Manti Beach', 'Ayia Napa',   'Famagusta', 34.9928, 34.0211, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Loukkos%20tou%20Manti%20Beach.jpg'),
  ('f18', 'Glyki Nero Beach',        'Ayia Napa',   'Famagusta', 34.9836, 34.0078, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Glyki%20Nero%20Beach.jpg'),
  ('f19', 'Ammos tou Kampouri Beach','Ayia Napa',   'Famagusta', 35.0008, 34.0344, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Ammos%20tou%20Kampouri%20Beach%20.jpg'),
  ('f20', 'Kermia Beach',            'Ayia Napa',   'Famagusta', 35.0047, 34.0406, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Kermia%20Beach.jpg'),
  ('f21', 'Nissia Gardens Beach',    'Ayia Napa',   'Famagusta', 34.9972, 34.0314, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Nissia%20Gardens%20Beach.jpg'),
  ('f22', 'Nissia Beach',            'Ayia Napa',   'Famagusta', 34.9958, 34.0289, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Nissia%20Beach%20Famagusta%20.jpg'),
  ('f23', 'Vizakia Beach',           'Protaras',    'Famagusta', 35.0089, 34.0478, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Vizakia%20Beach.jpg'),
  ('f24', 'Lombardi Beach',         'Protaras',    'Famagusta', 35.0203, 34.0511, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Lombardi%20Beach.jpg'),
  ('f25', 'Vrisi Beach',           'Ayia Napa',   'Famagusta', 34.9861, 34.0133, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Vrisi%20Beach.jpg'),
  ('f26', 'Ayia Napa Marina',      'Ayia Napa',   'Famagusta', 34.9875, 34.0056, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Ayia%20Napa%20Marina.jpg'),
  -- PAPHOS
  ('p1',  'Coral Bay',                'Peyia',       'Paphos',    34.8356, 32.3700, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/coral-bay-beach-cyprus.webp'),
  ('p2',  'Kaphizis Beach',           'Peyia',       'Paphos',    34.8411, 32.3644, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Kaphizis%20Beach.jpg'),
  ('p3',  'Laourou Beach',            'Peyia',       'Paphos',    34.8389, 32.3622, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Laourou%20Beach.jpg'),
  ('p4',  'Kotsias Beach',            'Lemba',       'Paphos',    34.8133, 32.3931, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Kotsias%20Beach.JPG'),
  ('p5',  'Venus Beach',              'Paphos',      'Paphos',    34.7681, 32.4069, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Venus%20Beach.jpg'),
  ('p6',  'Faros Beach',              'Paphos',      'Paphos',    34.7469, 32.4222, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Faros%20Beach.webp'),
  ('p7',  'Municipal Baths Beach',    'Paphos',      'Paphos',    34.7592, 32.4083, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Municipal%20Baths%20Beach.webp'),
  ('p8',  'Alykes Beach',             'Paphos',      'Paphos',    34.7756, 32.4044, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Alykes%20Beach.jpg'),
  ('p9',  'Vrysoudia A Beach',        'Paphos',      'Paphos',    34.7839, 32.4011, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Polis%20Chrysochous%20Municipal%20Beach.jpg'),
  ('p10', 'Vrysoudia B Beach',        'Geroskipou',  'Paphos',    34.7906, 32.4094, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Vrysoudia%20B%20Beach.jpg'),
  ('p11', 'Pachyammos Beach',         'Paphos',      'Paphos',    34.8028, 32.3961, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Pachyammos%20Beach.jpg'),
  ('p12', 'Pachyammos 2 Beach',       'Geroskipou',  'Paphos',    34.7944, 32.4047, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Pachyammos%202%20Beach.jpg'),
  ('p13', 'Geroskipou Municipal Beach','Geroskipou', 'Paphos',    34.7978, 32.4069, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Geroskipou%20Municipal%20Beach.jpg'),
  ('p14', 'Polis Chrysochous Municipal Beach','Polis','Paphos',   35.0358, 32.4250, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Polis%20Chrysochous%20Municipal%20Beach.jpg'),
  -- LIMASSOL
  ('l1',  'Pissouri Beach',           'Pissouri',    'Limassol',  34.6681, 32.7064, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Pissouri%20Beach%20.jpg'),
  ('l2',  'Governor''s Beach',        'Pentakomo',   'Limassol',  34.7186, 33.2683, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Governor''s%20Beach.jpg'),
  ('l3',  'Kourion Beach',            'Episkopi',    'Limassol',  34.6519, 32.8744, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Kourion%20Beach.jpg'),
  ('l8',  'Parekklisia Beach',        'Parekklisia', 'Limassol',  34.6889, 33.0917, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Parekklisia%20Beach%20.jpg'),
  ('l9',  'Limassol Marina',          'Limassol',    'Limassol',  34.6728, 33.0356, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Limassol%20Marina.jpg'),
  -- LARNACA
  ('lr1', 'Mackenzie Beach',          'Larnaca',     'Larnaca',   34.8689, 33.6336, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Larnaca_01-2017_img27_Finikoudes.jpg/330px-Larnaca_01-2017_img27_Finikoudes.jpg'),
  ('lr2', 'Finikoudes Beach',         'Larnaca',     'Larnaca',   34.9153, 33.6425, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Larnaca_01-2017_img27_Finikoudes.jpg/330px-Larnaca_01-2017_img27_Finikoudes.jpg')
on conflict (id) do update set
  name      = excluded.name,
  location  = excluded.location,
  region    = excluded.region,
  lat       = excluded.lat,
  lng       = excluded.lng,
  image_url = excluded.image_url,
  updated_at = now();
