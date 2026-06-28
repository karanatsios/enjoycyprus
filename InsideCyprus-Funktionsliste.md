# Inside Cyprus – Funktionsliste & Arbeitsweise

Stand: 28. Juni 2026 — zuletzt automatisch aktualisiert

---

## Allgemein

**Inside Cyprus** ist eine deutschsprachige Informations- und Serviceplattform für Zypern – konzipiert für Expats, Touristen und Unternehmen. Die App ist als Progressive Web App (PWA) verfügbar und läuft auf Desktop, Tablet und Smartphone.

- **Technologie:** React Native (Expo SDK 56) mit expo-router, statisch exportiert für das Web
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
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

**INFORMATIONEN**
- 👥 Community – Inside Cyprus Community
- ❓ Zypern FAQ – 100 Fragen & Antworten (geplant)
- 📰 News – Nachrichten aus Zypern ✅
- 💼 Jobs in Zypern – Stellenangebote (geplant)
- 🚨 Notfallnummern – Wichtige Nummern auf Zypern
- 🏥 Krankenhäuser & Botschaften – Adressen und Karte (geplant)
- 🚌 Busverbindungen – Route mit Bus, Umstieg & Haltestellen
- 🎉 Events – Veranstaltungen, Partys & Konzerte
- 📍 Sehenswürdigkeiten – Die schönsten Orte der Insel (geplant)
- 🏖️ Blaue Flagge Strände – Zertifizierte Strände (geplant)
- 🌤️ Wetter – 7-Tage-Vorschau

**MEHR**
- 📲 App installieren – Android / iPhone Startbildschirm
- ℹ️ Info – Über Inside Cyprus (geplant)
- 📄 Impressum – Rechtliche Angaben (geplant)
- 📋 AGB – Allgemeine Geschäftsbedingungen (geplant)
- 👤 Profil – Mein Profil
- ⚙️ Einstellungen – App konfigurieren (geplant)
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
- 7 Quellen: Cyprus Mail, Kathimerini, Financial Mirror, Cyprus Today Online, Cyprus Scene + je ein deutschsprachiger Inside-Cyprus-Überblick
- Alle Links öffnen direkt im Browser (externer Link)

### 🌤️ Wetter (weather)
- 7-Tage-Wettervorschau für Zypern

### 🗺️ Karte (map)
- Interaktive Karte mit eingetragenen Unternehmen und Orten

### 🗂️ Alle Einträge (categories)
- Alle Unternehmen und Dienstleister durchsuchbar
- Filterung nach Kategorie und Region

### ➕ Eintrag erstellen (submit)
- Mehrstufiges Formular zur Erfassung eines Unternehmenseintrags
- Felder: Name, Kategorie, Region, Beschreibung, Kontaktdaten, Adresse, Website, Logo
- Direkt-Veröffentlichung für Admins (Status: approved, Plan-Score: 100)
- Admin-Testmodus: Checkbox zum sofortigen Freischalten beim Testen (🧪)
- Normale Einträge landen zur Prüfung in der Warteschlange

### 👤 Mein Eintrag (mein-eintrag)
- Eigenen Eintrag einsehen, bearbeiten und verlängern

### ⭐ Partner werden (partner)
- Informationen zum Affiliate-/Partnerprogramm
- Provisionsmodell

### 👤 Profil (profile)
- Benutzerprofil anzeigen und bearbeiten
- Supabase Auth (E-Mail / Passwort)

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
- Buchung pro Box und Zeitraum

**Strände (Auswahl):**
Nissi Beach, Fig Tree Bay, Coral Bay, Kourion Beach, Lady's Mile, Mackenzie Beach, Lara Beach, Agia Napa Municipal, Governor's Beach, Curium Beach, Evdimou Beach, Cape Greco

---

## 🌴 KI-Urlaubsplaner (planner)

Intelligenter Reiseplaner speziell für Zypern, betrieben mit der Claude API (Anthropic).

**Funktionen:**
- Chat-Interface auf Deutsch
- Schnellstart-Chips: „Strand empfehlen", „Rundreise planen", „Restaurants in Limassol", „Sehenswürdigkeiten", „Budget-Tipps", „Familienurlaub"
- **Spracheingabe:** Mikrofon-Button (Web Speech API) – spricht man, wird der Text automatisch ins Eingabefeld übertragen und gesendet
- **Standorterkennung:** Nutzerstandort wird per Geolocation-API erkannt und einer Zypern-Region (Paphos / Limassol / Nikosia / Ayia Napa / Nordteil) zugeordnet
- KI antwortet kontextbezogen auf Zypern-Reisefragen

**Technisch:**
- Modell: `claude-sonnet-4-6`
- Direkte Browser-API-Anfrage (Header: `anthropic-dangerous-direct-browser-access: true`)
- API-Key via Umgebungsvariable `EXPO_PUBLIC_ANTHROPIC_API_KEY`
- Konversationsverlauf bleibt während der Sitzung erhalten

---

## 🔐 Admin-Bereich

Nur für autorisierte Administratoren zugänglich (`karanatsios@mailbox.org`, `vitali.vs@gmx.de`).

**Benutzerverwaltung:**
- Alle registrierten Nutzer werden aufgelistet
- E-Mail-Adresse, Registrierungsdatum und aktueller Status sichtbar

**Rollen & Tags:**
| Rolle | Tag | Farbe | Bedeutung |
|-------|-----|-------|-----------|
| admin | Admin | 🔐 Lila | Vollzugriff auf alle Bereiche |
| partner | Affiliate-Partner | ⭐ Orange | Partnerprogramm-Mitglied |
| user | Kunde | 👤 Grün | Normaler Nutzer |

- Tags werden automatisch berechnet und in der Supabase-Datenbank (`profiles.tag`) gespeichert
- Umschalten Admin ↔ Kunde per Toggle-Switch mit sofortiger Wirkung
- Änderungen werden sofort in der UI und in der Datenbank gespeichert

**Eintragsfreischaltung:**
- Neue Unternehmenseinträge zur Prüfung und Freigabe

---

## Technische Architektur

### Frontend
- React Native + Expo SDK 56
- expo-router (file-based routing, Tab + Stack Navigation)
- react-native-web für Browserdarstellung
- i18next für Mehrsprachigkeit (aktuell: Deutsch)
- Statischer Export → `dist/` Ordner

### Backend (Supabase)
- **Auth:** E-Mail/Passwort-Authentifizierung
- **Datenbank:** PostgreSQL mit Row Level Security (RLS)
- **Tabellen:**
  - `profiles` – Nutzerprofile (role, tag, is_partner)
  - `listings` – Unternehmenseinträge (status, plan_score, region, …)
  - `events` – Veranstaltungen
- **Realtime:** Subscriptions für Live-Updates

### Deployment
- **Plattform:** Vercel
- **Methode:** Statisches Deployment aus `dist/`
- **Build:** `npx expo export -p web` → post-build Viewport-Patch via `scripts/fix-viewport.js`
- **Branches:** `main` → Produktion

### Mobile-Optimierungen
- Viewport: `maximum-scale=1, user-scalable=no` verhindert ungewolltes Zoomen
- Patchscript: `scripts/fix-viewport.js` setzt Viewport nach jedem Build korrekt

---

## Geplante Features (Roadmap)

- 🌐 Zypern FAQ – 100 häufige Fragen mit Antworten
- 💼 Jobportal – Stellenangebote suchen und aufgeben
- 🏥 Krankenhäuser & Botschaften – mit Karte und Kontaktdaten
- 📍 Sehenswürdigkeiten – Top-Orte der Insel mit Fotos
- 🏖️ Blaue Flagge Strände – Liste und Karte zertifizierter Strände
- 📲 PWA-Installation – Anleitung für Android und iPhone
- ℹ️ Info / Impressum / AGB – rechtliche Pflichtseiten
- ⚙️ Einstellungen – Sprache, Benachrichtigungen, Dark Mode

---

*Erstellt mit Claude Code · Inside Cyprus © 2026*
