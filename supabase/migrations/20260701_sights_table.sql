-- Sehenswürdigkeiten-Tabelle
create table if not exists public.sights (
  id          text primary key,
  name        text not null,
  location    text not null,
  region      text not null,
  is_north    boolean not null default false,
  lat         float not null,
  lng         float not null,
  image_url   text not null default '',
  description text not null default '',
  category    text not null default '',
  updated_at  timestamptz default now()
);

alter table public.sights enable row level security;

create policy "sights_select" on public.sights for select using (true);
create policy "sights_admin"  on public.sights for all using (true) with check (true);

-- Seed: Sehenswürdigkeiten Zypern
insert into public.sights (id, name, location, region, is_north, lat, lng, image_url, description, category) values
  -- Südzypern
  ('ss1',  'Aphrodite Felsen (Petra tou Romiou)', 'Kouklia',      'Paphos',    false, 34.6133, 32.5019, '', 'Der mythische Geburtsort der Göttin Aphrodite – eine der bekanntesten Sehenswürdigkeiten Zyperns. Spektakuläre Felsformation direkt am Meer.', 'Natur'),
  ('ss2',  'Kolossi Burg',                        'Kolossi',      'Limassol',  false, 34.6678, 32.9231, '', 'Mittelalterliche Burg aus dem 13. Jahrhundert, einst Hauptquartier der Kreuzritter und Zentrum der Zuckerrohrproduktion.', 'Burg'),
  ('ss3',  'Kourion Amphitheater',                'Episkopi',     'Limassol',  false, 34.6606, 32.8878, '', 'Beeindruckendes griechisch-römisches Amphitheater mit Blick auf das Mittelmeer. Noch heute Schauplatz von Open-Air-Konzerten.', 'Antike'),
  ('ss4',  'Akamas Halbinsel',                    'Polis',        'Paphos',    false, 35.0833, 32.3167, '', 'Unberührte Naturlandschaft im Nordwesten Zyperns mit einzigartiger Flora und Fauna. Wanderwege und Nistplätze der Caretta-Caretta-Schildkröten.', 'Natur'),
  ('ss5',  'Tombs of the Kings',                  'Paphos',       'Paphos',    false, 34.7764, 32.3947, '', 'Unterirdisches Nekropolis aus dem 4. Jahrhundert v. Chr. – UNESCO-Weltkulturerbe. Beeindruckende Grabkammern in den Fels gehauen.', 'Antike'),
  ('ss6',  'Paphos Mosaiken',                     'Paphos',       'Paphos',    false, 34.7569, 32.4081, '', 'Weltberühmte römische Bodenmosaiken aus dem 3./4. Jahrhundert – UNESCO-Weltkulturerbe. Zählen zu den schönsten der Welt.', 'Antike'),
  ('ss7',  'Cape Greco',                          'Ayia Napa',    'Famagusta', false, 34.9583, 34.0786, '', 'Atemberaubendes Kap im Südosten Zyperns mit kristallklarem Wasser, Meereshöhlen und Wanderwegen direkt an den Klippen.', 'Natur'),
  ('ss8',  'Kykkos Kloster',                      'Troodos',      'Limassol',  false, 34.9844, 32.7397, '', 'Das reichste und bedeutendste Kloster Zyperns, tief im Troodos-Gebirge. Beherbergt eine der drei Ikonen, die der Evangelist Lukas gemalt haben soll.', 'Kirche'),
  ('ss9',  'Troodos Gebirge',                     'Troodos',      'Limassol',  false, 34.9167, 32.8667, '', 'Höchstes Gebirge Zyperns mit dem Gipfel Olympos (1952 m). Wunderschöne Wanderwege, byzantinische Kirchen und im Winter Skifahren.', 'Natur'),
  ('ss10', 'Hala Sultan Tekke',                   'Larnaka',      'Larnaka',   false, 34.8769, 33.6094, '', 'Islamisches Heiligtum am Salzsee von Larnaka – eines der bedeutendsten muslimischen Heiligtümer des östlichen Mittelmeers.', 'Kirche'),
  ('ss11', 'Lefkara Dorf',                        'Lefkara',      'Larnaka',   false, 34.8667, 33.3167, '', 'Malerisches Bergdorf berühmt für Lefkaritika-Spitzenklöppelei und Silberschmiedekunst – beide UNESCO-Kulturerbe.', 'Dorf'),
  ('ss12', 'Nikosia Altstadt & Ledra Street',     'Nikosia',      'Nikosia',   false, 35.1725, 33.3617, '', 'Herz der geteilten Hauptstadt. Die Ledra Street führt direkt zum einzigen Grenzübergang in einer Hauptstadt der Welt.', 'Stadt'),
  ('ss13', 'Larnaka Mittelalterliche Burg',       'Larnaka',      'Larnaka',   false, 34.9089, 33.6406, '', 'Byzantinische Burg aus dem 7. Jahrhundert am Strand von Larnaka. Heute Museum mit Exponaten aus der Stadtgeschichte.', 'Burg'),
  -- Nordzypern
  ('sn1',  'Famagusta Altstadt',                  'Famagusta',    'Famagusta', true,  35.1247, 33.9422, '', 'Historische Hafenstadt mit mächtigen venezianischen Stadtmauern und der Katharinenkathedrale (heute Lala Mustafa Pasha Moschee). Einzigartiges mittelalterliches Stadtbild.', 'Stadt'),
  ('sn2',  'Varosha Ghost Town',                  'Famagusta',    'Famagusta', true,  35.1100, 33.9550, '', 'Verlassener Stadtteil von Famagusta – seit 1974 menschenleer. Die verfallenen Hochhäuser und Straßen bieten einen einzigartigen Einblick in die Geschichte der Insel.', 'Geschichte'),
  ('sn3',  'Golden Beach',                        'Karpaz',       'Karpaz',    true,  35.6167, 34.2333, '', 'Golden Beach auf der Karpaz-Halbinsel – einer der schönsten und abgelegensten Strände des Mittelmeers. Unberührte Natur, wilde Esel und türkisblaues Wasser.', 'Natur'),
  ('sn4',  'Kyrenia Burg',                        'Kyrenia',      'Kyrenia',   true,  35.3411, 33.3178, '', 'Byzantinische Burg aus dem 7. Jahrhundert am malerischen Hafen von Kyrenia. Beherbergt das weltberühmte Schiffswrackmuseum.', 'Burg'),
  ('sn5',  'Bellapais Kloster',                   'Bellapais',    'Kyrenia',   true,  35.3106, 33.3461, '', 'Gotisches Kloster aus dem 13. Jahrhundert mit spektakulärem Blick über das Kyrenia-Gebirge und das Meer. Literarisch bekannt durch Lawrence Durrell.', 'Kirche'),
  ('sn6',  'St. Hilarion Burg',                   'Kyrenia',      'Kyrenia',   true,  35.3194, 33.2817, '', 'Mittelalterliche Märchenburg hoch oben im Kyrenia-Gebirge. Soll Walt Disney als Vorlage für das Schloss in Dornröschen gedient haben.', 'Burg'),
  ('sn7',  'Apostolos Andreas Kloster',           'Karpaz',       'Karpaz',    true,  35.6453, 34.2961, '', 'Historisches Pilgerkloster an der Spitze der Karpaz-Halbinsel – heilige Stätte für Christen und Muslime gleichermaßen.', 'Kirche'),
  ('sn8',  'Salamis Ruinen',                      'Famagusta',    'Famagusta', true,  35.1833, 33.9044, '', 'Antike Ausgrabungsstätte der Stadt Salamis mit eindrucksvollem Theater, Gymnasium und Thermen. Eine der bedeutendsten archäologischen Stätten des östlichen Mittelmeers.', 'Antike'),
  ('sn9',  'Namik Kemal Gefängnis',               'Famagusta',    'Famagusta', true,  35.1219, 33.9422, '', 'Historisches osmanisches Gefängnis in der Altstadt von Famagusta, in dem der berühmte türkische Dichter Namık Kemal inhaftiert war.', 'Geschichte'),
  ('sn10', 'Buffavento Burg',                     'Kyrenia',      'Kyrenia',   true,  35.2972, 33.4025, '', 'Hoch oben im Kyrenia-Gebirge auf 950 m gelegen – bietet einen atemberaubenden Panoramablick über die gesamte Insel bis zur türkischen Küste.', 'Burg')
on conflict (id) do update set
  name        = excluded.name,
  location    = excluded.location,
  region      = excluded.region,
  is_north    = excluded.is_north,
  lat         = excluded.lat,
  lng         = excluded.lng,
  image_url   = excluded.image_url,
  description = excluded.description,
  category    = excluded.category,
  updated_at  = now();
