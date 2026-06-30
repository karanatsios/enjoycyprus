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
  ('f1',  'Nissi Beach',              'Ayia Napa',   'Famagusta', 34.9889, 34.0019, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Nissi-Beach.jpg/330px-Nissi-Beach.jpg'),
  ('f2',  'Fig Tree Bay',             'Protaras',    'Famagusta', 35.0125, 34.0572, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Fig_Tree_Bay.jpg/330px-Fig_Tree_Bay.jpg'),
  ('f3',  'Sandy Bay',                'Ayia Napa',   'Famagusta', 34.9944, 34.0197, 'https://picsum.photos/seed/sandy-bay-cy/800/534'),
  ('f4',  'Makronissos Beach',        'Ayia Napa',   'Famagusta', 34.9803, 33.9878, 'https://picsum.photos/seed/makronissos-cy/800/534'),
  ('f5',  'Pantachou Beach',          'Ayia Napa',   'Famagusta', 34.9844, 34.0022, 'https://picsum.photos/seed/pantachou-cy/800/534'),
  ('f6',  'Louma Beach',              'Ayia Napa',   'Famagusta', 34.9900, 34.0100, 'https://picsum.photos/seed/louma-cy/800/534'),
  ('f7',  'Protaras Beach',           'Protaras',    'Famagusta', 35.0094, 34.0547, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Modern_new_pedestrian_seaside_road_next_to_Protaras_beach_in_Paralimni.jpg/330px-Modern_new_pedestrian_seaside_road_next_to_Protaras_beach_in_Paralimni.jpg'),
  ('f8',  'Sunrise Beach',            'Protaras',    'Famagusta', 35.0178, 34.0594, 'https://picsum.photos/seed/sunrise-protaras/800/534'),
  ('f9',  'Konnos Bay',               'Cape Greco',  'Famagusta', 34.9736, 34.0722, 'https://picsum.photos/seed/konnos-bay-cy/800/534'),
  -- PAPHOS
  ('p1',  'Coral Bay',                'Peyia',       'Paphos',    34.8356, 32.3700, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/coral-bay-beach-cyprus.webp'),
  ('p2',  'Kaphizis Beach',           'Peyia',       'Paphos',    34.8411, 32.3644, 'https://images.pexels.com/photos/10067361/pexels-photo-10067361.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('p3',  'Laourou Beach',            'Peyia',       'Paphos',    34.8389, 32.3622, 'https://images.pexels.com/photos/28379234/pexels-photo-28379234.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('p4',  'Kotsias Beach',            'Lemba',       'Paphos',    34.8133, 32.3931, 'https://images.pexels.com/photos/30563628/pexels-photo-30563628.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('p5',  'Venus Beach',              'Paphos',      'Paphos',    34.7681, 32.4069, 'https://images.pexels.com/photos/10067358/pexels-photo-10067358.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('p6',  'Faros Beach',              'Paphos',      'Paphos',    34.7469, 32.4222, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Paphos_Marine%2C_Cyprus_-_panoramio.jpg/330px-Paphos_Marine%2C_Cyprus_-_panoramio.jpg'),
  ('p7',  'Municipal Baths Beach',    'Paphos',      'Paphos',    34.7592, 32.4083, 'https://picsum.photos/seed/municipal-paphos/800/534'),
  ('p8',  'Alykes Beach',             'Paphos',      'Paphos',    34.7756, 32.4044, 'https://picsum.photos/seed/alykes-paphos/800/534'),
  ('p9',  'Vrysoudia A Beach',        'Paphos',      'Paphos',    34.7839, 32.4011, 'https://picsum.photos/seed/vrysoudia-a/800/534'),
  ('p10', 'Vrysoudia B Beach',        'Geroskipou',  'Paphos',    34.7906, 32.4094, 'https://picsum.photos/seed/vrysoudia-b/800/534'),
  ('p11', 'Pachyammos Beach',         'Paphos',      'Paphos',    34.8028, 32.3961, 'https://picsum.photos/seed/pachyammos-1/800/534'),
  ('p12', 'Pachyammos 2 Beach',       'Geroskipou',  'Paphos',    34.7944, 32.4047, 'https://picsum.photos/seed/pachyammos-2/800/534'),
  ('p13', 'Geroskipou Municipal Beach','Geroskipou', 'Paphos',    34.7978, 32.4069, 'https://picsum.photos/seed/geroskipou-beach/800/534'),
  ('p14', 'Polis Chrysochous Municipal Beach','Polis','Paphos',   35.0358, 32.4250, 'https://picsum.photos/seed/polis-beach/800/534'),
  -- LIMASSOL
  ('l1',  'Pissouri Beach',           'Pissouri',    'Limassol',  34.6681, 32.7064, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Pissouri%20Beach%20.jpg'),
  ('l2',  'Governor''s Beach',        'Pentakomo',   'Limassol',  34.7186, 33.2683, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Governor''s%20Beach.jpg'),
  ('l3',  'Kourion Beach',            'Episkopi',    'Limassol',  34.6519, 32.8744, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Kourion%20Beach.jpg'),
  ('l4',  'Lady''s Mile Beach',       'Limassol',    'Limassol',  34.6456, 33.0017, 'https://picsum.photos/seed/ladys-mile/800/534'),
  ('l5',  'Limassol Old Port Beach',  'Limassol',    'Limassol',  34.6736, 33.0444, 'https://picsum.photos/seed/limassol-port/800/534'),
  ('l6',  'Amathus Beach',            'Limassol',    'Limassol',  34.6997, 33.1239, 'https://picsum.photos/seed/amathus-beach/800/534'),
  ('l7',  'Dasoudi Beach',            'Limassol',    'Limassol',  34.7058, 33.1433, 'https://picsum.photos/seed/dasoudi-beach/800/534'),
  ('l8',  'Parekklisia Beach',        'Parekklisia', 'Limassol',  34.6889, 33.0917, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Parekklisia%20Beach%20.jpg'),
  ('l9',  'Limassol Marina',          'Limassol',    'Limassol',  34.6728, 33.0356, 'https://jewactcyhvzrceoiajau.supabase.co/storage/v1/object/public/beach-images/Limassol%20Marina.jpg'),
  -- LARNACA
  ('lr1', 'Mackenzie Beach',          'Larnaca',     'Larnaca',   34.8689, 33.6336, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Larnaca_01-2017_img27_Finikoudes.jpg/330px-Larnaca_01-2017_img27_Finikoudes.jpg'),
  ('lr2', 'Finikoudes Beach',         'Larnaca',     'Larnaca',   34.9153, 33.6425, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Larnaca_01-2017_img27_Finikoudes.jpg/330px-Larnaca_01-2017_img27_Finikoudes.jpg'),
  ('lr3', 'Dhekelia Beach',           'Dhekelia',    'Larnaca',   34.9806, 33.7450, 'https://picsum.photos/seed/dhekelia-beach/800/534'),
  ('lr4', 'Pyla Beach',               'Pyla',        'Larnaca',   34.9811, 33.7222, 'https://picsum.photos/seed/pyla-beach/800/534'),
  ('lr5', 'Pervolia Beach',           'Pervolia',    'Larnaca',   34.8347, 33.5789, 'https://picsum.photos/seed/pervolia-beach/800/534'),
  ('lr6', 'Soft Beach',               'Larnaca',     'Larnaca',   34.9183, 33.6469, 'https://picsum.photos/seed/soft-beach-larnaca/800/534')
on conflict (id) do update set
  name      = excluded.name,
  location  = excluded.location,
  region    = excluded.region,
  lat       = excluded.lat,
  lng       = excluded.lng,
  image_url = excluded.image_url,
  updated_at = now();
