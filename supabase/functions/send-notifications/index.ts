// Supabase Edge Function: send-notifications
// Läuft alle 5 Minuten via Cron-Trigger
// Sendet geplante Push-Aktionen an alle Nutzer im gewählten Radius

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const VAPID_PUBLIC     = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE    = Deno.env.get('VAPID_PRIVATE_KEY')!;
const VAPID_SUBJECT    = 'mailto:karanatsios@mailbox.org';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE);

// Web Push senden (ohne externe Bibliothek – nutzt Web Crypto API)
async function sendWebPush(subscription: { endpoint: string; p256dh: string; auth: string }, payload: string) {
  // Deno hat keine web-push Bibliothek nativ – wir nutzen den Supabase-eigenen Fetch
  // Für Production: web-push via esm.sh einbinden
  const { default: webpush } = await import('https://esm.sh/web-push@3.6.7');
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
  await webpush.sendNotification(
    { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
    payload
  );
}

Deno.serve(async () => {
  const now = new Date().toISOString();

  // 1. Alle fälligen Notifications abrufen
  const { data: jobs, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('status', 'scheduled')
    .lte('starts_at', now)
    .gte('ends_at', now);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  if (!jobs || jobs.length === 0) return new Response(JSON.stringify({ sent: 0 }), { status: 200 });

  let totalSent = 0;

  for (const job of jobs) {
    // 2. Subscriptions im Radius holen
    const { data: subs } = await supabase.rpc('get_subscriptions_in_radius', {
      center_lat: job.lat,
      center_lng: job.lng,
      radius_km: job.radius_km,
    });

    if (!subs || subs.length === 0) {
      await supabase.from('notifications').update({ status: 'sent', recipients_count: 0 }).eq('id', job.id);
      continue;
    }

    const payload = JSON.stringify({
      title: job.title,
      body: job.body,
      icon: '/favicon.ico',
      image: job.image_url || undefined,
      tag: job.id,
      url: '/',
    });

    let sent = 0;
    for (const sub of subs) {
      try {
        await sendWebPush(sub, payload);
        sent++;
      } catch (_e) {
        // Ungültige Subscription – ignorieren
      }
    }

    // 3. Status aktualisieren
    await supabase
      .from('notifications')
      .update({ status: 'sent', recipients_count: sent })
      .eq('id', job.id);

    totalSent += sent;
  }

  return new Response(JSON.stringify({ sent: totalSent, jobs: jobs.length }), { status: 200 });
});
