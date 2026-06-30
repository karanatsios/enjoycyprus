# Inside Cyprus – Offene To-dos

Stand: 28. Juni 2026 — bitte nach jeder erledigten Aufgabe abhaken ([ ] → [x])

---

## 🔴 Kritisch – Marketing / Push-Notifications

Diese Punkte müssen erledigt werden, damit Push-Aktionen wirklich beim Nutzer ankommen:

- [x] **VAPID-Schlüssel generiert** ✅
  - Public Key: `BAMdRkE7TM8jYPbJ7ONbGWgKsqH74u3y8fAplr7GKK6Qz26wVykoAX-Cg8IEhNO61aHVB0a-PmrGWqHGF_r03JM`
  - Private Key: `G2fY6cq5Q6WVC1kz1Sy-HQJDIrfF_fU0l0eJ3k_h3zQ` ⚠️ Geheim halten!
  - Public Key bereits in `.env` eingetragen
  - [ ] **Noch offen:** Public Key in **Vercel** eintragen → Settings → Environment Variables → `EXPO_PUBLIC_VAPID_PUBLIC_KEY`
  - [ ] **Noch offen:** Private Key in **Supabase** → Edge Functions → Secrets → `VAPID_PRIVATE_KEY`

- [x] **Supabase Edge Function deployed** ✅
  - Name: `send-notifications`
  - URL: `https://jewactcyhvzrceoiajau.supabase.co/functions/v1/send-notifications`

- [x] **Cron-Job eingerichtet** ✅ (pg_cron auf Supabase Pro, alle 5 Minuten)

- [x] **Supabase DB Function `deduct_notification_credit` angelegt** ✅

---

## 🔴 Kritisch – Karte (Supabase-Tabellen anlegen)

- [x] **`places` + `place_reviews` Tabellen anlegen + Seed-Daten einspielen** ✅
  - 15 Sehenswürdigkeiten, 8 Strände, 6 Krankenhäuser, 5 Tourist-Infos in Supabase

---

## 🟠 Wichtig – Stripe (Bezahlung)

- [ ] **Stripe-Konto erstellen**
  - https://dashboard.stripe.com/register
  - Land: Zypern oder Deutschland

- [ ] **5 Payment Links erstellen** (ein Link pro Paket)
  - Stripe Dashboard → Payment Links → Create
  - Starter: 1 Credit – 5 € → Link in `marketing.tsx` bei `starter` eintragen
  - Basic: 5 Credits – 20 € → Link bei `basic` eintragen
  - Pro: 15 Credits – 45 € → Link bei `pro` eintragen
  - Business: 40 Credits – 99 € → Link bei `business` eintragen
  - Unlimited: ∞ Credits – 199 € → Link bei `unlimited` eintragen
  - Datei: `/app/(tabs)/marketing.tsx` → Funktion `openStripe()` → `links`-Objekt

- [ ] **Stripe Webhook einrichten** (automatische Credit-Vergabe nach Zahlung)
  - Stripe Dashboard → Webhooks → Add Endpoint
  - Event: `checkout.session.completed`
  - Supabase Edge Function als Webhook-Empfänger

---

## 🟠 Wichtig – Domain & SSL

- [ ] **Eigene Domain kaufen** (z.B. `insidecyprus.de` oder `insidecyprus.app`)
  - Empfehlung: Namecheap, IONOS oder Cloudflare Registrar
  - Alternativen: `insidecyprus.eu`, `inside-cyprus.com`, `zypern-portal.de`

- [ ] **Domain in Vercel verknüpfen**
  - Vercel Dashboard → Projekt `enjoycyprus` → Settings → Domains → Add Domain
  - DNS-Einträge beim Registrar setzen (A-Record oder CNAME auf Vercel)
  - Vercel stellt automatisch ein **SSL-Zertifikat (Let's Encrypt)** aus

- [ ] **Google Safe Browsing bereinigen** (nach Domain-Wechsel)
  - Neue Domain bei [search.google.com/search-console](https://search.google.com/search-console) verifizieren
  - Security Issues prüfen → falls nötig, Überprüfung beantragen
  - Das "Schädlich"-Banner verschwindet automatisch mit einer sauberen neuen Domain

---

## 🟡 Geplante Features (Roadmap)

- [ ] **Zypern FAQ erweitern** – weitere Fragen aus PDFs ergänzen (aktuell ~35 Einträge)
- [ ] **Jobportal** – Stellenangebote suchen und aufgeben
- [ ] **Blaue Flagge Strände** – Liste und Karte zertifizierter Strände
- [ ] **PWA-Installation** – Anleitung für Android und iPhone (Add to Homescreen)
- [ ] **Info / Impressum / AGB** – rechtliche Pflichtseiten
- [ ] **Einstellungen** – Sprache, Benachrichtigungen, Dark Mode
- [ ] **Beachbox Zahlungsintegration** – Stripe für Strandbox-Buchungen (10 €/Tag)
- [ ] **Mein Eintrag – Verlängern** – Button funktioniert, aber noch kein Zahlungsfluss
- [ ] **Karte – Fotos** bei Sehenswürdigkeiten und Stränden ergänzen (image_url Spalte bereits vorhanden)
- [ ] **Bewertungen sichtbar machen** – Durchschnitt nach Nutzer-Reviews live aktualisieren (Trigger in Supabase)

---

## 🟢 Bereits erledigt

- [x] Start / Index – Kategorien & Suche
- [x] Events – Veranstaltungen aus Supabase
- [x] Community
- [x] Notfallnummern
- [x] Busverbindungen
- [x] News – Süden/Norden Filter, externe Links im neuen Tab
- [x] Wetter – 7-Tage-Vorschau
- [x] Alle Einträge
- [x] Eintrag erstellen (Submit)
- [x] Mein Eintrag – Login, Eintrag anzeigen
- [x] Partner werden
- [x] Profil
- [x] KI-Urlaubsplaner (Claude API)
- [x] Beachbox – Buchungsflow komplett
- [x] Admin-Bereich – Nutzerverwaltung, Multi-Tags, Toggle
- [x] FAQ – Accordion, 35+ Fragen, 7 Kategorien
- [x] Marketing – Push-Aktion erstellen, Credits, Kampagnenübersicht
- [x] Supabase Tabellen: push_subscriptions, notifications, notification_credits, credit_purchases
- [x] Service Worker (sw.js) für Push-Empfang
- [x] VAPID-Schlüssel generiert + in .env eingetragen
- [x] Supabase Edge Function `send-notifications` deployed
- [x] pg_cron Cron-Job eingerichtet (alle 5 Minuten)
- [x] **Karte – Layer-System** ✅
  - Sehenswürdigkeiten 📍 (orange), Strände 🏖️ (blau), Krankenhäuser 🏥 (rot), Tourist Info ℹ️ (lila)
  - Große farbige Marker (40px) sofort sichtbar
  - Filter-Chips zum An-/Ausschalten
  - Popup mit Beschreibung + 🔊 Vorlesen (Web Speech API) + 🗺️ Route + ⭐ Bewerten
  - Bewertungs-Modal (1–5 Sterne + Kommentar → Supabase)
  - Horizontal scrollbare Ortsliste unter der Karte
  - Detail-Panel mit Sprachausgabe und Route
  - 34 Orte statisch eingebaut (Fallback, auch ohne Supabase-Tabelle)
  - SQL-Migration: `supabase/migrations/20260628_places_reviews.sql`

---

## 📋 Morgen als nächstes

1. ~~Supabase SQL: places + place_reviews~~ ✅
2. ~~Supabase SQL: deduct_notification_credit~~ ✅
3. **Vercel:** `EXPO_PUBLIC_VAPID_PUBLIC_KEY` Environment Variable eintragen
4. **Stripe-Konto** erstellen + 5 Payment Links anlegen + in `marketing.tsx` eintragen
5. **Impressum / AGB** – rechtliche Pflichtseiten anlegen

---

*Inside Cyprus © 2026 – To-do-Liste für Entwicklung und Setup*
