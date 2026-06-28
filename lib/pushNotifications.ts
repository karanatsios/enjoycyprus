import { supabase } from './supabase';

// VAPID public key – generate at https://vapidkeys.com or via web-push CLI
// Replace this with your actual VAPID public key from Supabase Edge Function config
const VAPID_PUBLIC_KEY = process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

export async function registerPushSubscription(lat?: number, lng?: number) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { error: 'Push-Benachrichtigungen werden in diesem Browser nicht unterstützt.' };
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return { error: 'Benachrichtigungen wurden abgelehnt.' };
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    const existing = await reg.pushManager.getSubscription();
    if (existing) await existing.unsubscribe();

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY ? urlBase64ToUint8Array(VAPID_PUBLIC_KEY) : undefined,
    });

    const { data: { user } } = await supabase.auth.getUser();
    const sub = subscription.toJSON() as any;

    await supabase.from('push_subscriptions').upsert({
      user_id: user?.id ?? null,
      endpoint: sub.endpoint,
      p256dh: sub.keys?.p256dh,
      auth: sub.keys?.auth,
      lat: lat ?? null,
      lng: lng ?? null,
      location: lat && lng ? `SRID=4326;POINT(${lng} ${lat})` : null,
    }, { onConflict: 'endpoint' });

    return { success: true };
  } catch (e: any) {
    return { error: e.message || 'Fehler beim Registrieren.' };
  }
}

export async function getCredits(userId: string): Promise<number> {
  const { data } = await supabase
    .from('notification_credits')
    .select('credits')
    .eq('user_id', userId)
    .single();
  return data?.credits ?? 0;
}

export async function createNotificationCampaign(campaign: {
  userId: string;
  businessName: string;
  title: string;
  body: string;
  imageUrl?: string;
  lat: number;
  lng: number;
  radiusKm: number;
  startsAt: Date;
  endsAt: Date;
}) {
  // Deduct 1 credit
  const { error: creditError } = await supabase.rpc('deduct_notification_credit', {
    p_user_id: campaign.userId,
  });
  if (creditError) return { error: 'Nicht genug Credits.' };

  const { data, error } = await supabase.from('notifications').insert({
    user_id: campaign.userId,
    business_name: campaign.businessName,
    title: campaign.title,
    body: campaign.body,
    image_url: campaign.imageUrl ?? null,
    lat: campaign.lat,
    lng: campaign.lng,
    location: `SRID=4326;POINT(${campaign.lng} ${campaign.lat})`,
    radius_km: campaign.radiusKm,
    starts_at: campaign.startsAt.toISOString(),
    ends_at: campaign.endsAt.toISOString(),
    status: 'scheduled',
    credits_used: 1,
  }).select().single();

  return { data, error };
}
