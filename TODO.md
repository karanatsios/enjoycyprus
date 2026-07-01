# Inside Cyprus – Offene To-dos

Stand: 30. Juni 2026 (Abend) — bitte nach jeder erledigten Aufgabe abhaken ([ ] → [x])

> 👋 **Beim nächsten Start:** Diese Datei zuerst lesen und offene [ ]-Punkte mit dem Nutzer besprechen.

---

## 🔴 Kritisch – Marketing / Push-Notifications

- [x] **VAPID-Schlüssel generiert** ✅
  - Public Key: `BAMdRkE7TM8jYPbJ7ONbGWgKsqH74u3y8fAplr7GKK6Qz26wVykoAX-Cg8IEhNO61aHVB0a-PmrGWqHGF_r03JM`
  - Private Key: `G2fY6cq5Q6WVC1kz1Sy-HQJDIrfF_fU0l0eJ3k_h3zQ` ⚠️ Geheim halten!
  - Public Key bereits in `.env` eingetragen
  - [ ] **Noch offen:** Public Key in **Vercel** → Settings → Environment Variables → `EXPO_PUBLIC_VAPID_PUBLIC_KEY`
  - [ ] **Noch offen:** Private Key in **Supabase** → Edge Functions → Secrets → `VAPID_PRIVATE_KEY`

- [x] **Supabase Edge Function deployed** ✅ (`send-notifications`)
- [x] **Cron-Job eingerichtet** ✅ (pg_cron, alle 5 Minuten)
- [x] **Supabase DB Function `deduct_notification_credit` angelegt** ✅

---

## 🟠 Wichtig – Stripe (Bezahlung)

- [ ] **Stripe-Konto erstellen** → https://dashboard.stripe.com/register
- [ ] **5 Payment Links erstellen** (je Paket einen)
  - Starter 1 Credit – 5 € · Basic 5 Credits – 20 € · Pro 15 Credits – 45 €
  - Business 40 Credits – 99 € · Unlimited ∞ – 199 €
  - Datei: `/app/(tabs)/marketing.tsx` → `openStripe()` → `links`-Objekt
- [ ] **Stripe Webhook** → `checkout.session.completed` → Supabase Edge Function

---

## 🟠 Wichtig – Domain & SSL

- [x] **Eigene Domain gekauft** ✅
- [ ] **Domain in Vercel verknüpfen** → Settings → Domains → DNS setzen
- [ ] **Google Safe Browsing bereinigen** nach Domain-Wechsel

---

## 🟠 Wichtig – Rechtliche Pflichtseiten

- [ ] **Impressum** (`/app/(tabs)/impressum.tsx`)
- [ ] **Datenschutzerklärung** (`/app/(tabs)/datenschutz.tsx`)
- [ ] **AGB** (`/app/(tabs)/agb.tsx`)
- [ ] **Alle drei im Hamburger-Menü verlinken** (`components/AppHeader.tsx`)

---

## 🟡 Neue Feature-Ideen (Roadmap-Erweiterung)

- [ ] **Essen bestellen** – Lieferdienste auf Zypern integrieren (z.B. Wolt, Foody.com.cy, lokale Anbieter)
  - Entweder eigene Übersicht mit Links/Deep-Links zu den Apps
  - Oder direkte API-Anbindung falls verfügbar
  - Ziel: Nutzer kann direkt aus Inside Cyprus heraus Essen bestellen

- [ ] **Taxi / Ride-Hailing** – Bolt und lokale Taxidienste integrieren
  - Bolt ist auf Zypern sehr verbreitet (Limassol, Nikosia, Larnaka, Paphos)
  - Deep-Link zu Bolt-App + Übersicht lokaler Taxiunternehmen mit Telefonnummer
  - Optional: Preisvergleich / Direktbuchung

- [ ] **Flugplan** – Ankunfts- & Abflugzeiten Paphos (PFO) + Larnaka (LCA)
  - API-Anbindung: AeroDataBox, AviationStack oder FlightAware
  - Anzeige: Flugnummer, Airline, Herkunft/Ziel, Zeit, Status (pünktlich/verspätet)
  - Filter: Ankünfte / Abflüge, nach Flughafen
  - Suche nach Flugnummer

- [ ] **Parking Zypern** – Parkplätze finden, alle Städte
  - Paphos: PafosParking App (bereits bekannt)
  - Recherche: Gibt es ähnliche Apps/APIs für Limassol, Larnaka, Nikosia, Ayia Napa?
  - Integration: Karte mit verfügbaren Parkplätzen, P+R, Parkgebühren
  - API prüfen ob Echtzeit-Verfügbarkeit möglich
  - Alternativ: statische Übersicht der wichtigsten Parkhäuser mit Adressen je Stadt

- [ ] **Strand-Bewertungen** – Nutzer können Strände bewerten & kommentieren
  - Sternebewertung (1–5) pro Strand
  - Kurzer Kommentar / Erfahrungsbericht
  - Durchschnittsbewertung live anzeigen (Supabase-Trigger)
  - Moderation durch Admin

- [ ] **Community-Upload** – Nutzer können eigene Inhalte einreichen *(größeres Feature, Planung nötig)*
  - **Eigene Bilder hochladen** zu bestehenden Stränden / Sehenswürdigkeiten
  - **Neue Strände vorschlagen** – Name, Standort (GPS oder Karte), Foto → landet zur Prüfung beim Admin
  - **Neue Sehenswürdigkeiten vorschlagen** – gleicher Flow wie Strände
  - Admin-Freigabe-Workflow: Vorschlag → Admin prüft → freischalten oder ablehnen
  - Supabase Storage für Bild-Upload, RLS für Zugriffsschutz
  - ⚠️ Erfordert eigene Planungssession (Datenbankstruktur, Moderation, UI)

---

## 🟡 Geplante Features (Roadmap)

- [ ] **Zypern FAQ erweitern** – weitere Fragen ergänzen (aktuell ~35 Einträge)
- [ ] **Jobportal** – Stellenangebote suchen und aufgeben
- [ ] **Jobs – Automatische DB-Befüllung** (pg_cron oder externer Scraper)
- [ ] **PWA-Installation** – Anleitung Android/iPhone (Add to Homescreen)
- [ ] **Einstellungen** – Sprache, Benachrichtigungen, Dark Mode
- [ ] **Bewertungen** – Durchschnitt live per Supabase-Trigger aktualisieren
- [ ] **Karte – Fotos** bei Sehenswürdigkeiten ergänzen (`image_url` vorhanden)
- [ ] **Blaue Flagge Strände** – restliche Bilder für Famagusta-Strände hochladen (Sandy Bay, Pantachou, Sunrise, Konnos Bay)

---

## 🟢 Bereits erledigt

- [x] Start / Index – Kategorien & Suche
- [x] Events – Veranstaltungen aus Supabase
- [x] Community, Notfallnummern, Busverbindungen
- [x] News – Süden/Norden Filter
- [x] Wetter – 7-Tage-Vorschau
- [x] Alle Einträge, Eintrag erstellen, Mein Eintrag
- [x] Partner werden, Profil
- [x] KI-Urlaubsplaner (Claude API)
- [x] Beachbox – Buchungsflow komplett
- [x] Admin-Bereich – Nutzerverwaltung, Multi-Tags, Toggle (Seite selbst OK, Menülink-Bug offen)
- [x] FAQ – Accordion, 35+ Fragen, 7 Kategorien
- [x] Marketing – Push-Aktion, Credits, Kampagnenübersicht
- [x] Service Worker (sw.js) für Push-Empfang
- [x] Supabase Edge Function `send-notifications` + pg_cron
- [x] **Karte – Layer-System** ✅ (Sehenswürdigkeiten, Strände, Krankenhäuser, Tourist Info, Bewertungen)
- [x] **Blaue Flagge Strände** ✅
  - Supabase `beaches`-Tabelle mit allen Feldern (name, location, region, lat, lng, image_url)
  - Strände ohne Code-Deploy hinzufügbar (nur SQL/Supabase Dashboard)
  - Suchleiste zum Filtern nach Name/Ort
  - Regionfilter-Chips (Alle / Famagusta / Paphos / Limassol / Larnaca)
  - Bilder aus Supabase Storage (mit picsum-Fallback)
  - Button **„Auf Karte anzeigen"** → In-App Leaflet-Karte zentriert auf Strand
  - Button **„Route planen"** → Google Maps Routenplaner (Standort → Strand)
  - Vercel-Build-Fix: `build`-Script + `buildCommand` in `vercel.json` ergänzt
  - Aktuell ~35 Strände aktiv (Famagusta, Paphos, Limassol, Larnaca)

---

## 🔴 MORGEN ZUERST – Admin-Bereich Navigation (offenes Problem)

- [ ] **Admin-Menülink funktioniert nicht via Hamburger-Menü**
  - Manuell `/admin` eintippen → funktioniert ✅
  - Klick im Menü → zeigt leere Seite ✗
  - Ursache noch unklar: `router.push('/(tabs)/admin')` vs. URL `/admin` im Browser
  - **Zuerst testen:** Ob nach dem Realtime-Fix (Commit `af0b986`) das Menü wieder geht
  - Wenn nicht: Routing-Strategie für Expo Router Web sorgfältig prüfen (Docs lesen!)
  - **Kein Schnellschuss mehr** – erst verstehen, dann ändern

---

## 📋 Als nächstes

1. **Admin-Bereich** – Menünavigation fixen (siehe oben)
2. **Vercel:** `EXPO_PUBLIC_VAPID_PUBLIC_KEY` Environment Variable eintragen
3. **Stripe-Konto** erstellen + 5 Payment Links anlegen + in `marketing.tsx` eintragen
4. **Impressum / Datenschutz / AGB** anlegen
5. **Domain** in Vercel verknüpfen
6. Restliche Strand-Bilder hochladen (Sandy Bay, Pantachou, Sunrise Beach, Konnos Bay)

---

## 🔖 Morgen einrichten – Git-Versionierung (Feature-Tags)

**Idee:** Vor jeder neuen Implementierung einen Git-Tag setzen, nach Abnahme ebenfalls. So kann jederzeit auf einen funktionierenden Stand zurückgegriffen werden.

**Workflow:**
1. Vor Änderung: `git tag v-DATUM-FEATURE-before` (z.B. `v-20260701-stripe-before`)
2. Änderung implementieren & testen
3. Nach Abnahme: `git tag v-DATUM-FEATURE-stable` (z.B. `v-20260701-stripe-stable`)
4. Tags pushen: `git push origin --tags`
5. Zurückrollen bei Bedarf: `git checkout v-DATUM-FEATURE-stable`

**Nächste Session:** Script oder Alias anlegen, der das automatisch macht.

---

*Inside Cyprus © 2026 – To-do-Liste für Entwicklung und Setup*
