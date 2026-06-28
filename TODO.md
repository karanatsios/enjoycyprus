# Inside Cyprus – Offene To-dos

Stand: 28. Juni 2026 — bitte nach jeder erledigten Aufgabe abhaken ([ ] → [x])

---

## 🔴 Kritisch – Marketing / Push-Notifications

Diese Punkte müssen erledigt werden, damit Push-Aktionen wirklich beim Nutzer ankommen:

- [ ] **VAPID-Schlüssel generieren**
  - Terminal: `npx web-push generate-vapid-keys`
  - Public Key → Vercel Environment Variable: `EXPO_PUBLIC_VAPID_PUBLIC_KEY`
  - Private Key → Supabase Secret: `VAPID_PRIVATE_KEY`
  - Anleitung: https://www.npmjs.com/package/web-push

- [ ] **Supabase Edge Function einrichten** (`send-notifications`)
  - Aufgabe: Alle `notifications` mit `status = 'scheduled'` und `starts_at <= NOW()` abrufen
  - Für jede Notification: `get_subscriptions_in_radius()` aufrufen → Web Push senden
  - Status danach auf `sent` setzen + `recipients_count` speichern
  - Supabase Dashboard → Edge Functions → New Function
  - Cron-Trigger einrichten: alle 5 Minuten (`*/5 * * * *`)
  - Docs: https://supabase.com/docs/guides/functions

- [ ] **Supabase DB Function `deduct_notification_credit` anlegen**
  - Im SQL Editor ausführen:
  ```sql
  CREATE OR REPLACE FUNCTION deduct_notification_credit(p_user_id UUID)
  RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
  BEGIN
    UPDATE notification_credits
    SET credits = credits - 1, updated_at = NOW()
    WHERE user_id = p_user_id AND credits > 0;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Nicht genug Credits';
    END IF;
  END;
  $$;
  ```

---

## 🟠 Wichtig – Stripe (Bezahlung)

- [ ] **Stripe-Konto erstellen**
  - https://dashboard.stripe.com/register
  - Land: Zypern oder Deutschland

- [ ] **5 Payment Links erstellen** (ein Link pro Paket)
  - Stripe Dashboard → Payment Links → Create
  - Starter: 1 Credit – 5 € → Link in `marketing.tsx` Zeile ~115 bei `starter` eintragen
  - Basic: 5 Credits – 20 € → Link bei `basic` eintragen
  - Pro: 15 Credits – 45 € → Link bei `pro` eintragen
  - Business: 40 Credits – 99 € → Link bei `business` eintragen
  - Unlimited: ∞ Credits – 199 € → Link bei `unlimited` eintragen
  - Datei: `/app/(tabs)/marketing.tsx` → Funktion `openStripe()` → `links`-Objekt

- [ ] **Stripe Webhook einrichten** (automatische Credit-Vergabe nach Zahlung)
  - Stripe Dashboard → Webhooks → Add Endpoint
  - Event: `checkout.session.completed`
  - Supabase Edge Function als Webhook-Empfänger
  - Nach erfolgreicher Zahlung: Credits automatisch auf Nutzerkonto buchen

---

## 🟡 Geplante Features (Roadmap)

- [ ] **Zypern FAQ erweitern** – weitere Fragen aus PDFs ergänzen (aktuell ~35 Einträge)
- [ ] **Jobportal** – Stellenangebote suchen und aufgeben
- [ ] **Krankenhäuser & Botschaften** – Adressen, Telefonnummern, Karte
- [ ] **Sehenswürdigkeiten** – Top-Orte der Insel mit Fotos
- [ ] **Blaue Flagge Strände** – Liste und Karte zertifizierter Strände
- [ ] **PWA-Installation** – Anleitung für Android und iPhone (Add to Homescreen)
- [ ] **Info / Impressum / AGB** – rechtliche Pflichtseiten
- [ ] **Einstellungen** – Sprache, Benachrichtigungen, Dark Mode
- [ ] **Beachbox Zahlungsintegration** – Stripe für Strandbox-Buchungen (10 €/Tag)
- [ ] **Mein Eintrag – Verlängern** – Button funktioniert, aber noch kein Zahlungsfluss

---

## 🟢 Bereits erledigt

- [x] Start / Index – Kategorien & Suche
- [x] Events – Veranstaltungen aus Supabase
- [x] Community
- [x] Notfallnummern
- [x] Busverbindungen
- [x] News – Süden/Norden Filter, externe Links im neuen Tab
- [x] Wetter – 7-Tage-Vorschau
- [x] Karte
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
- [x] InsideCyprus-Funktionsliste.md

---

*Inside Cyprus © 2026 – To-do-Liste für Entwicklung und Setup*
