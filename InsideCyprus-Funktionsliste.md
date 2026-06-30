# Inside Cyprus – Funktionsliste & Arbeitsweise

Stand: 28. Juni 2026 — zuletzt aktualisiert

---

## Allgemein

**Inside Cyprus** ist eine deutschsprachige Informations- und Serviceplattform für Zypern – konzipiert für Expats, Touristen und Unternehmen. Die App ist als Progressive Web App (PWA) verfügbar und läuft auf Desktop, Tablet und Smartphone.

- **Technologie:** React Native (Expo SDK 56) mit expo-router, statisch exportiert für das Web
- **Backend:** Supabase (PostgreSQL, Auth, Realtime, Edge Functions)
- **Hosting:** Vercel (statisches Deployment aus dem `dist/`-Ordner)
- **Sprache:** Deutsch

---

## Navigation & Struktur

### Bottom Tab Bar (immer sichtbar)
| Tab | Icon | Funktion |
|-----|------|----------|
| Start | 🏠 | Startseite mit Kategorien und Suche |
| Events | 🎉 | Veranstaltungen und Partys |
| Community | grünes Oval | Community-Bereich |
| Notfall | 🚨 | Notfallnummern (rot hervorgehoben) |
| Bus | 🚌 | Busverbindungen (orange hervorgehoben) |

### Hamburger-Menü (oben rechts)
Vierstufige Struktur mit allen weiteren Screens:

**NAVIGATION**
- 🌴 Urlaubsplaner – KI-Reiseplaner für Zypern
- 🏠 Start – Kategorien und Suche
- 🗂️ Alle Einträge – Alle Unternehmen durchsuchen
- 🗺️ Karte – Orte auf der Karte finden
- ⭐ Partner werden – Provisionen verdienen
- 📦 Beachbox – Strandboxen mieten (10 €/Tag)

**FÜR UNTERNEHMEN**
- ➕ Eintrag erstellen – Unternehmen eintragen
- 👤 Mein Eintrag – Eintrag bearbeiten / verlängern
- 📣 Marketing – Push-Aktionen & Geo-Notifications

**INFORMATIONEN**
- 👥 Community – Inside Cyprus Community
- ❓ Zypern FAQ – 35+ Fragen & Antworten (7 Kategorien)
- 📰 News – Nachrichten aus Zypern
- 🚨 Notfallnummern – Wichtige Nummern auf Zypern
- 🚌 Busverbindungen – Route mit Bus, Umstieg & Haltestellen
- 🎉 Events – Veranstaltungen, Partys & Konzerte
- 🌤️ Wetter – 7-Tage-Vorschau

**MEHR**
- 👤 Profil – Mein Profil
- 🔐 Admin – Verwaltung & Freischaltung (nur für Admins)

---

## Screens & Funktionen im Detail

### 🏠 Start (index)
- Kategorien-Übersicht für Zypern-Einträge
- Suchfunktion
- Regionsfilter (Nord / Süd)

### 🎉 Events
- Liste aller Veranstaltungen aus der Supabase-Datenbank
- Anzeige mit Datum, Ort und Beschreibung

### 👥 Community
- Community-Bereich für Inside-Cyprus-Nutzer

### 🚨 Notfall (emergency)
- Übersicht der wichtigsten Notfallnummern auf Zypern
- Polizei, Feuerwehr, Krankenwagen, Botschaften

### 🚌 Bus
- Busverbindungen auf Zypern suchen
- Anzeige von Umstieg und Haltestellen

### 📰 News (news)
- Aktuelle Nachrichtenquellen aus Zypern (Süden & Norden)
- Filter: Alle / Süden / Norden
- Alle Links öffnen direkt im Browser

### 🌤️ Wetter (weather)
- 7-Tage-Wettervorschau für Zypern

### 🗺️ Karte (map) ✅ komplett überarbeitet

Interaktive Leaflet-Karte mit folgenden Ebenen:

**Layer-System (Filter-Chips)**
| Chip | Farbe | Inhalt |
|------|-------|--------|
| 📍 Sehenswürdigkeiten | Orange | 15 Orte (Aphrodite Felsen, Kolossi Burg, Kyrenia Burg, Bellapais, Kourion, Cape Greco, Kykkos, Troodos, Nikosia Altstadt u.v.m.) |
| 🏖️ Strände | Blau | 8 Strände (Nissi Beach, Fig Tree Bay, Coral Bay, Lara Beach, Governor's Beach u.a.) |
| 🏥 Krankenhäuser | Rot | 5 Krankenhäuser (Limassol, Nikosia, Larnaka, Paphos, Nordzypern) |
| ℹ️ Tourist Info | Lila | 5 Infopunkte (Larnaka Flughafen, Paphos, Limassol, Nikosia, Ayia Napa) |
| 🏢 Unternehmen | Grün | Alle freigeschalteten Einträge aus Supabase |

**Marker:**
- 40px große farbige Kreise mit weißem Rand, sofort sichtbar
- Klick öffnet Popup mit: Name, Typ-Label, Beschreibung, Bewertung, Adresse, Telefon
- Buttons im Popup: 🔊 Vorlesen · 🗺️ Route (Google Maps) · ⭐ Bewerten

**Bewertungs-Modal:**
- 1–5 Sterne auswählen
- Kommentar + Name (optional)
- Speichert direkt in Supabase `place_reviews`

**Sprachausgabe:**
- Web Speech API (`SpeechSynthesisUtterance`, Sprache: `de-DE`)
- Funktioniert in Chrome, Edge, Safari
- Vorlesen im Popup und im Detail-Panel

**Ortsliste unter der Karte:**
- Horizontal scrollbare Karten aller sichtbaren Orte
- Tippen öffnet Detail-Panel mit vollständiger Info + Sprachausgabe + Route

**Daten:**
- 34 Orte statisch eingebaut (Fallback, funktioniert auch ohne Supabase-Tabelle)
- Nach SQL-Migration lädt die Karte aus `places`-Tabelle in Supabase
- SQL: `supabase/migrations/20260628_places_reviews.sql`

### 🗂️ Alle Einträge (categories)
- Alle Unternehmen und Dienstleister durchsuchbar
- Filterung nach Kategorie und Region

### ➕ Eintrag erstellen (submit)
- Mehrstufiges Formular zur Erfassung eines Unternehmenseintrags
- Felder: Name, Kategorie, Region, Beschreibung, Kontaktdaten, Adresse, Website, Logo
- Direkt-Veröffentlichung für Admins (Status: approved, Plan-Score: 100)
- Normale Einträge landen zur Prüfung in der Warteschlange

### 👤 Mein Eintrag (mein-eintrag)
- Eigenen Eintrag einsehen, bearbeiten und verlängern
- Marketing-Button → direkt zur Push-Aktion-Erstellung

### ⭐ Partner werden (partner)
- Informationen zum Affiliate-/Partnerprogramm
- Provisionsmodell

### 👤 Profil (profile)
- Benutzerprofil anzeigen und bearbeiten
- Supabase Auth (E-Mail / Passwort)

### ❓ FAQ (faq)
- 35+ Fragen & Antworten zu Zypern
- 7 Kategorien: Einreise, Wohnen, Arbeit, Finanzen, Gesundheit, Alltag, Sonstiges
- Accordion-Format (aufklappbar)

---

## 📦 Beachbox

Strandboxen-Mietservice für Zypern.

**Buchungsablauf:**
1. Strand auswählen (12 verfügbare Strände)
2. Box auswählen (12 Boxen pro Strand, visuelles 3×4-Raster)
3. Mietdauer festlegen: Von-/Bis-Datum (bis zu 60 Tage)
4. Zusammenfassung: Mietpreis + Sicherheitspfand
5. Buchungsbestätigung

**Konditionen:**
- Preis: 10 €/Tag
- Sicherheitspfand: 80 € (reserviert, nicht abgebucht)
- Maximale Mietdauer: 60 Tage

---

## 🌴 KI-Urlaubsplaner (planner)

Intelligenter Reiseplaner speziell für Zypern, betrieben mit der Claude API (Anthropic).

**Funktionen:**
- Chat-Interface auf Deutsch
- Schnellstart-Chips: „Strand empfehlen", „Rundreise planen", „Restaurants in Limassol", „Sehenswürdigkeiten", „Budget-Tipps", „Familienurlaub"
- **Spracheingabe:** Mikrofon-Button (Web Speech API)
- **Standorterkennung:** Nutzerstandort → Zypern-Region

**Technisch:**
- Modell: `claude-sonnet-4-6`
- API-Key via `EXPO_PUBLIC_ANTHROPIC_API_KEY`

---

## 📣 Marketing / Push-Notifications

Geo-zielgerichtete Push-Aktionen für Unternehmen.

**Funktionen:**
- 3 Tabs: Aktion erstellen / Meine Kampagnen / Credits
- Radius-Auswahl: 5 / 10 / 25 / 50 km
- Zeitplanung: Startdatum + Enddatum
- Credit-Badge im Header (live aus Supabase)

**Credit-Pakete:**
| Paket | Credits | Preis |
|-------|---------|-------|
| Starter | 1 | 5 € |
| Basic | 5 | 20 € |
| Pro | 15 | 45 € |
| Business | 40 | 99 € |
| Unlimited | ∞ | 199 € |

**Technisch:**
- Supabase-Tabellen: `push_subscriptions`, `notifications`, `notification_credits`, `credit_purchases`
- PostGIS: `get_subscriptions_in_radius()` für Geo-Filterung
- Edge Function: `send-notifications` (Deno, web-push@3.6.7)
- pg_cron: alle 5 Minuten → Edge Function aufrufen
- VAPID-Schlüssel: in `.env` und Supabase Secrets

**Setup-Status → Details in TODO.md**

---

## 🔐 Admin-Bereich

Nur für: `karanatsios@mailbox.org`, `vitali.vs@gmx.de`

**Funktionen:**
- Alle Nutzer auflisten mit Status
- Admin ↔ Kunde umschalten (Toggle)
- Einträge freischalten

---

## Technische Architektur

### Frontend
- React Native + Expo SDK 56
- expo-router (file-based routing, Tab + Stack Navigation)
- Leaflet.js in iframe für die Karte
- Statischer Export → `dist/` Ordner

### Backend (Supabase)
- **Auth:** E-Mail/Passwort-Authentifizierung
- **Datenbank:** PostgreSQL mit Row Level Security (RLS)

**Tabellen:**
| Tabelle | Inhalt |
|---------|--------|
| `profiles` | Nutzerprofile (role, tag, is_partner) |
| `businesses` | Unternehmenseinträge |
| `events` | Veranstaltungen |
| `push_subscriptions` | Browser Push Endpoints + Geo-Koordinaten |
| `notifications` | Geplante Push-Aktionen (status, radius_km, starts_at, ends_at) |
| `notification_credits` | Credit-Guthaben pro Nutzer |
| `credit_purchases` | Kaufhistorie |
| `places` | Sehenswürdigkeiten, Strände, Krankenhäuser, Tourist-Info *(SQL noch auszuführen)* |
| `place_reviews` | Nutzerbewertungen für Orte *(SQL noch auszuführen)* |

### Deployment
- **Plattform:** Vercel
- **Branch:** `main` → Produktion
- **Build:** `npx expo export -p web` → `node scripts/fix-viewport.js` → `git push`

---

## Git / Secrets

- **GitHub Repo:** `karanatsios/enjoycyprus`
- **Branch:** `main`
- **PAT:** in git remote URL für Pushes
- **Supabase URL:** `https://jewactcyhvzrceoiajau.supabase.co`
- **Supabase Anon Key:** `sb_publishable_pL8YXchXN3EsRs8_K7A8PA_C45DftbB`
- **Admin-E-Mails:** `karanatsios@mailbox.org`, `vitali.vs@gmx.de`
- **VAPID Public Key:** `BAMdRkE7TM8jYPbJ7ONbGWgKsqH74u3y8fAplr7GKK6Qz26wVykoAX-Cg8IEhNO61aHVB0a-PmrGWqHGF_r03JM`
- **VAPID Private Key:** *(in Supabase Secrets gespeichert – nie committen!)*

---

*Erstellt mit Claude Code · Inside Cyprus © 2026*
