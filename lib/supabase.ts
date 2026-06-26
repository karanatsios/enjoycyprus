import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// ── Supabase-Projekt anlegen auf https://supabase.com ──────────────
// 1. Kostenloses Konto erstellen
// 2. Neues Projekt anlegen
// 3. Unter Settings → API die URL und den anon key kopieren
// 4. Hier einsetzen:
const SUPABASE_URL  = 'https://DEIN_PROJEKT.supabase.co';
const SUPABASE_ANON = 'DEIN_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage: Platform.OS === 'web'
      ? typeof window !== 'undefined' ? window.localStorage : undefined
      : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
