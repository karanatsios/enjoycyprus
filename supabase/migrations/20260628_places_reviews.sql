-- Places & Reviews for Inside Cyprus Map
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- sehenswuerdigkeit | strand | krankenhaus | tourist_info | restaurant
  description TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  address TEXT,
  phone TEXT,
  website TEXT,
  image_url TEXT,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  region TEXT, -- sueden | norden
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS place_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  author_name TEXT DEFAULT 'Anonym',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Places public read" ON places FOR SELECT USING (true);
CREATE POLICY "Reviews public read" ON place_reviews FOR SELECT USING (true);
CREATE POLICY "Users insert reviews" ON place_reviews FOR INSERT WITH CHECK (true);

-- Seed: Sehenswürdigkeiten
INSERT INTO places (name, type, description, lat, lng, region) VALUES
('Aphrodite Felsen (Petra tou Romiou)', 'sehenswuerdigkeit', 'Der Geburtsort der Göttin Aphrodite – einer der bekanntesten Orte Zyperns. Spektakuläre Felsformation am Meer, bei Sonnenuntergang besonders schön.', 34.6133, 32.5019, 'sueden'),
('Kolossi Burg', 'sehenswuerdigkeit', 'Mittelalterliche Burg aus dem 13. Jahrhundert, einst Hauptquartier der Kreuzritter. Bekannt für ihre Zuckerrohr-Produktion.', 34.6678, 32.9231, 'sueden'),
('Kourion Amphitheater', 'sehenswuerdigkeit', 'Beeindruckendes griechisch-römisches Amphitheater mit Blick auf das Meer. Heute noch für Konzerte und Aufführungen genutzt.', 34.6606, 32.8878, 'sueden'),
('Kyrenia Burg', 'sehenswuerdigkeit', 'Byzantinische Burg aus dem 7. Jahrhundert am Hafen von Kyrenia. Beherbergt das berühmte Schiffswrack-Museum.', 35.3411, 33.3178, 'norden'),
('Bellapais Kloster', 'sehenswuerdigkeit', 'Gotisches Kloster aus dem 13. Jahrhundert mit atemberaubendem Blick über das Kyrenia-Gebirge. Eines der schönsten Bauwerke Zyperns.', 35.3106, 33.3461, 'norden'),
('Famagusta Altstadt', 'sehenswuerdigkeit', 'Mittelalterliche Stadtmauern und die Katharinenkathedrale (heute Lala Mustafa Moschee). Beeindruckende venezianische Architektur.', 35.1247, 33.9422, 'norden'),
('Akamas Halbinsel', 'sehenswuerdigkeit', 'Unberührte Naturlandschaft im Nordwesten Zyperns. Wanderwege, Schildkröten-Nistplätze und das Aphrodite-Bad.', 35.0833, 32.3167, 'sueden'),
('Tombs of the Kings', 'sehenswuerdigkeit', 'Eindrucksvolles unterirdisches Nekropolis aus dem 4. Jahrhundert v. Chr. UNESCO-Weltkulturerbe in Paphos.', 34.7764, 32.3947, 'sueden'),
('Paphos Mosaiken', 'sehenswuerdigkeit', 'Weltberühmte römische Bodenmosaiken aus dem 3./4. Jahrhundert n. Chr. UNESCO-Weltkulturerbe im Archäologischen Park Paphos.', 34.7569, 32.4081, 'sueden'),
('Cape Greco', 'sehenswuerdigkeit', 'Atemberaubendes Kap im Südosten Zyperns mit kristallklarem Wasser, Meereshöhlen und Wanderwegen.', 34.9583, 34.0786, 'sueden'),
('Kykkos Kloster', 'sehenswuerdigkeit', 'Das reichste und bekannteste Kloster Zyperns, tief im Troodos-Gebirge. Beherbergt eine wertvolle Ikone der Jungfrau Maria.', 34.9844, 32.7397, 'sueden'),
('Troodos Gebirge', 'sehenswuerdigkeit', 'Das höchste Gebirge Zyperns mit dem Gipfel Olympos (1952m). Byzantinische Kirchen, Wanderwege und im Winter Skifahren.', 34.9167, 32.8667, 'sueden'),
('Hala Sultan Tekke', 'sehenswuerdigkeit', 'Muslimisches Heiligtum am Salzsee von Larnaka, eines der wichtigsten islamischen Pilgerziele im Mittelmeerraum.', 34.8769, 33.6094, 'sueden'),
('Lefkara Dorf', 'sehenswuerdigkeit', 'Malerisches Bergdorf bekannt für seine Spitzenklöppelei (Lefkaritika) und Silberschmiedekunst. UNESCO-Kulturerbe.', 34.8667, 33.3167, 'sueden'),
('Nikosia Altstadt & Ledra Street', 'sehenswuerdigkeit', 'Das Herz der geteilten Hauptstadt Zyperns. Einkaufsstraße, venezianische Stadtmauern und der einzige Grenzübergang in einer Hauptstadt der Welt.', 35.1725, 33.3617, 'sueden');

-- Seed: Strände
INSERT INTO places (name, type, description, lat, lng, region) VALUES
('Nissi Beach', 'strand', 'Einer der beliebtesten Strände Zyperns in Ayia Napa. Weißer Sand, türkisblaues Wasser, lebhaftes Treiben. Blaue Flagge zertifiziert.', 34.9889, 34.0019, 'sueden'),
('Fig Tree Bay', 'strand', 'Schöner Sandstrand in Protaras mit ruhigem, flachem Wasser – ideal für Familien. Blaue Flagge zertifiziert.', 35.0125, 34.0572, 'sueden'),
('Coral Bay', 'strand', 'Beliebter Sandstrand nördlich von Paphos mit vielen Wassersportmöglichkeiten und Restaurants in der Nähe.', 34.8356, 32.3700, 'sueden'),
('Kourion Beach', 'strand', 'Wilder, unberührter Kiesstrand unter den Klippen des antiken Kourion. Ideal zum Schnorcheln.', 34.6519, 32.8744, 'sueden'),
('Lady\'s Mile Beach', 'strand', 'Langer, ruhiger Strand westlich von Limassol. Naturbelassen, wenig Touristen. Beliebter Kite-Surf-Spot.', 34.6456, 33.0017, 'sueden'),
('Mackenzie Beach', 'strand', 'Urbaner Strand in Larnaka direkt neben dem Flughafen. Lebhafte Atmosphäre, viele Bars und Restaurants.', 34.8689, 33.6336, 'sueden'),
('Lara Beach', 'strand', 'Abgelegener, unberührter Strand auf der Akamas-Halbinsel. Wichtiger Nistplatz für Caretta-Caretta-Schildkröten. Naturschutzgebiet.', 35.0544, 32.3125, 'sueden'),
('Governor\'s Beach', 'strand', 'Einzigartiger Strand mit weißen Klippen und schwarzem Kieselstrand östlich von Limassol.', 34.7186, 33.2683, 'sueden');

-- Seed: Krankenhäuser
INSERT INTO places (name, type, description, lat, lng, address, phone, region) VALUES
('Limassol General Hospital', 'krankenhaus', 'Staatliches Allgemeinkrankenhaus Limassol. Notaufnahme 24/7. Deutschsprachige Ärzte auf Anfrage.', 34.7058, 33.0361, 'Nikiforou Foka, Limassol', '+357 25 801100', 'sueden'),
('Nikosia General Hospital (GESY)', 'krankenhaus', 'Größtes staatliches Krankenhaus Zyperns. Alle Fachabteilungen. Notaufnahme rund um die Uhr.', 35.1500, 33.3667, 'Athalassas Avenue, Nikosia', '+357 22 603000', 'sueden'),
('Larnaka General Hospital', 'krankenhaus', 'Staatliches Krankenhaus Larnaka mit Notaufnahme und allen wichtigen Fachabteilungen.', 34.9050, 33.6439, 'Grigori Afxentiou, Larnaka', '+357 24 800500', 'sueden'),
('Paphos General Hospital', 'krankenhaus', 'Staatliches Krankenhaus Paphos. Notaufnahme 24h. Wichtigste medizinische Versorgung im Westen Zyperns.', 34.7744, 32.4197, 'Neofytou Nikolaidi, Paphos', '+357 26 803100', 'sueden'),
('Evangelismos Private Hospital Nikosia', 'krankenhaus', 'Privatkrankenhaus mit deutschsprachigem Personal. Hoher Komfortstandard, kürzere Wartezeiten.', 35.1597, 33.3672, 'Nikodimou Mylona 44, Nikosia', '+357 22 841000', 'sueden'),
('Near East University Hospital (Norden)', 'krankenhaus', 'Modernes Universitätskrankenhaus in Nordzypern. Alle Fachabteilungen, Notaufnahme 24/7.', 35.2028, 33.3678, 'Nikosia-Güzelyurt Yolu, Nordzypern', '+90 392 675 1000', 'norden');

-- Seed: Tourist Information
INSERT INTO places (name, type, description, lat, lng, address, phone, region) VALUES
('Tourist Information Larnaka Flughafen', 'tourist_info', 'Offizielle Touristeninformation direkt im Ankunftsbereich des Flughafens. Karten, Broschüren, Hotelhilfe.', 34.8753, 33.6253, 'Larnaka International Airport', '+357 24 643576', 'sueden'),
('Tourist Information Paphos', 'tourist_info', 'Zentrale Touristeninformation Paphos. Ausflugstipps, Karten, Veranstaltungskalender.', 34.7731, 32.4242, 'Gladstone Street 3, Paphos', '+357 26 932841', 'sueden'),
('Tourist Information Limassol', 'tourist_info', 'Touristeninformation im Stadtzentrum Limassol. Stadtführungen, Events, Ausflüge.', 34.6769, 33.0444, 'Spyrou Araouzou 115, Limassol', '+357 25 362756', 'sueden'),
('Tourist Information Nikosia', 'tourist_info', 'Touristeninformation in der Altstadt Nikosia. Stadtplan, Sehenswürdigkeiten, geführte Touren.', 35.1719, 33.3642, 'Aristokyprou 11, Nikosia', '+357 22 674264', 'sueden'),
('Tourist Information Ayia Napa', 'tourist_info', 'Touristeninformation im Zentrum von Ayia Napa. Nachtleben, Ausflüge, Strände.', 34.9844, 34.0022, 'Krio Nero Avenue, Ayia Napa', '+357 23 721796', 'sueden');
