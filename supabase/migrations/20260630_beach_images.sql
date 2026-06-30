-- Beach images table: decoupled from code so URLs can be updated without deploy
create table if not exists public.beach_images (
  id text primary key,          -- matches Beach.id in beaches.tsx (f1, p1, etc.)
  name text not null,
  image_url text not null,
  updated_at timestamptz default now()
);

alter table public.beach_images enable row level security;

create policy "beach_images_select" on public.beach_images
  for select using (true);

-- Service role can insert/update (admin uploads via dashboard or API)
create policy "beach_images_admin" on public.beach_images
  for all using (true) with check (true);

-- Supabase Storage bucket for beach images (run in Dashboard > Storage if not exists)
-- Bucket name: beach-images, Public: true

-- Seed with current best-available image URLs
-- Replace image_url values with Supabase Storage public URLs after uploading
insert into public.beach_images (id, name, image_url) values
  -- FAMAGUSTA
  ('f1',  'Nissi Beach',              'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Nissi-Beach.jpg/330px-Nissi-Beach.jpg'),
  ('f2',  'Fig Tree Bay',             'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Fig_Tree_Bay.jpg/330px-Fig_Tree_Bay.jpg'),
  ('f3',  'Sandy Bay',                'https://picsum.photos/seed/sandy-bay-cy/800/534'),
  ('f4',  'Makronissos Beach',        'https://picsum.photos/seed/makronissos-cy/800/534'),
  ('f5',  'Pantachou Beach',          'https://picsum.photos/seed/pantachou-cy/800/534'),
  ('f6',  'Louma Beach',              'https://picsum.photos/seed/louma-cy/800/534'),
  ('f7',  'Protaras Beach',           'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Modern_new_pedestrian_seaside_road_next_to_Protaras_beach_in_Paralimni.jpg/330px-Modern_new_pedestrian_seaside_road_next_to_Protaras_beach_in_Paralimni.jpg'),
  ('f8',  'Sunrise Beach',            'https://picsum.photos/seed/sunrise-protaras/800/534'),
  ('f9',  'Konnos Bay',               'https://picsum.photos/seed/konnos-bay-cy/800/534'),
  -- PAPHOS
  ('p1',  'Coral Bay',                'https://images.pexels.com/photos/30563689/pexels-photo-30563689.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('p2',  'Kaphizis Beach',           'https://images.pexels.com/photos/10067361/pexels-photo-10067361.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('p3',  'Laourou Beach',            'https://images.pexels.com/photos/28379234/pexels-photo-28379234.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('p4',  'Kotsias Beach',            'https://images.pexels.com/photos/30563628/pexels-photo-30563628.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('p5',  'Venus Beach',              'https://images.pexels.com/photos/10067358/pexels-photo-10067358.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('p6',  'Faros Beach',              'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Paphos_Marine%2C_Cyprus_-_panoramio.jpg/330px-Paphos_Marine%2C_Cyprus_-_panoramio.jpg'),
  ('p7',  'Municipal Baths Beach',    'https://picsum.photos/seed/municipal-paphos/800/534'),
  ('p8',  'Alykes Beach',             'https://picsum.photos/seed/alykes-paphos/800/534'),
  ('p9',  'Vrysoudia A Beach',        'https://picsum.photos/seed/vrysoudia-a/800/534'),
  ('p10', 'Vrysoudia B Beach',        'https://picsum.photos/seed/vrysoudia-b/800/534'),
  ('p11', 'Pachyammos Beach',         'https://picsum.photos/seed/pachyammos-1/800/534'),
  ('p12', 'Pachyammos 2 Beach',       'https://picsum.photos/seed/pachyammos-2/800/534'),
  ('p13', 'Geroskipou Municipal Beach','https://picsum.photos/seed/geroskipou-beach/800/534'),
  ('p14', 'Polis Chrysochous Municipal Beach','https://picsum.photos/seed/polis-beach/800/534'),
  -- LIMASSOL
  ('l1',  'Pissouri Beach',           'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/View_of_Pissouri_03.jpg/330px-View_of_Pissouri_03.jpg'),
  ('l2',  'Governor''s Beach',        'https://picsum.photos/seed/governors-beach/800/534'),
  ('l3',  'Kourion Beach',            'https://picsum.photos/seed/kourion-beach/800/534'),
  ('l4',  'Lady''s Mile Beach',       'https://picsum.photos/seed/ladys-mile/800/534'),
  ('l5',  'Limassol Old Port Beach',  'https://picsum.photos/seed/limassol-port/800/534'),
  ('l6',  'Amathus Beach',            'https://picsum.photos/seed/amathus-beach/800/534'),
  ('l7',  'Dasoudi Beach',            'https://picsum.photos/seed/dasoudi-beach/800/534'),
  -- LARNACA
  ('lr1', 'Mackenzie Beach',          'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Larnaca_01-2017_img27_Finikoudes.jpg/330px-Larnaca_01-2017_img27_Finikoudes.jpg'),
  ('lr2', 'Finikoudes Beach',         'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Larnaca_01-2017_img27_Finikoudes.jpg/330px-Larnaca_01-2017_img27_Finikoudes.jpg'),
  ('lr3', 'Dhekelia Beach',           'https://picsum.photos/seed/dhekelia-beach/800/534'),
  ('lr4', 'Pyla Beach',               'https://picsum.photos/seed/pyla-beach/800/534'),
  ('lr5', 'Pervolia Beach',           'https://picsum.photos/seed/pervolia-beach/800/534'),
  ('lr6', 'Soft Beach',               'https://picsum.photos/seed/soft-beach-larnaca/800/534')
on conflict (id) do update set image_url = excluded.image_url, updated_at = now();
